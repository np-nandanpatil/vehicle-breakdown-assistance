# GitHub Pages Deployment Guide

This guide explains how to deploy the Vehicle Breakdown Assistance application to GitHub Pages.

## Prerequisites

1. A GitHub account
2. The project code pushed to a GitHub repository
3. Firebase credentials (see FIREBASE_SETUP.md)

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository with the name: `vehicle-breakdown-assistance`
3. Choose **Public** (required for free GitHub Pages)
4. Click **Create repository**

## Step 2: Push Your Code to GitHub

In your local project directory, run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Vehicle Breakdown Assistance app"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/vehicle-breakdown-assistance.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Add Firebase Credentials as GitHub Secrets

GitHub Actions needs access to your Firebase credentials to build the app properly. However, **we'll use the client-side Firebase SDK which loads credentials from the environment**.

For public deployment with client-side Firebase:

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each Firebase credential as a secret:

   - **Name:** `VITE_FIREBASE_API_KEY`
     **Value:** Your Firebase API Key
   
   - **Name:** `VITE_FIREBASE_AUTH_DOMAIN`
     **Value:** Your Firebase Auth Domain (e.g., `your-project.firebaseapp.com`)
   
   - **Name:** `VITE_FIREBASE_PROJECT_ID`
     **Value:** Your Firebase Project ID
   
   - **Name:** `VITE_FIREBASE_STORAGE_BUCKET`
     **Value:** Your Firebase Storage Bucket (e.g., `your-project.appspot.com`)
   
   - **Name:** `VITE_FIREBASE_MESSAGING_SENDER_ID`
     **Value:** Your Firebase Messaging Sender ID
   
   - **Name:** `VITE_FIREBASE_APP_ID`
     **Value:** Your Firebase App ID

**Note:** These are public credentials intended for client-side use. For sensitive operations, use Firebase Security Rules.

## Step 4: Create/Update GitHub Actions Workflow

Create a file at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: 'frontend/package-lock.json'

      - name: Install dependencies
        run: npm install
        working-directory: frontend

      - name: Build frontend
        run: npm run build
        working-directory: frontend
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
          cname: your-domain.com  # Remove this if you don't have a custom domain
```

Save this file in your repository.

## Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings**
3. Scroll down to **GitHub Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Select **Branch:** `gh-pages` and folder **`/ (root)`**
6. Click **Save**

## Step 6: Configure Vite Base Path

The `vite.config.js` is already configured with:
```javascript
base: '/vehicle-breakdown-assistance/',
```

This tells Vite to build assets for the `/vehicle-breakdown-assistance/` path on GitHub Pages.

## Step 7: Deploy

1. Commit and push your changes:
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add GitHub Pages deployment workflow"
   git push
   ```

2. GitHub Actions will automatically start building and deploying
3. Go to **Actions** tab in your repository to see the build progress
4. Once complete, your app will be live at:
   ```
   https://YOUR_USERNAME.github.io/vehicle-breakdown-assistance/
   ```

## Automatic Deployment

After setup, every time you push to the `main` branch, GitHub Actions will automatically:
1. Build the React + Vite application
2. Run the build process with your Firebase credentials
3. Deploy to GitHub Pages

## Custom Domain (Optional)

To use a custom domain:

1. Get a domain from a registrar (GoDaddy, Namecheap, etc.)
2. Add a `CNAME` file to the root of your repository with your domain name
3. Update your domain registrar's DNS settings to point to GitHub Pages
4. Update the `cname` line in the workflow file with your domain

## Troubleshooting

### Build fails with "Cannot find module"
- Make sure all dependencies are listed in `frontend/package.json`
- Check the build logs in the **Actions** tab

### App loads but shows blank page
- Check browser console for errors (F12 → Console)
- Verify Firebase credentials are correct
- Make sure Firestore database is created in Firebase Console

### Firebase authentication not working
- Verify the Firebase Auth Domain in your `.env` matches your project
- Check Firebase Console → Authentication → Settings for authorized domains
- You may need to add your GitHub Pages domain to the authorized domains list

### Redirect to home page not working
- This is expected due to GitHub Pages' limitations with client-side routing
- The app uses React Router which handles routing on the client side
- Deep links may require additional configuration

## For Development

To test locally before deploying:

```bash
cd frontend
npm install
npm run dev
```

Then visit `http://localhost:3000` (note: base path is `/` in dev mode)

## Additional Resources

- [GitHub Pages Documentation](https://pages.github.com/)
- [Vite Build Documentation](https://vitejs.dev/guide/build.html)
- [Firebase Documentation](https://firebase.google.com/docs)