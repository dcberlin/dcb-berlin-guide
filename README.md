# The DCB Berlin Guide

The Berlin Guide created by [DCB](https://diasporacivica.berlin) aims to be the online gateway for members of the Romanian community in Berlin.
Its goal is to provide clear information on places of interest and services in demand among the Romanian diaspora in the city and its surroundings.

## Implementation

This is a monorepo containing all the moving parts of the web app.
The application consists of a Django server which persists it in Postgres and provides it through a REST API.
The data is consumed by frontend client built with React and can also be directly used by the public (read-only).
Data input is done by authorized users via the Django Admin.

## Set up for development

* Clone the repo.
* Copy the `.env.local` template to `.env` and fill in the missing environment variables (Mapbox API token etc.).
* Make sure you have Docker and Docker Compose installed.
* Run all the required containers with `docker-compose up`.
* You're good to go! Any changes in the repos will be reflected in the containers as well thanks to Docker volumes.
