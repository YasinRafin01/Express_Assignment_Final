const express = require('express');
const router = express.Router();
const pool = require('../db');
const upload = require('../middlewares/upload');
const upload1=require('../middlewares/upload_room');
const path = require('path');

// Serve static files from the 'uploads' directory
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Insert hotel data
router.post('/add-hotel', upload, async (req, res) => {
    const { slug, title, description, guest_count, bedroom_count, bathroom_count, amenities, host_info, address, latitude, longitude } = req.body;
    
    // Get filenames of the uploaded images
    const images = req.files ? req.files.map(file => file.filename) : [];
   
    // Convert amenities to an array
    const amenitiesArray = amenities.split(',').map(item => item.trim());

    try {
      const result = await pool.query(
        `INSERT INTO hotel_details (slug, images, title, description, guest_count, bedroom_count, bathroom_count, amenities, host_info, address, latitude, longitude)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING id`,
        [slug, images, title, description, guest_count, bedroom_count, bathroom_count, amenitiesArray, host_info, address, latitude, longitude]
      );
      res.status(201).json({ hotelId: result.rows[0].id });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error inserting hotel details');
    }
  });

// Updated route to get hotel details by slug
router.get('/hotel/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM hotel_details WHERE slug = $1',
      [slug]
    );
    if (result.rows.length > 0) {
      const hotel = result.rows[0];
      
      // Handle PostgreSQL array format
      if (hotel.images && typeof hotel.images === 'string') {
        // Remove the curly braces and split the string
        hotel.images = hotel.images.replace(/^\{|\}$/g, '').split(',');
      } else if (!Array.isArray(hotel.images)) {
        hotel.images = [];
      }
      
      // Map the image filenames to full URLs
      hotel.images = hotel.images.map(filename => `/uploads/hotel1/${filename.trim()}`);
      
      res.json(hotel);
    } else {
      res.status(404).send('Hotel not found');
    }
  } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching hotel details');
  }
});


// Insert room data
router.post('/add-room', upload1, async (req, res) => {
  const { hotel_slug, room_slug, room_title, bedroom_count } = req.body;
  
  const room_images = req.files ? req.files.map(file => file.filename) : [];

  try {
    const result = await pool.query(
      `INSERT INTO room_details (hotel_slug, room_slug, room_images, room_title, bedroom_count)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [hotel_slug, room_slug, room_images, room_title, bedroom_count]
    );
    res.status(201).json({ roomId: result.rows[0].id });
  } catch (error) {
    console.error(error);s
    res.status(500).send('Error inserting room details');
  }
});

// Get room details by hotel_slug and room_slug
router.get('/hotel/:slug/:room_slug', async (req, res) => {
  const { slug, room_slug } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM room_details WHERE hotel_slug = $1 AND room_slug = $2',
      [slug, room_slug]
    );
    if (result.rows.length > 0) {
      const room = result.rows[0];
      
      // Handle PostgreSQL array format for room_images
      if (room.room_images && typeof room.room_images === 'string') {
        room.room_images = room.room_images.replace(/^\{|\}$/g, '').split(',');
      } else if (!Array.isArray(room.room_images)) {
        room.room_images = [];
      }
      
      // Map the image filenames to full URLs
      room.room_images = room.room_images.map(filename => `/uploads/rooms/${filename.trim()}`);
      
      res.json(room);
    } else {
      res.status(404).send('Room not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching room details');
  }
});


module.exports = router;