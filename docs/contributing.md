# website template

template repository for project websites, built with [`astro`](https://astro.build) and
[`keystatic cms`](https://keystatic.com).

## prerequisites

- [node.js v24](https://nodejs.org/en/download)
- [pnpm v10](https://pnpm.io/installation)

> [!TIP]
>
> you can use `pnpm` to install the required node.js version with `pnpm env use 24 --global`

## environment variables

set required environment variables in `.env.local`. start by copying the example file:

```bash
cp .env.local.example .env.local
```

| environment variable               | required | default    | description                    |
| ---------------------------------- | -------- | ---------- | ------------------------------ |
| EMAIL_ADDRESS                      | true     |            | contact email address          |
| EMAIL_SERVICE_API_BASE_URL         | false    |            | development email service api  |
| EMAIL_SMTP_PASSWORD                | false    |            |                                |
| EMAIL_SMTP_PORT                    | true     |            | email server port              |
| EMAIL_SMTP_SERVER                  | true     |            | email server hostname          |
| EMAIL_SMTP_USERNAME                | false    |            |                                |
| KEYSTATIC_GITHUB_CLIENT_ID         | false    |            | github oauth2 client id        |
| KEYSTATIC_GITHUB_CLIENT_SECRET     | false    |            | github oauth2 client secret    |
| KEYSTATIC_SECRET                   | false    |            |                                |
| PUBLIC_APP_BASE_PATH               | false    | "/"        | optional base path             |
| PUBLIC_APP_BASE_URL                | true     |            | deployment url                 |
| PUBLIC_BOTS                        | true     | "disabled" | allow web crawlers             |
| PUBLIC_GOOGLE_SITE_VERIFICATION    | false    |            | google search console property |
| PUBLIC_IMPRINT_SERVICE_BASE_URL    | true     |            | acdh imprint service           |
| PUBLIC_MATOMO_BASE_URL             | false    |            | acdh matomo analytics base url |
| PUBLIC_MATOMO_ID                   | false    |            | acdh matomo analytics site id  |
| PUBLIC_KEYSTATIC_GITHUB_APP_SLUG   | false    |            | github app for oauth2          |
| PUBLIC_KEYSTATIC_GITHUB_REPO_NAME  | false    |            | github repository              |
| PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER | false    |            | github organisation            |
| PUBLIC_KEYSTATIC_MODE              | false    | "local"    | set to "github" in production  |
| PUBLIC_REDMINE_ID                  | true     |            | acdh service id                |

environment variables are validated in [`config/env.config.ts`](./config/env.config.ts). when adding
new environment variables, don't forget to add them to [`.env.local.example`](./.env.local.example)
and [`config/env.config.ts`](./config/env.config.ts) as well.

## development

install dependencies:

```bash
pnpm install
```

run a development server on <http://localhost:3000>:

```bash
pnpm run dev
```

> [!TIP]
>
> this template supports developing in containers. when opening the project in your editor, you
> should be prompted to re-open it in a devcontainer.

## e2e tests

generate a production build and run end-to-end tests with:

```bash
pnpm run build
pnpm run test:e2e
```

visual snapshot tests should be run in the template's devcontainer - or a comparable debian bookworm
based linux environment -, and can be updated with:

```bash
pnpm run test:e2e:update-snapshots
```

## content processing pipeline

TODO

## deployment

- ask a sysadmin to create a new acdh kubernetes project.
- create a new namespace in that project via [rancher](https://rancher.acdh-dev.oeaw.ac.at), and set
  the `KUBE_NAMESPACE` github variable to that namespace.
- adjust the [`app_name`](./.github/workflows/build-deploy.yml#L36), which will be the name of the
  deployment in the above namespace.
- set the `PUBLIC_URL` github variable to the application's public url (e.g.
  "https://my-app.acdh-dev.oeaw.ac.at"), and set the `KUBE_INGRESS_BASE_DOMAIN` to the public url's
  base domain (e.g. "acdh-dev.oeaw.ac.at"). `PUBLIC_URL` should match `PUBLIC_APP_BASE_URL`.
- when deploying to a production domain (i.e. a domain not ending in "acdh-dev.oeaw.ac.at"), set
  `HELM_UPGRADE_EXTRA_ARGS` to
  `--set 'ingress.annotations.cert-manager\.io/cluster-issuer=acdh-prod'` for "acdh.oeaw.ac.at"
  domains, or to `--set 'ingress.annotations.cert-manager\.io/cluster-issuer=letsencrypt-prod'` for
  any other non-oeaw domains, and ensure `KUBE_INGRESS_BASE_DOMAIN` is set correctly.
- if you haven't yet, create a service issue in the acdh [redmine](https://redmine.acdh.oeaw.ac.at)
  issue tracker, and set the `SERVICE_ID` github variable to the issue number. this should match the
  `PUBLIC_REDMINE_ID` variable in your `.env.local` file.
- ensure required build args (prefixed with `PUBLIC_`) are referenced in both the
  [`Dockerfile`](./Dockerfile), as well as the [validation](./.github/workflows/validate.yml) and
  [deployment](./.github/workflows/build-deploy.yml) pipelines, and set as
  [github variables](https://github.com/acdh-oeaw/template-website-astro/settings/variables/actions).
- ensure required runtime environment variables are referenced in the
  [validation](./.github/workflows/validate.yml) and
  [deployment](./.github/workflows/build-deploy.yml) pipelines, and set as
  [github secrets](https://github.com/acdh-oeaw/template-website-astro/settings/secrets/actions).
  github secrets need to be prefixed with `K8S_SECRET_` to be automatically copied to the runtime
  environment. in case you need secrets in the docker build context, you can
  [mount a secret in the Dockerfile](https://docs.docker.com/build/building/secrets/).
- ensure both the github repository, as well as the
  [package registry](https://github.com/orgs/acdh-oeaw/packages/container/my-app/settings) is set to
  public.
- the `PUBLIC_BOTS` variable defaults to "disabled", which signals to web crawlers that the website
  should not be indexed. when deploying to a production domain (i.e. a domain not ending in
  "acdh-dev.oeaw.ac.at") this should be set to "enabled".

if everything is set up correctly, every git push to the `main` branch will create a new deployment
if the validation pipeline passes.

you can reference the [template repository](https://github.com/acdh-oeaw/template-website-astro) for
a working setup.

> [!NOTE]
>
> by default, this will deploy a `node` server, which will serve pre-rendered pages, assets, and api
> routes. if you prefer a truly static build, which uses `caddy` as a fileserver, remove the `node`
> adapter from `astro.config.ts`, and use `Dockerfile.static` for deployment.

## production deployment checklist

- [ ] update `PUBLIC_URL`, `KUBE_INGRESS_BASE_DOMAIN`, `HELM_UPGRADE_EXTRA_ARGS`
      [github variables](https://github.com/acdh-oeaw/template-website-astro/settings/variables/actions).
- [ ] get a matomo id for the app, and set both `PUBLIC_MATOMO_BASE_URL` and `PUBLIC_MATOMO_ID`.
- [ ] set `NEXT_PUBLIC_BOTS` to "enabled".
- [ ] ensure sitemap includes entries for dynamic pages.
- [ ] optionally, create a google search console property, and provide the verification token as
      `PUBLIC_GOOGLE_SITE_VERIFICATION`. once verfied, submit `sitemap.xml` in the search console
      settings.
- [ ] set up keystatic cms by following [the official guide](https://keystatic.com/docs/github-mode)
      and provide the generated github app configuration via github (
      [secrets](https://github.com/acdh-oeaw/template-website-astro/settings/secrets/actions) and
      [variables](https://github.com/acdh-oeaw/template-website-astro/settings/variables/actions)).

## template variants

- [variant/static](https://github.com/acdh-oeaw/template-website-astro/tree/variant/static) branch:
  removes keystatic cms, contact form, and email service, serves site with caddy
- [variant/without-rss](https://github.com/acdh-oeaw/template-website-astro/tree/variant/without-rss)
  branch: removes rss feed.
- [variant/without-site-search](https://github.com/acdh-oeaw/template-website-astro/tree/variant/without-site-search)
  branch: removes site search with `pagefind`.
