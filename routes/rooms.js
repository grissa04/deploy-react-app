const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Reservation = require('../models/Reservation');

/**
 * ✅ GET /api/rooms
 * Fetch all rooms with optional filters:
 * ?capacity=5&equipement=TV&date=2025-09-04&startTime=10:00&endTime=12:00
 */
router.get('/', async (req, res) => {
  try {
    const { capacity, equipement, date, startTime, endTime } = req.query;

    // ✅ Build query for room attributes
    let query = {};
    if (capacity) {
      query.capacity = { $gte: parseInt(capacity) };
    }
    if (equipement) {
      query['equipements.name'] = { $regex: new RegExp(equipement, 'i') }; // case-insensitive search
    }

    let rooms = await Room.find(query);

    // ✅ If date and time provided, filter by availability
    if (date && startTime && endTime) {
      const reservations = await Reservation.find({ date });

      // Find reserved rooms in this time range
      const reservedRoomIds = reservations
        .filter(r => startTime < r.endTime && endTime > r.startTime) // overlap
        .map(r => r.roomId.toString());

      rooms = rooms.filter(room => !reservedRoomIds.includes(room._id.toString()));
    }

    res.json({
      success: true,
      count: rooms.length,
      rooms
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * ✅ GET /api/rooms/:id
 * Fetch a single room by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Get available rooms with filters
router.get('/available', async (req, res) => {
  try {
    const { date, start, end, capacity, equipment } = req.query;

    // Validate required fields
    if (!date || !start || !end) {
      return res.status(400).json({ error: 'Date, start, and end time are required' });
    }

    // ✅ Base query
    let query = {};
    if (capacity) query.capacity = { $gte: parseInt(capacity) };
    if (equipment) query['equipements.name'] = equipment;

    // ✅ Fetch all rooms matching base query
    let rooms = await Room.find(query);

    // ✅ Find reservations for the same date
    const reservations = await Reservation.find({ date });

    // ✅ Filter out rooms that are already reserved in the given time slot
    const reservedRoomIds = reservations
      .filter(r => start < r.endTime && end > r.startTime) // time overlap
      .map(r => r.roomId.toString());

    const availableRooms = rooms.filter(room => !reservedRoomIds.includes(room._id.toString()));

    res.json(availableRooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
