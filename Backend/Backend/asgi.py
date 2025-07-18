"""
ASGI config for Backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.sessions import SessionMiddlewareStack

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Backend.settings")

django.setup()

from booking.routing import websocket_urlpatterns

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": SessionMiddlewareStack(
            AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
        ),
    }
)
