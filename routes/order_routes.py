from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from models.user_model import UserModel
from models.order_model import get_equipment, save_order, get_user_address, save_address

order_bp = Blueprint('order', __name__)

@order_bp.route('/<int:equipment_id>', methods=['GET', 'POST'])
def order(equipment_id):
    if 'user_id' not in session:
        flash('Please log in to place an order.', 'warning')
        return redirect(url_for('auth.login'))

    user_id = session['user_id']
    equipment = get_equipment(equipment_id)
    if not equipment:
        flash('Equipment not found.', 'danger')
        return redirect(url_for('home.index'))
    
    user = UserModel.get_user_by_id(user_id)
    address = get_user_address(user_id)
    if not user:
        flash('User not found. Please log in again.', 'danger')
        return redirect(url_for('auth.login'))

    if request.method == 'POST':
        try:
            quantity = int(request.form.get('quantity'))
            from_date = request.form.get('from_date')
            to_date = request.form.get('to_date')
            payment_method = request.form.get('payment_method')
            if not from_date or not to_date:
                flash('Please provide rental dates.', 'warning')
                return redirect(url_for('order.order', equipment_id=equipment_id))
            
            # Dummy calculation for days; replace with actual date difference logic
            days = 1
            total_price = days * quantity * equipment['price']
            if quantity > equipment.get('available_quantity', 100):
                flash('Quantity exceeds available stock.', 'warning')
                return redirect(url_for('order.order', equipment_id=equipment_id))
            
            save_order(
                user_id=user_id,
                equipment_id=equipment_id,
                equipment_name=equipment['name'],
                quantity=quantity,
                from_date=from_date,
                to_date=to_date,
                price=equipment['price'],
                payment_method=payment_method,
                total_price=total_price
            )
            flash('Order placed successfully!', 'success')
            return redirect(url_for('home.index'))
        except ValueError:
            flash('Invalid input. Please check your details.', 'danger')

    return render_template('order.html', user=user, equipment=equipment, address=address)

@order_bp.route('/orders')
def orders():
    # Render orders overview page; ensure templates/orders.html exists
    return render_template('orders.html')

@order_bp.route('/add_address', methods=['POST'])
def add_address():
    if 'user_id' not in session:
        flash('Please log in first.', 'warning')
        return redirect(url_for('auth.login'))
    
    user_id = session['user_id']
    full_name = request.form.get('fullname')
    phone = request.form.get('phone')
    street = request.form.get('street')
    city = request.form.get('city')
    state = request.form.get('state')
    postal_code = request.form.get('postal_code')
    equipment_id = request.form.get('equipment_id')
    
    if not all([full_name, phone, street, city, state, postal_code]):
        flash('All fields are required.', 'danger')
        return redirect(url_for('order.order', equipment_id=equipment_id))
    
    save_address(user_id, full_name, phone, street, city, state, postal_code)
    flash('Address saved successfully!', 'success')
    return redirect(url_for('order.order', equipment_id=equipment_id))
