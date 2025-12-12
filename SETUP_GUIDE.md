# ViewLater: Complete Setup Guide

This guide will walk you through setting up your MongoDB Atlas account, connecting it to your backend, and running the complete full-stack application.

---

## 📋 Table of Contents

1. [Setting Up MongoDB Atlas](#1-setting-up-mongodb-atlas)
2. [Connecting the Backend to MongoDB](#2-connecting-the-backend-to-mongodb)
3. [Running the Backend Server](#3-running-the-backend-server)
4. [Running the Frontend](#4-running-the-frontend)
5. [Testing the Application](#5-testing-the-application)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Setting Up MongoDB Atlas

MongoDB Atlas is a cloud database service that will host your application's data.

### Step 1.1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account
2. Follow the on-screen instructions to create a new organization and project

### Step 1.2: Create a Free Cluster

1. Once your project is created, click **"Build a Database"**
2. Choose the **"M0 Shared"** (free) plan
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure) and region
   - Choose a region closest to your location for better performance
4. Give your cluster a name (e.g., `ViewLaterCluster`)
5. Click **"Create Cluster"** (deployment will take 3-5 minutes)

### Step 1.3: Configure Database User

1. In the left navigation, under "Security," click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** as the authentication method
4. Enter a **username** (e.g., `viewlater_user`)
5. Click **"Autogenerate Secure Password"** or create your own strong password
6. **IMPORTANT:** Copy and save this password securely - you'll need it shortly
7. Under "Database User Privileges," select **"Read and write to any database"**
8. Click **"Add User"**

### Step 1.4: Configure Network Access

1. In the left navigation, under "Security," click **"Network Access"**
2. Click **"Add IP Address"**
3. For development purposes, click **"Allow Access From Anywhere"**
   - This sets the IP to `0.0.0.0/0`
   - **Note:** For production, you should restrict this to your server's IP
4. Click **"Confirm"**

### Step 1.5: Get Your Connection String

1. Click **"Database"** in the left navigation to return to your cluster
2. Click the **"Connect"** button for your cluster
3. Select **"Connect your application"**
4. Ensure "Driver" is set to **"Node.js"** and select the latest version
5. Copy the connection string - it will look like this:
   ```
   mongodb+srv://<username>:<password>@yourcluster.mongodb.net/?retryWrites=true&w=majority
   ```
6. Save this connection string - you'll use it in the next step

---

## 2. Connecting the Backend to MongoDB

### Step 2.1: Navigate to Backend Directory

```powershell
cd "d:\Learning Stuffs\Mini Project Series\ViewLater"
```

### Step 2.2: Create `.env` File

1. Copy the `.env.example` file:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Open the `.env` file and update it with your credentials:
   ```env
   MONGO_URI=mongodb+srv://viewlater_user:YOUR_PASSWORD_HERE@yourcluster.mongodb.net/viewlater?retryWrites=true&w=majority
   JWT_SECRET=your_very_long_and_random_secret_key_here_make_it_secure_123456789
   PORT=5000
   ```

   **Important:**
   - Replace `viewlater_user` with your MongoDB username
   - Replace `YOUR_PASSWORD_HERE` with your actual MongoDB password
   - Add `/viewlater` before the `?` to specify the database name
   - Create a long, random string for `JWT_SECRET` (at least 32 characters)

### Step 2.3: Install Backend Dependencies

```powershell
npm install
```

This will install all required packages:
- express
- cors
- mongoose
- dotenv
- bcryptjs
- jsonwebtoken

---

## 3. Running the Backend Server

### Start the Development Server

```powershell
npm run dev
```

**Expected Output:**
```
[nodemon] starting `node server.js`
Server running on port 5000
MongoDB Connected...
```

✅ If you see "MongoDB Connected..." - your backend is ready!

❌ If you see connection errors, check the [Troubleshooting](#6-troubleshooting) section.

---

## 4. Running the Frontend

### Step 4.1: Open a New Terminal

Keep the backend server running and open a **new terminal window**.

### Step 4.2: Navigate to Frontend Directory

```powershell
cd "d:\Learning Stuffs\Mini Project Series\ViewLater\client"
```

### Step 4.3: Install Frontend Dependencies

```powershell
npm install
```

This will install:
- react
- react-dom
- react-router-dom
- axios
- react-scripts

### Step 4.4: Start the React Development Server

```powershell
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view viewlater-frontend in the browser.

  Local:            http://localhost:3000
```

Your browser should automatically open to `http://localhost:3000`

---

## 5. Testing the Application

### Step 5.1: Register a New Account

1. The app should open to the Login page
2. Click **"Register"** link at the bottom
3. Enter an email address and password
4. Click **"Register"** button
5. You should be redirected to the Dashboard

### Step 5.2: Create Your First Section

1. In the sidebar, click the **"+"** button next to "Sections"
2. Enter a section name (e.g., "Web Development")
3. Click **"Add"**

### Step 5.3: Add Your First Link

1. Click **"+ Add Link"** button in the main area
2. Fill in the form:
   - **URL:** `https://github.com` (required)
   - **Title:** "GitHub" (optional)
   - **Description:** "Code hosting platform" (optional)
   - **Section:** Select the section you created
   - **Tags:** "development, tools" (optional)
3. Click **"Add Link"**

### Step 5.4: Test Features

- **Search:** Type in the search bar to filter links by title or URL
- **Filter by Section:** Click on a section in the sidebar to filter links
- **Filter by Tags:** Click on a tag to filter by that tag
- **Edit Link:** Click the pencil icon on a link card
- **Delete Link:** Click the trash icon on a link card
- **Edit Section:** Hover over a section and click the pencil icon
- **Delete Section:** Hover over a section and click the trash icon

---

## 6. Troubleshooting

### MongoDB Connection Issues

**Error:** `MongoNetworkError: failed to connect to server`

**Solutions:**
1. Check your internet connection
2. Verify your IP address is whitelisted in MongoDB Atlas Network Access
3. Ensure your MongoDB username and password are correct in `.env`
4. Make sure you replaced `<password>` with your actual password

---

**Error:** `MongoServerError: bad auth : Authentication failed`

**Solutions:**
1. Double-check your MongoDB username and password in `.env`
2. Ensure there are no extra spaces in the connection string
3. If password contains special characters, URL encode them:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `%` → `%25`
   - `^` → `%5E`

---

### CORS Issues

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solutions:**
1. Ensure the backend server is running on port 5000
2. Check that `cors` middleware is properly configured in `server.js`
3. Verify the API URL in `client/src/api/api.js` is set to `http://localhost:5000/api`

---

### Frontend Connection Issues

**Error:** `Network Error` when trying to register/login

**Solutions:**
1. Ensure the backend server is running
2. Check that you're accessing the frontend at `http://localhost:3000`
3. Verify the backend is on `http://localhost:5000`
4. Check browser console for detailed error messages

---

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
1. Stop any other application using port 5000
2. Or change the PORT in `.env` to a different number (e.g., 5001)
3. Update the API URL in `client/src/api/api.js` accordingly

---

## 📁 Project Structure

```
ViewLater/
├── server.js                 # Backend entry point
├── package.json              # Backend dependencies
├── .env                      # Environment variables (create this)
├── .env.example              # Environment template
├── models/                   # Database models
│   ├── User.js
│   ├── Section.js
│   └── Link.js
├── controllers/              # Business logic
│   ├── userController.js
│   ├── sectionController.js
│   └── linkController.js
├── routes/                   # API routes
│   ├── userRoutes.js
│   ├── sectionRoutes.js
│   └── linkRoutes.js
├── middleware/               # Custom middleware
│   └── auth.js
└── client/                   # React frontend
    ├── package.json          # Frontend dependencies
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── App.js
        ├── api/
        │   └── api.js        # Axios configuration
        ├── context/
        │   ├── AuthContext.js
        │   └── DataContext.js
        └── components/
            ├── Auth/
            ├── Dashboard/
            ├── Sidebar/
            └── Links/
```

---

## 🔑 API Endpoints Reference

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Sections (Requires Authentication)
- `GET /api/sections` - Get all user's sections
- `POST /api/sections` - Create new section
- `PUT /api/sections/:id` - Update section
- `DELETE /api/sections/:id` - Delete section

### Links (Requires Authentication)
- `GET /api/links` - Get all user's links (supports query params: `section`, `search`, `tags`)
- `GET /api/links/tags` - Get all user's unique tags
- `POST /api/links` - Create new link
- `PUT /api/links/:id` - Update link
- `DELETE /api/links/:id` - Delete link

---

## 🎉 Next Steps

Now that your application is running:

1. **Customize the styling** - Edit the CSS files to match your preferences
2. **Add more features** - Consider adding:
   - Link previews with Open Graph data
   - Export/import functionality
   - Link notes or annotations
   - Favorites/starred links
   - Dark mode
3. **Deploy your app** - Consider:
   - Backend: Heroku, Railway, Render, or DigitalOcean
   - Frontend: Vercel, Netlify, or GitHub Pages
4. **Secure for production**:
   - Restrict MongoDB Network Access to your server IP
   - Use strong JWT secrets
   - Implement rate limiting
   - Add input validation and sanitization

---

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Authentication Guide](https://jwt.io/introduction)

---

## 💡 Tips

- Use **MongoDB Compass** to visually browse your database
- Install **React DevTools** browser extension for debugging
- Use **Postman** or **Thunder Client** to test API endpoints
- Keep your `.env` file secure and never commit it to version control

---

**Happy Coding! 🚀**

If you encounter any issues not covered in this guide, check the terminal output for error messages, which often provide helpful clues for debugging.
