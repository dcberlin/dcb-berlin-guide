# The DCB Berlin Guide

_This project is currently in a prototype phase. It partially lacks functionality, sufficient testing coverage and proper frontend architecture._

The Berlin Guide created by [DCB](https://diasporacivica.berlin) aims to be the online gateway for members of the Romanian community in Berlin.
Its goal is to provide clear information on places of interest and services in demand among the Romanian diaspora in the city and its surroundings.

## Implementation

This is a monorepo containing all the moving parts of the web app.
The application consists of a Django server which persists data in Postgres and provides it through a read-only REST API.
The data is consumed by a frontend client built with React and can also be directly used by the public.
Data input is done by authorized users via the Django Admin. Deployment is done via Docker in swarm mode with Traefik as reverse proxy.

## Set up for development

* Clone the repo.
* Copy the `.env.local` template to `.env` and fill in the missing environment variables (Mapbox API token etc.).
* Make sure you have Docker and Docker Compose installed.
* Run all the required containers with `docker-compose up`.
* You're good to go! Any changes will be reflected in the containers as well, thanks to Docker volumes. The frontend is accessible under port `3000` and the Django server under port `8000`.

## Deploy

Any merge into `main` will trigger a CD action which builds the needed containers and triggers a rolling update using Docker in swarm mode.
