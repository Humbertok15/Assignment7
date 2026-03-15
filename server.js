// server.js
require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const { Track, sequelize } = require('./setup.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// --------------------
// GET /api/tracks
// Returns all tracks
// --------------------
app.get('/api/tracks', async (req, res) => {
  try {
    const tracks = await Track.findAll();
    res.json(tracks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching tracks' });
  }
});

// --------------------
// GET /api/tracks/:id
// Returns a single track by id
// --------------------
app.get('/api/tracks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const track = await Track.findByPk(id);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    res.json(track);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching track' });
  }
});

// --------------------
// POST /api/tracks
// Create a new track
// --------------------
app.post('/api/tracks', async (req, res) => {
  const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;

  // Validate required fields
  if (!songTitle || !artistName || !albumName || !genre) {
    return res.status(400).json({ error: 'songTitle, artistName, albumName, and genre are required' });
  }

  try {
    const newTrack = await Track.create({
      songTitle,
      artistName,
      albumName,
      genre,
      duration,
      releaseYear
    });
    res.status(201).json(newTrack);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while creating track' });
  }
});

// --------------------
// PUT /api/tracks/:id
// Update an existing track
// --------------------
app.put('/api/tracks/:id', async (req, res) => {
  const { id } = req.params;
  const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;

  try {
    const track = await Track.findByPk(id);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    await track.update({ songTitle, artistName, albumName, genre, duration, releaseYear });
    res.json(track);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while updating track' });
  }
});

// --------------------
// DELETE /api/tracks/:id
// Delete a track
// --------------------
app.delete('/api/tracks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const track = await Track.findByPk(id);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    await track.destroy();
    res.json({ message: 'Track deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while deleting track' });
  }
});

// Start server
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Server running on port ${PORT}. Database connected.`);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
});
