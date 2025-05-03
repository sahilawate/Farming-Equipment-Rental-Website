import mysql.connector
from config import Config

# Get DB Connection
def get_db_connection():
    return mysql.connector.connect(
        host=Config.MYSQL_HOST,
        user=Config.MYSQL_USER,
        password=Config.MYSQL_PASSWORD,
        database=Config.MYSQL_DB,
        port=Config.MYSQL_PORT
    )

# Get Equipment by ID
def get_equipment(equipment_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        query = """
            SELECT id, name, price, available_quantity, image_url
            FROM equipments 
            WHERE id = %s
        """
        cursor.execute(query, (equipment_id,))
        equipment = cursor.fetchone()
        return equipment
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None
    finally:
        cursor.close()
        connection.close()

# Save Order
def save_order(user_id, equipment_id, equipment_name, quantity, from_date, to_date, price, payment_method, total_price):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        query = """
            INSERT INTO orders 
            (user_id, equipment_id, equipment_name, quantity, from_date, to_date, price, payment_method, total_price)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (user_id, equipment_id, equipment_name, quantity, from_date, to_date, price, payment_method, total_price))
        connection.commit()
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        connection.rollback()
    finally:
        cursor.close()
        connection.close()

# Save Address
def save_address(user_id, full_name, phone, street, city, state, postal_code):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        query = """
            INSERT INTO addresses 
            (user_id, full_name, phone, street, city, state, postal_code)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (user_id, full_name, phone, street, city, state, postal_code))
        connection.commit()
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        connection.rollback()
    finally:
        cursor.close()
        connection.close()

# Get User Address
def get_user_address(user_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        query = "SELECT * FROM addresses WHERE user_id = %s LIMIT 1"
        cursor.execute(query, (user_id,))
        address = cursor.fetchone()
        return address
    finally:
        cursor.close()
        connection.close()
