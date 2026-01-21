const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: String, required: true }, // YYYY-MM-DD
  startTime: { type: String, required: true }, // HH:mm
  endTime: { type: String, required: true },
  expiresAt: { type: Date }
});

ReservationSchema.pre('save', function setExpiry(next) {
  if (this.date && this.endTime) {
    this.expiresAt = new Date(`${this.date}T${this.endTime}`);
  }
  next();
});

// Auto-delete past reservations (MongoDB TTL monitor)
ReservationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Reservation', ReservationSchema);
