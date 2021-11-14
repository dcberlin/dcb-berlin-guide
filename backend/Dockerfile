FROM python:3.9.5-slim

WORKDIR /backend
COPY . /backend

RUN : \
  && apt-get update \
  && apt-get install -y curl gdal-bin libgdal-dev \
  && pip install --no-cache-dir --upgrade pip \
  && pip install --no-cache-dir poetry~=1.1.6 \
  && pip install gunicorn \
  && poetry config virtualenvs.create false \
  && poetry install --no-dev \
  && pip uninstall --yes poetry \
  && python src/manage.py collectstatic \
  && :

WORKDIR src
