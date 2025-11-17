import express from 'express';
import Service from '../models/Service.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Get all services
router.get('/', async (req, res, next) => {
  try {
    const { vehicleType } = req.query;
    const query = { isActive: true };

    if (vehicleType) {
      query.vehicleType = vehicleType;
    }

    const services = await Service.find(query);
    res.json(services);
  } catch (error) {
    next(error);
  }
});

// Get service by ID
router.get('/:id', async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    next(error);
  }
});

// Create service (Admin only)
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res, next) => {
  try {
    const { name, vehicleType, description, problems, basePrice, estimatedTime, availability } = req.body;

    const service = new Service({
      name,
      vehicleType,
      description,
      problems,
      basePrice,
      estimatedTime,
      availability,
    });

    await service.save();
    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    next(error);
  }
});

// Update service (Admin only)
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service updated successfully', service });
  } catch (error) {
    next(error);
  }
});

// Delete service (Admin only)
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;