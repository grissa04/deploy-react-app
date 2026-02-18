# 🏢 StationF Meeting Rooms

A full-stack meeting room reservation system built with modern technologies.

This project allows users to:
- Authenticate using Google OAuth
- View available meeting rooms
- Create reservations
- Manage data securely with MongoDB Atlas

---

## 🚀 Tech Stack

### Frontend (Web)
- ⚛️ React (Vite)
- Fetch API
- Environment variables with Vite

### Backend (Server)
- 🚀 Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Google OAuth

### Deployment
- 🌍 Frontend hosted on **Vercel**
- 🔧 Backend hosted on **Render**
- ☁️ Database hosted on **MongoDB Atlas**

---

## 🌍 Live Application

**Frontend:**  
https://deploy-react-app-ruby.vercel.app  

**Backend API:**  
https://meeting-rooms-xps7.onrender.com  

**Health Check:**  
https://meeting-rooms-xps7.onrender.com/health  

---

## 📁 Project Structure

```
STATIONF-MEETINGS
│
├── server/                # Backend (Express + MongoDB)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── db.js
│   ├── server.js
│   ├── seed.js
│   └── validation.js
│
└── web/                   # Frontend (React + Vite)
    ├── src/
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

# 🛠️ Local Installation Guide

## 1️⃣ Clone the repository

```bash
git clone https://github.com/grissa04/deploy-react-app.git
cd STATIONF-MEETINGS
```

---

## 2️⃣ Backend Setup (server)

### Install dependencies

```bash
cd server
npm install
```

### Create `.env` file inside `/server`

```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
JWT_SECRET=your_super_secret_key
```

### Run backend locally

```bash
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

## 3️⃣ Frontend Setup (web)

### Install dependencies

```bash
cd web
npm install
```

### Create `.env` inside `/web`

```
VITE_API_URL=http://localhost:5000
```

### Run frontend locally

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 🔐 Authentication

This project uses:
- Google OAuth 2.0
- JWT tokens for session management

### Authorized JavaScript Origins
```
http://localhost:5173
https://deploy-react-app-ruby.vercel.app
```

### Authorized Redirect URIs
```
https://meeting-rooms-xps7.onrender.com/api/auth/google
```

---

# 🧠 API Endpoints

### Rooms
```
GET /api/rooms
POST /api/rooms
```

### Reservations
```
GET /api/reservations
POST /api/reservations
```

### Authentication
```
POST /api/auth/google
```

### Health Check
```
GET /health
```

---

# 🌍 Deployment Architecture

Frontend (Vercel)  
⬇️  
Calls Backend API (Render)  
⬇️  
Connected to MongoDB Atlas Cloud Database  

⚠️ Free tier note: Render backend may take ~30 seconds to wake up after inactivity.

---

# 📦 Database

Database name:
```
stationf
```

Collections:
- rooms
- reservations
- users

Connection string format:
```
mongodb+srv://username:password@cluster.mongodb.net/stationf
```

---

# 🧪 Seeding the Database

```bash
node seed.js
```

---

# 👨‍💻 Author

Abdallah Grissa  
Full-Stack JavaScript Developer  

---

# 📄 License

This project is for educational and demonstration purposes.
