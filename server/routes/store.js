const express = require('express');
const router = express.Router();
const Store = require('../models/Store');

// GET /api/store - Get store layout data
router.get('/', async (req, res) => {
  try {
    const store = await Store.getStore();
    res.json(store);
  } catch (err) {
    console.error('Error fetching store:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/store/dimensions - Update store dimensions
router.put('/dimensions', async (req, res) => {
  try {
    const { width, height } = req.body;
    
    // Validate input
    if (!width || !height) {
      return res.status(400).json({ message: 'Width and height are required' });
    }
    
    if (width < 5 || width > 100 || height < 5 || height > 100) {
      return res.status(400).json({ 
        message: 'Dimensions must be between 5 and 100 meters' 
      });
    }
    
    const store = await Store.getStore();
    store.width = width;
    store.height = height;
    await store.save();
    
    res.json(store);
  } catch (err) {
    console.error('Error updating store dimensions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/store - Update entire store layout (dimensions and zones)
router.put('/', async (req, res) => {
  try {
    const { width, height, zones } = req.body;
    
    // Validate input
    if (!width || !height || !zones) {
      return res.status(400).json({ message: 'Width, height, and zones are required' });
    }
    
    const store = await Store.getStore();
    store.width = width;
    store.height = height;
    store.zones = zones;
    await store.save();
    
    res.json(store);
  } catch (err) {
    console.error('Error updating store layout:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/store/zones - Add a new zone
router.post('/zones', async (req, res) => {
  try {
    const newZone = req.body;
    
    // Validate input - don't require ID as it will be generated if not provided
    if (!newZone.name || !newZone.color || 
        newZone.x === undefined || newZone.y === undefined || 
        !newZone.width || !newZone.height) {
      return res.status(400).json({ message: 'Missing required zone properties' });
    }
    
    // Generate an ID if not provided
    if (!newZone.id) {
      newZone.id = Date.now().toString();
    }
    
    const store = await Store.getStore();
    store.zones.push(newZone);
    await store.save();
    
    res.status(201).json(store);
  } catch (err) {
    console.error('Error adding zone:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/store/zones/:id - Update a zone
router.put('/zones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const store = await Store.getStore();
    
    const zoneIndex = store.zones.findIndex(zone => zone.id === id);
    if (zoneIndex === -1) {
      return res.status(404).json({ message: 'Zone not found' });
    }
    
    // Update zone properties
    store.zones[zoneIndex] = {
      ...store.zones[zoneIndex].toObject(),
      ...updates
    };
    
    await store.save();
    res.json(store);
  } catch (err) {
    console.error('Error updating zone:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/store/zones/:id - Delete a zone
router.delete('/zones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const store = await Store.getStore();
    
    const initialLength = store.zones.length;
    store.zones = store.zones.filter(zone => zone.id !== id);
    
    if (store.zones.length === initialLength) {
      return res.status(404).json({ message: 'Zone not found' });
    }
    
    await store.save();
    res.json(store);
  } catch (err) {
    console.error('Error deleting zone:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
