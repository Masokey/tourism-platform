from src.models.user import db
from datetime import datetime

class Advertisement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    place_id = db.Column(db.Integer, db.ForeignKey('place.id'), nullable=True)  # اختياري
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text)
    image_url = db.Column(db.String(300))
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # العلاقة مع الأماكن
    place = db.relationship('Place', backref='advertisements', lazy=True)

    def __repr__(self):
        return f'<Advertisement {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'place_id': self.place_id,
            'title': self.title,
            'content': self.content,
            'image_url': self.image_url,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'place_name': self.place.name if self.place else None,
            'user_name': self.user.username if self.user else None
        }

