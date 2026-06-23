"""Optional Google Sheets sync via service account.

If GOOGLE_SHEET_ID and GOOGLE_SERVICE_ACCOUNT_JSON are configured, every new
partnership application is appended as a row to the configured sheet.

The Sheet must be shared (Editor) with the service account email.
"""
from __future__ import annotations
import asyncio
import json
import logging
import os
from typing import Any, Dict, List

logger = logging.getLogger(__name__)

SHEET_ID = os.environ.get("GOOGLE_SHEET_ID", "").strip()
SERVICE_ACCOUNT_JSON = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON", "").strip()
SHEET_RANGE = os.environ.get("GOOGLE_SHEET_RANGE", "Applications!A:Z")

SHEET_HEADERS = [
    "submitted_at", "id", "status", "full_name", "email", "phone", "location",
    "profession", "primary_platform", "social_profiles", "audience_size",
    "audience_demographic", "top_geographies", "analytics_url", "media_kit_url",
    "portfolio_url", "posting_frequency", "content_output", "content_pillars",
    "currently_monetising", "monthly_revenue_range", "revenue_streams",
    "past_brand_collaborations", "notable_brands", "preferred_brand_categories",
    "restricted_categories", "exclusivity_terms", "twelve_month_goal",
    "long_term_vision", "expectations_from_edamen", "open_questions",
]


def is_enabled() -> bool:
    return bool(SHEET_ID and SERVICE_ACCOUNT_JSON)


def _build_service():
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    info = json.loads(SERVICE_ACCOUNT_JSON)
    creds = service_account.Credentials.from_service_account_info(
        info, scopes=["https://www.googleapis.com/auth/spreadsheets"]
    )
    return build("sheets", "v4", credentials=creds, cache_discovery=False)


def _row_from_application(app_doc: Dict[str, Any]) -> List[str]:
    def _g(k: str) -> str:
        v = app_doc.get(k)
        if v is None:
            return ""
        if isinstance(v, list):
            try:
                return json.dumps(v, ensure_ascii=False)
            except Exception:
                return str(v)
        return str(v)

    return [
        _g("created_at"), _g("id"), _g("status"), _g("full_name"), _g("email"),
        _g("phone"), _g("location"), _g("profession"), _g("primary_platform"),
        _g("social_profiles"), _g("audience_size"), _g("audience_demographic"),
        _g("top_geographies"), _g("analytics_url"), _g("media_kit_url"),
        _g("portfolio_url"), _g("posting_frequency"), _g("content_output"),
        _g("content_pillars"), _g("currently_monetising"), _g("monthly_revenue_range"),
        _g("revenue_streams"), _g("past_brand_collaborations"), _g("notable_brands"),
        _g("preferred_brand_categories"), _g("restricted_categories"),
        _g("exclusivity_terms"), _g("twelve_month_goal"), _g("long_term_vision"),
        _g("expectations_from_edamen"), _g("open_questions"),
    ]


def _append_sync(values: List[List[str]]) -> None:
    service = _build_service()
    service.spreadsheets().values().append(
        spreadsheetId=SHEET_ID,
        range=SHEET_RANGE,
        valueInputOption="RAW",
        insertDataOption="INSERT_ROWS",
        body={"values": values},
    ).execute()


async def append_application(app_doc: Dict[str, Any]) -> bool:
    if not is_enabled():
        return False
    try:
        row = _row_from_application(app_doc)
        await asyncio.to_thread(_append_sync, [row])
        return True
    except Exception as e:
        logger.exception("Google Sheets append failed: %s", e)
        return False


async def ensure_headers() -> None:
    """Write the header row if the sheet appears empty. Best-effort."""
    if not is_enabled():
        return
    try:
        def _go():
            service = _build_service()
            existing = service.spreadsheets().values().get(
                spreadsheetId=SHEET_ID, range=SHEET_RANGE
            ).execute()
            if not existing.get("values"):
                service.spreadsheets().values().update(
                    spreadsheetId=SHEET_ID,
                    range=SHEET_RANGE,
                    valueInputOption="RAW",
                    body={"values": [SHEET_HEADERS]},
                ).execute()
        await asyncio.to_thread(_go)
    except Exception as e:
        logger.warning("ensure_headers failed: %s", e)
