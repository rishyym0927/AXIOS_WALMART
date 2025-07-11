import { Store, Zone } from '@/types';

// Use Next.js built-in dev detection
// const API_STORE_URL = process.env.NODE_ENV === 'production' 
//   ? 'https://proto-8b15.onrender.com/api/store'
//   : 'http://localhost:5000/api/store';

const API_STORE_URL = "https://proto-8b15.onrender.com/api/store"
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