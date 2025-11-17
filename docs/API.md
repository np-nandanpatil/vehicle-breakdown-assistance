# API Documentation - Vehicle Breakdown Assistance

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

## Response Format

All API responses follow this format:

```json
{
  "message": "Success message",
  "data": {},
  "status": 200
}
```

Error response:
```json
{
  "message": "Error message",
  "status": 400
}
```

---

## Auth Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64a1234567890abcdef",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Status Codes:**
- `201` - User created successfully
- `400` - Validation error or email already registered

---

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64a1234567890abcdef",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer"
  }
}
```

**Status Codes:**
- `200` - Login successful
- `401` - Invalid credentials

---

### Get Current User
```http
GET /auth/me
```

**Headers:** Requires authorization

**Response:**
```json
{
  "id": "64a1234567890abcdef",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "role": "customer",
  "isVerified": false,
  "createdAt": "2024-01-15T10:00:00Z"
}
```

---

## Services Endpoints

### Get All Services
```http
GET /services?vehicleType=2-wheeler
```

**Query Parameters:**
- `vehicleType` (optional) - Filter by vehicle type: `2-wheeler`, `3-wheeler`, `4-wheeler`

**Response:**
```json
[
  {
    "id": "64a1234567890abcdef",
    "name": "Flat Tire Repair",
    "vehicleType": "2-wheeler",
    "description": "Quick flat tire repair service",
    "basePrice": 50,
    "estimatedTime": 30,
    "availability": {
      "available24_7": true
    },
    "problems": [
      {
        "title": "Flat Tire",
        "description": "One or both tires are flat",
        "solutions": ["Replace tire", "Patch if possible"],
        "tutorialLink": "https://youtube.com/..."
      }
    ],
    "isActive": true
  }
]
```

---

### Get Service Details
```http
GET /services/:id
```

**Response:**
```json
{
  "id": "64a1234567890abcdef",
  "name": "Flat Tire Repair",
  "vehicleType": "2-wheeler",
  "description": "Quick flat tire repair service",
  "basePrice": 50,
  "estimatedTime": 30,
  "problems": [],
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z"
}
```

---

### Create Service (Admin Only)
```http
POST /services
```

**Headers:** Requires admin authorization

**Request Body:**
```json
{
  "name": "Battery Replacement",
  "vehicleType": "4-wheeler",
  "description": "Replace dead or weak battery",
  "basePrice": 150,
  "estimatedTime": 45,
  "problems": [
    {
      "title": "Dead Battery",
      "description": "Vehicle won't start",
      "solutions": ["Check connections", "Replace battery"],
      "tutorialLink": "https://youtube.com/..."
    }
  ],
  "availability": {
    "available24_7": true
  }
}
```

**Status Codes:**
- `201` - Service created
- `403` - Insufficient permissions

---

### Update Service (Admin Only)
```http
PUT /services/:id
```

**Headers:** Requires admin authorization

**Request Body:** Same as create (can be partial)

---

### Delete Service (Admin Only)
```http
DELETE /services/:id
```

**Status Codes:**
- `200` - Service deleted
- `404` - Service not found

---

## Bookings Endpoints

### Create Booking
```http
POST /bookings
```

**Headers:** Requires authorization

**Request Body:**
```json
{
  "serviceId": "64a1234567890abcdef",
  "vehicleDetails": "Honda City 2020",
  "problem": "Flat tire on front wheel",
  "location": {
    "address": "123 Main Street, City",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "city": "New York"
  }
}
```

**Response:**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": "64a1234567890abcdef",
    "bookingReference": "VBAABC123",
    "userId": "64a1234567890abcdef",
    "serviceId": "64a1234567890abcdef",
    "status": "pending",
    "vehicleDetails": "Honda City 2020",
    "problem": "Flat tire on front wheel",
    "location": {...},
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

**Status Codes:**
- `201` - Booking created
- `401` - Not authenticated

---

### Get User Bookings
```http
GET /bookings/user/bookings
```

**Headers:** Requires authorization

**Response:**
```json
[
  {
    "id": "64a1234567890abcdef",
    "bookingReference": "VBAABC123",
    "status": "in-progress",
    "serviceId": {...},
    "vehicleDetails": "Honda City 2020",
    "estimatedArrival": "2024-01-15T11:00:00Z",
    "actualArrival": "2024-01-15T10:55:00Z",
    "assignedOperator": {...},
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

---

### Get Booking Details
```http
GET /bookings/:bookingReference
```

**Response:**
```json
{
  "id": "64a1234567890abcdef",
  "bookingReference": "VBAABC123",
  "userId": {...},
  "serviceId": {...},
  "status": "completed",
  "cost": {
    "basePrice": 50,
    "additionalCharges": 10,
    "tax": 4.80,
    "totalAmount": 64.80
  },
  "payment": {
    "method": "card",
    "status": "completed",
    "transactionId": "TXN123456"
  },
  "rating": {
    "score": 5,
    "comment": "Excellent service!",
    "ratedAt": "2024-01-15T11:30:00Z"
  },
  "createdAt": "2024-01-15T10:00:00Z"
}
```

---

### Update Booking Status (Admin/Operator Only)
```http
PATCH /bookings/:id/status
```

**Headers:** Requires admin/operator authorization

**Request Body:**
```json
{
  "status": "in-progress"
}
```

**Valid Status Values:**
- `pending` - Initial status
- `assigned` - Operator assigned
- `in-progress` - Work in progress
- `completed` - Work completed
- `cancelled` - Booking cancelled

---

### Rate Booking
```http
POST /bookings/:id/rate
```

**Headers:** Requires authorization (user who made booking)

**Request Body:**
```json
{
  "score": 5,
  "comment": "Great service, very professional"
}
```

**Response:**
```json
{
  "message": "Rating submitted successfully",
  "booking": {
    "id": "64a1234567890abcdef",
    "rating": {
      "score": 5,
      "comment": "Great service, very professional",
      "ratedAt": "2024-01-15T11:30:00Z"
    }
  }
}
```

**Status Codes:**
- `200` - Rating submitted
- `400` - Invalid rating (must be 1-5)
- `403` - Unauthorized to rate this booking

---

## Admin Endpoints

### Get Dashboard Statistics
```http
GET /admin/stats
```

**Headers:** Requires admin authorization

**Response:**
```json
{
  "totalUsers": 150,
  "totalBookings": 450,
  "totalServices": 30,
  "completedBookings": 380,
  "totalRevenue": 15000
}
```

---

### Get All Bookings
```http
GET /admin/bookings?status=completed&startDate=2024-01-01&endDate=2024-01-31
```

**Headers:** Requires admin authorization

**Query Parameters:**
- `status` (optional) - Filter by status
- `vehicleType` (optional) - Filter by vehicle type
- `startDate` (optional) - Start date in ISO format
- `endDate` (optional) - End date in ISO format

**Response:** Array of booking objects with populated user and service details

---

### Assign Operator to Booking
```http
PATCH /admin/bookings/:id/assign
```

**Headers:** Requires admin authorization

**Request Body:**
```json
{
  "operatorId": "64a1234567890abcdef"
}
```

---

### Get All Users
```http
GET /admin/users?role=operator
```

**Headers:** Requires admin authorization

**Query Parameters:**
- `role` (optional) - Filter by role: `customer`, `operator`, `admin`

---

### Toggle User Status
```http
PATCH /admin/users/:id/toggle
```

**Headers:** Requires admin authorization

**Response:** Updates user's `isActive` status

---

### Revenue Analytics
```http
GET /admin/analytics/revenue?period=monthly
```

**Headers:** Requires admin authorization

**Query Parameters:**
- `period` (optional) - `daily`, `weekly`, `monthly` (default: monthly)

**Response:**
```json
{
  "revenueByVehicle": [
    {
      "_id": "64a1234567890abcdef",
      "totalRevenue": 5000,
      "count": 100,
      "service": [{...}]
    }
  ]
}
```

---

## Error Handling

### Common Error Responses

**Invalid Token (401)**
```json
{
  "message": "Invalid or expired token",
  "status": 401
}
```

**Insufficient Permissions (403)**
```json
{
  "message": "Insufficient permissions",
  "status": 403
}
```

**Not Found (404)**
```json
{
  "message": "Service not found",
  "status": 404
}
```

**Validation Error (400)**
```json
{
  "errors": [
    {"msg": "Email is required", "param": "email"}
  ],
  "status": 400
}
```

**Server Error (500)**
```json
{
  "message": "Internal Server Error",
  "status": 500
}
```

---

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- **Public endpoints**: 100 requests per hour
- **Authenticated endpoints**: 1000 requests per hour
- **Admin endpoints**: 5000 requests per hour

---

## Pagination

List endpoints support pagination:

```http
GET /admin/bookings?page=1&limit=20
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

---

## Webhooks

Webhooks are sent for important events:

- `booking.created`
- `booking.updated`
- `booking.completed`
- `payment.processed`

Configure webhook URL in admin panel.

---

## SDK/Client Libraries

### JavaScript (Frontend)
```javascript
const apiClient = window.apiClient;

// Login
const response = await apiClient.auth.login({
  email: 'user@example.com',
  password: 'password'
});

// Create booking
const booking = await apiClient.bookings.create({
  serviceId: 'id',
  vehicleDetails: 'Honda City',
  problem: 'Flat tire',
  location: {}
});
```

---

## Support

For API support or issues:
- Email: api-support@vba.com
- Documentation: https://docs.vba.com
- Status Page: https://status.vba.com