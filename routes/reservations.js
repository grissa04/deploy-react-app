const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Reservation = require('../models/Reservation');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'You need to be a member to reserve a room.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

// ✅ Create reservation
router.post('/', requireAuth, async (req, res) => {
  try {
    const { roomId, date, startTime, endTime } = req.body;

    // ✅ Prevent reserving in the past
    const now = new Date();
    const reservationDate = new Date(`${date}T${startTime}`);
    if (reservationDate < now) {
      return res.status(400).json({ message: 'You cannot reserve a past date.' });
    }

    // ✅ Check for conflicts
    const conflict = await Reservation.findOne({
      roomId,
      date,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (conflict) {
      return res.status(400).json({ message: 'Room already reserved at this time' });
    }

    // ✅ Save to DB
    const reservation = new Reservation({
      roomId,
      date,
      startTime,
      endTime,
      userId: req.userId
    });
    await reservation.save();

    // ✅ Save to reservations.json
    const filePath = path.join(__dirname, '../data/reservations.json');
    let reservations = [];
    if (fs.existsSync(filePath)) {
      reservations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    reservations.push(reservation);
    fs.writeFileSync(filePath, JSON.stringify(reservations, null, 2));

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Cancel reservation (NEW)
router.delete('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if < 24h
    const reservationDateTime = new Date(`${reservation.date}T${reservation.startTime}`);
    const now = new Date();
    const diffHours = (reservationDateTime - now) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return res.status(400).json({
        message: 'You cannot cancel or update this reservation less than 24h before it starts.'
      });
    }

    await reservation.deleteOne();
    res.json({ success: true, message: 'Reservation cancelled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const reservations = await Reservation.find()
      .populate('roomId')
      .populate('userId', 'name email');

    const expiredIds = reservations
      .filter((r) => {
        const endAt = new Date(`${r.date}T${r.endTime}`);
        return !Number.isNaN(endAt.getTime()) && endAt < now;
      })
      .map((r) => r._id);

    if (expiredIds.length > 0) {
      await Reservation.deleteMany({ _id: { $in: expiredIds } });
    }

    const activeReservations = reservations.filter(
      (r) => !expiredIds.some((id) => id.equals(r._id))
    );

    res.json(activeReservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
