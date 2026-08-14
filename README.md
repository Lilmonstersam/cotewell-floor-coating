# Cotewell industrial epoxy flooring mock-up

Static SEO and CRO mock-up for Cotewell's industrial epoxy floor coating service page.

## Preview URL

`https://lilmonstersam.github.io/cotewell-floor-coating/`

## Deployment

GitHub Pages is deployed automatically by `.github/workflows/deploy-pages.yml` whenever changes are pushed to `main`. The workflow can also be run manually from the repository's Actions tab.

For the first publish from this prepared local repository:

```sh
git add .
git commit -m "Deploy Cotewell floor coating mock-up"
git push -u origin main
```

The deployment artifact contains only:

- `index.html`
- `styles.css`
- `app.js`
- `assets/`
- `robots.txt`
- `.nojekyll`

No build step or package installation is required.

## Local preview

From the repository root:

```sh
python3 -m http.server 4177 --bind 127.0.0.1
```

Open `http://127.0.0.1:4177/`.

## Review-site safeguards

- The page has `noindex, nofollow` metadata.
- `robots.txt` blocks crawling of the GitHub Pages preview.
- The enquiry form is visual only and does not submit.
- Cotewell navigation and CTA links point to the live Cotewell website.

Before implementing this page on `cotewell.com.au`, connect the form, merge the approved schema with the live site's SEO output, remove the preview-only noindex rules and complete production accessibility, analytics and performance QA.
