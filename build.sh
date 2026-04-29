#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies using Poetry
# We use --with-cache to speed up future builds
poetry install

# Collect static files (CSS, JS, Images)
python manage.py collectstatic --no-input

# Run database migrations
python manage.py migrate
