require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

// Routes
const roomsRoutes = require('./routes/rooms');
const reservationsRoutes = require('./routes/reservations');
const authRoutes = require("./routes/auth");

const app = express();
connectDB();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use('/api/rooms', roomsRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use("/api/auth", authRoutes);


// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
