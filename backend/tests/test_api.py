import pytest

def test_register_user(client, init_database):
    response = client.post('/api/auth/register', json={
        "username": "new_user",
        "email": "new@test.com",
        "password": "password123",
        "role": "user"
    })
    assert response.status_code == 201

def test_login_user(client, init_database):
    response = client.post('/api/auth/login', json={
        "email": "user@test.com",
        "password": "password123"
    })
    assert response.status_code == 200

def test_create_event_unauthorized(client, init_database):
    # Logghiamo l'utente
    login_res = client.post('/api/auth/login', json={
        "email": "user@test.com",
        "password": "password123"
    })
    token = login_res.get_json()["access_token"]
    
    # Proviamo a creare un evento
    response = client.post('/api/events', 
                           headers={"Authorization": f"Bearer {token}"},
                           data={"title": "Test Event"})
    
    # Stampiamo il messaggio di errore del server
    print("\n--- ERRORE DEL SERVER ---")
    print("Status:", response.status_code)
    print("Dati:", response.get_data(as_text=True))
    print("-------------------------\n")
    
    assert response.status_code == 403
