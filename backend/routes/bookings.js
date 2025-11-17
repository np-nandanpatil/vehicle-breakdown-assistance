import express from 'express';
import Booking from '../models/Booking.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Create booking
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { serviceId, vehicleDetails, problem, location } = req.body;

    const booking = new Booking({
      userId: req.user.id,
      serviceId,
      vehicleDetails,
      problem,
      location,
      status: 'pending',
    });

    await booking.save();
    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
});

// Get user bookings
router.get('/user/bookings', authenticateToken, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('serviceId')
      .populate('assignedOperator', 'firstName lastName phone');

    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

// Get booking by reference
router.get('/:bookingReference', async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      bookingReference: req.params.bookingReference.toUpperCase(),
    })
      .populate('serviceId')
      .populate('userId', 'firstName lastName email phone')
      .populate('assignedOperator', 'firstName lastName phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    next(error);
  }
});

// Update booking status (Admin/Operator only)
router.patch('/:id/status', authenticateToken, authorizeRole('admin', 'operator'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    next(error);
  }
});

// Rate booking
router.post('/:id/rate', authenticateToken, async (req, res, next) => {
  try {
    const { score, comment } = req.body;

    if (score < 1 || score > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    booking.rating = { score, comment, ratedAt: new Date() };
    await booking.save();

    res.json({ message: 'Rating submitted successfully', booking });
  } catch (error) {
    next(error);
  }
});

export default router;