import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleType: {
      type: String,
      enum: ['2-wheeler', '3-wheeler', '4-wheeler'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    problems: [
      {
        title: String,
        description: String,
        solutions: [String],
        tutorialLink: String,
      },
    ],
    basePrice: {
      type: Number,
      required: true,
    },
    estimatedTime: {
      type: Number, // in minutes
      required: true,
    },
    availability: {
      available24_7: {
        type: Boolean,
        default: true,
      },
      operatingHours: {
        start: String,
        end: String,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);