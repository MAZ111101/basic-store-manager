# 🛍️ A Basic Store Management System #
- A full-stack store management platform built with **React + Tailwind CSS** (Frontend) and **Flask + PostgreSQL** (Backend). This app supports user authentication, item CRUD operations, order placement with tax calculation, PDF receipt generation, and session-based login/logout functionality.

## 📦 Features
- 🔐 User registration and login with password hashing
- 🛒 Add/Delete Items
- 🧾 Place Orders with tax and generate downloadable PDF receipts
- 💳 Different tax rates for cash/debit payments
- 📁 Download order receipts
- 🧭 Sidebar and Navbar-based layout for navigation
- 🐳 Docker support for smooth setup

- ## 🧰 Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS, React Router
- **Backend:** Flask, psycopg2, FPDF
- **Database:** PostgreSQL
- **Others:** Docker

## 🚀 Getting Started

### 📁 Project Structure
basic-store-manager/
- backend/app.py
- frontend/src/...
- database/db_init.py
- README.md

### 🐳 Docker Setup (Recommended)
- Pull docker PostgreSQL Image, and provide environment variables to connect with database.

### 💻 Manual Setup
- Install node_modules with relevant packages, and libraries for typescript, tailwind css, node, and flask.
- Run database schema with "cd database -> python db_init.py"
- Run backend schema with "cd backend -> python app.py"
- Run frontend with "cd frontend -> npm run start"
- Open localhost:3000 to explore it.
