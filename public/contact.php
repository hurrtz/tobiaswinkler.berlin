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
const LOG_FILE_NAME = 'tobiaswinkler-contact.log';
const CONTACT_CONFIG_FILE = 'contact-config.php';
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const HTTP_TIMEOUT_SECONDS = 20;

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

function require_env(string $name): string
{
    $value = trim((string) (getenv($name) ?: ''));

    if ($value === '') {
        throw new RuntimeException(sprintf('Missing required environment variable: %s', $name));
    }

    return $value;
}

function config_file_path(): string
{
    return dirname(__DIR__) . '/' . CONTACT_CONFIG_FILE;
}

function config_file_values(): array
{
    $path = config_file_path();

    if (!is_file($path)) {
        return [];
    }

    $config = require $path;

    if (!is_array($config)) {
        throw new RuntimeException(sprintf('%s must return an array.', CONTACT_CONFIG_FILE));
    }

    return $config;
}

function require_config_value(array $config, string $key, ?string $envName = null): string
{
    $value = trim((string) ($config[$key] ?? ''));

    if ($value !== '') {
        return $value;
    }

    if ($envName !== null) {
        return require_env($envName);
    }

    throw new RuntimeException(sprintf('Missing required config value: %s', $key));
}

function log_event(string $event, array $context = []): void
{
    $entry = sprintf(
        "[%s] %s %s\n",
        date('c'),
        $event,
        json_encode($context, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
    );

    $logPath = dirname(__DIR__) . '/' . LOG_FILE_NAME;
    $written = @file_put_contents($logPath, $entry, FILE_APPEND | LOCK_EX);

    if ($written === false) {
        error_log(sprintf('[tobiaswinkler-contact] %s', trim($entry)));
    }
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

function brevo_config(): array
{
    $fileConfig = config_file_values();

    return [
        'apiKey' => require_config_value($fileConfig, 'brevoApiKey', 'BREVO_API_KEY'),
        'senderEmail' => trim((string) ($fileConfig['senderEmail'] ?? getenv('BREVO_SENDER_EMAIL') ?? 'contact@tobiaswinkler.berlin')),
        'senderName' => trim((string) ($fileConfig['senderName'] ?? getenv('BREVO_SENDER_NAME') ?? 'Tobias Winkler Website')),
        'recipientEmail' => trim((string) ($fileConfig['recipientEmail'] ?? getenv('CONTACT_EMAIL') ?? 'contact@tobiaswinkler.berlin')),
    ];
}

function brevo_response_payload(?string $body): ?array
{
    if ($body === null || $body === '') {
        return null;
    }

    $payload = json_decode($body, true);
    return is_array($payload) ? $payload : null;
}

function brevo_error_message(int $statusCode, ?array $payload, ?string $body): string
{
    if (is_array($payload)) {
        if (isset($payload['message']) && is_string($payload['message']) && $payload['message'] !== '') {
            return sprintf('Brevo API request failed with %d: %s', $statusCode, $payload['message']);
        }

        if (isset($payload['code']) && is_string($payload['code'])) {
            return sprintf('Brevo API request failed with %d: %s', $statusCode, $payload['code']);
        }
    }

    return sprintf('Brevo API request failed with %d: %s', $statusCode, trim((string) $body));
}

function brevo_http_request(string $apiKey, string $jsonPayload): array
{
    $headers = [
        'accept: application/json',
        'api-key: ' . $apiKey,
        'content-type: application/json',
    ];

    if (function_exists('curl_init')) {
        $handle = curl_init(BREVO_API_URL);

        curl_setopt_array($handle, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_POSTFIELDS => $jsonPayload,
            CURLOPT_TIMEOUT => HTTP_TIMEOUT_SECONDS,
        ]);

        $body = curl_exec($handle);

        if ($body === false) {
            $error = curl_error($handle);
            $code = curl_errno($handle);
            curl_close($handle);

            throw new RuntimeException(sprintf('Brevo API connection failed: %s (%d)', $error ?: 'unknown error', $code));
        }

        $statusCode = (int) curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
        curl_close($handle);

        return [
            'statusCode' => $statusCode,
            'body' => (string) $body,
        ];
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => implode("\r\n", $headers),
            'content' => $jsonPayload,
            'timeout' => HTTP_TIMEOUT_SECONDS,
            'ignore_errors' => true,
        ],
    ]);

    $body = @file_get_contents(BREVO_API_URL, false, $context);

    if ($body === false) {
        $lastError = error_get_last();

        throw new RuntimeException(sprintf(
            'Brevo API connection failed: %s',
            $lastError['message'] ?? 'unknown error'
        ));
    }

    $statusCode = 0;
    $responseHeaders = $http_response_header ?? [];

    if (isset($responseHeaders[0]) && preg_match('/^HTTP\/\S+\s+(\d{3})/', $responseHeaders[0], $matches) === 1) {
        $statusCode = (int) $matches[1];
    }

    return [
        'statusCode' => $statusCode,
        'body' => (string) $body,
    ];
}

