import pytest
from app import create_app, db
from app.models.user import User

@pytest.fixture
def app():
    """Crea una nuova istanza dell'app per i test usando un DB in memoria"""
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "WTF_CSRF_ENABLED": False
    })

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    """Client di test per fare le richieste HTTP"""
    return app.test_client()

@pytest.fixture
def init_database(app):
    """Popola il database con dati di base per i test"""
    admin = User(username="admin_test", email="admin@test.com", role="admin")
    admin.set_password("password123")
    user = User(username="user_test", email="user@test.com", role="user")
    user.set_password("password123")
    
    db.session.add(admin)
    db.session.add(user)
    db.session.commit()
    
    return db
