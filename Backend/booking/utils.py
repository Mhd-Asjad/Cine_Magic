import base64
from django.template.loader import render_to_string
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
import os
import time
import logging
logger = logging.getLogger(__name__)
def get_base64_qr(qr_field,retries=5 , delay=0.5):
    # Read the QR code image file and encode it to base64
    if not qr_field:
        return None

    try:
        path = qr_field.path
        logger.debug(f"Reading QR code from path: {path}")
        for attempt in range(retries):
            if os.path.exists(path):
                with open(path, "rb") as f:
                    encoded =  base64.b64encode(f.read()).decode("utf-8")
                    logger.debug(f"QR code encoded to base64 successfully : {encoded[:30]}...") 
                    return encoded
            else:
                logger.warning(f"QR code file not found at {path}, attempt {attempt + 1}/{retries}")
                time.sleep(delay)
    except Exception as e:
        logger.error(f"Failed to read QR code: {e}")
    return None
def send_response_mail(to_email, subject, plain_message, context=None, qr_code=None):
    # from_email = settings.DEFAULT_FROM_EMAIL
    from_email = "mhdasjad877@gmail.com"
    logger.info(f'context: {context} , qr_code: {qr_code}')
    html_content = render_to_string(
        "emails/booking_email.html", {"context": context, "qr_code": qr_code}
    )

    email = EmailMultiAlternatives(subject, plain_message, from_email, [to_email])
    email.attach_alternative(html_content, "text/html")
    email.send()