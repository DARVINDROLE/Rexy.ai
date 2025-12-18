from sqlalchemy.orm import Session
from models.schema import UserCreate, UserResponse, LoginRequest
from database.database import get_db
from models.database import User  # or wherever your User ORM model is
from typing import Dict, Any


class UserService:
    
    def create_user(self, user_data: UserCreate, db: Session) -> User:
        """Create new user"""
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise Exception("User with this email already exists")
        
        # Create new user
        user = User(
            name=user_data.name,
            email=user_data.email,
            preferred_language=user_data.preferred_language.value
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        return user
    
    def login(self, user_data: LoginRequest, db: Session) -> User:
        """Login user"""
        
        user = db.query(User).filter(User.email == user_data.email).first()
        if not user:
            raise Exception("User with this email does not exist")
        
        return user
    
    def get_user(self, user_id: int, db: Session) -> User:
        """Get user by ID"""
        return db.query(User).filter(User.id == user_id).first()
    
    def update_user(self, user_id: int, user_data: Dict[str, Any], db: Session) -> User:
        """Update user information"""
        
        user = self.get_user(user_id, db)
        if not user:
            raise Exception("User not found")
        
        for key, value in user_data.items():
            if hasattr(user, key):
                setattr(user, key, value)
        
        db.commit()
        db.refresh(user)
        
        return user