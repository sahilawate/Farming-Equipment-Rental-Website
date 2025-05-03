from flask import Blueprint, render_template, request, abort
from models.equipment_model import get_all_equipments, get_equipment

equipment = Blueprint('equipment', __name__)

# Load Equipments Page (with Search Option)
@equipment.route('/', methods=['GET'])
def equipments():
    search_query = request.args.get('search', '')
    equipments = get_all_equipments(search_query)
    
    return render_template('equipments.html', equipments=equipments, search_query=search_query)

# Load Equipment Details Page
@equipment.route('/<int:equipment_id>')
def more_info(equipment_id):
    equipment = get_equipment(equipment_id)
    if not equipment:
        abort(404)  # Return 404 if equipment not found
    return render_template('more_info.html', equipment=equipment)
