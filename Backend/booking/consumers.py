from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async
from .models import *
from useracc.models import User
import logging

logger = logging.getLogger(__name__)


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.user_group_name = f"user_{self.user_id}"
        logger.info("group_name: %s", self.user_group_name)
        # Verify user exists.
        if await self.is_valid_user():
            await self.channel_layer.group_add(self.user_group_name, self.channel_name)
            logger.info(f"Connected: Added to group : {self.user_group_name}")
            await self.accept()
        else:
            logger.info(f"Invalid user {self.user_id} - closing")
            await self.close(code=4001)

    async def disconnect(self, close_code):
        logger.warning(
            f"channel_group disconnected {self.user_group_name} with code {close_code}"
        )
        if hasattr(self, "user_group_name"):
            await self.channel_layer.group_discard(
                self.user_group_name, self.channel_name
            )

    # async def receive(self, text_data):
    #     try:
    #         data = json.loads(text_data)
    #         if data.get('type') == 'ping':
    #             await self.send(text_data=json.dumps({'type': 'pong'}))
    #             logger.debug(f"Received ping from {self.user_id}")
    #     except json.JSONDecodeError:
    #         logger.error(f"Invalid JSON received from {self.user_id}")

    async def send_notification(self, event):
        logger.info(f"Websocker Consumer received: {event}")
        await self.send(
            text_data=json.dumps(
                {
                    "type": event.get("event_type"),
                    "notification": event.get("notification"),
                    "unread_count": event.get("unread_count"),
                }
            )
        )

    @database_sync_to_async
    def is_valid_user(self):
        try:
            return User.objects.filter(id=self.user_id).exists()
        except:
            return False
