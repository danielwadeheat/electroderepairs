# WordPress Handoff Notes

This project is a static frontend handoff for Electrode Repairs. It is not a complete WordPress theme yet.

## Update Note For This Zip

This updated handoff zip changes the home page only by removing one unnecessary `<link rel="preload">` for `assets/images/circuit-integration-640.webp` from `index.html`. That image is still used as decorative CSS background art and will continue to load normally from the stylesheet, but it no longer triggers Chrome's "preloaded but not used within a few seconds" inspection warning.

Aside from this note in `HANDOFF.md` and that one-line cleanup in `index.html`, everything else remains the same as the previous zip.

## What Is Included

- Static HTML pages for the current site UI.
- Source and minified CSS files.
- Source and minified JavaScript files.
- Image assets used by the pages.
- A build script for optimized image assets: `tools/optimize-assets.js`.

## What The WordPress Team Needs To Do

1. Convert the static pages into WordPress templates, blocks, or theme files.
   This repo does not include `functions.php`, PHP templates, WordPress enqueue logic, or a WordPress theme header.

2. Replace static `.html` links with WordPress permalinks.
   Examples:
   - `index.html` -> `/`
   - `about.html` -> `/about/`
   - `repairs.html` -> `/repair/` or the final repair page URL
   - `buy.html` -> `/buy/`
   - `sell.html` -> `/sell/`
   - `contact.html` -> `/contact/`
   - `privacy_policy.html` -> `/privacy-policy/`
   - `terms_of_use.html` -> `/terms-of-use/`

3. Confirm or regenerate canonical and social metadata.
   The static pages have been updated to use production `https://electroderepairs.com/...` canonical, Open Graph, and Twitter image URLs. The WordPress SEO plugin may still need to regenerate these values from the final WordPress page URLs.

4. Enqueue assets through WordPress.
   Static paths such as `css/home.min.css`, `css/pages.min.css`, `script.min.js`, and `assets/images/...` should be converted to WordPress theme/plugin asset URLs.

5. Connect forms to the production backend.
   Current form status:
   - `contact.html` uses a static `action="#"`.
   - `buy.html` uses a static `action="#"` and a frontend-only success message.
   - `sell.html` uses a static `action="#"` and a frontend-only success message.
   - `repairs.html` currently posts to `https://widget.electroderepairs.com/function.php`.

6. Confirm whether the repair quote widget endpoint should remain live.
   The repair form can submit to the current widget backend, so test submissions may trigger real backend/email behavior.

7. Let your SEO plugin generate or verify final canonical/social metadata.

## Preferred Form Integration

If the production site uses Gravity Forms, use Gravity Forms' REST API submission endpoint:

```text
https://electroderepairs.com/wp-json/gf/v2/forms/{FORM_ID}/submissions
```

The WordPress team should map this frontend's fields to the final Gravity Forms field names, such as `input_1`, `input_2`, etc. They should also keep validation, anti-spam, notifications, and CRM/webhook routing inside WordPress.

If Gravity Forms is not used, the next best option is a custom WordPress endpoint such as:

```text
https://electroderepairs.com/wp-json/electrode/v1/contact
```

or an `admin-post.php` handler with nonce checks, spam protection, validation, and server-side email/CRM routing.

## Do Not Include In The Handoff Zip

- `node_modules/`
- `.git/`
- old local audit output such as `qa/`

## Useful Build Commands

```bash
npm run build
npm run lint
```
