import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Booking
from review.models import Complaints
from .models import Notifications
from .tasks import send_booking_notification_task, send_complaint_notification , send_booking_email_task
from django.db import transaction

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Booking)
def trigger_booking_notification(sender, instance, created, **kwargs):
    # Only send notification if this is a new booking (not an update)
    def after_commit():
        logger.info(
            f"created celery task to send booking email for booking_id={instance.booking_id}"
        )
        send_booking_notification_task.delay(instance.booking_id)
        if instance.status == "cofirmed":
            send_booking_email_task.delay(instance.booking_id)
    if created or instance.status == "cancelled" :
        transaction.on_commit(after_commit)


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
