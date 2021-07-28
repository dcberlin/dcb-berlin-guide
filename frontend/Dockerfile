FROM node:16-alpine as built-client
WORKDIR /usr/src/app

ARG REACT_APP_MAPBOX_TOKEN
ENV REACT_APP_MAPBOX_TOKEN $REACT_APP_MAPBOX_TOKEN
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL $REACT_APP_API_URL

COPY package.json yarn.lock nginx.conf ./
RUN yarn
COPY . ./
RUN yarn build

FROM nginx:1.21.1
RUN apt-get update && apt-get install -y curl
COPY --from=built-client /usr/src/app/build /usr/share/nginx/html
COPY --from=built-client /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
