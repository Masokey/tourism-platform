from src.models.user import db
from datetime import datetime

class Place(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    address = db.Column(db.String(200))
    phone = db.Column(db.String(20))
    website = db.Column(db.String(200))
    category = db.Column(db.String(50), nullable=False)  # restaurant, entertainment, pharmacy, etc.
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected
    is_featured = db.Column(db.Boolean, default=False)  # للمستخدمين المدفوعين
    image_url = db.Column(db.String(300))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Place {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'address': self.address,
            'phone': self.phone,
            'website': self.website,
            'category': self.category,
            'user_id': self.user_id,
            'status': self.status,
            'is_featured': self.is_featured,
            'image_url': self.image_url,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'owner': self.owner.username if self.owner else None
        }

