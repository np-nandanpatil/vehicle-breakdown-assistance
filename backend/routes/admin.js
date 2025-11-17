import express from 'express';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard stats
router.get('/stats', authenticateToken, authorizeRole('admin'), async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalBookings = await Booking.countDocuments();
    const totalServices = await Service.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    const revenueData = await Booking.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$cost.totalAmount' },
        },
      },
    ]);

    res.json({
      totalUsers,
      totalBookings,
      totalServices,
      completedBookings,
      totalRevenue: revenueData[0]?.totalRevenue || 0,
    });
  } catch (error) {
    next(error);
  }
});

// Get all bookings (admin view)
router.get('/bookings', authenticateToken, authorizeRole('admin'), async (req, res, next) => {
  try {
    const { status, vehicleType, startDate, endDate } = req.query;
    const query = {};

    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'firstName lastName email phone')
      .populate('serviceId', 'name vehicleType')
      .populate('assignedOperator', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

// Assign operator to booking
router.patch('/bookings/:id/assign', authenticateToken, authorizeRole('admin'), async (req, res, next) => {
  try {
    const { operatorId } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        assignedOperator: operatorId,
        status: 'assigned',
      },
      { new: true }
    ).populate('assignedOperator');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Operator assigned', booking });
  } catch (error) {
    next(error);
  }
});

// Get all users (admin view)
router.get('/users', authenticateToken, authorizeRole('admin'), async (req, res, next) => {
  try {
    const { role } = req.query;
    const query = {};
    if (role) query.role = role;

    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Toggle user status
router.patch('/users/:id/toggle', authenticateToken, authorizeRole('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: 'User status updated', user });
  } catch (error) {
    next(error);
  }
});

// Revenue analytics
router.get('/analytics/revenue', authenticateToken, authorizeRole('admin'), async (req, res, next) => {
  try {
    const { period = 'monthly' } = req.query;

    const revenueByVehicle = await Booking.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$serviceId',
          totalRevenue: { $sum: '$cost.totalAmount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: '_id',
          as: 'service',
        },
      },
    ]);

    res.json({ revenueByVehicle });
  } catch (error) {
    next(error);
  }
});

export default router;