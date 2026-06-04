from app import db
from datetime import datetime

class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    available_seats = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, default=0.0)
    poster_path = db.Column(db.String(255)) # Path al file caricato localmente (NON URL)
    
    organizer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    organizer = db.relationship('User', backref=db.backref('organized_events', lazy=True))

class Registration(db.Model):
    __tablename__ = 'registrations'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    qr_code_path = db.Column(db.String(255)) # Path al QR code generato
    
    user = db.relationship('User', backref=db.backref('registrations', lazy=True))
    event = db.relationship('Event', backref=db.backref('attendees', lazy=True))

class Review(db.Model):
    __tablename__ = 'reviews'
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False) # Rating 1-5
    comment = db.Column(db.Text)
    reported = db.Column(db.Boolean, default=False) # Per la moderazione dell'admin
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    
    user = db.relationship('User', backref=db.backref('reviews', lazy=True))
    event = db.relationship('Event', backref=db.backref('reviews', lazy=True))
