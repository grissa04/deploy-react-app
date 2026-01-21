const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: String,
  description: String,
  capacity: Number,
  equipements: [
    {
      name: String,
    },
  ],
  createdAt: Date,
  updatedAt: Date,
});

module.exports = mongoose.model('Room', RoomSchema);
