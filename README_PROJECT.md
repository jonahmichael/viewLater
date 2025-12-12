# ViewLater

A full-stack MERN application for saving and organizing links with sections and tags.

## Features

- 🔐 User authentication (JWT)
- 📁 Create custom sections to organize links
- 🔖 Add tags to links for better filtering
- 🔍 Search links by title or URL
- 🎯 Filter links by section or tags
- 📱 Responsive design

## Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

**Frontend:**
- React.js
- React Router
- Context API for state management
- Axios for API calls

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (free tier available)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**

2. **Set up the backend:**

```bash
# Install backend dependencies
npm install

# Create .env file from example
copy .env.example .env

# Edit .env with your MongoDB URI and JWT secret
```

3. **Set up the frontend:**

```bash
# Navigate to client directory
cd client

# Install frontend dependencies
npm install
```

4. **Run the application:**

```bash
# Terminal 1 - Run backend (from root directory)
npm run dev

# Terminal 2 - Run frontend (from client directory)
cd client
npm start
```

The backend will run on `http://localhost:5000` and the frontend on `http://localhost:3000`.

## Detailed Setup

For detailed setup instructions, including MongoDB Atlas configuration, see [SETUP_GUIDE.md](SETUP_GUIDE.md).

## Project Structure

```
ViewLater/
├── server.js              # Backend entry point
├── models/                # Database models
├── controllers/           # Route controllers
├── routes/                # API routes
├── middleware/            # Custom middleware
├── client/                # React frontend
│   ├── public/
│   └── src/
│       ├── components/    # React components
│       ├── context/       # Context providers
│       └── api/           # API configuration
└── SETUP_GUIDE.md         # Detailed setup instructions
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Sections
- `GET /api/sections` - Get all sections
- `POST /api/sections` - Create section
- `PUT /api/sections/:id` - Update section
- `DELETE /api/sections/:id` - Delete section

### Links
- `GET /api/links` - Get all links (with optional filters)
- `GET /api/links/tags` - Get all unique tags
- `POST /api/links` - Create link
- `PUT /api/links/:id` - Update link
- `DELETE /api/links/:id` - Delete link

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
