# SERIUS - Streaming Platform Backend

A production-ready Node.js backend for a live streaming platform with real-time chat, monetization, and content creation features.

## 🚀 Features

- **User Authentication**: JWT-based secure authentication
- **Live Streaming**: Create, manage, and monetize streams
- **Real-time Chat**: Socket.IO integration for live chat
- **Payment Processing**: Stripe integration for payments
- **Clip Creation**: Users can create clips from streams
- **Role-Based Access**: Admin, Streamer, and User roles
- **Error Handling**: Comprehensive error handling with custom error classes
- **Database**: MongoDB with optimized indexing

## 📋 Prerequisites

- Node.js v14+
- MongoDB
- npm or yarn

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mikelmwangi001-spec/SERIUS.git
   cd SERIUS/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   npm run dev  # Development mode with auto-reload
   npm start    # Production mode
   ```

## 📁 Project Structure

```
backend/
├── config/
│   ├── constants.js       # App-wide constants
│   └── db.js             # Database connection
├── models/
│   ├── User.js           # User model with auth
│   ├── Stream.js         # Stream model
│   ├── Payment.js        # Payment model
│   └── Clip.js          # Clip model
├── routes/
│   ├── auth.js          # Authentication endpoints
│   ├── stream.js        # Stream management endpoints
│   ├── payment.js       # Payment endpoints
│   └── admin.js         # Admin endpoints
├── middleware/
│   ├── authMiddleware.js    # JWT authentication
│   └── validateRequest.js   # Request validation
├── utils/
│   ├── errorHandler.js      # Error handling
│   └── jwtUtils.js         # JWT utilities
├── server.js            # Main server file
└── package.json         # Dependencies
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Streams
- `GET /api/streams` - Get all streams
- `GET /api/streams/:id` - Get stream details
- `POST /api/streams` - Create new stream
- `PATCH /api/streams/:id/start` - Start stream
- `PATCH /api/streams/:id/end` - End stream

### Payments
- `POST /api/payments/create-intent` - Create payment
- `GET /api/payments/history` - Get payment history
- `PATCH /api/payments/:id/confirm` - Confirm payment

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/payments` - Get all payments

## 🔒 Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/serius
JWT_SECRET=your_secret_key
JWT_EXPIRY=7d
STRIPE_SECRET_KEY=sk_test_...
CORS_ORIGIN=http://localhost:5173
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🚀 Deployment

Deployable to:
- Heroku
- AWS EC2/ECS
- Railway
- Render
- DigitalOcean

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jwt**: Authentication
- **bcryptjs**: Password hashing
- **socket.io**: Real-time communication
- **stripe**: Payment processing
- **cors**: Cross-origin requests
- **dotenv**: Environment variables

## 📝 License

ISC

## 👨‍💻 Author

Mikel Mwangi

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
