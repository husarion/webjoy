FROM node:19.9.0-buster AS frontend_builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

RUN npm run build

FROM caddy:2.6.2-alpine

WORKDIR /src

COPY Caddyfile.webserver /etc/caddy/Caddyfile
COPY --from=frontend_builder /app/build /src

EXPOSE 8080

ENV ROSBRIDGE_SERVER_HOST=

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]