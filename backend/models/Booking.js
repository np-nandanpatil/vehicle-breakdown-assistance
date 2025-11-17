import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      uppercase: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    vehicleDetails: {
      type: String,
      required: true,
    },
    problem: {
      type: String,
      required: true,
    },
    location: {
      address: String,
      latitude: Number,
      longitude: Number,
      city: String,
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    estimatedArrival: Date,
    actualArrival: Date,
    completionTime: Date,
    assignedOperator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    cost: {
      basePrice: Number,
      additionalCharges: Number,
      tax: Number,
      totalAmount: Number,
    },
    payment: {
      method: {
        type: String,
        enum: ['cash', 'card', 'upi', 'wallet'],
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
      },
      transactionId: String,
    },
    rating: {
      score: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      ratedAt: Date,
    },
    notes: String,
  },
  { timestamps: true }
);

// Generate booking reference before saving
bookingSchema.pre('save', async function (next) {
  if (!this.bookingReference) {
    const timestamp = Date.now().toString();
    this.bookingReference = `VBA${timestamp.slice(-6).toUpperCase()}`;
  }
  next();
});

export default mongoose.model('Booking', bookingSchema);