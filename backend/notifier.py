"""Email notifications via Resend.

Sends a transactional email to NOTIFY_EMAIL_TO whenever a new partnership
application is created. Best-effort: never blocks the request, silently
no-ops if env vars are not configured.
"""
from __future__ import annotations
import asyncio
import html as html_lib
import logging
import os
from typing import Any, Dict, List, Tuple

logger = logging.getLogger(__name__)

API_KEY = os.environ.get("RESEND_API_KEY", "").strip()
SENDER = os.environ.get("SENDER_EMAIL", "").strip() or "onboarding@resend.dev"
TO = os.environ.get("NOTIFY_EMAIL_TO", "").strip()


def is_enabled() -> bool:
    return bool(API_KEY and TO)


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


def _esc(v: Any) -> str:
    if v is None:
        return ""
    return html_lib.escape(str(v))


def _link(v: str) -> str:
    if not v:
        return ""
    safe = html_lib.escape(v, quote=True)
    return f'<a href="{safe}" style="color:#2563EB;text-decoration:none">{safe}</a>'


def _row(label: str, value: str, is_link: bool = False) -> str:
    if not value:
        return ""
    cell = _link(value) if is_link else _esc(value).replace("\n", "<br>")
    return (
        f'<tr>'
        f'<td style="padding:8px 12px;border-bottom:1px solid #1f1f1f;'
        f'color:#A1A1AA;font:11px/1.5 -apple-system,Inter,Arial,sans-serif;'
        f'text-transform:uppercase;letter-spacing:0.18em;width:200px;vertical-align:top">{html_lib.escape(label)}</td>'
        f'<td style="padding:8px 12px;border-bottom:1px solid #1f1f1f;'
        f'color:#F5F5F5;font:14px/1.55 -apple-system,Inter,Arial,sans-serif;vertical-align:top">{cell}</td>'
        f'</tr>'
    )


def _socials_html(socials: Any) -> str:
    if not isinstance(socials, list) or not socials:
        return ""
    items = []
    for s in socials:
        if not isinstance(s, dict):
            continue
        platform = _esc(s.get("platform") or "—")
        handle = _esc(s.get("handle") or "")
        followers = _esc(s.get("followers") or "")
        url = s.get("url") or ""
        link = _link(url) if url else ""
        items.append(
            f'<li style="margin:0 0 6px 0;color:#F5F5F5;font:14px/1.55 -apple-system,Inter,Arial,sans-serif">'
            f'<span style="color:#A1A1AA">{platform}</span> · {handle} · {followers} {("· " + link) if link else ""}'
            f'</li>'
        )
    return (
        '<tr><td colspan="2" style="padding:16px 12px 4px 12px;color:#A1A1AA;'
        'font:11px/1.5 -apple-system,Inter,Arial,sans-serif;text-transform:uppercase;letter-spacing:0.18em">Social profiles</td></tr>'
        f'<tr><td colspan="2" style="padding:0 12px 12px 12px"><ul style="margin:0;padding-left:18px">{"".join(items)}</ul></td></tr>'
    )


def _build_html(app: Dict[str, Any]) -> str:
    rows = []
    for label, key in _FIELDS:
        v = app.get(key)
        if v is None or v == "":
            continue
        is_link = key in {"analytics_url", "media_kit_url", "portfolio_url"}
        rows.append(_row(label, str(v), is_link=is_link))

    socials = _socials_html(app.get("social_profiles"))

    return f"""\
<!doctype html>
<html><body style="margin:0;padding:24px;background:#090909;color:#F5F5F5;font-family:-apple-system,Inter,Arial,sans-serif">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:640px;margin:0 auto;background:#0c0c0c;border:1px solid #1f1f1f;border-radius:12px;overflow:hidden">
    <tr>
      <td style="padding:24px 24px 8px 24px">
        <div style="font:11px/1.5 -apple-system,Inter,Arial,sans-serif;color:#A1A1AA;text-transform:uppercase;letter-spacing:0.28em">Edamen Media — New Application</div>
        <h1 style="margin:8px 0 0 0;font:500 28px/1.15 -apple-system,'SF Pro Display',Arial,sans-serif;letter-spacing:-0.02em;color:#F5F5F5">{_esc(app.get("full_name") or "—")}</h1>
        <div style="margin:4px 0 0 0;color:#A1A1AA;font:14px/1.5 -apple-system,Inter,Arial,sans-serif">{_esc(app.get("email") or "")}</div>
      </td>
    </tr>
    <tr><td style="padding:0 12px 12px 12px"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      {''.join(rows)}
      {socials}
    </table></td></tr>
    <tr>
      <td style="padding:16px 24px 24px 24px;border-top:1px solid #1f1f1f">
        <div style="color:#A1A1AA;font:12px/1.5 -apple-system,Inter,Arial,sans-serif">
          ID: {_esc(app.get("id") or "—")} · Status: {_esc(app.get("status") or "New")} · Submitted: {_esc(app.get("created_at") or "—")}
        </div>
      </td>
    </tr>
  </table>
</body></html>"""


def _send_sync(subject: str, html: str) -> str:
    import resend  # lazy import

    resend.api_key = API_KEY
    res = resend.Emails.send({
        "from": SENDER,
        "to": [TO],
        "subject": subject,
        "html": html,
    })
    return (res or {}).get("id", "")


async def notify_new_application(app_doc: Dict[str, Any]) -> bool:
    if not is_enabled():
        return False
    try:
        name = app_doc.get("full_name") or "Unknown"
        subject = f"New Edamen application — {name}"
        html = _build_html(app_doc)
        sid = await asyncio.to_thread(_send_sync, subject, html)
        logger.info("Application email sent: id=%s", sid)
        return True
    except Exception as e:
        logger.exception("Resend email failed: %s", e)
        return False
