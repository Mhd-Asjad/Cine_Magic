from __future__ import absolute_import , unicode_literals
import os
from celery import Celery


os.environ.setdefault('DJANGO_SETTINGS_MODULE' , 'Backend.settings')

app = Celery('Backend')

app.config_from_object('django.conf:settings', namespace='CELERY')

CELERY_BROKER_URL = 'redis://redis:6379/0'

app.autodiscover_tasks()