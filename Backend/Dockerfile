# Stage 1: Builder
FROM python:3.10-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip && pip install --user -r requirements.txt && rm -rf /root/.cache

# Stage 2: Final
FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/home/appuser/.local/bin:$PATH"

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user and set permissions
RUN useradd -m appuser && \
    mkdir -p /app/staticfiles /app/media && \
    chown -R appuser:appuser /app

WORKDIR /app

# Copy dependencies and application code
COPY --from=builder --chown=appuser:appuser /root/.local /home/appuser/.local
COPY --chown=appuser:appuser . .

# Collect static files
USER appuser

CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "Backend.asgi:application"]