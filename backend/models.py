"""Pydantic models for Edamen Media."""
from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict
import uuid


APPLICATION_STATUSES = ["New", "Reviewing", "Qualified", "Call Scheduled", "Signed", "Rejected"]


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class AdminUser(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    created_at: str = Field(default_factory=_now_iso)


class SocialProfile(BaseModel):
    platform: str
    handle: str
    url: Optional[str] = None
    followers: Optional[str] = None


class ApplicationCreate(BaseModel):
    # Basic
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[str] = None
    profession: Optional[str] = None

    # Social Profiles
    social_profiles: List[SocialProfile] = []
    primary_platform: Optional[str] = None

    # Audience
    audience_size: Optional[str] = None
    audience_demographic: Optional[str] = None
    top_geographies: Optional[str] = None

    # Analytics / Media Kit (URLs only)
    analytics_url: Optional[str] = None
    media_kit_url: Optional[str] = None
    portfolio_url: Optional[str] = None

    # Content cadence
    posting_frequency: Optional[str] = None
    content_output: Optional[str] = None
    content_pillars: Optional[str] = None

    # Monetisation
    currently_monetising: Optional[str] = None
    monthly_revenue_range: Optional[str] = None
    revenue_streams: Optional[str] = None

    # Brand Collabs
    past_brand_collaborations: Optional[str] = None
    notable_brands: Optional[str] = None

    # Preferences / Restrictions
    preferred_brand_categories: Optional[str] = None
    restricted_categories: Optional[str] = None
    exclusivity_terms: Optional[str] = None

    # Goals
    twelve_month_goal: Optional[str] = None
    long_term_vision: Optional[str] = None

    # Expectations
    expectations_from_edamen: Optional[str] = None
    open_questions: Optional[str] = None


class Application(ApplicationCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "New"
    notes: Optional[str] = ""
    created_at: str = Field(default_factory=_now_iso)
    updated_at: str = Field(default_factory=_now_iso)


class StatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    company: Optional[str] = None
    message: str
    created_at: str = Field(default_factory=_now_iso)


class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    message: str
