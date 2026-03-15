// setup.js
require('dotenv').config();           // Load environment variables
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize connection to SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_NAME || 'music_library.db'
});

// Define Track model
const Track = sequelize.define('Track', {
  trackId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  songTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  artistName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  albumName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER
  },
  releaseYear: {
    type: DataTypes.INTEGER
  }
});

// Asynchronous function to create database and tables
async function setupDatabase() {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');

    // Sync models (create tables)
    await sequelize.sync({ force: true }); // force: true drops table if it already exists
    console.log('✅ All tables created successfully.');

  } catch (error) {
    console.error('❌ Unable to connect or create tables:', error);
  } finally {
    // Close the connection
    await sequelize.close();
    console.log('✅ Database connection closed.');
  }
}

// Run the setup
setupDatabase();

// Export the Track model and sequelize for later use
module.exports = { Track, sequelize };
