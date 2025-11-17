# Vehicle Breakdown Assistance - Complete Setup Instructions

Welcome! This document provides step-by-step instructions to get your application running.

## 📋 Project Overview

**Vehicle Breakdown Assistance** is a modern web application that helps users find solutions for their vehicle problems. It features:

- ✅ User registration and authentication
- ✅ Vehicle type selection (2-wheeler, 3-wheeler, 4-wheeler)
- ✅ Problem browsing and solution viewing
- ✅ YouTube video integration for step-by-step tutorials
- ✅ GPS location capture
- ✅ Community feedback and ratings
- ✅ Admin dashboard for managing content
- ✅ Minimalist, clean UI design (Apple/Stripe style)

**Tech Stack:**
- Frontend: React 18 + Vite + React Router
- Backend: Firebase (Firestore, Authentication, Storage)
- Deployment: GitHub Pages with GitHub Actions
- Styling: Pure CSS with modern design system

## 🚀 Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 16+ installed
- npm or yarn
- A GitHub account (for deployment)

### 2. Firebase Setup
Follow the detailed guide: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

**Quick summary:**
1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore, Authentication, and Storage
3. Get your Firebase config credentials
4. Create `.env` file in `frontend/` folder with your credentials

### 3. Run Locally

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### 4. Create Admin Account

