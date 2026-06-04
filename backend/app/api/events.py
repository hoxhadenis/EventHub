from app.utils.email_task import send_confirmation_email_async
import os
from datetime import datetime
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models.event import Event, Registration
from app.schemas.event_schema import EventSchema
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from app.utils.decorators import organizer_required

events_bp = Blueprint('events', __name__, url_prefix='/api/events')
event_schema = EventSchema()
events_schema = EventSchema(many=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ==========================================
# ROTTE PUBBLICHE (Lettura e Ricerca)
# ==========================================

@events_bp.route('', methods=['GET'])
def get_events():
    """Restituisce tutti gli eventi, con filtri opzionali"""
    query = Event.query
    
    # Filtri di base
    if 'city' in request.args:
        query = query.filter(Event.city.ilike(f"%{request.args['city']}%"))
    if 'category' in request.args:
        query = query.filter(Event.category.ilike(f"%{request.args['category']}%"))
        
    events = query.all()
    return jsonify(events_schema.dump(events)), 200

@events_bp.route('/<int:event_id>', methods=['GET'])
def get_event_detail(event_id):
    """Dettaglio singolo evento"""
    event = Event.query.get_or_404(event_id)
    return jsonify(event_schema.dump(event)), 200


# ==========================================
# ROTTE ORGANIZZATORE (CRUD Eventi)
# ==========================================

@events_bp.route('', methods=['POST'])
@organizer_required # Solo gli organizzatori possono creare eventi
def create_event():
    # Gestione form data (non JSON puro, per via del file upload)
    try:
        data = event_schema.load(request.form)
    except ValidationError as err:
        return jsonify(err.messages), 400

    # Gestione Upload Immagine
    if 'poster' not in request.files:
        return jsonify({"msg": "L'immagine di copertina è obbligatoria"}), 400
        
    file = request.files['poster']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({"msg": "File non valido o assente"}), 400

    filename = secure_filename(file.filename)
    # Crea un nome univoco aggiungendo il timestamp
    unique_filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{filename}"
    
    # Percorso di salvataggio fisico
    upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
    file_path = os.path.join(upload_folder, unique_filename)
    file.save(file_path)

    # Percorso relativo da salvare nel DB
    poster_url_path = f"/static/uploads/{unique_filename}"

    organizer_id = get_jwt_identity()

    new_event = Event(
        title=data['title'],
        description=data['description'],
        date=data['date'],
        location=data['location'],
        city=data['city'],
        available_seats=data['available_seats'],
        category=data['category'],
        price=data.get('price', 0.0),
        poster_path=poster_url_path,
        organizer_id=organizer_id
    )

    db.session.add(new_event)
    db.session.commit()
    
    # Task Asincrono: Invio email di conferma
    user_email = "utente@simulato.com" # Nella realtà estrarrato dal db tramite user_id
    send_confirmation_email_async(user_email, event.title)


    return jsonify({"msg": "Evento creato con successo", "event": event_schema.dump(new_event)}), 201


# ==========================================
# ROTTE UTENTE (Iscrizione)
# ==========================================

@events_bp.route('/<int:event_id>/register', methods=['POST'])
@jwt_required() # Qualsiasi utente loggato può iscriversi
def register_to_event(event_id):
    user_id = get_jwt_identity()
    event = Event.query.get_or_404(event_id)

    # Verifica se l'utente è già iscritto
    existing_reg = Registration.query.filter_by(user_id=user_id, event_id=event_id).first()
    if existing_reg:
        return jsonify({"msg": "Sei già iscritto a questo evento"}), 409

    # Controllo posti disponibili
    if event.available_seats <= 0:
        return jsonify({"msg": "Spiacenti, i posti sono esauriti"}), 400

    # Decrementa posti e crea registrazione
    event.available_seats -= 1
    
    # Il QR Code lo generiamo virtualmente con un path segnaposto, 
    # andrebbe creata una funzione ad hoc per generare fisicamente l'immagine QR
    qr_code_mock = f"/static/qrcodes/qr_{user_id}_{event_id}.png"

    new_reg = Registration(
        user_id=user_id,
        event_id=event_id,
        qr_code_path=qr_code_mock
    )

    db.session.add(new_reg)
    db.session.commit()
    
    # Task Asincrono: Invio email di conferma
    user_email = "utente@simulato.com" # Nella realtà estrarrato dal db tramite user_id
    send_confirmation_email_async(user_email, event.title)


    return jsonify({"msg": "Iscrizione completata con successo"}), 200

@events_bp.route('/my-tickets', methods=['GET'])
@jwt_required()
def get_my_tickets():
    user_id = get_jwt_identity()
    registrations = Registration.query.filter_by(user_id=user_id).all()
    
    result = []
    for reg in registrations:
        result.append({
            "id": reg.id,
            "registration_date": reg.registration_date.isoformat(),
            "qr_code_path": reg.qr_code_path,
            "event": {
                "id": reg.event.id,
                "title": reg.event.title,
                "date": reg.event.date.isoformat(),
                "location": reg.event.location,
                "city": reg.event.city,
                "poster_path": reg.event.poster_path
            }
        })
    return jsonify(result), 200