function send_brevo_mail(array $config, string $subject, string $body, string $replyToEmail, string $replyToName): array
{
    $payload = [
        'sender' => [
            'email' => $config['senderEmail'],
            'name' => $config['senderName'],
        ],
        'to' => [
            [
                'email' => $config['recipientEmail'],
                'name' => 'Tobias Winkler',
            ],
        ],
        'subject' => $subject,
        'textContent' => $body,
        'replyTo' => [
            'email' => $replyToEmail,
            'name' => $replyToName,
        ],
        'tags' => ['website-contact-form'],
    ];

    $jsonPayload = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    if ($jsonPayload === false) {
        throw new RuntimeException('Failed to encode Brevo API payload.');
    }

    $response = brevo_http_request($config['apiKey'], $jsonPayload);
    $statusCode = (int) $response['statusCode'];
    $responseBody = (string) $response['body'];
    $responsePayload = brevo_response_payload($responseBody);

    if ($statusCode < 200 || $statusCode >= 300) {
        throw new RuntimeException(brevo_error_message($statusCode, $responsePayload, $responseBody));
    }

    return $responsePayload ?? [];
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
$clientKey = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');

if ($website !== '') {
    log_event('suppressed_honeypot', ['ip' => $clientKey]);
    respond(200, ['message' => 'Message received.']);
}

if ($elapsedMs > 0 && $elapsedMs < MIN_ELAPSED_MS) {
    log_event('suppressed_fast_submit', ['ip' => $clientKey, 'elapsedMs' => $elapsedMs]);
    respond(422, ['message' => 'Please wait a moment before sending the form.']);
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

if (!remember_attempt($clientKey, RATE_LIMIT_WINDOW_SECONDS, RATE_LIMIT_MAX_ATTEMPTS)) {
    log_event('rate_limited', ['ip' => $clientKey]);
    respond(429, ['message' => 'Too many messages were sent recently. Please wait a little and try again.']);
}

try {
    $config = brevo_config();
} catch (Throwable $exception) {
    log_event('brevo_config_invalid', ['error' => $exception->getMessage()]);
    respond(500, ['message' => 'The contact endpoint is not configured.']);
}

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

try {
    $responsePayload = send_brevo_mail($config, $subject, $body, (string) $email, $name);
} catch (Throwable $exception) {
    log_event('brevo_send_failed', [
        'ip' => $clientKey,
        'topic' => $topic,
        'name' => $name,
        'email' => $email,
        'error' => $exception->getMessage(),
    ]);
    respond(500, ['message' => 'The server could not send the email.']);
}

log_event('brevo_sent', [
    'ip' => $clientKey,
    'topic' => $topic,
    'name' => $name,
    'email' => $email,
    'messageId' => $responsePayload['messageId'] ?? null,
]);

respond(200, ['message' => 'Message sent successfully.']);
