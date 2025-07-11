import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Booking
from review.models import Complaints
from .models import Notifications
from .tasks import send_booking_notification_task, send_complaint_notification
from django.db import transaction

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Booking)
def trigger_booking_notification(sender, instance, created, **kwargs):
    with transaction.atomic():
        logger.info(
            f"created celery task to send socket message for booking_id={instance.booking_id}"
        )
        send_booking_notification_task.delay(instance.booking_id)


@receiver(post_save, sender=Complaints)
def complaint_notification(sender, instance, created, **kwargs):
    if created:
        message = f"Your complaint '{instance.subject}' has been received."
        notification = Notifications.objects.create(
            user=instance.user,
            notification_type="Complaint",
            message=message,
            booking=None,
            complaint=instance,
        )
        send_complaint_notification.delay(instance.user.id, notification.id)
    elif instance.status == "resolved" and not instance.is_resolved:
        message = f"Your complaint '{instance.subject}' has been resolved."
        notifcation = Notifications.objects.create(
            user=instance.user,
            notification_type="Complaint",
            message=message,
            booking=None,
            complaint=instance,
        )
        send_complaint_notification.delay(instance.user.id, notifcation.id)
