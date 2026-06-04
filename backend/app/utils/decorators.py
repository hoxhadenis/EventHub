from functools import wraps
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from flask import jsonify
from app.models.user import User

def role_required(required_role):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({"msg": "Utente non trovato"}), 404
                
            # Se l'utente è admin, ha sempre accesso. Altrimenti controlliamo il ruolo specifico
            if user.role != required_role and user.role != 'admin':
                return jsonify({"msg": f"Accesso negato. Richiesto ruolo: {required_role}"}), 403
                
            return fn(*args, **kwargs)
        return decorator
    return wrapper

# Alias per comodità
admin_required = role_required('admin')
organizer_required = role_required('organizer')
