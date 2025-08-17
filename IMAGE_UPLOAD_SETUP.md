# Complete Image Upload Setup Guide

## ✅ Server-Side Setup (DevMeet-Backend)

### 1. Dependencies Installed
- ✅ cloudinary
- ✅ multer
- ✅ streamifier x   
- ✅ dotenv

### 2. Configuration Files Created
- ✅ `/config/cloudinary.js` - Cloudinary configuration
- ✅ `/config/multer.js` - File upload handling
- ✅ `/src/utils/cloudinaryUtils.js` - Upload utilities

### 3. Environment Variables (`.env`)
```env
CLOUDINARY_CLOUD_NAME=dlcnv2mkm
CLOUDINARY_API_KEY=815279987495468
CLOUDINARY_API_SECRET=qfv9n8G6ycSOfrUAvGqwEUWvzNQ
```

### 4. API Endpoints
- ✅ `POST /profile/upload-photo` - Upload profile photo
- ✅ `PATCH /profile/edit` - Update profile (existing)

## ✅ Client-Side Setup (DevHub)

### 1. Components Created
- ✅ `PhotoUpload.jsx` - File upload component
- ✅ `uploadToCloudinary.js` - Updated to use server endpoint

### 2. Environment Variables (`.env`)
```env
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Integration
- ✅ PhotoUpload component integrated into EditProfile
- ✅ Server-side upload implemented

## 🚀 How It Works

1. **User selects photo** → PhotoUpload component
2. **File validation** → Type and size checks
3. **Upload to server** → `/profile/upload-photo` endpoint
4. **Server processes** → Multer handles file, Cloudinary uploads
5. **Response returns** → Cloudinary URL saved to user profile
6. **UI updates** → Photo displayed in profile

## 🔧 Features

- ✅ File type validation (images only)
- ✅ File size limit (5MB)
- ✅ Image optimization (400x400, face detection)
- ✅ Old photo deletion from Cloudinary
- ✅ Error handling
- ✅ Loading states
- ✅ Preview functionality

## 📝 Usage

1. Start your server: `node app.js`
2. Start your client: `npm run dev`
3. Go to Profile → Edit Profile
4. Click "Choose Photo" to upload from gallery
5. Photo is automatically uploaded and optimized

## 🔍 Troubleshooting

### Common Issues:

1. **"No file uploaded"**
   - Check if file input is working
   - Verify multer configuration

2. **"Failed to upload image"**
   - Check Cloudinary credentials
   - Verify internet connection
   - Check server logs

3. **CORS errors**
   - Ensure CORS is configured for your client URL
   - Check credentials: true setting

4. **Authentication errors**
   - Verify user is logged in
   - Check auth middleware

### Debug Steps:

1. Check server console for error logs
2. Check browser network tab for API calls
3. Verify environment variables are loaded
4. Test with smaller image files

## 🎯 Next Steps

The image upload system is now complete and ready to use! Users can upload photos directly from their device gallery, and the images will be automatically optimized and stored in Cloudinary.
