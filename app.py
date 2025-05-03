from flask import Flask, session
from flask_session import Session
from config import Config
from routes.home_routes import home
from routes.auth_routes import auth
from routes.equipment_routes import equipment
from routes.order_routes import order_bp
from routes.admin_routes import admin_bp
from routes.rental_routes import rental
from services.db_service import close_db

app = Flask(__name__)
app.config.from_object(Config)

# Configure session settings
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
Session(app)

@app.before_request
def add_user_to_globals():
    app.jinja_env.globals.update(current_user=session.get('user_name'))

# Register Blueprints
app.register_blueprint(home, url_prefix='/')
app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(equipment, url_prefix='/equipment')
app.register_blueprint(order_bp, url_prefix='/order')
app.register_blueprint(admin_bp, url_prefix='/admin')
app.register_blueprint(rental, url_prefix='/rental')

@app.teardown_appcontext
def teardown_db(exception):
    close_db()

if __name__ == '__main__':
    app.run(debug=True)
