import mysql.connector
from services.db_service import get_db

class UserModel:
    @staticmethod
    def create_user(fullname, email, phone, password):
        db = get_db()
        cursor = db.cursor()
        try:
            query = "INSERT INTO users (fullname, email, phone, password) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (fullname, email, phone, password))
            db.commit()
            return True
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            return False
        finally:
            cursor.close()

    @staticmethod
    def get_user_by_email(email):
        db = get_db()
        cursor = db.cursor(dictionary=True)
        query = "SELECT * FROM users WHERE email = %s"
        cursor.execute(query, (email,))
        user = cursor.fetchone()
        cursor.close()
        return user

    @staticmethod
    def get_user_by_id(user_id):
        db = get_db()
        cursor = db.cursor(dictionary=True)
        
        query = """
        SELECT u.id, u.fullname, u.email, u.phone, 
            a.street_address, a.landmark, a.village_locality, 
            a.pin_code, a.city, a.state
        FROM users u
        LEFT JOIN addresses a ON u.id = a.user_id
        WHERE u.id = %s
        """
        
        cursor.execute(query, (user_id,))
        user = cursor.fetchone()
        cursor.close()
        
        if user:
            user['address'] = {
                "street_address": user['street_address'] if 'street_address' in user else '',
                "landmark": user['landmark'] if 'landmark' in user else '',
                "village_locality": user['village_locality'] if 'village_locality' in user else '',
                "pin_code": user['pin_code'] if 'pin_code' in user else '',
                "city": user['city'] if 'city' in user else '',
                "state": user['state'] if 'state' in user else ''
            }

        return user
