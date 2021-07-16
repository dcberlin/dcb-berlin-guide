FROM node:16-alpine as build-deps
WORKDIR /usr/src/app

ARG REACT_APP_MAPBOX_TOKEN
ENV REACT_APP_MAPBOX_TOKEN $REACT_APP_MAPBOX_TOKEN
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL $REACT_APP_API_URL

COPY package.json yarn.lock nginx.config ./
RUN yarn
COPY . ./
RUN yarn build

FROM nginx:1.12-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
COPY /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
