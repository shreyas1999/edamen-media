"""Edamen Media backend — FastAPI app."""
import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException, Depends, Query
from motor.motor_asyncio import AsyncIOMotorClient
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from auth import create_token, hash_password, require_admin, verify_password  # noqa: E402
from models import (  # noqa: E402
    AdminLogin,
    APPLICATION_STATUSES,
    Application,
    ApplicationCreate,
    ContactMessage,
    ContactMessageCreate,
    StatusUpdate,
)
import sheets  # noqa: E402


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("edamen")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Edamen Media API")
api = APIRouter(prefix="/api")


# ---------- Startup ----------
@app.on_event("startup")
async def on_startup() -> None:
    admin_email = os.environ.get("ADMIN_EMAIL", "").strip().lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "")
    if admin_email and admin_password:
        existing = await db.admin_users.find_one({"email": admin_email})
        if not existing:
            await db.admin_users.insert_one({
                "email": admin_email,
                "password_hash": hash_password(admin_password),
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
            logger.info("Seeded admin user: %s", admin_email)
    # Best-effort: write headers to Google Sheet if configured
    await sheets.ensure_headers()


@app.on_event("shutdown")
async def on_shutdown() -> None:
    client.close()


# ---------- Public ----------
@api.get("/")
async def root():
    return {"service": "edamen-media", "ok": True}


@api.get("/health")
async def health():
    return {
        "ok": True,
        "sheets_enabled": sheets.is_enabled(),
        "time": datetime.now(timezone.utc).isoformat(),
    }


# ---------- Auth ----------
@api.post("/auth/login")
async def login(payload: AdminLogin):
    user = await db.admin_users.find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(subject=user["email"], extra={"role": "admin"})
    return {"token": token, "email": user["email"]}


@api.get("/auth/me")
async def me(payload: dict = Depends(require_admin)):
    return {"email": payload.get("sub"), "role": payload.get("role")}


# ---------- Applications ----------
@api.post("/applications", response_model=Application)
async def create_application(payload: ApplicationCreate):
    app_obj = Application(**payload.model_dump())
    doc = app_obj.model_dump()
    # social_profiles serialize as list of dicts already
    await db.applications.insert_one({**doc})
    # Best-effort sheets append (does not block on errors)
    synced = await sheets.append_application(doc)
    logger.info("New application %s synced=%s", app_obj.id, synced)
    return app_obj


@api.get("/applications", response_model=List[Application])
async def list_applications(
    status: Optional[str] = Query(None),
    _: dict = Depends(require_admin),
):
    query = {}
    if status and status in APPLICATION_STATUSES:
        query["status"] = status
    docs = await db.applications.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


@api.get("/applications/stats")
async def app_stats(_: dict = Depends(require_admin)):
    pipeline = [{"$group": {"_id": "$status", "count": {"$sum": 1}}}]
    rows = await db.applications.aggregate(pipeline).to_list(50)
    counts = {s: 0 for s in APPLICATION_STATUSES}
    for r in rows:
        if r["_id"] in counts:
            counts[r["_id"]] = r["count"]
    total = sum(counts.values())
    return {"total": total, "by_status": counts}


@api.get("/applications/{app_id}", response_model=Application)
async def get_application(app_id: str, _: dict = Depends(require_admin)):
    doc = await db.applications.find_one({"id": app_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    return doc


@api.patch("/applications/{app_id}", response_model=Application)
async def update_application(
    app_id: str,
    payload: StatusUpdate,
    _: dict = Depends(require_admin),
):
    if payload.status not in APPLICATION_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    update = {"status": payload.status, "updated_at": datetime.now(timezone.utc).isoformat()}
    if payload.notes is not None:
        update["notes"] = payload.notes
    result = await db.applications.find_one_and_update(
        {"id": app_id},
        {"$set": update},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Not found")
    return result


@api.delete("/applications/{app_id}")
async def delete_application(app_id: str, _: dict = Depends(require_admin)):
    result = await db.applications.delete_one({"id": app_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}


# ---------- Contact ----------
@api.post("/contact", response_model=ContactMessage)
async def create_contact(payload: ContactMessageCreate):
    msg = ContactMessage(**payload.model_dump())
    await db.contact_messages.insert_one(msg.model_dump())
    return msg


@api.get("/contact", response_model=List[ContactMessage])
async def list_contact(_: dict = Depends(require_admin)):
    docs = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


# ---------- Config (public) ----------
@api.get("/config")
async def public_config():
    return {
        "calendly_url": os.environ.get("CALENDLY_URL", ""),
        "statuses": APPLICATION_STATUSES,
    }


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
