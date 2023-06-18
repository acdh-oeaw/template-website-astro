# syntax=docker/dockerfile:1

# build
FROM node:18-slim AS build

RUN corepack enable

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --chown=node:node .npmrc package.json pnpm-lock.yaml ./
COPY --chown=node:node patches ./patches

RUN pnpm fetch

COPY --chown=node:node astro.config.ts tailwind.config.ts tsconfig.json ./
COPY --chown=node:node config ./config
COPY --chown=node:node public ./public
COPY --chown=node:node src ./src

ARG PUBLIC_APP_BASE_URL
ARG PUBLIC_REDMINE_ID
ARG PUBLIC_MATOMO_BASE_URL
ARG PUBLIC_MATOMO_ID

RUN pnpm install --frozen-lockfile --offline

ENV NODE_ENV=production

RUN pnpm run build

# serve
FROM node:18-slim AS serve

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --from=build --chown=node:node /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3000

CMD [ "node", "./dist/server/entry.mjs" ]
