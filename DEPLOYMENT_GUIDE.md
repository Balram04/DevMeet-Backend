# DevMeet Backend - Production Ready

## Environment Variables Required for Render

Set these in your Render Web Service environment variables:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://balramprajapati3263:GSfhxWLajAUiT4Q0@nodeg.x9gffle.mongodb.net/
JWT_SECRET=ramlal@123
JWT_EXPIRES_IN=4d
CLOUDINARY_CLOUD_NAME=dlcnv2mkm
CLOUDINARY_API_KEY=815279987495468
CLOUDINARY_API_SECRET=qfv9n8G6ycSOfrUAvGqwEUWvzNQ
CORS_ORIGIN=https://your-vercel-frontend-url.vercel.app
CLIENT_URL=https://your-vercel-frontend-url.vercel.app
```

## Build Commands for Render

- **Build Command**: `npm install`
- **Start Command**: `npm start`

## Features

- Express.js REST API
- MongoDB Atlas database
- JWT authentication with cookies
- Cloudinary file upload
- Socket.io real-time chat
- CORS configured for production
- Environment-based configuration

## API Endpoints

### Authentication
- POST `/signup` - User registration
- POST `/login` - User login
- POST `/logout` - User logout

### Profile
- GET `/profile/view` - Get user profile
- PATCH `/profile/edit` - Update profile
- POST `/profile/upload-photo` - Upload profile photo
- PATCH `/profile/password` - Change password

### Connections
- POST `/request/send/:status/:toUserId` - Send connection request
- POST `/request/review/:status/:requestId` - Accept/reject request
- DELETE `/request/cancel/:toUserId` - Cancel request
- GET `/user/requests/received` - Get pending requests
- GET `/user/connections` - Get connections

### Feed
- GET `/feed` - Get user feed
- GET `/feed/user/:userId` - Get specific user

The backend is production-ready for Render deployment!
