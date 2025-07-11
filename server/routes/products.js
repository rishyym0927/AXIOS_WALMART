const express = require('express');
const router = express.Router();
const Store = require('../models/Store');

// Debug helper function
const debugLog = (operation, data) => {
  console.log(`\n🔍 PRODUCTS ROUTE DEBUG - ${operation.toUpperCase()}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  if (data) {
    console.log('Data:', JSON.stringify(data, null, 2));
  }
  console.log('=====================================\n');
};

// GET /api/products/:zoneId/:shelfId - Get all products for a specific shelf
router.get('/:zoneId/:shelfId', async (req, res) => {
  try {
    const { zoneId, shelfId } = req.params;
    
    debugLog('GET Products by Shelf', { zoneId, shelfId });
    
    console.log('📥 Fetching products for shelf:', shelfId, 'in zone:', zoneId);
    
    if (!zoneId) {
      console.log('❌ Missing zoneId parameter');
      return res.status(400).json({ message: 'Missing zoneId parameter' });
    }
    
    if (!shelfId) {
      console.log('❌ Missing shelfId parameter');
      return res.status(400).json({ message: 'Missing shelfId parameter' });
    }
    
    const store = await Store.getStore();
    
    // Verify we have zones data
    if (!store.zones || !Array.isArray(store.zones)) {
      console.log('❌ Store has no zones array');
      return res.status(500).json({ message: 'Store data is invalid' });
    }
    
    const zone = store.zones.find(zone => zone.id === zoneId);
    
    if (!zone) {
      console.log('❌ Zone not found with ID:', zoneId);
      return res.status(404).json({ message: `Zone not found with ID: ${zoneId}` });
    }
    
    // Verify zone has shelves data
    if (!zone.shelves || !Array.isArray(zone.shelves)) {
      console.log('⚠️ Zone has no shelves array, initializing empty array');
      zone.shelves = [];
    }
    
    const shelf = zone.shelves.find(shelf => shelf.id === shelfId);
    
    if (!shelf) {
      console.log('❌ Shelf not found with ID:', shelfId, 'in zone:', zoneId);
      return res.status(404).json({ message: `Shelf not found with ID: ${shelfId} in zone: ${zoneId}` });
    }
    
    // Ensure shelf has products array
    if (!shelf.products) {
      console.log('⚠️ Shelf has no products array, initializing empty array');
      shelf.products = [];
    }
    
    const products = shelf.products;
    console.log('✅ Found', products.length, 'products for shelf', shelfId, 'in zone', zoneId);
    debugLog('GET Products Success', {
      zoneId,
      shelfId,
      productsCount: products.length
    });
    
    res.json(products);
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    console.error('Stack trace:', err.stack);
    debugLog('GET Products Error', { 
      error: err.message, 
      zoneId: req.params.zoneId,
      shelfId: req.params.shelfId 
    });
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/products/:zoneId/:shelfId - Add a product to a shelf
router.post('/:zoneId/:shelfId', async (req, res) => {
  try {
    const { zoneId, shelfId } = req.params;
    const newProduct = req.body;
    
    debugLog('POST Product', { 
      zoneId,
      shelfId,
      productData: newProduct
    });
    
    console.log('➕ Adding new product to shelf:', shelfId, 'in zone:', zoneId);
    console.log('Product data:', JSON.stringify(newProduct, null, 2));
    
    // Parameter validation
    if (!zoneId) {
      console.log('❌ Missing zoneId parameter');
      return res.status(400).json({ message: 'Missing zoneId parameter' });
    }
    
    if (!shelfId) {
      console.log('❌ Missing shelfId parameter');
      return res.status(400).json({ message: 'Missing shelfId parameter' });
    }
    
    // Product data validation
    if (!newProduct.name || !newProduct.category || 
        !newProduct.width || !newProduct.height || !newProduct.depth) {
      console.log('❌ Validation failed: Missing required product properties');
      return res.status(400).json({ message: 'Missing required product properties' });
    }
    
    // Generate an ID if not provided
    if (!newProduct.id) {
      newProduct.id = `product-${Date.now()}`;
      console.log('🔧 Generated product ID:', newProduct.id);
    }
    
    const store = await Store.getStore();
    
    // Verify store has zones
    if (!store.zones || !Array.isArray(store.zones)) {
      console.log('❌ Store has no zones array');
      return res.status(500).json({ message: 'Store data is invalid' });
    }
    
    const zoneIndex = store.zones.findIndex(zone => zone.id === zoneId);
    
    if (zoneIndex === -1) {
      console.log('❌ Zone not found with ID:', zoneId);
      return res.status(404).json({ message: `Zone not found with ID: ${zoneId}` });
    }
    
    // Verify zone has shelves
    if (!store.zones[zoneIndex].shelves || !Array.isArray(store.zones[zoneIndex].shelves)) {
      console.log('❌ Zone has no shelves array');
      return res.status(404).json({ message: `Zone ${zoneId} has no shelves` });
    }
    
    const shelfIndex = store.zones[zoneIndex].shelves.findIndex(shelf => shelf.id === shelfId);
    
    if (shelfIndex === -1) {
      console.log('❌ Shelf not found with ID:', shelfId, 'in zone:', zoneId);
      return res.status(404).json({ message: `Shelf not found with ID: ${shelfId} in zone: ${zoneId}` });
    }
    
    // Initialize products array if it doesn't exist
    if (!store.zones[zoneIndex].shelves[shelfIndex].products) {
      console.log('🔧 Initializing products array for shelf');
      store.zones[zoneIndex].shelves[shelfIndex].products = [];
    }
    
    // Add product to shelf
    store.zones[zoneIndex].shelves[shelfIndex].products.push(newProduct);
    
    console.log('💾 Saving product to database...');
    await store.save();
    
    console.log('✅ Product added successfully to shelf:', shelfId, 'in zone:', zoneId);
    debugLog('POST Product Success', {
      zoneId,
      shelfId,
      productId: newProduct.id
    });
    
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('❌ Error adding product:', err);
    console.error('Stack trace:', err.stack);
    debugLog('POST Product Error', { 
      error: err.message, 
      zoneId: req.params.zoneId,
      shelfId: req.params.shelfId 
    });
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/products/:zoneId/:shelfId/:productId - Remove a product from a shelf
router.delete('/:zoneId/:shelfId/:productId', async (req, res) => {
  try {
    const { zoneId, shelfId, productId } = req.params;
    
    debugLog('DELETE Product', { zoneId, shelfId, productId });
    
    console.log('🗑️ Deleting product', productId, 'from shelf', shelfId, 'in zone:', zoneId);
    
    // Parameter validation
    if (!zoneId) {
      console.log('❌ Missing zoneId parameter');
      return res.status(400).json({ message: 'Missing zoneId parameter' });
    }
    
    if (!shelfId) {
      console.log('❌ Missing shelfId parameter');
      return res.status(400).json({ message: 'Missing shelfId parameter' });
    }
    
    if (!productId) {
      console.log('❌ Missing productId parameter');
      return res.status(400).json({ message: 'Missing productId parameter' });
    }
    
    const store = await Store.getStore();
    
    // Verify store has zones
    if (!store.zones || !Array.isArray(store.zones)) {
      console.log('❌ Store has no zones array');
      return res.status(500).json({ message: 'Store data is invalid' });
    }
    
    const zoneIndex = store.zones.findIndex(zone => zone.id === zoneId);
    
    if (zoneIndex === -1) {
      console.log('❌ Zone not found with ID:', zoneId);
      return res.status(404).json({ message: `Zone not found with ID: ${zoneId}` });
    }
    
    // Verify zone has shelves
    if (!store.zones[zoneIndex].shelves || !Array.isArray(store.zones[zoneIndex].shelves)) {
      console.log('❌ Zone has no shelves array');
      return res.status(404).json({ message: `Zone ${zoneId} has no shelves` });
    }
    
    const shelfIndex = store.zones[zoneIndex].shelves.findIndex(shelf => shelf.id === shelfId);
    
    if (shelfIndex === -1) {
      console.log('❌ Shelf not found with ID:', shelfId, 'in zone:', zoneId);
      return res.status(404).json({ message: `Shelf not found with ID: ${shelfId} in zone: ${zoneId}` });
    }
    
    const shelf = store.zones[zoneIndex].shelves[shelfIndex];
    
    // Verify shelf has products
    if (!shelf.products || !Array.isArray(shelf.products) || shelf.products.length === 0) {
      console.log('❌ No products found in shelf:', shelfId);
      return res.status(404).json({ message: `No products found in shelf: ${shelfId}` });
    }
    
    // Check if product exists before attempting to delete
    const productExists = shelf.products.some(product => product.id === productId);
    if (!productExists) {
      console.log('❌ Product not found with ID:', productId);
      return res.status(404).json({ message: `Product not found with ID: ${productId}` });
    }
    
    // Remove the product
    const initialLength = shelf.products.length;
    store.zones[zoneIndex].shelves[shelfIndex].products = 
      shelf.products.filter(product => product.id !== productId);
    
    const newLength = store.zones[zoneIndex].shelves[shelfIndex].products.length;
    console.log(`Removed product. Products before: ${initialLength}, after: ${newLength}`);
    
    console.log('💾 Saving changes to database...');
    await store.save();
    
    console.log('✅ Product deleted successfully from shelf:', shelfId, 'in zone:', zoneId);
    debugLog('DELETE Product Success', {
      zoneId,
      shelfId,
      productId
    });
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting product:', err);
    console.error('Stack trace:', err.stack);
    debugLog('DELETE Product Error', { 
      error: err.message, 
      zoneId: req.params.zoneId,
      shelfId: req.params.shelfId,
      productId: req.params.productId
    });
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/products/:zoneId/:shelfId/:productId - Update a product
router.patch('/:zoneId/:shelfId/:productId', async (req, res) => {
  try {
    const { zoneId, shelfId, productId } = req.params;
    const updates = req.body;
    
    debugLog('PATCH Product', { 
      zoneId, 
      shelfId, 
      productId,
      updates 
    });
    
    console.log('📝 Updating product', productId, 'in shelf', shelfId);
    console.log('Update data:', JSON.stringify(updates, null, 2));
    
    const store = await Store.getStore();
    const zoneIndex = store.zones.findIndex(zone => zone.id === zoneId);
    
    if (zoneIndex === -1) {
      console.log('❌ Zone not found with ID:', zoneId);
      return res.status(404).json({ message: 'Zone not found' });
    }
    
    const shelfIndex = store.zones[zoneIndex].shelves.findIndex(shelf => shelf.id === shelfId);
    
    if (shelfIndex === -1) {
      console.log('❌ Shelf not found with ID:', shelfId);
      return res.status(404).json({ message: 'Shelf not found' });
    }
    
    const productIndex = store.zones[zoneIndex].shelves[shelfIndex].products?.findIndex(
      product => product.id === productId
    );
    
    if (productIndex === -1 || productIndex === undefined) {
      console.log('❌ Product not found with ID:', productId);
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update product with new values
    const product = store.zones[zoneIndex].shelves[shelfIndex].products[productIndex];
    const updatedProduct = { ...product, ...updates };
    store.zones[zoneIndex].shelves[shelfIndex].products[productIndex] = updatedProduct;
    
    console.log('💾 Saving changes to database...');
    await store.save();
    
    console.log('✅ Product updated successfully');
    debugLog('PATCH Product Success', {
      zoneId,
      shelfId,
      productId,
      updates
    });
    
    res.json(updatedProduct);
  } catch (err) {
    console.error('❌ Error updating product:', err);
    console.error('Stack trace:', err.stack);
    debugLog('PATCH Product Error', { 
      error: err.message, 
      zoneId: req.params.zoneId,
      shelfId: req.params.shelfId,
      productId: req.params.productId
    });
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
