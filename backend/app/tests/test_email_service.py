"""Email dispatch: logged when disabled, sent via SMTP when enabled, never fatal."""

import logging

import pytest

from app.config import get_settings
from app.services import email_service


class FakeSMTP:
    sent: list = []
    fail = False

    def __init__(self, host, port, timeout=None):
        self.host, self.port = host, port

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        return False

    def starttls(self, context=None):
        pass

    def login(self, user, password):
        pass

    def send_message(self, message):
        if FakeSMTP.fail:
            raise OSError("smtp down")
        FakeSMTP.sent.append(message)


@pytest.fixture()
def smtp_enabled(monkeypatch):
    settings = get_settings()
    saved = (settings.email_notifications_enabled, settings.smtp_host)
    settings.email_notifications_enabled, settings.smtp_host = True, "smtp.example.com"
    FakeSMTP.sent, FakeSMTP.fail = [], False
    monkeypatch.setattr(email_service.smtplib, "SMTP", FakeSMTP)
    yield
    settings.email_notifications_enabled, settings.smtp_host = saved


def test_disabled_email_is_logged_not_sent(caplog, monkeypatch):
    monkeypatch.setattr(email_service.smtplib, "SMTP", lambda *a, **k: pytest.fail("network used"))
    with caplog.at_level(logging.INFO, logger="safarsathi.email"):
        assert email_service.send_notification_email("a@b.com", "Hello", "Body") is None
    assert "Email (not sent)" in caplog.text and "Hello" in caplog.text


def test_enabled_email_is_sent(smtp_enabled):
    future = email_service.send_notification_email("a@b.com", "Subject", "Body", "<p>Body</p>")
    assert future.result(timeout=5) is True
    message = FakeSMTP.sent[0]
    assert message["To"] == "a@b.com" and message["Subject"] == "Subject"
    assert message.is_multipart()


def test_smtp_failure_is_swallowed(smtp_enabled):
    FakeSMTP.fail = True
    assert email_service.send_notification_email("a@b.com", "S", "B").result(timeout=5) is False


def test_disruption_and_recovery_emails_are_dispatched(client, caplog):
    with caplog.at_level(logging.INFO, logger="safarsathi.email"):
        client.post("/api/trips/trip-ladakh-2025/disruptions", json={"type": "flight-delay", "delayMinutes": 180})
        options = client.post("/api/trips/trip-ladakh-2025/recovery-options/generate").json()
        plan = next(o for o in options if o["feasible"])
        assert client.post("/api/trips/trip-ladakh-2025/recovery/apply", json={"recoveryId": plan["id"]}).status_code == 200
    assert "Disruption detected" in caplog.text
    assert "Recovery applied" in caplog.text
    assert "aisha.khan@example.com" in caplog.text
