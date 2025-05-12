from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import psycopg2
import re
import os
from fpdf import FPDF
from datetime import datetime
import random
import uuid

app = Flask(__name__)
CORS(app)

DB_PARAMS = {
    "dbname": "storedb",
    "user": "postgres",
    "password": "yourpassword",
    "host": "localhost",
    "port": "5432"
}

PDF_FOLDER = "receipts"
os.makedirs(PDF_FOLDER, exist_ok=True)

# Email and password regex validation
EMAIL_REGEX = r'^\S+@\S+\.\S+$'
PASSWORD_REGEX = r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$'

# ========== Utility ==========

def get_db_conn():
    return psycopg2.connect(**DB_PARAMS)

def validate_email(email):
    return re.match(EMAIL_REGEX, email)

def validate_password(password):
    return re.match(PASSWORD_REGEX, password)

# ========== Routes ==========

@app.post("/register")
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not validate_email(email) or not validate_password(password):
        return jsonify({"error": "Invalid email or password format"}), 400

    hashed = generate_password_hash(password)
    conn = get_db_conn()
    cur = conn.cursor()
    try:
        cur.execute("INSERT INTO \"user\" (email, password_hash) VALUES (%s, %s)", (email, hashed))
        conn.commit()
        return jsonify({"message": "User registered"}), 201
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return jsonify({"error": "Email already exists"}), 409
    finally:
        cur.close()
        conn.close()

@app.post("/login")
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, password_hash FROM \"user\" WHERE email=%s", (email,))
    user = cur.fetchone()
    cur.close()
    conn.close()

    if user and check_password_hash(user[1], password):
        return jsonify({"message": "Login successful", "user_id": user[0]})
        return jsonify({"message": "Email", "user_email": user[1]})
    return jsonify({"error": "Invalid credentials"}), 401

@app.post("/logout")
def logout():
    data = request.json
    user_id = data.get("user_id")
    
    if not user_id:
        return jsonify({"error": "User ID required"}), 400

    return jsonify({"message": f"User {user_id} logged out"}), 200

# ---------- Item CRUD ----------

@app.get("/items")
def get_items():
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT * FROM item")
    items = cur.fetchall()
    items_list = [{"id": item[0], "name": item[1], "price": item[2]} for item in items]
    cur.close()
    conn.close()
    return jsonify({"items": items_list})

@app.post("/items")
def add_item():
    data = request.json
    name = data.get("name")
    price = round(random.uniform(10, 100), 2)
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("INSERT INTO item (name, price) VALUES (%s, %s)", (name, price))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": f"Item '{name}' added with price {price}"}), 201

@app.delete("/items/<int:item_id>")
def delete_item(item_id):
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("DELETE FROM item WHERE id=%s", (item_id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Item deleted"}), 200

# ---------- Tax Setup ----------

@app.post("/tax-rate")
def set_tax_rate():
    data = request.json
    method = data.get("method")
    rate = round(float(data.get("rate")), 2)

    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO tax_rate (method, tax_rate)
        VALUES (%s, %s)
        ON CONFLICT (method)
        DO UPDATE SET tax_rate = EXCLUDED.tax_rate
    """, (method, rate))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": f"{method.title()} tax rate set to {rate}%"}), 200

# ---------- Order/Receipt ----------

@app.post("/order")
def create_order():
    data = request.json
    user_id = data.get("user_id")
    item_ids = data.get("items")
    payment_type = data.get("payment_type")  # 'cash' or 'debit'

    conn = get_db_conn()
    cur = conn.cursor()

    cur.execute("SELECT tax_rate FROM tax_rate WHERE method=%s", (payment_type,))
    result = cur.fetchone()
    if not result:
        return jsonify({"error": "Tax rate not set for this payment method"}), 400

    tax_rate = result[0]

    if not item_ids:
        return jsonify({"error": "No items selected"}), 400
    cur.execute("SELECT id, name, price FROM item WHERE id IN %s", (tuple(item_ids),))
    
    items = cur.fetchall()

    total = sum(i[2] for i in items)
    tax_amount = round(total * (tax_rate / 100), 2)
    final_total = round(total + tax_amount, 2)

    cur.execute("""
        INSERT INTO "order" (user_id, payment_type, total, tax, final_total)
        VALUES (%s, %s, %s, %s, %s) RETURNING id
    """, (user_id, payment_type, total, tax_amount, final_total))
    order_id = cur.fetchone()[0]

    for item in items:
        cur.execute("INSERT INTO order_item (order_id, item_id) VALUES (%s, %s)", (order_id, item[0]))

    pdf_path = os.path.join(PDF_FOLDER, f"receipt_{order_id}_{uuid.uuid4().hex}.pdf")
    generate_receipt_pdf(items, total, tax_amount, final_total, payment_type, pdf_path)

    cur.execute("UPDATE \"order\" SET receipt_pdf=%s WHERE id=%s", (pdf_path, order_id))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Order placed", "order_id": order_id, "receipt": pdf_path}), 201

@app.get("/receipt/<int:order_id>")
def get_receipt(order_id):
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT receipt_pdf FROM \"order\" WHERE id=%s", (order_id,))
    result = cur.fetchone()
    cur.close()
    conn.close()
    if result and os.path.exists(result[0]):
        return send_file(result[0], as_attachment=True)
    return jsonify({"error": "Receipt not found"}), 404

# ========== Receipt PDF ==========

def generate_receipt_pdf(items, subtotal, tax, total, payment_type, path):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, "Store Receipt", ln=True, align='C')
    pdf.cell(200, 10, f"Payment Type: {payment_type}", ln=True)
    pdf.ln(10)
    for item in items:
        pdf.cell(200, 10, f"{item[1]} - ${item[2]:.2f}", ln=True)
    pdf.ln(5)
    pdf.cell(200, 10, f"Subtotal: ${subtotal:.2f}", ln=True)
    pdf.cell(200, 10, f"Tax: ${tax:.2f}", ln=True)
    pdf.cell(200, 10, f"Total: ${total:.2f}", ln=True)
    pdf.output(path)

# ========== Entry ==========
def seed_tax_rates():
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO tax_rate (method, tax_rate)
        VALUES 
        ('cash', 13.0),
        ('debit', 5.0)
        ON CONFLICT (method)
        DO UPDATE SET tax_rate = EXCLUDED.tax_rate
    """)
    conn.commit()
    cur.close()
    conn.close()

if __name__ == "__main__":
    seed_tax_rates()
    app.run(debug=True)