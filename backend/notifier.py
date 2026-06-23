"""Telegram notifications for new applications.

Posts an HTML-formatted snapshot to the configured TELEGRAM_CHAT_ID via the
Bot API. Best-effort: never blocks the request, silently no-ops if env vars
are not configured. Splits long messages to respect Telegram's 4096-char cap.
"""
from __future__ import annotations
import asyncio
import html as html_lib
import logging
import os
from typing import Any, Dict, List, Tuple

import requests

logger = logging.getLogger(__name__)

BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "").strip()

API_BASE = "https://api.telegram.org"
MAX_LEN = 3800  # safe under Telegram's 4096 hard cap


def is_enabled() -> bool:
    return bool(BOT_TOKEN and CHAT_ID)


_FIELDS: List[Tuple[str, str]] = [
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

LINK_FIELDS = {"analytics_url", "media_kit_url", "portfolio_url"}


def _esc(v: Any) -> str:
    if v is None:
        return ""
    return html_lib.escape(str(v), quote=False)


def _format_socials(socials: Any) -> str:
    if not isinstance(socials, list) or not socials:
        return ""
    lines = []
    for s in socials:
        if not isinstance(s, dict):
            continue
        platform = _esc(s.get("platform") or "—")
        handle = _esc(s.get("handle") or "")
        followers = _esc(s.get("followers") or "")
        url = s.get("url") or ""
        link_part = ""
        if url:
            url_safe = html_lib.escape(url, quote=True)
            link_part = f' · <a href="{url_safe}">link</a>'
        bits = [b for b in [platform, handle, followers] if b]
        lines.append("• " + " · ".join(bits) + link_part)
    return "\n".join(lines)


def _build_message(app: Dict[str, Any]) -> str:
    name = _esc(app.get("full_name") or "Unknown")
    email = _esc(app.get("email") or "")
    parts = [
        "<b>📥 New Edamen Application</b>",
        f"<b>{name}</b>" + (f" · {email}" if email else ""),
        "",
    ]
    for label, key in _FIELDS:
        if key in ("full_name", "email"):
            continue
        v = app.get(key)
        if v is None or v == "":
            continue
        if key in LINK_FIELDS:
            url_safe = html_lib.escape(str(v), quote=True)
            value_html = f'<a href="{url_safe}">{_esc(v)}</a>'
        else:
            value_html = _esc(v)
        parts.append(f"<b>{_esc(label)}:</b> {value_html}")

    socials = _format_socials(app.get("social_profiles"))
    if socials:
        parts.append("")
        parts.append("<b>Social profiles</b>")
        parts.append(socials)

    parts.append("")
    parts.append(f"<i>ID:</i> <code>{_esc(app.get('id') or '—')}</code>")
    parts.append(f"<i>Submitted:</i> {_esc(app.get('created_at') or '—')}")
    return "\n".join(parts)


def _chunk(text: str, limit: int = MAX_LEN) -> List[str]:
    if len(text) <= limit:
        return [text]
    chunks: List[str] = []
    remaining = text
    while remaining:
        if len(remaining) <= limit:
            chunks.append(remaining)
            break
        cut = remaining.rfind("\n", 0, limit)
        if cut == -1:
            cut = limit
        chunks.append(remaining[:cut])
        remaining = remaining[cut:].lstrip("\n")
    return chunks


def _send_sync(text: str) -> bool:
    url = f"{API_BASE}/bot{BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": CHAT_ID,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }
    r = requests.post(url, json=payload, timeout=10)
    if r.status_code != 200:
        logger.warning("Telegram non-200 (%s): %s", r.status_code, r.text[:300])
        return False
    return True


async def notify_new_application(app_doc: Dict[str, Any]) -> bool:
    if not is_enabled():
        return False
    try:
        text = _build_message(app_doc)
        for chunk in _chunk(text):
            ok = await asyncio.to_thread(_send_sync, chunk)
            if not ok:
                return False
        logger.info("Telegram notification sent for application %s", app_doc.get("id"))
        return True
    except Exception as e:
        logger.exception("Telegram send failed: %s", e)
        return False
