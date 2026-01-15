# Backend Setup Guide

## MongoDB Atlas Setup (Cloud Database)

### Step 1: Create MongoDB Atlas Account

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (no credit card required)
3. Verify your email address

### Step 2: Create a Free Cluster

1. After logging in, click **"Build a Database"** or **"Create"**
2. Choose **FREE** tier (M0 Sandbox - 512MB storage)
3. Select cloud provider:
   - **AWS** (recommended)
   - Choose a region closest to your location
4. Cluster Name: Leave default or name it `ViewLater`
5. Click **"Create Cluster"** 
6. Wait 1-3 minutes for cluster provisioning

### Step 3: Create Database User

1. In the left sidebar, click **"Database Access"**
2. Click **"+ ADD NEW DATABASE USER"**
3. Authentication Method: **Password**
4. Enter credentials:
   - Username: `viewlater` (or your preferred username)
   - Password: Click **"Autogenerate Secure Password"** (save this password!)
   - Or create your own strong password
5. Database User Privileges: Select **"Read and write to any database"**
6. Click **"Add User"**

**⚠️ Important: Save your password somewhere safe! You'll need it for the connection string.**

### Step 4: Configure Network Access

1. In the left sidebar, click **"Network Access"**
2. Click **"+ ADD IP ADDRESS"**
3. For development, click **"ALLOW ACCESS FROM ANYWHERE"**
   - This adds `0.0.0.0/0` to the IP Access List
   - ⚠️ For production, restrict to specific IP addresses
4. Click **"Confirm"**
5. Wait for status to change from "Pending" to "Active" (about 1 minute)

### Step 5: Get Your Connection String

1. Go back to **"Database"** in the left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**
5. Version: Select latest version
6. Copy the connection string (it looks like this):

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Configure Your Application

1. Open the `.env` file in the project root
2. Replace the `MONGO_URI` value with your connection string
3. **Important modifications to the connection string:**
   - Replace `<username>` with your database username (e.g., `viewlater`)
   - Replace `<password>` with your database password
   - Add `/viewlater` before the `?` to specify database name

**Example:**
```env
MONGO_URI=mongodb+srv://viewlater:YourPassword123@cluster0.abcde.mongodb.net/viewlater?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_for_jwt_here
PORT=5000
```

### Step 7: Test the Connection

1. Save the `.env` file
2. Open a terminal in the project root directory
3. Start the backend server:
   ```bash
   npm start
   ```
4. You should see:
   ```
   MongoDB Connected...
   Server running on port 5000
   ```

## Troubleshooting

### Connection Timeout Error
- Check if your IP address is whitelisted in Network Access
- Verify your internet connection
- Try adding `0.0.0.0/0` in Network Access

### Authentication Failed
- Double-check username and password in connection string
- Ensure password doesn't contain special characters (or URL encode them)
- Verify the database user was created successfully

### Special Characters in Password
If your password contains special characters, URL encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- `%` becomes `%25`

Example:
```
Password: Pass@123#
Encoded: Pass%40123%23
```

## Alternative: Local MongoDB Setup

If you prefer to run MongoDB locally:

1. Download [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Install MongoDB
3. Start MongoDB service:
   ```bash
   # Windows (as Administrator)
   net start MongoDB
   
   # Or run mongod directly
   mongod
   ```
4. Update `.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/viewlater
   ```

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Connection String Format](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
