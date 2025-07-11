const express = require('express');
const router = express.Router();
const Store = require('../models/Store');

// Debug helper function
const debugLog = (operation, data) => {
  console.log(`\n🔍 SHELVES ROUTE DEBUG - ${operation.toUpperCase()}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  if (data) {
    console.log('Data:', JSON.stringify(data, null, 2));
  }
  console.log('=====================================\n');
};

// GET /api/shelves/:zoneId - Get all shelves for a specific zone
router.get('/:zoneId', async (req, res) => {
  try {
    const { zoneId } = req.params;
    
    debugLog('GET Shelves by Zone', { zoneId });
    
    console.log('📥 Fetching shelves for zone:', zoneId);
    
    const store = await Store.getStore();
    const zone = store.zones.find(zone => zone.id === zoneId);
    
    if (!zone) {
      console.log('❌ Zone not found with ID:', zoneId);
      return res.status(404).json({ message: 'Zone not found' });
    }
    
    const shelves = zone.shelves || [];
    console.log('✅ Found', shelves.length, 'shelves for zone', zoneId);
    debugLog('GET Shelves Success', {
      zoneId,
      shelvesCount: shelves.length
    });
    
    res.json(shelves);
  } catch (err) {
    console.error('❌ Error fetching shelves:', err);
    console.error('Stack trace:', err.stack);
    debugLog('GET Shelves Error', { error: err.message, zoneId: req.params.zoneId });
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/shelves/:zoneId/:shelfId - Get a specific shelf
router.get('/:zoneId/:shelfId', async (req, res) => {
  try {
    const { zoneId, shelfId } = req.params;
    
    debugLog('GET Shelf', { zoneId, shelfId });
    
    console.log('📥 Fetching shelf:', shelfId, 'from zone:', zoneId);
    
    const store = await Store.getStore();
    const zone = store.zones.find(zone => zone.id === zoneId);
    
    if (!zone) {
      console.log('❌ Zone not found with ID:', zoneId);
      return res.status(404).json({ message: 'Zone not found' });
    }
    
    const shelf = zone.shelves?.find(shelf => shelf.id === shelfId);
    
    if (!shelf) {
      console.log('❌ Shelf not found with ID:', shelfId);
      return res.status(404).json({ message: 'Shelf not found' });
    }
    
    console.log('✅ Found shelf:', shelfId);
    debugLog('GET Shelf Success', {
      zoneId,
      shelfId,
      shelf
    });
    
    res.json(shelf);
  } catch (err) {
    console.error('❌ Error fetching shelf:', err);
    console.error('Stack trace:', err.stack);
    debugLog('GET Shelf Error', { 
      error: err.message, 
      zoneId: req.params.zoneId,
      shelfId: req.params.shelfId 
    });
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/shelves/:zoneId - Add a new shelf to a zone
router.post('/:zoneId', async (req, res) => {
  try {
    const { zoneId } = req.params;
    const newShelf = req.body;
    
    debugLog('POST Shelf', { 
      zoneId,
      shelfData: newShelf
    });
    
    console.log('➕ Adding new shelf to zone:', zoneId);
    console.log('Shelf data:', JSON.stringify(newShelf, null, 2));
    
    // Validate input - don't require ID as it will be generated if not provided
    if (!newShelf.name || !newShelf.category || 
        newShelf.x === undefined || newShelf.y === undefined || 
        !newShelf.width || !newShelf.height) {
      console.log('❌ Validation failed: Missing required shelf properties');
      return res.status(400).json({ message: 'Missing required shelf properties' });
    }
    
    // Generate an ID if not provided
    if (!newShelf.id) {
      newShelf.id = `shelf-${Date.now()}`;
      console.log('🔧 Generated shelf ID:', newShelf.id);
    }
    
    // Ensure zoneId is set correctly
    newShelf.zoneId = zoneId;
    
    console.log('✅ Shelf validation passed');
    
    const store = await Store.getStore();
    const zoneIndex = store.zones.findIndex(zone => zone.id === zoneId);
    
    if (zoneIndex === -1) {
      console.log('❌ Zone not found with ID:', zoneId);
      return res.status(404).json({ message: 'Zone not found' });
    }
    
    // Initialize shelves array if it doesn't exist
    if (!store.zones[zoneIndex].shelves) {
      store.zones[zoneIndex].shelves = [];
    }
    
    console.log('Current shelves count:', store.zones[zoneIndex].shelves.length);
    store.zones[zoneIndex].shelves.push(newShelf);
    console.log('New shelves count:', store.zones[zoneIndex].shelves.length);
    
    console.log('💾 Saving store with new shelf...');
    await store.save();
    
    console.log('✅ Shelf added successfully');
    debugLog('POST Shelf Success', {
      zoneId,
      newShelfId: newShelf.id,
      totalShelves: store.zones[zoneIndex].shelves.length
    });
    
    res.status(201).json(newShelf);
  } catch (err) {
    console.error('❌ Error adding shelf:', err);
    console.error('Stack trace:', err.stack);
    debugLog('POST Shelf Error', { error: err.message, zoneId: req.params.zoneId });
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/shelves/:zoneId/:shelfId - Update a shelf
router.put('/:zoneId/:shelfId', async (req, res) => {
  try {
    const { zoneId, shelfId } = req.params;
    const updates = req.body;
    
    debugLog('PUT Shelf', { 
      zoneId,
      shelfId,
      updates
    });
    
    console.log('📝 Updating shelf:', shelfId, 'in zone:', zoneId);
    console.log('Updates:', JSON.stringify(updates, null, 2));
    
    const store = await Store.getStore();
    const zoneIndex = store.zones.findIndex(zone => zone.id === zoneId);
    
    if (zoneIndex === -1) {
      console.log('❌ Zone not found with ID:', zoneId);
      return res.status(404).json({ message: 'Zone not found' });
    }
    
    if (!store.zones[zoneIndex].shelves) {
      console.log('❌ No shelves found in zone:', zoneId);
      return res.status(404).json({ message: 'No shelves found in this zone' });
    }
    
    const shelfIndex = store.zones[zoneIndex].shelves.findIndex(shelf => shelf.id === shelfId);
    
    if (shelfIndex === -1) {
      console.log('❌ Shelf not found with ID:', shelfId);
      return res.status(404).json({ message: 'Shelf not found' });
    }
    
    console.log('Current shelf data:', JSON.stringify(store.zones[zoneIndex].shelves[shelfIndex], null, 2));
    
    // Update shelf properties
    store.zones[zoneIndex].shelves[shelfIndex] = {
      ...store.zones[zoneIndex].shelves[shelfIndex].toObject(),
      ...updates
    };
    
    // Ensure zoneId remains correct
    store.zones[zoneIndex].shelves[shelfIndex].zoneId = zoneId;
    
    console.log('Updated shelf data:', JSON.stringify(store.zones[zoneIndex].shelves[shelfIndex], null, 2));
    
    console.log('💾 Saving updated shelf...');
    await store.save();
    
    console.log('✅ Shelf updated successfully');
    debugLog('PUT Shelf Success', {
      zoneId,
      shelfId,
      updatedShelf: store.zones[zoneIndex].shelves[shelfIndex]
    });
    
    res.json(store.zones[zoneIndex].shelves[shelfIndex]);
  } catch (err) {
    console.error('❌ Error updating shelf:', err);
    console.error('Stack trace:', err.stack);
    debugLog('PUT Shelf Error', { 
      error: err.message, 
      zoneId: req.params.zoneId,
      shelfId: req.params.shelfId 
    });
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/shelves/:zoneId/:shelfId - Delete a shelf
router.delete('/:zoneId/:shelfId', async (req, res) => {
  try {
    const { zoneId, shelfId } = req.params;
    
    debugLog('DELETE Shelf', { zoneId, shelfId });
    
    console.log('🗑️  Deleting shelf:', shelfId, 'from zone:', zoneId);
    
    const store = await Store.getStore();
    const zoneIndex = store.zones.findIndex(zone => zone.id === zoneId);
    
    if (zoneIndex === -1) {
      console.log('❌ Zone not found with ID:', zoneId);
      return res.status(404).json({ message: 'Zone not found' });
    }
    
    if (!store.zones[zoneIndex].shelves) {
      console.log('❌ No shelves found in zone:', zoneId);
      return res.status(404).json({ message: 'No shelves found in this zone' });
    }
    
    const initialLength = store.zones[zoneIndex].shelves.length;
    const shelfToDelete = store.zones[zoneIndex].shelves.find(shelf => shelf.id === shelfId);
    
    if (shelfToDelete) {
      console.log('Shelf to delete:', JSON.stringify(shelfToDelete, null, 2));
    }
    
    store.zones[zoneIndex].shelves = store.zones[zoneIndex].shelves.filter(shelf => shelf.id !== shelfId);
    console.log('New shelves count:', store.zones[zoneIndex].shelves.length);
    
    if (store.zones[zoneIndex].shelves.length === initialLength) {
      console.log('❌ Shelf not found with ID:', shelfId);
      return res.status(404).json({ message: 'Shelf not found' });
    }
    
    console.log('💾 Saving store after shelf deletion...');
    await store.save();
    
    console.log('✅ Shelf deleted successfully');
    debugLog('DELETE Shelf Success', {
      zoneId,
      deletedShelfId: shelfId,
      remainingShelves: store.zones[zoneIndex].shelves.length
    });
    
    res.json({ message: 'Shelf deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting shelf:', err);
    console.error('Stack trace:', err.stack);
    debugLog('DELETE Shelf Error', { 
      error: err.message, 
      zoneId: req.params.zoneId,
      shelfId: req.params.shelfId 
    });
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/shelves/:zoneId - Delete all shelves in a zone
router.delete('/:zoneId', async (req, res) => {
  try {
    const { zoneId } = req.params;
    
    debugLog('DELETE All Shelves', { zoneId });
    
    console.log('🗑️  Deleting all shelves from zone:', zoneId);
    
    const store = await Store.getStore();
    const zoneIndex = store.zones.findIndex(zone => zone.id === zoneId);
    
    if (zoneIndex === -1) {
      console.log('❌ Zone not found with ID:', zoneId);
      return res.status(404).json({ message: 'Zone not found' });
    }
    
    const shelvesCount = store.zones[zoneIndex].shelves?.length || 0;
    console.log('Shelves to delete:', shelvesCount);
    
    store.zones[zoneIndex].shelves = [];
    
    console.log('💾 Saving store after shelves deletion...');
    await store.save();
    
    console.log('✅ All shelves deleted successfully');
    debugLog('DELETE All Shelves Success', {
      zoneId,
      deletedCount: shelvesCount
    });
    
    res.json({ message: `${shelvesCount} shelves deleted successfully` });
  } catch (err) {
    console.error('❌ Error deleting all shelves:', err);
    console.error('Stack trace:', err.stack);
    debugLog('DELETE All Shelves Error', { 
      error: err.message, 
      zoneId: req.params.zoneId
    });
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
