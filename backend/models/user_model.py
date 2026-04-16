from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    email: str
    password: str

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    username: Optional[str] = None
    social_links: Optional[dict] = None
    notifications_enabled: Optional[bool] = None
    avatar_seed: Optional[str] = None
    avatar_style: Optional[str] = "adventurer"
    avatar_score: Optional[float] = None
    avatar_state: Optional[str] = None
    gender: Optional[str] = None

class PreferencesUpdate(BaseModel):
    tone: Optional[str] = None
    response_length: Optional[str] = None
    focus: Optional[str] = None

class PasswordUpdate(BaseModel):
    old_password: str
    new_password: str