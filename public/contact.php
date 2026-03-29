<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

const MIN_ELAPSED_MS = 2500;
const RATE_LIMIT_WINDOW_SECONDS = 900;
const RATE_LIMIT_MAX_ATTEMPTS = 5;
const MAX_TOPIC_LENGTH = 120;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 200;
const MAX_COMPANY_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 5000;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed.']);
    exit;
}

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function clean_line(string $value): string
{
    return trim(str_replace(["\r", "\n"], ' ', $value));
}

function remember_attempt(string $key, int $windowSeconds, int $maxAttempts): bool
{
    $storagePath = sys_get_temp_dir() . '/tobiaswinkler-contact-' . hash('sha256', $key) . '.json';
    $handle = @fopen($storagePath, 'c+');

    if ($handle === false) {
        return true;
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            return true;
        }

        $raw = stream_get_contents($handle);
        $attempts = json_decode($raw ?: '[]', true);

        if (!is_array($attempts)) {
            $attempts = [];
        }

        $now = time();
        $attempts = array_values(array_filter(
            $attempts,
            static fn ($timestamp): bool => is_int($timestamp) && $timestamp >= ($now - $windowSeconds)
        ));

        if (count($attempts) >= $maxAttempts) {
            return false;
        }

        $attempts[] = $now;

        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($attempts));

        return true;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

$rawBody = file_get_contents('php://input');
$payload = json_decode($rawBody ?: '', true);

if (!is_array($payload)) {
    respond(400, ['message' => 'Invalid request payload.']);
}

$topic = clean_line((string) ($payload['topic'] ?? ''));
$name = clean_line((string) ($payload['name'] ?? ''));
$email = filter_var(trim((string) ($payload['email'] ?? '')), FILTER_VALIDATE_EMAIL);
$company = clean_line((string) ($payload['company'] ?? ''));
$message = trim((string) ($payload['message'] ?? ''));
$website = clean_line((string) ($payload['website'] ?? ''));
$elapsedMs = (int) ($payload['elapsedMs'] ?? 0);

if ($website !== '' || ($elapsedMs > 0 && $elapsedMs < MIN_ELAPSED_MS)) {
    respond(200, ['message' => 'Message received.']);
}

if ($topic === '' || $name === '' || $email === false || $message === '') {
    respond(422, ['message' => 'Please complete all required fields.']);
}

if (
    mb_strlen($topic) > MAX_TOPIC_LENGTH ||
    mb_strlen($name) > MAX_NAME_LENGTH ||
    mb_strlen((string) $email) > MAX_EMAIL_LENGTH ||
    mb_strlen($company) > MAX_COMPANY_LENGTH ||
    mb_strlen($message) > MAX_MESSAGE_LENGTH
) {
    respond(422, ['message' => 'One or more fields are too long.']);
}

$clientKey = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');

if (!remember_attempt($clientKey, RATE_LIMIT_WINDOW_SECONDS, RATE_LIMIT_MAX_ATTEMPTS)) {
    respond(429, ['message' => 'Too many messages were sent recently. Please wait a little and try again.']);
}

$recipient = 'contact@tobiaswinkler.berlin';

$subject = sprintf('[tobiaswinkler.berlin] %s from %s', $topic, $name);
$body = implode("\n", [
    'New contact form submission',
    '',
    sprintf('Topic: %s', $topic),
    sprintf('Name: %s', $name),
    sprintf('Email: %s', $email),
    sprintf('Company: %s', $company !== '' ? $company : 'Not provided'),
    '',
    $message,
]);

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    sprintf('From: Tobias Winkler Website <%s>', $recipient),
    sprintf('Reply-To: %s', $email),
    sprintf('X-Website-Contact: %s', $recipient),
];

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$sent = mail($recipient, $encodedSubject, $body, implode("\r\n", $headers));

if (!$sent) {
    respond(500, ['message' => 'The server could not send the email.']);
}

respond(200, ['message' => 'Message sent successfully.']);
