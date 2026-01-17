# Switching Between localStorage and PostgreSQL

The ViewLater app supports two data storage modes:
1. **localStorage** - Client-side storage (no backend needed)
2. **PostgreSQL** - Server-side relational database (requires backend)

## Current Setup

You have **both implementations** ready to use!

### Files:
- `client/src/context/DataContext.js` - localStorage version (currently active)
- `client/src/context/DataContext.api.js` - PostgreSQL/API version

## How to Switch

### Option 1: Use localStorage (Default - No Setup Required)

✅ Already configured and working
✅ No backend needed
✅ Data persists in browser
✅ Perfect for testing and single-user scenarios

**No action needed** - this is already active!

### Option 2: Switch to PostgreSQL (Full Backend)

Follow these steps to use the PostgreSQL backend:

#### Step 1: Set up PostgreSQL

1. Install PostgreSQL (see `POSTGRESQL_SETUP.md`)
2. Create the database:
   ```sql
   CREATE DATABASE viewlater;
   ```

3. Update `.env` file:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=viewlater
   DB_USER=postgres
   DB_PASSWORD=your_password
   PORT=5000
   ```

4. Initialize database tables:
   ```bash
   cd "ViewLater"
   node config/initDatabase.js
   ```

#### Step 2: Start the Backend Server

```bash
cd "ViewLater"
npm start
```

You should see:
```
✅ Database connection established
✅ Database tables synchronized
🚀 Server running on port 5000
```

#### Step 3: Switch Frontend to Use API

**Update `client/src/App.js`:**

```javascript
// Change this line:
import { DataProvider } from './context/DataContext';

// To this:
import { DataProvider } from './context/DataContext.api';
```

That's it! The app will now use PostgreSQL.

#### Step 4: Restart Frontend

```bash
cd "ViewLater/client"
npm start
```

## Benefits Comparison

### localStorage

✅ No setup required
✅ Works offline
✅ Fast (no network latency)
✅ Private (data never leaves your browser)
❌ Limited to ~10MB
❌ Data tied to single browser
❌ No collaboration features

### PostgreSQL

✅ Unlimited storage
✅ Access from any device
✅ Backup and recovery
✅ Advanced queries and search
✅ Multi-user ready
✅ Data integrity and relationships
❌ Requires backend server
❌ Requires database setup

## Features Available in Both Modes

Both localStorage and PostgreSQL implementations support:

- ✅ Create, read, update, delete sections
- ✅ Create, read, update, delete links
- ✅ Tag management
- ✅ Search by title, description, section, tags
- ✅ Circular icon view for links
- ✅ Section-based organization
- ✅ Unlisted links

## API Endpoints (PostgreSQL Mode)

When using PostgreSQL, these endpoints are available:

### Sections
- `GET /api/sections` - Get all sections
- `POST /api/sections` - Create section
- `PUT /api/sections/:id` - Update section
- `DELETE /api/sections/:id` - Delete section

### Links
- `GET /api/links` - Get all links (with optional filters)
  - Query params: `?section=id`, `?search=query`, `?tags=tag1,tag2`
- `POST /api/links` - Create link
- `PUT /api/links/:id` - Update link
- `DELETE /api/links/:id` - Delete link
- `GET /api/links/tags` - Get all unique tags

## Troubleshooting

### Backend Not Connecting

**Error:** "Failed to fetch" or "Network Error"

**Solutions:**
1. Verify backend is running: `http://localhost:5000`
2. Check CORS is enabled in `server.js`
3. Confirm API_URL in `client/src/api/api.js` matches your backend port

### Database Connection Issues

**Error:** "Database connection failed"

**Solutions:**
1. Verify PostgreSQL is running
2. Check credentials in `.env`
3. Ensure database exists: `psql -U postgres -l`
4. Run initialization: `node config/initDatabase.js`

### Data Not Showing After Switch

If you switch to PostgreSQL and don't see your localStorage data:

**This is expected!** localStorage and PostgreSQL are separate data stores.

To migrate data:
1. Use PostgreSQL mode
2. Manually recreate sections and links through the UI
3. Or export from localStorage and import via API (custom script needed)

## Quick Switch Commands

### Switch to PostgreSQL:
```bash
# In client/src/App.js, change:
import { DataProvider } from './context/DataContext.api';
```

### Switch back to localStorage:
```bash
# In client/src/App.js, change:
import { DataProvider } from './context/DataContext';
```

No other code changes needed!

## Recommendations

**For Development/Testing:**
- Use **localStorage** - instant setup, no dependencies

**For Production:**
- Use **PostgreSQL** - scalable, reliable, feature-rich

**For Personal Use:**
- Use **localStorage** - simple and private

**For Team/Multi-device:**
- Use **PostgreSQL** - accessible from anywhere

## Next Steps

1. Choose your storage mode
2. If PostgreSQL: Follow setup guide
3. Update `App.js` import
4. Restart frontend
5. Start organizing your links!
