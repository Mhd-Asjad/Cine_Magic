import base64
from django.template.loader import render_to_string
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
import os


def get_base64_qr(qr_field):
    if qr_field and qr_field.name:
        filepath = qr_field.path
        if os.path.exists(filepath):
            with qr_field.open("rb") as f:
                return base64.b64encode(f.read()).decode("utf-8")
    return None


def send_response_mail(to_email, subject, plain_message, context=None, qr_code=None):
    # from_email = settings.DEFAULT_FROM_EMAIL
    from_email = "mhdasjad877@gmail.com"

    html_content = render_to_string(
        "emails/booking_email.html", {"context": context, "qr_code": qr_code}
    )

    email = EmailMultiAlternatives(subject, plain_message, from_email, [to_email])
    email.attach_alternative(html_content, "text/html")
    email.send()
