#builder stage
FROM python:3.10-slim as builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 

WORKDIR /app

COPY requirements.txt ./

RUN python -m venv /opt/venv \
    && . /opt/venv/bin/activate \
    && pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"


# Copy the Python dependencies from the builder stage
COPY --from=builder /opt/venv /opt/venv

COPY . .

EXPOSE 8000

CMD ["gunicorn", "Backend.wsgi:application", "--bind", "0.0.0.0:8000"]