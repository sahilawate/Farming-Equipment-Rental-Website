import mysql.connector
from config import Config

def get_db_connection():
    return mysql.connector.connect(
        host=Config.MYSQL_HOST,
        user=Config.MYSQL_USER,
        password=Config.MYSQL_PASSWORD,
        database=Config.MYSQL_DB,
        port=Config.MYSQL_PORT
    )

# ✅ Get All Equipment (with optional search)
def get_all_equipments(search_query=None):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        if search_query:
            query = "SELECT * FROM equipments WHERE name LIKE %s"
            cursor.execute(query, (f"%{search_query}%",))
        else:
            query = "SELECT * FROM equipments"
            cursor.execute(query)
        
        equipments = cursor.fetchall()
        return equipments
    finally:
        cursor.close()
        connection.close()

#  Get Single Equipment by ID
def get_equipment(equipment_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        query = "SELECT * FROM equipments WHERE id = %s"
        cursor.execute(query, (equipment_id,))
        equipment = cursor.fetchone()
        return equipment
    finally:
        cursor.close()
        connection.close()
