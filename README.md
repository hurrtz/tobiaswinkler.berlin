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

- `VITE_CONTACT_EMAIL` to change the recipient used by the contact form
- `VITE_PROFILE_IMAGE_URL` to override the default portrait image
- `VITE_INSTAGRAM_URL` to override the Instagram profile link
- `VITE_X_URL` to override the X profile link
- `VITE_XING_URL` to override the Xing profile link

## Contact form

The frontend posts to `public/contact.php`. On a PHP-capable host this script sends mail to
`contact@tobiaswinkler.berlin` by default, or to `CONTACT_EMAIL` if that server environment
variable is set.

The endpoint includes basic spam protection:

- a hidden honeypot field
- a minimum form-completion time check
- IP-based rate limiting via temporary files

If the PHP endpoint is unavailable in the current environment, the form falls back to opening a
draft email.

If you deploy behind Apache, `public/.htaccess` contains an SPA fallback rewrite.
