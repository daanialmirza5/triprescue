"""Transactional email (disruption alerts, applied recoveries).

With EMAIL_NOTIFICATIONS_ENABLED=false (the default) nothing touches the
network: every message is logged at INFO so local dev and tests can see what
would have been sent. When enabled, messages go out over SMTP on a small
worker pool so a slow mail server never blocks an API request, and any SMTP
failure is logged rather than raised - email is a side channel, never a
reason for a disruption or recovery request to fail.
"""

from __future__ import annotations

import logging
import smtplib
import ssl
from concurrent.futures import Future, ThreadPoolExecutor
from email.message import EmailMessage
from html import escape

from app.config import get_settings

logger = logging.getLogger("safarsathi.email")
_executor = ThreadPoolExecutor(max_workers=2, thread_name_prefix="email")


def _build_message(to_email: str, subject: str, body: str, html_body: str | None) -> EmailMessage:
    settings = get_settings()
    message = EmailMessage()
    message["From"] = settings.email_from
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(body)
    if html_body:
        message.add_alternative(html_body, subtype="html")
    return message


def _deliver(message: EmailMessage) -> bool:
    settings = get_settings()
    try:
        with smtplib.SMTP(settings.smtp_host or "", settings.smtp_port, timeout=15) as smtp:
            if settings.smtp_use_tls:
                smtp.starttls(context=ssl.create_default_context())
            if settings.smtp_user and settings.smtp_password:
                smtp.login(settings.smtp_user, settings.smtp_password)
            smtp.send_message(message)
        logger.info("Email sent to %s: %s", message["To"], message["Subject"])
        return True
    except Exception:
        logger.warning("Email delivery to %s failed", message["To"], exc_info=True)
        return False


def send_notification_email(to_email: str, subject: str, body: str, html_body: str | None = None) -> Future | None:
    """Queue an email. Returns the delivery Future when actually sending, or
    None when email is disabled/unconfigured (the message is logged instead)."""
    settings = get_settings()
    if not to_email:
        return None
    if not settings.email_notifications_enabled or not settings.smtp_host:
        if settings.email_notifications_enabled:
            logger.warning("EMAIL_NOTIFICATIONS_ENABLED is set but SMTP_HOST is missing; logging email instead.")
        logger.info("Email (not sent) to=%s subject=%r body=%r", to_email, subject, body)
        return None
    return _executor.submit(_deliver, _build_message(to_email, subject, body, html_body))


def _html(title: str, lines: list[str]) -> str:
    items = "".join(f"<p style='margin:0 0 10px'>{escape(line)}</p>" for line in lines)
    return (
        "<div style='font-family:Arial,sans-serif;color:#0B1B3A;max-width:560px'>"
        f"<h2 style='color:#1F6BFF;margin:0 0 14px'>{escape(title)}</h2>{items}"
        "<p style='color:#5B6B86;font-size:12px;margin-top:20px'>Safar Sathi · Your Journey, Always with You</p></div>"
    )


def notify_disruption(to_email: str | None, traveler_name: str, trip_name: str, label: str, downstream: int, exposure: float) -> None:
    if not to_email:
        return
    lines = [
        f"Hi {traveler_name},",
        f"{label} on your trip “{trip_name}”.",
        f"{downstream} downstream booking(s) may be affected (₹{exposure:,.0f} at risk).",
        "Open Safar Sathi to review ranked recovery options - nothing changes until you confirm.",
    ]
    send_notification_email(to_email, f"Disruption detected: {label}", "\n\n".join(lines), _html("Disruption detected", lines))


def notify_recovery_applied(to_email: str | None, traveler_name: str, trip_name: str, plan_name: str, preserved: int, total: int, cost_delta: float) -> None:
    if not to_email:
        return
    lines = [
        f"Hi {traveler_name},",
        f"“{plan_name}” has been applied to “{trip_name}”.",
        f"{preserved}/{total} bookings preserved; additional cost ₹{max(cost_delta, 0):,.0f}.",
        "Your itinerary has been re-validated end to end.",
    ]
    send_notification_email(to_email, f"Recovery applied: {plan_name}", "\n\n".join(lines), _html("Journey recovered", lines))
