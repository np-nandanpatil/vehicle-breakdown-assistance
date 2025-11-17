# Setup Guide - Vehicle Breakdown Assistance Platform

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** v16.x or higher ([Download](https://nodejs.org/))
- **npm** v8.x or higher (comes with Node.js)
- **MongoDB** v5.0+ or MongoDB Atlas account ([Download](https://www.mongodb.com/))
- **Git** ([Download](https://git-scm.com/))
- **Docker** & **Docker Compose** (optional, for containerized setup)

Check installation:
```bash
node --version    # Should be v16+
npm --version     # Should be v8+
mongodb --version # If installed locally
git --version
```

## Step 1: Clone Repository

```bash
git clone https://github.com/yourorg/vehicle-breakdown-assistance.git
cd vehicle-breakdown-assistance
```

## Step 2: Setup Environment Variables

### Create .env file from template
```bash
cp .env.example .env
```

### Edit .env with your configuration
```bash
nano .env  # or use your editor of choice
```

### Required Configuration
```env
# Server
PORT=5000
NODE_ENV=development

# Database - Choose one:
# Option A: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/vehicle-breakdown

# Option B: MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/vehicle-breakdown

# Authentication
JWT_SECRET=your-very-secret-key-here-change-in-production

# Frontend
FRONTEND_URL=http://localhost:3000
API_BASE_URL=http://localhost:5000/api
```

## Step 3: Setup Local MongoDB (Optional)

### Option A: Using Local MongoDB

1. **Install MongoDB Community Edition**
   - [macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
   - [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
   - [Linux](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB Service**
   ```bash
   # macOS (if installed with Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows (MongoDB should auto-start)
   ```

3. **Verify MongoDB is running**
   ```bash
   mongosh
   ```

### Option B: Using MongoDB Atlas (Recommended for Production)

1. [Create MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas/register)
2. Create a new cluster
3. Add network access (whitelist your IP)
4. Create database user
5. Copy connection string and update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/vehicle-breakdown
   ```

## Step 4: Install Dependencies

```bash
# Install root dependencies
npm install

# This will automatically install workspace dependencies
# But you can also install them separately:
npm install -w backend
npm install -w admin
```

## Step 5: Run Development Servers

### Option A: All Services Together (Recommended)

```bash
npm run dev
```

This starts:
- Backend API on http://localhost:5000
- Frontend on http://localhost:3000
- Admin Dashboard on http://localhost:5173

### Option B: Run Services Separately

**Terminal 1 - Backend:**
```bash
npm run dev -w backend
# or
cd backend && npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev -w frontend
# or
cd frontend && npm start
```

**Terminal 3 - Admin Dashboard:**
```bash
npm run dev -w admin
# or
cd admin && npm run dev
```

## Step 6: Access Applications

Once everything is running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/health
- **Admin Dashboard**: http://localhost:5173 (if running)

## Testing the Setup

### 1. Test Backend Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Create Test User (Register)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "password123"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Docker Setup (Alternative)

If you prefer containerized environment:

### 1. Install Docker
- [Docker Installation Guide](https://docs.docker.com/get-docker/)

### 2. Start Services with Docker Compose
```bash
docker-compose up -d
```

### 3. View Logs
```bash
docker-compose logs -f
```

### 4. Stop Services
```bash
docker-compose down
```

### Services Available
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Admin: http://localhost:5173
- MongoDB: localhost:27017

## Common Issues & Solutions

### Issue: Cannot connect to MongoDB
**Solution:**
```bash
# Check if MongoDB is running
# macOS:
brew services list

# Linux:
sudo systemctl status mongod

# If not running, start it:
# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### Issue: Port already in use
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process (replace PID)
kill -9 PID

# Or use different port
PORT=5001 npm run dev -w backend
```

### Issue: Module not found errors
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue: CORS errors
**Solution:**
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check `API_BASE_URL` in frontend configuration

### Issue: JWT authentication failing
**Solution:**
```bash
# Generate new JWT secret (use a strong random string)
# Update in .env:
JWT_SECRET=your-new-random-secret-key-here
```

## Database Seed Data (Optional)

To add sample services:

```bash
curl -X POST http://localhost:5000/api/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Flat Tire Repair",
    "vehicleType": "2-wheeler",
    "description": "Quick flat tire repair service",
    "basePrice": 50,
    "estimatedTime": 30,
    "problems": []
  }'
```

## Development Tips

### VS Code Extensions (Recommended)
- REST Client (for API testing)
- MongoDB for VS Code
- Prettier (code formatter)
- ESLint

### Useful Commands
```bash
# Run tests
npm test -w backend

# Format code
npm run format

# Lint code
npm run lint

# Build for production
npm run build

# View database
mongosh  # interactive shell
```

## Next Steps

1. Read [API.md](./API.md) for API documentation
2. Read [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guide
3. Check [backend/README.md](../backend/README.md) for backend-specific documentation
4. Check [admin/README.md](../admin/README.md) for admin dashboard documentation

## Getting Help

- Check existing GitHub issues
- Read [API.md](./API.md) for API details
- Review [backend logs](../backend/logs)
- Contact: support@vba.com

---

**Now you're ready to develop! 🚀**