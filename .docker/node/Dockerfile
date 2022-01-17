FROM node:16.13.1-alpine3.15

RUN apk add --no-cache curl && \
  curl https://raw.githubusercontent.com/eficode/wait-for/v2.1.3/wait-for --output /usr/bin/wait-for && \
  chmod +x /usr/bin/wait-for

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

USER node

WORKDIR /home/node/app

EXPOSE 3000
