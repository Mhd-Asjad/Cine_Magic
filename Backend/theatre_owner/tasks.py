from celery import shared_task
from django.core.mail import send_mail


@shared_task
def send_response_mail(user_mail, email_subject, email_msg):
    send_mail(
        email_subject,
        email_msg,
        "mhdasjad877@gmail.com",
        [user_mail],
        fail_silently=True,
    )
