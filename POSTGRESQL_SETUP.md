# PostgreSQL Database Setup Guide

This guide will help you set up PostgreSQL for the ViewLater application.

## Prerequisites

- PostgreSQL 12 or higher installed on your system

## Installation

### Windows

1. **Download PostgreSQL:**
   - Visit [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
   - Download the installer for Windows
   - Run the installer and follow the setup wizard

2. **During Installation:**
   - Remember the password you set for the postgres superuser
   - Default port: 5432
   - Locale: Default locale

3. **Verify Installation:**
   ```powershell
   psql --version
   ```

### macOS

Using Homebrew:
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Database Setup

### Step 1: Create Database

**Windows (using pgAdmin or psql):**

1. Open Command Prompt or PowerShell as Administrator
2. Connect to PostgreSQL:
```powershell
psql -U postgres
```

3. Create the database:
```sql
CREATE DATABASE viewlater;
```

4. Create a dedicated user (optional but recommended):
```sql
CREATE USER viewlater_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE viewlater TO viewlater_user;
```

5. Exit psql:
```sql
\q
```

**Linux/macOS:**
```bash
sudo -u postgres psql
CREATE DATABASE viewlater;
CREATE USER viewlater_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE viewlater TO viewlater_user;
\q
```

### Step 2: Configure Environment Variables

Update your `.env` file in the root directory:

```env
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=viewlater
DB_USER=postgres             # or viewlater_user if you created one
DB_PASSWORD=your_password    # the password you set during installation

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Step 3: Initialize Database Tables

Run the database initialization script:

```bash
cd "ViewLater"
node config/initDatabase.js
```

This will:
- Create all necessary tables (sections, links, tags, link_tags)
- Set up foreign key relationships
- Create indexes for better performance
- Add a default "Getting Started" section

## Database Schema

### Tables

#### 1. **sections**
- `id` (UUID, Primary Key)
- `name` (VARCHAR, NOT NULL)
- `description` (TEXT)
- `color` (VARCHAR)
- `icon` (VARCHAR)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

#### 2. **links**
- `id` (UUID, Primary Key)
- `url` (TEXT, NOT NULL)
- `title` (VARCHAR)
- `description` (TEXT)
- `favicon` (TEXT)
- `sectionId` (UUID, Foreign Key → sections.id, ON DELETE SET NULL)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

#### 3. **tags**
- `id` (UUID, Primary Key)
- `name` (VARCHAR, UNIQUE, NOT NULL)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

#### 4. **link_tags** (Junction Table)
- `id` (UUID, Primary Key)
- `linkId` (UUID, Foreign Key → links.id, ON DELETE CASCADE)
- `tagId` (UUID, Foreign Key → tags.id, ON DELETE CASCADE)
- Unique constraint on (linkId, tagId)

### Relationships

- **Section → Links**: One-to-Many (A section can have many links)
- **Link → Tags**: Many-to-Many (A link can have many tags, a tag can be on many links)
- **Link → Section**: Many-to-One (A link belongs to one section, can be null for unlisted)

## Running the Application

### Start the Backend Server

```bash
cd "ViewLater"
npm start
# or
node server.js
```

You should see:
```
✅ Database connection established
✅ Database tables synchronized
🚀 Server running on port 5000
📊 Using PostgreSQL database
```

### Start the Frontend

```bash
cd "ViewLater/client"
npm start
```

## Database Management

### Using pgAdmin (GUI)

1. Open pgAdmin 4 (installed with PostgreSQL)
2. Connect to your PostgreSQL server
3. Navigate to: Servers → PostgreSQL → Databases → viewlater
4. View tables under: Schemas → public → Tables

### Using psql (Command Line)

Connect to the database:
```bash
psql -U postgres -d viewlater
```

Useful commands:
```sql
-- List all tables
\dt

-- View table structure
\d links

-- View all sections
SELECT * FROM sections;

-- View all links with their sections
SELECT l.id, l.title, l.url, s.name as section_name
FROM links l
LEFT JOIN sections s ON l."sectionId" = s.id;

-- View all tags for a specific link
SELECT t.name
FROM tags t
JOIN link_tags lt ON t.id = lt."tagId"
WHERE lt."linkId" = 'your-link-id';
```

## Troubleshooting

### Connection Refused Error

**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solutions:**
1. Verify PostgreSQL is running:
   - Windows: Check Services app for "postgresql-x64-15"
   - Linux/Mac: `sudo systemctl status postgresql`

2. Start PostgreSQL:
   - Windows: Services app → Start the PostgreSQL service
   - Linux: `sudo systemctl start postgresql`
   - Mac: `brew services start postgresql`

### Authentication Failed

**Problem:** `password authentication failed for user "postgres"`

**Solution:**
1. Reset the postgres password:
   - Windows: Use pgAdmin or reinstall PostgreSQL
   - Linux/Mac:
   ```bash
   sudo -u postgres psql
   ALTER USER postgres PASSWORD 'new_password';
   ```

2. Update your `.env` file with the correct password

### Database Does Not Exist

**Problem:** `database "viewlater" does not exist`

**Solution:**
Run the database creation commands from Step 1 above.

### Port Already in Use

**Problem:** `Port 5432 is already in use`

**Solution:**
Either:
1. Stop the conflicting service
2. Change the PostgreSQL port in `postgresql.conf`
3. Update `DB_PORT` in your `.env` file

## Migration from localStorage

Your existing localStorage data can remain as a backup. When you start using the PostgreSQL backend:

1. The frontend will automatically switch to API calls
2. You can manually migrate data by exporting from localStorage and importing via the API
3. Or start fresh with the new database

## Benefits of PostgreSQL

✅ **ACID Compliance**: Guaranteed data consistency
✅ **Relationships**: Proper foreign keys and referential integrity
✅ **Performance**: Indexes for fast searches
✅ **Scalability**: Handle thousands of links efficiently
✅ **Advanced Queries**: Full-text search, complex filtering
✅ **Data Integrity**: Constraints prevent invalid data

## Next Steps

1. ✅ Install PostgreSQL
2. ✅ Create database and user
3. ✅ Configure `.env` file
4. ✅ Run initialization script
5. ✅ Start backend server
6. ✅ Update frontend to use API (see `DataContext.js`)
7. ✅ Test with a few links
8. ✅ Enjoy your new relational database!

## Support

For issues or questions:
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Sequelize Documentation: https://sequelize.org/docs/
