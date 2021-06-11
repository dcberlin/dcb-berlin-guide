FROM python:3.9.5-slim

WORKDIR /backend
COPY . /backend

RUN : \
  && pip install --no-cache-dir --upgrade pip \
  && pip install --no-cache-dir poetry~=1.1.6 \
  && pip install gunicorn \
  && poetry config virtualenvs.create false \
  && poetry install --no-dev \
  && pip uninstall --yes poetry \
  && apt update && apt install -y gdal-bin libgdal-dev \
  && python src/manage.py collectstatic --noinput \
  && :

WORKDIR src
