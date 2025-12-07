# syntax=docker/dockerfile:1-labs
# labs version is needed for `COPY --exclude`.
# @see https://docs.docker.com/reference/dockerfile/#copy---exclude

# using alpine base image to avoid `sharp` memory leaks.
# @see https://sharp.pixelplumbing.com/install#linux-memory-allocator

# build
FROM node:24-alpine AS build

RUN corepack enable

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --chown=node:node .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# COPY --chown=node:node ./patches ./patches

ENV CI=true
ENV SKIP_INSTALL_SIMPLE_GIT_HOOKS=1

RUN pnpm fetch

COPY --chown=node:node ./ ./

# astro assets cache
COPY --chown=node:node ./node_modules/.astro ./node_modules/.astro

ARG PUBLIC_APP_BASE_PATH
ARG PUBLIC_APP_BASE_URL
ARG PUBLIC_APP_BOTS
ARG PUBLIC_APP_GOOGLE_SITE_VERIFICATION
ARG PUBLIC_APP_IMPRINT_SERVICE_BASE_URL
ARG PUBLIC_APP_MATOMO_BASE_URL
ARG PUBLIC_APP_MATOMO_ID
ARG PUBLIC_APP_SERVICE_ID

# disable validation for runtime environment variables
ENV ENV_VALIDATION=public

RUN pnpm install --frozen-lockfile --prefer-offline

ENV NODE_ENV=production

# to mount secrets which need to be available at build time
# @see https://docs.docker.com/build/building/secrets/
RUN pnpm run build

# serve
FROM caddy:2-alpine AS serve

WORKDIR /usr/share/caddy

ARG PUBLIC_APP_BASE_PATH

# exclude assets which should have been optimized with `astro:assets`.
COPY --from=build --exclude=assets/content/assets/ /app/dist /usr/share/caddy

RUN cat > /etc/caddy/Caddyfile <<EOF
:3000 {
  root * /usr/share/caddy

  @de {
    header_regexp Accept-Language ^de
  }

  handle_path ${PUBLIC_APP_BASE_PATH:-/}* {
        handle / {
            redir @de ${PUBLIC_APP_BASE_PATH}/de/ 302
            redir ${PUBLIC_APP_BASE_PATH}/en/ 302
        }

    header /_astro/* Cache-Control "public, max-age=31536000, immutable"

    try_files {path} {path}/ =404
    file_server
  }

  handle_errors {
    rewrite * /{err.status_code}.html
    file_server
  }
}
EOF

EXPOSE 3000

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
