# Backend API - Vehicle Breakdown Assistance

Node.js/Express REST API backend for Vehicle Breakdown Assistance Platform.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start development server
npm run dev

# Server running on http://localhost:5000
```

## Structure

```
backend/
├── config/              # Configuration files
│   └── database.js      # MongoDB connection
├── controllers/         # Business logic (ready for implementation)
├── models/              # Mongoose schemas
│   ├── User.js
│   ├── Service.js
│   └── Booking.js
├── routes/              # API routes
│   ├── auth.js
│   ├── services.js
│   ├── bookings.js
│   └── admin.js
├── middleware/          # Express middleware
│   ├── auth.js          # JWT verification
│   └── errorHandler.js  # Error handling
├── utils/               # Helper functions
├── server.js            # Express app entry point
├── package.json
├── .env.example
└── Dockerfile
```

## API Routes

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Services
- `GET /api/services` - List services
- `GET /api/services/:id` - Get service details
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user/bookings` - Get user bookings
- `GET /api/bookings/:reference` - Get booking details
- `PATCH /api/bookings/:id/status` - Update status
- `POST /api/bookings/:id/rate` - Rate booking

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/bookings` - All bookings
- `PATCH /api/admin/bookings/:id/assign` - Assign operator
- `GET /api/admin/users` - Get users
- `PATCH /api/admin/users/:id/toggle` - Toggle user status
- `GET /api/admin/analytics/revenue` - Revenue analytics

See [API.md](../docs/API.md) for complete documentation.

## Environment Variables

```
# Database
MONGODB_URI=mongodb://localhost:27017/vehicle-breakdown

# Server
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your-secret-key

# Frontend
FRONTEND_URL=http://localhost:3000

# Email, Payment, etc. (optional)
```

## Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
# Auto-reloads on file changes with nodemon
```

### Run Tests
```bash
npm test              # Run all tests
npm test -- --watch  # Watch mode
npm test -- --coverage  # With coverage
```

### Lint Code
```bash
npm run lint
npm run lint -- --fix  # Auto-fix issues
```

## Database Models

### User
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: 'customer' | 'admin' | 'operator',
  vehicles: [ObjectId],
  bookings: [ObjectId],
  isVerified: Boolean,
  isActive: Boolean,
  createdAt: Date
}
```

### Service
```javascript
{
  name: String,
  vehicleType: '2-wheeler' | '3-wheeler' | '4-wheeler',
  description: String,
  problems: [{
    title: String,
    description: String,
    solutions: [String],
    tutorialLink: String
  }],
  basePrice: Number,
  estimatedTime: Number,
  availability: {
    available24_7: Boolean,
    operatingHours: { start: String, end: String }
  },
  isActive: Boolean,
  createdAt: Date
}
```

### Booking
```javascript
{
  bookingReference: String (unique),
  userId: ObjectId,
  serviceId: ObjectId,
  vehicleDetails: String,
  problem: String,
  location: {
    address: String,
    latitude: Number,
    longitude: Number,
    city: String
  },
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled',
  assignedOperator: ObjectId,
  cost: {
    basePrice: Number,
    additionalCharges: Number,
    tax: Number,
    totalAmount: Number
  },
  payment: {
    method: 'cash' | 'card' | 'upi',
    status: 'pending' | 'completed' | 'failed',
    transactionId: String
  },
  rating: {
    score: Number (1-5),
    comment: String,
    ratedAt: Date
  },
  createdAt: Date
}
```

## Authentication

Uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login** - Returns JWT token
2. **Token Storage** - Stored in localStorage (frontend)
3. **API Requests** - Token sent in Authorization header
4. **Token Expiry** - 7 days (configurable)

```javascript
// Token in header
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Error Handling

All errors follow consistent format:

```javascript
// Success
{ message: "Success", data: {...}, status: 200 }

// Error
{ message: "Error description", status: 400 }
```

**Error Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Middleware

### Authentication
```javascript
authenticateToken - Verifies JWT token, attaches user to request
authorizeRole('admin', 'operator') - Checks user role
```

### Validation
```javascript
Express-validator - Input validation on routes
```

### Error Handler
```javascript
errorHandler - Catches and formats all errors
```

## Deployment

### Using Docker
```bash
# Build image
docker build -t vba-backend .

# Run container
docker run -p 5000:5000 --env-file .env vba-backend
```

### Using Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
```

### Manual Deployment
```bash
# Install production dependencies
npm install --production

# Start server
npm start
```

See [DEPLOYMENT.md](../docs/DEPLOYMENT.md) for detailed instructions.

## Performance Tips

1. **Database Indexing** - Add indexes on frequently queried fields
2. **Query Optimization** - Use `.select()` to limit fields, `.limit()` for pagination
3. **Caching** - Implement Redis for frequently accessed data
4. **Compression** - GZIP enabled on responses
5. **Error Logging** - Centralized error handling

## Testing

```bash
# Run tests
npm test

# With coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# Specific test file
npm test -- booking.test.js
```

## Monitoring & Logging

- Console logging for development
- Integration ready for:
  - Sentry (error tracking)
  - DataDog (monitoring)
  - ELK Stack (log aggregation)

## Common Issues

### MongoDB Connection Failed
```bash
# Check MongoDB is running
ps aux | grep mongod

# Check connection string in .env
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 PID
```

### Tests Failing
```bash
# Clear cache
npm test -- --clearCache

# Run single test
npm test -- --testNamePattern="specific test"
```

## Contributing

Follow [CONTRIBUTING.md](../CONTRIBUTING.md) guidelines:
- Create feature branch
- Follow code style
- Add tests
- Submit pull request

## Documentation

- [API Documentation](../docs/API.md)
- [Setup Guide](../docs/SETUP.md)
- [Deployment Guide](../docs/DEPLOYMENT.md)
- [Contributing Guidelines](../CONTRIBUTING.md)

## Support

- Email: backend-support@vba.com
- Issues: GitHub Issues
- Documentation: https://docs.vba.com

## License

MIT License - See [LICENSE](../LICENSE) file