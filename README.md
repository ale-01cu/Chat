# Real-Time Chat Application

This is a full-stack real-time chat application built with a Django backend and a React frontend. It utilizes WebSockets for instant messaging and features a complete user authentication system.

## Features

-   **Real-Time Messaging:** Instant message delivery using Django Channels and WebSockets.
-   **User Authentication:** Secure user registration and login system using JWT (JSON Web Tokens).
-   **Online Presence:** See which users are currently online in a chat room.
-   **Scalable Backend:** Asynchronous backend built with ASGI.
-   **Modern Frontend:** Responsive and interactive user interface built with React and Tailwind CSS.
-   **State Management:** Centralized state management on the frontend using Redux Toolkit.

---

## Tech Stack

### Backend

-   **Framework:** Django
-   **Real-Time:** Django Channels
-   **API:** Django Rest Framework
-   **Authentication:** Djoser & Simple JWT
-   **Database:** SQLite (default)
-   **ASGI Server:** Daphne

### Frontend

-   **Framework:** React
-   **Build Tool:** Vite
-   **Routing:** React Router
-   **State Management:** Redux Toolkit
-   **Styling:** Tailwind CSS
-   **Form Validation:** Yup

---

## Project Structure

The project is divided into two main directories:

-   `backend/`: Contains the Django project.
    -   `core/`: Main project configuration (settings, ASGI, URLs).
    -   `apps/`: Houses the different Django applications.
        -   `user/`: Manages user accounts, authentication, and serialization.
        -   `chat/`: Handles chat rooms, messages, presence, and WebSocket consumers.
-   `frontend/`: Contains the React application.
    -   `src/`: The main source code for the React app.
        -   `components/`: Reusable UI components (Login, Register).
        -   `pages/`: Main application pages (Chat, LoginPage).
        -   `redux/`: Redux store and slices for state management.
        -   `hooks/`: Custom hooks (e.g., for token verification).
        -   `apis/`: API endpoint definitions.

---

## Setup and Installation

### Prerequisites

-   Python 3.x
-   Node.js and npm

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    # For Windows
    python -m venv venv
    .\venv\Scripts\activate

    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run database migrations:**
    ```bash
    python manage.py migrate
    ```

5.  **Start the development server:**
    ```bash
    python manage.py runserver
    ```
    The backend will be running at `http://localhost:8000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The frontend will be running at `http://localhost:5173`.

---

## API & WebSocket Overview

### REST API

The backend exposes RESTful endpoints for user management and authentication.

-   **`api/auth/users/`**: `POST` for user registration.
-   **`api/auth/users/me/`**: `GET` to retrieve the current user's data.
-   **`api/auth/jwt/create/`**: `POST` to log in and receive JWT tokens.
-   **`api/auth/jwt/refresh/`**: `POST` to refresh an access token.
-   **`api/auth/jwt/verify/`**: `POST` to verify an access token.

### WebSocket Communication

-   **Connection:** Clients connect to the WebSocket at `ws://localhost:8000/ws/chat/{room_name}/?token={access_token}`.
-   **Authentication:** The connection is authenticated using the JWT access token passed as a query parameter.
-   **Messages:**
    -   **Client-to-Server:** Messages are sent as JSON objects: `{"message": "Your message here"}`.
    -   **Server-to-Client:** The server broadcasts messages and user presence updates to all clients in a room.
        -   **New Message:** `{"message": { ...message_data }}`
        -   **User List:** `{"users": [ ...user_list ]}`
