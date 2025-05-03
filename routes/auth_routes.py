from flask import Blueprint, request, redirect, url_for, session, flash, render_template, jsonify
from models.user_model import UserModel
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth', __name__)

@auth.route('/profile', methods=['GET', 'POST'])
def profile():
    if 'user_id' not in session:
        return redirect('/login')

    user = UserModel.get_user_by_id(session['user_id'])

    if not user:
        flash("User not found!", "error")
        return redirect('/login')

    if request.method == 'POST':  # Handle address update
        updated_address = {
            "street_address": request.form.get('street_address'),
            "landmark": request.form.get('landmark'),
            "village_locality": request.form.get('village_locality'),
            "pin_code": request.form.get('pin_code'),
            "city": request.form.get('city'),
            "state": request.form.get('state')
        }

        success = UserModel.update_user_profile(
            session['user_id'], user['fullname'], user['phone'],
            updated_address['street_address'], updated_address['landmark'],
            updated_address['village_locality'], updated_address['pin_code'],
            updated_address['city'], updated_address['state']
        )
        
        if success:
            flash("Profile updated successfully!", "success")
            return redirect('/profile')

    return render_template('profile.html', user=user, address=user['address'])

@auth.route('/user/profile', methods=['GET'])
def get_user_profile():
    # Check if user is logged in and return profile info
    if 'user_id' in session:
        return jsonify({
            "logged_in": True,
            "user_name": session['user_name']
        })
    return jsonify({"logged_in": False})

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    # User signup route
    if request.method == 'POST':
        fullname = request.form['fullname']
        email = request.form['email']
        phone = request.form['phone']
        password = request.form['password']

        # Check if email already exists
        if UserModel.get_user_by_email(email):
            flash("Email is already registered!", "warning")
            return redirect(url_for('auth.signup'))

        # Hash password before storing
        hashed_password = generate_password_hash(password)

        # Store user in database
        if UserModel.create_user(fullname, email, phone, hashed_password):
            flash("Signup successful! You can now log in.", "success")
            return redirect(url_for('auth.login'))
        else:
            flash("Error during signup! Please try again.", "danger")

    return render_template('signup.html')

@auth.route('/login', methods=['GET', 'POST'])
def login():
    # User login route
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        user = UserModel.get_user_by_email(email)  # Check if user exists

        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['user_name'] = user['fullname']
            flash(f"Login successful! Welcome, {user['fullname']}", "success")
            return redirect(url_for('home.index'))  # Redirect to home
        elif user is None:
            flash("Email not registered! Please Sign Up.", "warning")  # User not found
            return redirect(url_for('auth.signup'))
        else:
            flash("Incorrect password! Try again.", "error")  # Wrong password

    return render_template('login.html')

@auth.route('/logout')
def logout():
    session.clear()
    flash("Logged out successfully!", "info")
    return redirect(url_for('home.index'))  # Redirect to home page instead of /auth/login

