import pytest
from unittest.mock import patch, MagicMock


def test_send_email_calls_resend_with_rendered_html(monkeypatch):
    monkeypatch.setattr("app.config.settings.resend_api_key", "test-key-123")
    with patch("resend.Emails.send") as mock_send:
        from app.integrations.email import send_email
        send_email(
            to="reseller@example.com",
            subject="Test onderwerp",
            template="account_approved",
            context={"name": "Jan", "company": "Bloemen BV", "tier": "pearl"},
        )
        mock_send.assert_called_once()
        call_args = mock_send.call_args[0][0]
        assert call_args["to"] == ["reseller@example.com"]
        assert call_args["subject"] == "Test onderwerp"
        assert "Jan" in call_args["html"]
        assert "from" in call_args


def test_send_email_skipped_when_no_api_key(monkeypatch):
    monkeypatch.setattr("app.config.settings.resend_api_key", "")
    with patch("resend.Emails.send") as mock_send:
        from importlib import reload
        import app.integrations.email as email_mod
        reload(email_mod)
        email_mod.send_email(
            to="reseller@example.com",
            subject="Test",
            template="account_approved",
            context={"name": "Jan", "company": "BV", "tier": "pearl"},
        )
        mock_send.assert_not_called()
