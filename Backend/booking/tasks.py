from celery import shared_task
import logging
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

logger = logging.getLogger(__name__)
from .models import Notifications
from useracc.models import User
from .utils import get_base64_qr, send_response_mail
from .models import Booking


@shared_task
def send_booking_email_task(booking_id):
    try:
        booking = Booking.objects.get(booking_id=booking_id)
    except Booking.DoesNotExist:
        return f"No email found for booking {booking_id}"

    if not booking.customer_email:
        return

    qr_base64 = (
        get_base64_qr(booking.qr_code) if booking.status == "confirmed" else None
    )

    # context
    context = {
        "booking_id": booking.booking_id,
        "status": booking.status,
        "movie": booking.show.movie.title,
        "theatre": booking.show.screen.theatre.name,
        "show_date": booking.show.show_date,
        "show_time": booking.slot.start_time,
        "consumer_name": booking.customer_name,
    }

    subject = f"Booking {booking.status.title()} - {booking.booking_id}"
    plain_message = f"Your booking {booking.booking_id} is {booking.status}."

    send_response_mail(
        to_email=booking.customer_email,
        subject=subject,
        plain_message=plain_message,
        context=context,
        qr_code=qr_base64,
    )


@shared_task
def send_booking_notification_task(booking_id):
    logger.debug(
        f"[Task Triggered] send_booking_notification_task for booking_id={booking_id}"
    )

    from .models import Booking, Notifications

    try:
        booking = Booking.objects.get(booking_id=booking_id)
    except Booking.DoesNotExist:
        logger.error(f"Booking with booking_id={booking_id} does not exist")
        return
    channel_layer = get_channel_layer()
    user_id = booking.user.id if booking.user else None

    if not user_id or not booking.status:
        logger.warning("Invalid user or status for booking.")
        return

    group_name = f"user_{user_id}"
    notification_type = None
    message = None
    if booking.status == "confirmed":
        message = f"Your booking {booking.booking_id} is confirmed!"
        event_type = "booking_confirmed"
        notification_type = "Booking"
    elif booking.status == "cancelled":
        message = f"Your booking {booking.booking_id} has been cancelled."
        event_type = "booking_cancelled"
        notification_type = "Cancelled"
    else:
        return

    notification, created = Notifications.objects.get_or_create(
        user=booking.user,
        booking=booking,
        notification_type=notification_type,
        defaults={"message": message},
    )

    unread_count = Notifications.objects.filter(user=user_id, is_read=False).count()

    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "send_notification",
            "event_type": event_type,
            "notification": {
                "id": notification.id,
                "notification_type": notification.notification_type,
                "message": notification.message,
                "is_read": notification.is_read,
                "created": notification.created.isoformat(),
                "booking_id": notification.booking_id,
            },
            "unread_count": unread_count,
        },
    )

    logger.info(f"Notification sent to {group_name}: {message}")
    if booking.customer_email:
        send_booking_email_task.delay(booking.booking_id)


@shared_task
def send_complaint_notification(user_id, notfication_id):
    channel_layer = get_channel_layer()
    try:
        user = User.objects.get(id=user_id)
        notification = Notifications.objects.get(id=notfication_id)
        group_name = f"user_{user.id}"
        notification_data = {
            "id": notification.id,
            "notification_type": notification.notification_type,
            "message": notification.message,
            "is_read": notification.is_read,
            "created": notification.created.isoformat(),
        }

        logger.info(f"Sending message to group: {group_name}")
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                "type": "send_notification",
                "event_type": "complaint",
                "notification": notification_data,
                "unread_count": Notifications.objects.filter(
                    user=user, is_read=False
                ).count(),
            },
        )
    except User.DoesNotExist:
        logger.error(f"User with id={user_id} does not exist")