1. Register a new user through the app
2. Go to [Firebase Console](https://console.firebase.google.com)
3. Firestore Database → `users` collection → Find your user
4. Set `isAdmin: true` in that document
5. Logout and login to access admin features

### 5. Add Sample Data

Use the Admin Dashboard to add:
- Vehicle types (2-wheeler, 3-wheeler, 4-wheeler)
- Problems for each vehicle type
- Solutions with YouTube links

### 6. Deploy to GitHub Pages

Follow the detailed guide: [GITHUB_PAGES_DEPLOYMENT.md](./GITHUB_PAGES_DEPLOYMENT.md)

**Quick summary:**
1. Push code to GitHub repository
2. Add Firebase secrets in GitHub repository settings
3. Enable GitHub Pages from `gh-pages` branch
4. App automatically deploys on each push

---

## 📁 Project Structure

```
vehicle-breakdown-assistance/
├── frontend/                          # React + Vite application
│   ├── src/
│   │   ├── App.jsx                   # Main app with routing
│   │   ├── main.jsx                  # React entry point
│   │   ├── index.css                 # Global styles (minimalist design)
│   │   ├── config/
│   │   │   └── firebase.js           # Firebase configuration
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Navigation bar
│   │   │   ├── Footer.jsx            # Footer
│   │   │   ├── ProtectedRoute.jsx    # Auth-protected routes
│   │   │   └── Loading.jsx           # Loading spinner
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Landing page
│   │   │   ├── pages.css             # Page-specific styles
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx         # User login
│   │   │   │   └── Register.jsx      # User registration
│   │   │   ├── user/                 # User features
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── SelectVehicle.jsx
│   │   │   │   ├── ViewProblems.jsx
│   │   │   │   ├── ViewSolution.jsx
│   │   │   │   ├── Feedback.jsx
│   │   │   │   └── ViewAllFeedback.jsx
│   │   │   └── admin/                # Admin features
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── ManageVehicles.jsx
│   │   │       ├── ManageProblems.jsx
│   │   │       ├── ManageSolutions.jsx
│   │   │       └── ViewFeedback.jsx
│   ├── package.json                  # Dependencies
│   ├── vite.config.js                # Vite build configuration
│   └── .env.example                  # Environment variables template
├── .github/
│   └── workflows/
│       └── deploy.yml                # GitHub Actions deployment
├── FIREBASE_SETUP.md                 # Firebase configuration guide
├── GITHUB_PAGES_DEPLOYMENT.md        # GitHub Pages deployment guide
└── SETUP_INSTRUCTIONS.md             # This file
```

---

## 🔐 User Roles & Features

### User Features
- Home page with feature showcase
- User registration (full name, email, phone, password)
- User login
- Select vehicle type (2W/3W/4W)
- View problems for selected vehicle
- View solutions with YouTube videos
- Give feedback with star rating
- View community feedback
- GPS location capture
- Logout

### Admin Features
- Admin-only login
- Dashboard with statistics
- Add/Delete vehicle types
- Add/Delete problems
- Add/Delete solutions (with YouTube links)
- View and approve/reject user feedback
- Logout

---

## 📱 Responsive Design

The application is fully responsive:
- **Desktop:** Full navigation, multi-column layouts
- **Tablet:** Adapted spacing, optimized touch targets
- **Mobile:** Hamburger menu, single-column layouts

All styling uses a minimalist design system inspired by Apple and Stripe.

---

## 🎨 Design System

### Colors
- **Primary:** #0066cc (Modern blue)
- **Success:** #34c759 (Green)
- **Error:** #ff3b30 (Red)
- **Warning:** #ff9500 (Orange)
- **Background:** #fafafa (Light gray)
- **Text:** #1d1d1d (Dark gray)

### Typography
- Clean, modern sans-serif fonts
- Proper letter spacing and line height
- Semantic heading hierarchy

### Components
- Subtle shadows and borders
- Smooth transitions (0.2s)
- Rounded corners (8-10px)
- Generous whitespace and padding

---

## 🔌 Firebase Database Schema

### Collections

**users**
- fullName, email, phone, isAdmin, createdAt, latitude, longitude

**vehicles**
- name, type (2w/3w/4w), description, createdAt

**problems**
- vehicleType, title, description, createdAt

**solutions**
- problemId, title, description, youtubeLink, stepByStep[], tools[], precautions[], createdAt

**feedback**
- userName, userEmail, rating, feedback, problemArea, approved, createdAt

---

## ⚙️ Environment Variables

Create `frontend/.env` with:

```
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🚨 Common Issues & Solutions

### Issue: "Cannot find module" error
**Solution:** Run `npm install` in the `frontend` directory

### Issue: Firebase credentials not loading
**Solution:** 
- Ensure `.env` file exists in `frontend` folder
- Variables must start with `VITE_`
- Restart the dev server after changing `.env`

### Issue: Firestore collections not found
**Solution:** Collections are created automatically when you add the first document. Use the Admin Dashboard to add initial data.

### Issue: Admin login not working
**Solution:** Make sure your user has `isAdmin: true` in the Firestore users collection

### Issue: GitHub Pages deployment fails
**Solution:** 
- Add Firebase secrets in GitHub repository settings
- Ensure the repository is public
- Check GitHub Actions logs for detailed error messages

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) | Complete Firebase configuration guide |
| [GITHUB_PAGES_DEPLOYMENT.md](./GITHUB_PAGES_DEPLOYMENT.md) | Deployment instructions |
| [README.md](./README.md) | Project overview and features |

---

## 🎯 Next Steps

1. **Setup Firebase** (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md))
2. **Run locally** (`npm run dev` in `frontend` folder)
3. **Test all features** with sample data
4. **Deploy to GitHub Pages** (see [GITHUB_PAGES_DEPLOYMENT.md](./GITHUB_PAGES_DEPLOYMENT.md))
5. **Customize** as needed for your use case

---

## 💡 Tips

- **YouTube Links:** Use format `https://www.youtube.com/watch?v=VIDEO_ID` or `https://youtu.be/VIDEO_ID`
- **GPS Feature:** Users will see a permission prompt - it's optional
- **Admin Account:** Only the first registered user should become admin
- **Security Rules:** Implement Firestore rules for production use

---

## 📞 Support

If you encounter issues:
1. Check the relevant documentation file
2. Review the Troubleshooting section
3. Check browser console (F12) for error messages
4. Review GitHub Actions logs for deployment issues

---

## ✨ Features Highlights

✅ **Modern UI** - Clean, minimalist design inspired by Apple and Stripe  
✅ **Firebase Backend** - No server setup needed  
✅ **Real-time Data** - Firestore synchronization  
✅ **Secure Auth** - Firebase Authentication  
✅ **GPS Integration** - Automatic location capture  
✅ **YouTube Videos** - Embedded solution tutorials  
✅ **Admin Dashboard** - Easy content management  
✅ **Community Feedback** - User ratings and reviews  
✅ **Responsive** - Works on all devices  
✅ **GitHub Pages** - One-click deployment  

---

Good luck with your Vehicle Breakdown Assistance application! 🚗