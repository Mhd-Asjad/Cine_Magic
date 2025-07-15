# Dockerfile
FROM cine-magic:1.0

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/home/appuser/.local/bin:$PATH"

WORKDIR /app

RUN mkdir -p /app/media/qrcodes && \
    chown -R appuser:appuser /app/media /app/staticfiles && \
    chmod -R 755 /app/media
    
# Copy application code
COPY --chown=appuser:appuser . .

USER appuser

CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "Backend.asgi:application"]