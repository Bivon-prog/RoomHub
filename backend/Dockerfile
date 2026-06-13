FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /app

# Copy requirements and pre-downloaded wheels
COPY requirements.txt /app/
COPY wheels /app/wheels

# Install packages offline from the local wheels directory
RUN pip install --no-cache-dir --no-index --find-links=/app/wheels -r requirements.txt

# Copy backend codebase
COPY . /app/

# Expose Django port
EXPOSE 8000

# Run gunicorn server
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]
