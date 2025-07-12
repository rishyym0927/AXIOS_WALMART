import { Store, Zone, Shelf, Product } from '@/types';

// Use Next.js built-in dev detection
// const API_STORE_URL = process.env.NODE_ENV === 'production' 
//   ? 'https://proto-8b15.onrender.com/api/store'
//   : 'http://localhost:5000/api/store';

const API_STORE_URL = "http://localhost:5000/api/store"
const API_SHELVES_URL = "http://localhost:5000/api/shelves"
const API_PRODUCTS_URL = "http://localhost:5000/api/products"
console.log('Environment:', process.env.NODE_ENV);
console.log('API URL:', API_STORE_URL);

// Service to interact with the store layout API
export async function fetchStoreLayout(): Promise<Store> {
  try {
    console.log('Fetching store layout from:', API_STORE_URL);
    const response = await fetch(API_STORE_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch store layout: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Store layout fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching store layout:', error);
    throw error;
  }
}

export async function updateStoreDimensions(width: number, height: number): Promise<Store> {
  try {
    console.log('Updating store dimensions:', { width, height });
    const response = await fetch(`${API_STORE_URL}/dimensions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ width, height }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update store dimensions: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Store dimensions updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error updating store dimensions:', error);
    throw error;
  }
}

export async function updateEntireStore(storeData: Store): Promise<Store> {
  try {
    console.log('Updating entire store:', storeData);
    const response = await fetch(API_STORE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(storeData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update store layout: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Store layout updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error updating store layout:', error);
    throw error;
  }
}

export async function addZone(zoneData: Omit<Zone, 'id'>): Promise<Store> {
  try {
    console.log('Adding zone:', zoneData);
    const response = await fetch(`${API_STORE_URL}/zones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(zoneData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add zone: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Zone added successfully:', data);
    return data;
  } catch (error) {
    console.error('Error adding zone:', error);
    throw error;
  }
}

export async function updateZone(zoneId: string, updates: Partial<Zone>): Promise<Store> {
  try {
    console.log('Updating zone:', zoneId, updates);
    const response = await fetch(`${API_STORE_URL}/zones/${zoneId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update zone: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Zone updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error updating zone:', error);
    throw error;
  }
}

export async function deleteZone(zoneId: string): Promise<Store> {
  try {
    console.log('Deleting zone:', zoneId);
    const response = await fetch(`${API_STORE_URL}/zones/${zoneId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete zone: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Zone deleted successfully:', data);
    return data;
  } catch (error) {
    console.error('Error deleting zone:', error);
    throw error;
  }
}

// Shelf services
export async function fetchShelvesForZone(zoneId: string): Promise<Shelf[]> {
  try {
    console.log('Fetching shelves for zone:', zoneId);
    const response = await fetch(`${API_SHELVES_URL}/${zoneId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch shelves: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Shelves fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching shelves:', error);
    throw error;
  }
}

export async function addShelf(zoneId: string, shelfData: Omit<Shelf, 'id'>): Promise<Shelf> {
  try {
    console.log('Adding shelf to zone:', zoneId, shelfData);
    const response = await fetch(`${API_SHELVES_URL}/${zoneId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shelfData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add shelf: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Shelf added successfully:', data);
    return data;
  } catch (error) {
    console.error('Error adding shelf:', error);
    throw error;
  }
}

export async function updateShelf(zoneId: string, shelfId: string, updates: Partial<Shelf>): Promise<Shelf> {
  try {
    console.log('Updating shelf:', shelfId, 'in zone:', zoneId, updates);
    const response = await fetch(`${API_SHELVES_URL}/${zoneId}/${shelfId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update shelf: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Shelf updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error updating shelf:', error);
    throw error;
  }
}

export async function deleteShelf(zoneId: string, shelfId: string): Promise<void> {
  try {
    console.log('Deleting shelf:', shelfId, 'from zone:', zoneId);
    const response = await fetch(`${API_SHELVES_URL}/${zoneId}/${shelfId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete shelf: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    console.log('Shelf deleted successfully');
  } catch (error) {
    console.error('Error deleting shelf:', error);
    throw error;
  }
}

export async function deleteAllShelvesInZone(zoneId: string): Promise<void> {
  try {
    console.log('Deleting all shelves in zone:', zoneId);
    const response = await fetch(`${API_SHELVES_URL}/${zoneId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete shelves: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    console.log('All shelves in zone deleted successfully');
  } catch (error) {
    console.error('Error deleting all shelves:', error);
    throw error;
  }
}

// Product API Services

export async function fetchProductsForShelf(zoneId: string, shelfId: string): Promise<Product[]> {
  try {
    console.log(`Fetching products for shelf ${shelfId} in zone ${zoneId}`);
    const response = await fetch(`${API_PRODUCTS_URL}/${zoneId}/${shelfId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const products = await response.json();
    console.log(`Found ${products.length} products for shelf ${shelfId}`);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function addProductToShelf(zoneId: string, shelfId: string, product: Omit<Product, 'id'>): Promise<Product> {
  try {
    console.log(`Adding product to shelf ${shelfId} in zone ${zoneId}`);
    const response = await fetch(`${API_PRODUCTS_URL}/${zoneId}/${shelfId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add product: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const newProduct = await response.json();
    console.log('Product added successfully:', newProduct);
    return newProduct;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

export async function removeProductFromShelf(zoneId: string, shelfId: string, productId: string): Promise<void> {
  try {
    console.log(`Removing product ${productId} from shelf ${shelfId} in zone ${zoneId}`);
    const response = await fetch(`${API_PRODUCTS_URL}/${zoneId}/${shelfId}/${productId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to remove product: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    console.log('Product removed successfully');
  } catch (error) {
    console.error('Error removing product:', error);
    throw error;
  }
}

export async function updateProduct(zoneId: string, shelfId: string, productId: string, updates: Partial<Product>): Promise<Product> {
  try {
    console.log(`Updating product ${productId} in shelf ${shelfId}`);
    const response = await fetch(`${API_PRODUCTS_URL}/${zoneId}/${shelfId}/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update product: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const updatedProduct = await response.json();
    console.log('Product updated successfully:', updatedProduct);
    return updatedProduct;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}