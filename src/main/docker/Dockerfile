FROM node:18-alpine as build-step
WORKDIR /app
COPY package.json /app
RUN npm install --force
COPY . /app
RUN npm run build

#FROM bunkerity/bunkerized-nginx as prod
FROM nginx as prod
COPY --from=build-step /app/target/classes/static /usr/share/nginx/html



