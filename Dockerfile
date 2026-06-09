# Builds the Zalo Mini App static bundle and serves it for browser preview/testing.
# NOTE: production delivery to the Zalo platform is done via `zmp-cli deploy`
# (with Zalo credentials), not this image. This image is for local preview / QA.
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runner
# zmp-cli build emits the static bundle to ./www
COPY --from=build /app/www /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1
