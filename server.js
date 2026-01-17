const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize, testConnection } = require('./config/database');
const initializeDatabase = require('./config/initDatabase');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize database connection
(async () => {
  try {
    await testConnection();
    await initializeDatabase();
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
})();

// Import routes
const sectionRoutes = require('./routes/sectionRoutes');
const linkRoutes = require('./routes/linkRoutes');

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to ViewLater API',
    database: 'PostgreSQL',
    version: '1.0.0'
  });
});

app.use('/api/sections', sectionRoutes);
app.use('/api/links', linkRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Using PostgreSQL database`);
});
