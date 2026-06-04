import threading
import time

def send_confirmation_email_async(user_email, event_title):
    """
    Simula l'invio di un'email in background.
    In produzione, qui andrebbe la logica SMTP (es. Flask-Mail) o API (es. SendGrid).
    """
    def send_email():
        print(f"\n[INIZIO] Preparazione email per {user_email}...")
        time.sleep(3) # Simula il ritardo di rete
        print(f"[SUCCESSO] Email di conferma inviata a {user_email} per l'evento '{event_title}'!\n")

    # Avvia la funzione in un thread separato
    thread = threading.Thread(target=send_email)
    thread.daemon = True # Il thread si chiuderà quando l'app principale si ferma
    thread.start()
