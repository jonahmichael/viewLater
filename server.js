const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log('MongoDB connection error:', err));

// Import routes
const userRoutes = require('./routes/userRoutes');
const sectionRoutes = require('./routes/sectionRoutes');
const linkRoutes = require('./routes/linkRoutes');

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ViewLater API' });
});

app.use('/api/users', userRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/links', linkRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
