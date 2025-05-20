# CineMagic - Seamless Online Movie Ticket Booking System

![Screenshot 2025-05-20 223612](https://github.com/user-attachments/assets/1d9bb155-f5a5-444c-bb29-77c89af03a76)

# 📽️Overview


Cinemagic is a feature-rich online platform that offers users a smooth and intuitive experience for booking movie tickets. From filtering movies by city, genre, and language to selecting custom theatre layouts and seat categories, Cinemagic provides a powerful system for users, admins, and theatre owners.

## 👥User Roles & ♨️Features :


## 1 - General User(MovieGeor)

* Sign up with Google or username with Email (OTP Login)
* Search and filter movies by city, language, or genre.
* View movie details and trailers
* Select Available Seats Book Tickets
* Make payments via Paypal.
* Access booking history and profile.
* Post and read blogs about movies and experiences.
* Register as A Theater Owner if have a Theater

## 2 - Admin (Manages the platform and user activities)

* Secure Login With Username and Password
* Dashboard overview of sales, bookings, and user stats.
* Manage Movies and Theatre Management
* Block/unblock users.
* Approve, edit, or feature user-submitted blogs.
* Handle refund requests for cancelled bookings.

## 3 - Theater Owner

Registers and manages one or more theatres.
* List one or multiple theaters.
* Create screens and define custom seat layouts With Time Slots.
* Add or schedule movie shows with timings.
* Monitor theatre bookings and seat availability.
* Manage seat categories and layout configurations.


## 🧰 Tech Stack

### Backend
- **Django (ASGI)** – High-performance backend
- **Django REST Framework** – API building
- **PostgreSQL** – Scalable DB storage
- **Paypal** – Secure payment integration
- **Requests** – Network calls

### Frontend
- **React + Redux Toolkit** – Modern UI & state management
- **Tailwind CSS** – Fast and responsive styling
- **Axios** – API communication
- **ShadCn** – Clean UI components
- **Vite** – Lightweight & fast build tool

## 📋 Prerequisites

- # follow these instruction to setup CineMagic in your local mechine


## Clone Git Repository

<pre lang="markdown"> ```
git clone https://github.com/Mhd-Asjad/Cine_Magic.git
cd backend
 ``` </pre>
 
## Set Up Environment Variables

Backend (.env file in movie_ticket/Backend)

# PostgreSQL Database

<pre lang="markdown"> ```
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432 ``` </pre>

# Google Social Login (Allauth)

<pre lang="markdown">
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY=your_google_client_id
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET=your_google_client_secret
 </pre>
# PayPal

<pre lang="markdown">
  
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PALPAL_API_URL=https://api-m.sandbox.paypal.com  
</pre>

Frontend (.env file in movie_ticket/Frontend )
<pre lang="markdown"> ```
VITE_API_KEY = /api/
VITE_TMDB_API_KEY = Your_TMDB_API_KEY

 ``` </pre>

# Access the Application
- Once the containers are running, you can access the application at:

http://localhost (or your domain if deployed)

## 🧪 Development Setup
For local development without Docker:

## Backend Setup
<pre lang="markdown">
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
</pre>
## Frontend Setup
<pre lang="markdown"> 
cd frontend
npm install
npm run dev
</pre>

  

