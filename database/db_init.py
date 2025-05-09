import psycopg2

conn = psycopg2.connect(
    dbname="storedb",
    user="postgres",
    password="yourpassword",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(126) UNIQUE NOT NULL,
    password_hash VARCHAR(512) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# Item table
cur.execute("""
CREATE TABLE IF NOT EXISTS item (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# Order table
cur.execute("""
CREATE TABLE IF NOT EXISTS "order" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id),
    payment_type VARCHAR(20) NOT NULL,
    total FLOAT NOT NULL,
    tax FLOAT NOT NULL,
    final_total FLOAT NOT NULL,
    receipt_pdf VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# OrderItem table
cur.execute("""
CREATE TABLE IF NOT EXISTS order_item (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES "order"(id),
    item_id INTEGER REFERENCES item(id)
)
""")

# TaxRate table
cur.execute("""
CREATE TABLE IF NOT EXISTS tax_rate (
    id SERIAL PRIMARY KEY,
    method VARCHAR(20) UNIQUE,
    tax_rate FLOAT NOT NULL
)
""")

conn.commit()
cur.close()
conn.close()
