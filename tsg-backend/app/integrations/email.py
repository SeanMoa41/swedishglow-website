import logging
import resend
from pathlib import Path
from jinja2 import Environment, FileSystemLoader
from app.config import settings

logger = logging.getLogger("tsg.email")

_template_dir = Path(__file__).parent.parent / "templates" / "email"
_jinja = Environment(loader=FileSystemLoader(str(_template_dir)), autoescape=True)


def send_email(to: str, subject: str, template: str, context: dict) -> None:
    if not settings.resend_api_key:
        logger.warning("RESEND_API_KEY not set — skipping email to %s", to)
        return

    resend.api_key = settings.resend_api_key
    html = _jinja.get_template(f"{template}.html").render(**context)
    try:
        resend.Emails.send({
            "from": "The Swedish Glow <noreply@theswedishglow.com>",
            "to": [to],
            "subject": subject,
            "html": html,
        })
        logger.info("Email sent: %s → %s", template, to)
    except Exception:
        logger.exception("Failed to send email %s to %s", template, to)
