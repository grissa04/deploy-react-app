const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Room = require('../models/Room');
const roomsData = require('../data/rooms.json');

connectDB();

async function seed() {
  await Room.deleteMany();
  await Room.insertMany(roomsData.rooms);
  console.log('Rooms seeded');
  process.exit();
}

seed();
