FROM node:16.20 AS build-src

WORKDIR /app
COPY package*.json yarn.lock ./

RUN yarn
COPY . .
RUN yarn build

FROM nginx:latest
WORKDIR /usr/share/nginx/html
COPY --from=build-src /app/build .
