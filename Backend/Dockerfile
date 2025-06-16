#builder stage
FROM python:3.10-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 

WORKDIR /app

COPY requirements.txt ./

RUN python -m venv /opt/venv \
    && . /opt/venv/bin/activate \
    && pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

FROM python:3.10-slim

# Install runtime system dependencies (e.g., for psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 curl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Create non-root user and set up directories
RUN useradd -m -r appuser && \
    mkdir -p /app/staticfiles /app/media && \
    chown -R appuser:appuser /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv

# Copy application code with correct ownership
WORKDIR /app
COPY --chown=appuser:appuser . .

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Run Gunicorn with optimized settings
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "--log-level", "info", "Backend.wsgi:application"]