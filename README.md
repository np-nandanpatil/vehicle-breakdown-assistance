# Vehicle Breakdown Assistance Platform

A comprehensive **24/7 vehicle breakdown assistance platform** providing roadside support for 2-wheelers, 3-wheelers, and 4-wheelers. Built with modern full-stack architecture.

## 🚀 Project Overview

This is a **production-ready** breakdown assistance application featuring:
- **Frontend**: Static website with cyberpunk UI aesthetic
- **Backend**: Node.js/Express REST API with MongoDB
- **Admin Dashboard**: React-based management system
- **Real-time Features**: Booking management and tracking
- **Payment Integration**: Stripe & Razorpay support

## 📁 Project Structure

```
vehicle-breakdown-assistance/
├── frontend/                  # Customer-facing website
│   ├── public/               # Static HTML files
│   │   └── html/            # Page templates
│   ├── src/
│   │   ├── css/             # Stylesheets
│   │   │   ├── components/  # Reusable component styles
│   │   │   ├── pages/       # Page-specific styles
│   │   │   └── utils/       # Variables, reset, utilities
│   │   └── js/              # JavaScript modules
│   │       ├── api/         # API client
│   │       ├── modules/     # Feature modules
│   │       └── utils/       # Utilities & config
│   └── package.json
│
├── backend/                   # REST API Server
│   ├── config/               # Database & environment config
│   ├── controllers/          # Business logic
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   ├── middleware/           # Auth, error handling
│   ├── utils/                # Helper functions
│   ├── server.js             # Entry point
│   ├── package.json
│   └── .env.example
│
├── admin/                     # Admin Dashboard
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   └── api/              # Admin API calls
│   └── package.json
│
├── docs/                      # Documentation
│   ├── API.md                # API documentation
│   ├── SETUP.md              # Setup guide
│   └── DEPLOYMENT.md         # Deployment guide
│
├── .github/                   # GitHub configuration
│   └── workflows/            # CI/CD pipelines
│
├── package.json              # Root package.json (workspaces)
├── docker-compose.yml        # Docker services
├── .gitignore               # Git ignore rules
└── .env.example             # Environment variables template
```

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Responsive design with custom properties
- **Vanilla JavaScript** - No framework dependency
- **Bootstrap Grid** - Responsive layouts

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Express-Validator** - Input validation

### Admin Dashboard
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container setup
- **GitHub Actions** - CI/CD

## 📦 Installation

### Prerequisites
- **Node.js** v16+ and npm/yarn
- **MongoDB** (local or Atlas)
- **Git**
- **Docker** (optional)

### Setup Steps

1. **Clone Repository**
```bash
git clone https://github.com/yourname/vehicle-breakdown-assistance.git
cd vehicle-breakdown-assistance
```

2. **Install Dependencies**
```bash
# Install root dependencies
npm install

# Install workspace dependencies
npm install -w backend
npm install -w admin
```

3. **Setup Environment Variables**
```bash
# Copy example env to .env
cp .env.example .env

# Update .env with your configuration
nano .env
```

4. **Setup Database**
```bash
# MongoDB (if running locally)
mongod

# Or use MongoDB Atlas connection string in .env
```

5. **Start Development Servers**
```bash
# Option 1: Run all services concurrently
npm run dev

# Option 2: Run individually
npm run dev -w backend    # Terminal 1: http://localhost:5000
npm run dev -w frontend   # Terminal 2: http://localhost:3000
npm run dev -w admin      # Terminal 3: http://localhost:5173
```

## 🐳 Docker Setup

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin Dashboard: http://localhost:5173
- MongoDB: localhost:27017

## 📚 API Documentation

### Authentication
```bash
POST /api/auth/register        # Register new user
POST /api/auth/login           # User login
GET  /api/auth/me              # Get current user
```

### Services
```bash
GET  /api/services             # List all services
GET  /api/services/:id         # Get service details
POST /api/services             # Create service (admin)
PUT  /api/services/:id         # Update service (admin)
DELETE /api/services/:id       # Delete service (admin)
```

### Bookings
```bash
POST /api/bookings             # Create booking
GET  /api/bookings/user/bookings        # Get user's bookings
GET  /api/bookings/:reference  # Get booking details
PATCH /api/bookings/:id/status # Update booking status
POST /api/bookings/:id/rate    # Rate service
```

### Admin
```bash
GET  /api/admin/stats          # Dashboard stats
GET  /api/admin/bookings       # All bookings
PATCH /api/admin/bookings/:id/assign    # Assign operator
GET  /api/admin/users          # Get users
PATCH /api/admin/users/:id/toggle       # Toggle user status
GET  /api/admin/analytics/revenue       # Revenue analytics
```

Full API documentation: [API.md](./docs/API.md)

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation with express-validator
- ✅ CORS protection
- ✅ SQL injection prevention (using Mongoose)
- ✅ HTTPS ready
- ✅ Rate limiting ready
- ✅ XSS protection with proper escaping

## 📱 Features

### Customer Features
- 🔍 Browse services by vehicle type
- 📝 Book breakdown assistance
- 💬 View booking status in real-time
- ⭐ Rate and review services
- 👤 Manage profile
- 💳 Multiple payment options

### Admin Features
- 📊 Dashboard with analytics
- 👥 User management
- 🚗 Service management
- 📦 Booking management
- 👨‍💼 Operator assignment
- 💰 Revenue tracking

### Operator Features
- 📲 View assigned bookings
- ✅ Update job status
- 📍 Real-time location tracking
- 💬 Customer communication

## 🧪 Testing

```bash
# Run backend tests
npm test -w backend

# Run with coverage
npm test -w backend -- --coverage
```

## 📈 Performance Optimization

- ✅ CSS minification
- ✅ JavaScript bundling
- ✅ Image optimization
- ✅ Database indexing
- ✅ API response caching
- ✅ Lazy loading

## 🚀 Deployment

### Heroku
```bash
heroku create vehicle-breakdown-assistance
git push heroku main
```

### AWS
See [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

### DigitalOcean
See [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## 📝 Environment Variables

Required environment variables are listed in `.env.example`. Copy and configure for your environment:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/vehicle-breakdown

# Authentication
JWT_SECRET=your-secret-key

# Backend
PORT=5000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:3000
API_BASE_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@vba.com or create an issue in the repository.

## 📞 Contact

- **Email**: support@vba.com
- **Phone**: +1-800-VBA-HELP
- **Website**: https://vehiclebreakdownassistance.com

---

**Built with ❤️ for vehicle owners**