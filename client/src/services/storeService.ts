import { Store, Zone } from '@/types';

// Service to interact with the store layout API
export async function fetchStoreLayout(): Promise<Store> {
  try {
    const response = await fetch('http://localhost:5000/api/store');
    if (!response.ok) {
      throw new Error(`Failed to fetch store layout: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching store layout:', error);
    throw error;
  }
}

export async function updateStoreDimensions(width: number, height: number): Promise<Store> {
  try {
    const response = await fetch('http://localhost:5000/api/store/dimensions', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ width, height }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update store dimensions: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating store dimensions:', error);
    throw error;
  }
}

export async function updateEntireStore(storeData: Store): Promise<Store> {
  try {
    const response = await fetch('http://localhost:5000/api/store', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(storeData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update store layout: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating store layout:', error);
    throw error;
  }
}

export async function addZone(zoneData: Omit<Zone, 'id'>): Promise<Store> {
  try {
    const response = await fetch('http://localhost:5000/api/store/zones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(zoneData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add zone: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding zone:', error);
    throw error;
  }
}

export async function updateZone(zoneId: string, updates: Partial<Zone>): Promise<Store> {
  try {
    const response = await fetch(`http://localhost:5000/api/store/zones/${zoneId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update zone: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating zone:', error);
    throw error;
  }
}

export async function deleteZone(zoneId: string): Promise<Store> {
  try {
    const response = await fetch(`http://localhost:5000/api/store/zones/${zoneId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete zone: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting zone:', error);
    throw error;
  }
}
