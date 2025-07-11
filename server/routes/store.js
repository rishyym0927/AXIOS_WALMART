const express = require('express');
const router = express.Router();
const Store = require('../models/Store');

// Debug helper function
const debugLog = (operation, data) => {
  console.log(`\n🔍 STORE ROUTE DEBUG - ${operation.toUpperCase()}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  if (data) {
    console.log('Data:', JSON.stringify(data, null, 2));
  }
  console.log('=====================================\n');
};

// GET /api/store - Get store layout data
router.get('/', async (req, res) => {
  try {
    debugLog('GET Store', { query: req.query });
    
    console.log('📥 Fetching store data from database...');
    const store = await Store.getStore();
    
    console.log('✅ Store data retrieved successfully');
    console.log('Store ID:', store._id);
    console.log('Store dimensions:', { width: store.width, height: store.height });
    console.log('Number of zones:', store.zones?.length || 0);
    
    debugLog('GET Store Success', {
      storeId: store._id,
      dimensions: { width: store.width, height: store.height },
      zonesCount: store.zones?.length || 0
    });
    
    res.json(store);
  } catch (err) {
    console.error('❌ Error fetching store:', err);
    console.error('Stack trace:', err.stack);
    debugLog('GET Store Error', { error: err.message });
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/store/dimensions - Update store dimensions
router.put('/dimensions', async (req, res) => {
  try {
    const { width, height } = req.body;
    
    debugLog('PUT Dimensions', { 
      requestBody: req.body,
      dimensions: { width, height }
    });
    
    console.log('📝 Updating store dimensions...');
    console.log('New dimensions:', { width, height });
    
    // Validate input
    if (!width || !height) {
      console.log('❌ Validation failed: Missing width or height');
      return res.status(400).json({ message: 'Width and height are required' });
    }
    
    if (width < 5 || width > 100 || height < 5 || height > 100) {
      console.log('❌ Validation failed: Dimensions out of range');
      return res.status(400).json({ 
        message: 'Dimensions must be between 5 and 100 meters' 
      });
    }
    
    console.log('✅ Validation passed');
    
    const store = await Store.getStore();
    console.log('Current store dimensions:', { width: store.width, height: store.height });
    
    store.width = width;
    store.height = height;
    
    console.log('💾 Saving updated store...');
    await store.save();
    
    console.log('✅ Store dimensions updated successfully');
    debugLog('PUT Dimensions Success', {
      oldDimensions: { width: store.width, height: store.height },
      newDimensions: { width, height }
    });
    
    res.json(store);
  } catch (err) {
    console.error('❌ Error updating store dimensions:', err);
    console.error('Stack trace:', err.stack);
    debugLog('PUT Dimensions Error', { error: err.message });
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/store - Update entire store layout (dimensions and zones)
router.put('/', async (req, res) => {
  try {
    const { width, height, zones } = req.body;
    
    debugLog('PUT Store Layout', { 
      requestBody: req.body,
      dimensions: { width, height },
      zonesCount: zones?.length || 0
    });
    
    console.log('📝 Updating entire store layout...');
    console.log('New dimensions:', { width, height });
    console.log('Number of zones:', zones?.length || 0);
    
    // Validate input
    if (!width || !height || !zones) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({ message: 'Width, height, and zones are required' });
    }
    
    console.log('✅ Validation passed');
    
    const store = await Store.getStore();
    console.log('Current store state:', {
      dimensions: { width: store.width, height: store.height },
      zonesCount: store.zones?.length || 0
    });
    
    store.width = width;
    store.height = height;
    store.zones = zones;
    
    console.log('💾 Saving updated store layout...');
    await store.save();
    
    console.log('✅ Store layout updated successfully');
    debugLog('PUT Store Layout Success', {
      finalDimensions: { width, height },
      finalZonesCount: zones.length
    });
    
    res.json(store);
  } catch (err) {
    console.error('❌ Error updating store layout:', err);
    console.error('Stack trace:', err.stack);
    debugLog('PUT Store Layout Error', { error: err.message });
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/store/zones - Add a new zone
router.post('/zones', async (req, res) => {
  try {
    const newZone = req.body;
    
    debugLog('POST Zone', { 
      requestBody: req.body,
      zoneData: newZone
    });
    
    console.log('➕ Adding new zone...');
    console.log('Zone data:', JSON.stringify(newZone, null, 2));
    
    // Validate input - don't require ID as it will be generated if not provided
    if (!newZone.name || !newZone.color || 
        newZone.x === undefined || newZone.y === undefined || 
        !newZone.width || !newZone.height) {
      console.log('❌ Validation failed: Missing required zone properties');
      return res.status(400).json({ message: 'Missing required zone properties' });
    }
    
    // Generate an ID if not provided
    if (!newZone.id) {
      newZone.id = Date.now().toString();
      console.log('🔧 Generated zone ID:', newZone.id);
    }
    
    console.log('✅ Zone validation passed');
    
    const store = await Store.getStore();
    console.log('Current zones count:', store.zones?.length || 0);
    
    store.zones.push(newZone);
    console.log('New zones count:', store.zones.length);
    
    console.log('💾 Saving store with new zone...');
    await store.save();
    
    console.log('✅ Zone added successfully');
    debugLog('POST Zone Success', {
      newZoneId: newZone.id,
      totalZones: store.zones.length
    });
    
    res.status(201).json(store);
  } catch (err) {
    console.error('❌ Error adding zone:', err);
    console.error('Stack trace:', err.stack);
    debugLog('POST Zone Error', { error: err.message });
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/store/zones/:id - Update a zone
router.put('/zones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    debugLog('PUT Zone', { 
      zoneId: id,
      updates: updates
    });
    
    console.log('📝 Updating zone...');
    console.log('Zone ID:', id);
    console.log('Updates:', JSON.stringify(updates, null, 2));
    
    const store = await Store.getStore();
    console.log('Current zones count:', store.zones?.length || 0);
    
    const zoneIndex = store.zones.findIndex(zone => zone.id === id);
    console.log('Zone index found:', zoneIndex);
    
    if (zoneIndex === -1) {
      console.log('❌ Zone not found with ID:', id);
      return res.status(404).json({ message: 'Zone not found' });
    }
    
    console.log('Current zone data:', JSON.stringify(store.zones[zoneIndex], null, 2));
    
    // Update zone properties
    store.zones[zoneIndex] = {
      ...store.zones[zoneIndex].toObject(),
      ...updates
    };
    
    console.log('Updated zone data:', JSON.stringify(store.zones[zoneIndex], null, 2));
    
    console.log('💾 Saving updated zone...');
    await store.save();
    
    console.log('✅ Zone updated successfully');
    debugLog('PUT Zone Success', {
      zoneId: id,
      updatedZone: store.zones[zoneIndex]
    });
    
    res.json(store);
  } catch (err) {
    console.error('❌ Error updating zone:', err);
    console.error('Stack trace:', err.stack);
    debugLog('PUT Zone Error', { error: err.message, zoneId: req.params.id });
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/store/zones/:id - Delete a zone
router.delete('/zones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    debugLog('DELETE Zone', { zoneId: id });
    
    console.log('🗑️  Deleting zone...');
    console.log('Zone ID:', id);
    
    const store = await Store.getStore();
    console.log('Current zones count:', store.zones?.length || 0);
    
    const initialLength = store.zones.length;
    const zoneToDelete = store.zones.find(zone => zone.id === id);
    
    if (zoneToDelete) {
      console.log('Zone to delete:', JSON.stringify(zoneToDelete, null, 2));
    }
    
    store.zones = store.zones.filter(zone => zone.id !== id);
    console.log('New zones count:', store.zones.length);
    
    if (store.zones.length === initialLength) {
      console.log('❌ Zone not found with ID:', id);
      return res.status(404).json({ message: 'Zone not found' });
    }
    
    console.log('💾 Saving store after zone deletion...');
    await store.save();
    
    console.log('✅ Zone deleted successfully');
    debugLog('DELETE Zone Success', {
      deletedZoneId: id,
      remainingZones: store.zones.length
    });
    
    res.json(store);
  } catch (err) {
    console.error('❌ Error deleting zone:', err);
    console.error('Stack trace:', err.stack);
    debugLog('DELETE Zone Error', { error: err.message, zoneId: req.params.id });
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;