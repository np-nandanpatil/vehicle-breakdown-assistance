# Firebase Setup Guide

This guide will help you set up Firebase for the Vehicle Breakdown Assistance application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter your project name: `vehicle-breakdown-assistance`
4. Accept the terms and click **"Create project"**
5. Wait for the project to be provisioned (this may take a few seconds)
6. Click **"Continue"** when done

## Step 2: Enable Required Services

### 2.1 Enable Firestore Database
1. In the left sidebar, go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose your preferred location (usually closest to your users)
5. Click **"Create"**

### 2.2 Enable Authentication
1. In the left sidebar, go to **Build** → **Authentication**
2. Click **"Get started"**
3. Under **Sign-in method**, click **"Email/Password"**
4. Enable **"Email/Password"** toggle
5. Click **"Save"**

### 2.3 Enable Cloud Storage (Optional, for future video storage)
1. In the left sidebar, go to **Build** → **Storage**
2. Click **"Get started"**
3. Choose your location and click **"Done"**

## Step 3: Get Firebase Configuration

1. In the left sidebar, click the **⚙️ Settings icon** (gear icon)
2. Select **"Project settings"**
3. Under the **"Your apps"** section, click the **Web icon** (</>) to add a web app
4. Enter app name: `vehicle-breakdown-assistance`
5. Check **"Also set up Firebase Hosting"** (optional)
6. Click **"Register app"**
7. On the next screen, you'll see your Firebase configuration

Copy your Firebase config that looks like this:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 4: Create Environment File

1. Navigate to the `frontend` folder
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and paste your Firebase configuration values:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## Step 5: Initialize Firestore Database Schema

The application expects the following collections in Firestore:

### Collection: `users`
Fields:
- `fullName` (string) - User's full name
- `email` (string) - User's email (unique)
- `phone` (string) - User's phone number
- `isAdmin` (boolean) - Whether user is admin (default: false)
- `createdAt` (timestamp) - Account creation time
- `latitude` (number) - Last known latitude (optional)
- `longitude` (number) - Last known longitude (optional)

### Collection: `vehicles`
Fields:
- `name` (string) - Vehicle type name (e.g., "2-Wheeler")
- `type` (string) - Vehicle category code (e.g., "2w", "3w", "4w")
- `description` (string) - Vehicle description
- `createdAt` (timestamp) - Creation time

### Collection: `problems`
Fields:
- `vehicleType` (string) - Reference to vehicle type (e.g., "2w")
- `title` (string) - Problem title
- `description` (string) - Problem description
- `createdAt` (timestamp) - Creation time

### Collection: `solutions`
Fields:
- `problemId` (string) - Reference to problem document ID
- `title` (string) - Solution title
- `description` (string) - Solution description
- `youtubeLink` (string) - YouTube video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
- `stepByStep` (array of strings) - Step-by-step instructions
- `tools` (array of strings) - Required tools list
- `precautions` (array of strings) - Safety precautions
- `createdAt` (timestamp) - Creation time

### Collection: `feedback`
Fields:
- `userName` (string) - User's name
- `userEmail` (string) - User's email
- `rating` (number) - Rating 1-5
- `feedback` (string) - Feedback text
- `problemArea` (string) - Related problem area
- `approved` (boolean) - Whether admin approved (default: false)
- `createdAt` (timestamp) - Submission time

## Step 6: Create Admin Account

1. First, register a user through the application normally at `http://localhost:3000/register`
2. Go to [Firebase Console](https://console.firebase.google.com/)
3. Navigate to **Build** → **Firestore Database**
4. Go to the **`users`** collection
5. Find your user document
6. Edit the document and add/modify the field `isAdmin` to `true`
7. Click **Save**

Now this account will have admin access!

## Step 7: Add Sample Data (Optional but Recommended)

To test the application, you should add sample vehicle types, problems, and solutions.

### Sample Vehicle Types:
1. **2-Wheeler**
   - type: "2w"
   - description: "Motorcycles and scooters"

2. **3-Wheeler**
   - type: "3w"
   - description: "Auto-rickshaws and three-wheelers"

3. **4-Wheeler**
   - type: "4w"
   - description: "Cars and light vehicles"

You can add these through the Admin Dashboard after logging in as an admin.

## Step 8: Set Firestore Security Rules

For production, add these security rules in **Firestore Database** → **Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - only own user can read/write
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Vehicles - anyone can read, only admin can write
    match /vehicles/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Problems - anyone can read, only admin can write
    match /problems/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Solutions - anyone can read, only admin can write
    match /solutions/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Feedback - anyone can write, only admin can read all, users can read approved
    match /feedback/{document=**} {
      allow read: if request.auth.uid != null && 
                      (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true ||
                       resource.data.approved == true);
      allow create: if request.auth.uid != null;
    }
  }
}
```

Click **Publish** to apply these rules.

## Step 9: Run the Application

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser

## Troubleshooting

### "Cannot access environment variables"
- Make sure the `.env` file exists in the `frontend` folder
- Variable names must start with `VITE_` to be exposed to the client
- Restart the dev server after adding the `.env` file

### "Firestore collection not found"
- Make sure you've created the Firestore database in step 2.1
- Collections are created automatically when you add the first document

### "Authentication not working"
- Verify Email/Password is enabled in Firebase Authentication settings
- Make sure your `.env` file has the correct credentials

### "Admin features not accessible"
- Make sure your user has `isAdmin: true` in the Firestore users collection
- Try logging out and logging back in

## Next Steps

After setting up Firebase, you can:
1. Run the application locally and test all features
2. Deploy to GitHub Pages (see GITHUB_PAGES_DEPLOYMENT.md)
3. Add your own vehicle types, problems, and solutions through the admin panel