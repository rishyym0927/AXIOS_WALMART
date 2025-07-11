const mongoose = require('mongoose');

// Define schema for a product
const ProductSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  depth: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  price: {
    type: Number
  }
});

// Define schema for a shelf
const ShelfSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  zoneId: {
    type: String,
    required: true
  },
  isOverlapping: {
    type: Boolean,
    default: false
  },
  products: {
    type: [ProductSchema],
    default: []
  }
});

// Define schema for a zone
const ZoneSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  isOverlapping: {
    type: Boolean,
    default: false
  },
  shelves: {
    type: [ShelfSchema],
    default: []
  }
});

// Define schema for store layout
const StoreSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: true,
    default: 'main-store', // This is our single store identifier
    unique: true
  },
  width: {
    type: Number,
    required: true,
    default: 30
  },
  height: {
    type: Number,
    required: true,
    default: 20
  },
  zones: {
    type: [ZoneSchema],
    default: []
  }
}, { 
  timestamps: true 
});

// We'll use a fixed storeId to ensure we always work with the same store
StoreSchema.statics.getStore = async function() {
  const FIXED_STORE_ID = 'main-store'; // This is our single store identifier
  
  // Attempt to find the store with our fixed ID
  let store = await this.findOne({ storeId: FIXED_STORE_ID });
  
  // If no store exists yet, create a default one with our fixed ID
  if (!store) {
    const defaultZones = [
      {
        id: '1',
        name: 'Grocery',
        color: '#10b981',
        x: 2,
        y: 2,
        width: 12,
        height: 8,
        shelves: [
          {
            id: 'shelf-1',
            name: 'Main Display',
            category: 'general',
            x: 1,
            y: 1,
            width: 3,
            height: 1,
            zoneId: '1'
          },
          {
            id: 'shelf-2',
            name: 'Corner Unit',
            category: 'specialty',
            x: 5,
            y: 2,
            width: 2,
            height: 1.5,
            zoneId: '1'
          }
        ]
      },
      {
        id: '2',
        name: 'Electronics',
        color: '#3b82f6',
        x: 16,
        y: 2,
        width: 12,
        height: 8,
        shelves: [
          {
            id: 'shelf-3',
            name: 'Electronics Display',
            category: 'electronics',
            x: 2,
            y: 2,
            width: 4,
            height: 1,
            zoneId: '2'
          }
        ]
      },
      {
        id: '3',
        name: 'Cash Counter',
        color: '#f59e0b',
        x: 12,
        y: 12,
        width: 6,
        height: 4,
        shelves: []
      }
    ];
    
    store = await this.create({
      storeId: FIXED_STORE_ID, // Set the fixed ID
      width: 30,
      height: 20,
      zones: defaultZones
    });
  }
  
  return store;
};

module.exports = mongoose.model('Store', StoreSchema);
