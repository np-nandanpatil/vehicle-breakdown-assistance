# ⚡ Quick Start Guide

Get the Vehicle Breakdown Assistance Platform running in **5 minutes**.

## Prerequisites Check

```bash
# Check Node.js version (need 16+)
node --version

# Check npm
npm --version
```

## Option 1: Using Docker (Easiest)

```bash
# 1. Clone repository
git clone https://github.com/yourorg/vehicle-breakdown-assistance.git
cd vehicle-breakdown-assistance

# 2. Start all services
docker-compose up -d

# 3. Wait 30 seconds, then access:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Admin: http://localhost:5173
# MongoDB: localhost:27017

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Option 2: Local Setup

### Step 1: Install Dependencies
```bash
# Install all dependencies
npm install
```

### Step 2: Setup Database
```bash
# Option A: Local MongoDB (if installed)
mongod

# Option B: MongoDB Atlas
# Create account at https://www.mongodb.com/cloud/atlas
# Copy connection string
```

### Step 3: Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env (change MONGODB_URI if using Atlas)
nano .env
```

### Step 4: Start Development Servers
```bash
# Terminal 1: Start all services together
npm run dev

# OR start individually:
# Terminal 1: Backend API
npm run dev -w backend

# Terminal 2: Frontend
npm run dev -w frontend

# Terminal 3: Admin Dashboard
npm run dev -w admin
```

### Step 5: Access Applications
```
Frontend:  http://localhost:3000
Backend:   http://localhost:5000
Admin:     http://localhost:5173
API Health: http://localhost:5000/api/health
```

---

## Testing the Setup

### 1. Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Copy the token from response
```

### 3. Get Services
```bash
curl http://localhost:5000/api/services

# Or filter by vehicle type
curl http://localhost:5000/api/services?vehicleType=2-wheeler
```

### 4. Create a Booking (authenticated)
```bash
# Replace TOKEN with token from login response
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "serviceId": "SERVICE_ID",
    "vehicleDetails": "Honda City 2020",
    "problem": "Flat tire",
    "location": {
      "address": "123 Main St, City",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "city": "New York"
    }
  }'
```

---

## Common Commands

```bash
# Development
npm run dev              # Run all services
npm run dev -w backend   # Run only backend
npm run build            # Build admin dashboard
npm test -w backend      # Run tests
npm run lint             # Lint code

# Docker
docker-compose up -d     # Start services
docker-compose logs -f   # View logs
docker-compose down      # Stop services

# Database (MongoDB)
mongosh                  # Connect to MongoDB
db.services.find()       # View services
db.bookings.find()       # View bookings
db.users.find()          # View users
```

---

## Troubleshooting

### Problem: Port 5000 already in use
```bash
# Find and kill process
lsof -i :5000
kill -9 PID

# Or use different port
PORT=5001 npm run dev -w backend
```

### Problem: MongoDB connection error
```bash
# Check MongoDB is running
ps aux | grep mongod

# If not running, start it (Mac)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### Problem: npm install fails
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Problem: Module not found
```bash
# Reinstall dependencies
npm install
npm install -w backend
npm install -w admin
```

---

## Next Steps

1. **Read Full Documentation**
   - [README.md](./README.md) - Project overview
   - [SETUP.md](./docs/SETUP.md) - Detailed setup guide
   - [API.md](./docs/API.md) - API reference
   - [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Deploy to production

2. **Start Development**
   - Create a feature branch: `git checkout -b feature/your-feature`
   - Make changes following [CONTRIBUTING.md](./CONTRIBUTING.md)
   - Test your changes: `npm test -w backend`
   - Submit pull request

3. **Deploy to Production**
   - Follow [DEPLOYMENT.md](./docs/DEPLOYMENT.md)
   - Choose your platform (AWS/Heroku/DigitalOcean)
   - Configure environment variables
   - Run deployment commands

---

## 📞 Need Help?

- **Setup Issues?** → Check [SETUP.md](./docs/SETUP.md)
- **API Questions?** → See [API.md](./docs/API.md)
- **Development?** → Read [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Deployment?** → Follow [DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- **Still stuck?** → Email support@vba.com

---

## ✨ You're All Set!

You now have a complete, production-ready Vehicle Breakdown Assistance Platform running on your machine. Happy coding! 🚀