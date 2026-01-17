const { sequelize, Section, Link, Tag } = require('../models/index.sequelize');

const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync all models (creates tables if they don't exist)
    // force: false ensures we don't drop existing tables
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database tables synchronized');
    
    // Check if we have any sections, if not create a default one
    const sectionCount = await Section.count();
    if (sectionCount === 0) {
      await Section.create({
        name: 'Getting Started',
        description: 'Your first section',
        color: '#6366f1'
      });
      console.log('✅ Created default section');
    }
    
    console.log('🎉 Database initialization complete!');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error(error);
    return false;
  }
};

// Run if executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = initializeDatabase;
