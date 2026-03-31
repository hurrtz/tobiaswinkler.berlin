# tobiaswinkler.berlin

A React single-page site for `tobiaswinkler.berlin`: portrait hero, contact form, CV, social links, and imprint.

## Requirements

- Node.js 20+
- npm

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal, usually `http://localhost:5173`.

## Build

```bash
npm run build
```

## Optional configuration

Set these in a local `.env` file if needed:

- `VITE_PROFILE_IMAGE_URL` to override the default portrait image
- `VITE_INSTAGRAM_URL` to override the Instagram profile link
- `VITE_X_URL` to override the X profile link
- `VITE_XING_URL` to override the Xing profile link

## Contact form

The frontend posts to `public/contact.php`. The PHP endpoint sends mail through the Brevo
transactional email API to `contact@tobiaswinkler.berlin`.

The easiest deployment setup is a PHP config file one level above the web root:

- copy [contact-config.php.example](/Users/tobias.winkler/Projects/tobiaswinkler.berlin/contact-config.php.example) to `contact-config.php`
- keep that file in the project root, next to `dist/`, not inside `dist/`
- fill in the real Brevo API key and sender details there

The endpoint reads `contact-config.php` first and falls back to server-side environment variables if
that file is not present.

Supported config values and environment variable equivalents:

- `brevoApiKey` or `BREVO_API_KEY`
- `senderEmail` or `BREVO_SENDER_EMAIL`
- `senderName` or `BREVO_SENDER_NAME`
- optional `recipientEmail` or `CONTACT_EMAIL`

The endpoint includes basic spam protection:

- a hidden honeypot field
- a minimum form-completion time check
- IP-based rate limiting via temporary files

Fast submissions under 2.5 seconds are rejected with a user-visible error so launch testing does
not look like a successful send when the anti-spam check actually suppressed the mail.

The handler also writes a simple debug log to `tobiaswinkler-contact.log` in the project root
(one level above the web root) and falls back to PHP's error log if that file cannot be written.

The Brevo API call uses HTTPS, which is usually more reliable on shared hosting than outbound SMTP.

If you deploy behind Apache, `public/.htaccess` contains an SPA fallback rewrite.
