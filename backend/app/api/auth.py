from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from app.schemas.user_schema import UserRegistrationSchema, UserLoginSchema
from flask_jwt_extended import create_access_token, create_refresh_token
from marshmallow import ValidationError

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    schema = UserRegistrationSchema()
    try:
        data = schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Email già registrata"}), 409
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "Username già in uso"}), 409

    new_user = User(
        username=data['username'],
        email=data['email'],
        role=data.get('role', 'user') # Di default assegniamo il ruolo 'user'
    )
    new_user.set_password(data['password'])

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Utente registrato con successo"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    schema = UserLoginSchema()
    try:
        data = schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({"msg": "Credenziali non valide"}), 401

    # Creazione dei token (identità = id utente)
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
    }), 200
