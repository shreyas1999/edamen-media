"""WhatsApp notifications via Twilio.

Sends a notification to WHATSAPP_NOTIFY_TO whenever a new application is created.
Silently no-ops if Twilio env vars are not configured. Never blocks the request.
"""
from __future__ import annotations
import asyncio
import json
import logging
import os
from typing import Any, Dict

logger = logging.getLogger(__name__)

ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "").strip()
AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "").strip()
FROM = os.environ.get("TWILIO_WHATSAPP_FROM", "").strip()
TO = os.environ.get("WHATSAPP_NOTIFY_TO", "").strip()

# Twilio caps a single message at 1600 chars; we keep a generous buffer.
MAX_BODY_LEN = 1500


def is_enabled() -> bool:
    return bool(ACCOUNT_SID and AUTH_TOKEN and FROM and TO)


_FIELDS = [
    ("Name", "full_name"),
    ("Email", "email"),
    ("Phone", "phone"),
    ("Location", "location"),
    ("Profession", "profession"),
    ("Primary platform", "primary_platform"),
    ("Audience size", "audience_size"),
    ("Audience demographic", "audience_demographic"),
    ("Top geographies", "top_geographies"),
    ("Analytics", "analytics_url"),
    ("Media Kit", "media_kit_url"),
    ("Portfolio", "portfolio_url"),
    ("Posting frequency", "posting_frequency"),
    ("Content output", "content_output"),
    ("Content pillars", "content_pillars"),
    ("Currently monetising", "currently_monetising"),
    ("Monthly revenue", "monthly_revenue_range"),
    ("Revenue streams", "revenue_streams"),
    ("Past collaborations", "past_brand_collaborations"),
    ("Notable brands", "notable_brands"),
    ("Preferred categories", "preferred_brand_categories"),
    ("Restricted categories", "restricted_categories"),
    ("Exclusivity terms", "exclusivity_terms"),
    ("12-month goal", "twelve_month_goal"),
    ("Long-term vision", "long_term_vision"),
    ("Expectations", "expectations_from_edamen"),
    ("Open questions", "open_questions"),
]


def _format_socials(socials: Any) -> str:
    if not isinstance(socials, list) or not socials:
        return ""
    out = []
    for s in socials:
        if not isinstance(s, dict):
            continue
        parts = [
            s.get("platform") or "—",
            s.get("handle") or "",
            s.get("followers") or "",
            s.get("url") or "",
        ]
        out.append(" · ".join([p for p in parts if p]))
    return "\n".join(out)


def _build_body(app: Dict[str, Any]) -> str:
    lines = [
        "*New Edamen Application*",
        f"_ID:_ {app.get('id', '—')}",
        "",
    ]
    for label, key in _FIELDS:
        v = app.get(key)
        if v is None or v == "":
            continue
        lines.append(f"*{label}:* {v}")

    socials = _format_socials(app.get("social_profiles"))
    if socials:
        lines.append("")
        lines.append("*Social profiles:*")
        lines.append(socials)

    lines.append("")
    lines.append(f"Submitted at: {app.get('created_at', '—')}")

    body = "\n".join(lines)
    if len(body) > MAX_BODY_LEN:
        body = body[: MAX_BODY_LEN - 20] + "\n…(truncated)"
    return body


def _send_sync(body: str) -> str:
    from twilio.rest import Client  # imported lazily so dev env doesn't require it

    client = Client(ACCOUNT_SID, AUTH_TOKEN)
    msg = client.messages.create(from_=FROM, to=TO, body=body)
    return msg.sid


async def notify_new_application(app_doc: Dict[str, Any]) -> bool:
    if not is_enabled():
        return False
    try:
        body = _build_body(app_doc)
        sid = await asyncio.to_thread(_send_sync, body)
        logger.info("WhatsApp notification sent: %s", sid)
        return True
    except Exception as e:
        logger.exception("WhatsApp notification failed: %s", e)
        return False
