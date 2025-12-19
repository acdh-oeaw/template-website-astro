# website template

template repository for project websites, built with [`astro`](https://astro.build) and
[`keystatic cms`](https://keystatic.com).

## how to edit content

use the cms at <https://template-website-astro.acdh-dev.oeaw.ac.at/admin> (this will commit changes
to the github repository).

when running locally, the cms is available at <http://localhost:3000/admin> (this will save changes
to the local filesystem).

## development

see [docs/contributing.md](./docs/contributing.md).

## template variants

- [`variant/static`](https://github.com/acdh-oeaw/template-website-astro/tree/variant/static)
  branch: removes keystatic cms, contact form, and email service, serves site with caddy
- [`variant/github-pages`](https://github.com/acdh-oeaw/template-website-astro/tree/variant/github-pages)
  branch: generates a static build and deploys to github pages. requires enabling "github pages" in
  the [repository settings](https://github.com/acdh-oeaw/template-website-astro/settings/pages)
  (choose "github actions" as source, and "main" as branch).
- [`variant/without-rss`](https://github.com/acdh-oeaw/template-website-astro/tree/variant/without-rss)
  branch: removes rss feed.
- [`variant/without-site-search`](https://github.com/acdh-oeaw/template-website-astro/tree/variant/without-site-search)
  branch: removes site search with `pagefind`.
