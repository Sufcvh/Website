from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class Application(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company: str
    position: str
    status: str = "applied"  # applied, shortlisted, round1, round2, round3, offer, rejected
    date_applied: str
    salary_range: Optional[str] = None
    job_description: Optional[str] = None
    contact_person: Optional[str] = None
    contact_email: Optional[str] = None
    notes: Optional[str] = None
    company_logo: Optional[str] = None
    interview_date: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ApplicationCreate(BaseModel):
    company: str
    position: str
    status: str = "applied"
    date_applied: str
    salary_range: Optional[str] = None
    job_description: Optional[str] = None
    contact_person: Optional[str] = None
    contact_email: Optional[str] = None
    notes: Optional[str] = None
    company_logo: Optional[str] = None
    interview_date: Optional[str] = None

class ApplicationUpdate(BaseModel):
    company: Optional[str] = None
    position: Optional[str] = None
    status: Optional[str] = None
    date_applied: Optional[str] = None
    salary_range: Optional[str] = None
    job_description: Optional[str] = None
    contact_person: Optional[str] = None
    contact_email: Optional[str] = None
    notes: Optional[str] = None
    company_logo: Optional[str] = None
    interview_date: Optional[str] = None

class Stats(BaseModel):
    total_applications: int
    by_status: dict
    response_rate: float
    upcoming_interviews: int


# Routes
@api_router.get("/")
async def root():
    return {"message": "Job Tracker API"}

@api_router.post("/applications", response_model=Application)
async def create_application(input: ApplicationCreate):
    app_dict = input.model_dump()
    app_obj = Application(**app_dict)
    
    doc = app_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.applications.insert_one(doc)
    return app_obj

@api_router.get("/applications", response_model=List[Application])
async def get_applications():
    applications = await db.applications.find({}, {"_id": 0}).to_list(1000)
    
    for app in applications:
        if isinstance(app.get('created_at'), str):
            app['created_at'] = datetime.fromisoformat(app['created_at'])
        if isinstance(app.get('updated_at'), str):
            app['updated_at'] = datetime.fromisoformat(app['updated_at'])
    
    return applications

@api_router.get("/applications/{app_id}", response_model=Application)
async def get_application(app_id: str):
    app = await db.applications.find_one({"id": app_id}, {"_id": 0})
    
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if isinstance(app.get('created_at'), str):
        app['created_at'] = datetime.fromisoformat(app['created_at'])
    if isinstance(app.get('updated_at'), str):
        app['updated_at'] = datetime.fromisoformat(app['updated_at'])
    
    return app

@api_router.put("/applications/{app_id}", response_model=Application)
async def update_application(app_id: str, input: ApplicationUpdate):
    existing = await db.applications.find_one({"id": app_id}, {"_id": 0})
    
    if not existing:
        raise HTTPException(status_code=404, detail="Application not found")
    
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.applications.update_one(
        {"id": app_id},
        {"$set": update_data}
    )
    
    updated = await db.applications.find_one({"id": app_id}, {"_id": 0})
    
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    if isinstance(updated.get('updated_at'), str):
        updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
    
    return updated

@api_router.delete("/applications/{app_id}")
async def delete_application(app_id: str):
    result = await db.applications.delete_one({"id": app_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return {"message": "Application deleted successfully"}

@api_router.get("/stats", response_model=Stats)
async def get_stats():
    applications = await db.applications.find({}, {"_id": 0}).to_list(1000)
    
    total = len(applications)
    by_status = {}
    upcoming_interviews = 0
    
    for app in applications:
        status = app.get('status', 'applied')
        by_status[status] = by_status.get(status, 0) + 1
        
        if app.get('interview_date'):
            try:
                interview_date = datetime.fromisoformat(app['interview_date'])
                if interview_date > datetime.now(timezone.utc):
                    upcoming_interviews += 1
            except:
                pass
    
    # Calculate response rate (applications that moved past 'applied')
    responded = total - by_status.get('applied', 0)
    response_rate = (responded / total * 100) if total > 0 else 0
    
    return Stats(
        total_applications=total,
        by_status=by_status,
        response_rate=round(response_rate, 1),
        upcoming_interviews=upcoming_interviews
    )


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()