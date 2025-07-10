# Store Layout Server Integration

This document explains how to integrate the store layout server with the client application.

## Client Integration

1. The `storeService.ts` file provides all necessary functions to interact with the server API.
2. Import these functions in your components or store files:

```typescript
import { fetchStoreLayout, updateStoreDimensions, updateEntireStore, 
         addZone, updateZone, deleteZone } from '@/services/storeService';
```

## Integration with useStoreDesigner

You can modify the Zustand store to fetch and persist data to the server. Here's an example integration:

```typescript
// In useStoreDesigner.ts
import { fetchStoreLayout, updateStoreDimensions, 
         updateEntireStore, addZone as addZoneApi, 
         updateZone as updateZoneApi, 
         deleteZone as deleteZoneApi } from '@/services/storeService';

// Add loading state
isLoading: boolean;
loadStoreFromServer: () => Promise<void>;

// In the store initialization:
isLoading: false,

// Add this action
loadStoreFromServer: async () => {
  set({ isLoading: true });
  try {
    const storeData = await fetchStoreLayout();
    set({ 
      store: storeData,
      isLoading: false
    });
    get().detectOverlaps();
    get().calculateLayoutMetrics();
  } catch (error) {
    console.error('Error loading store from server:', error);
    set({ isLoading: false });
  }
},

// Modify existing actions to persist changes:
setStoreDimensions: async (width: number, height: number) => {
  try {
    const updatedStore = await updateStoreDimensions(width, height);
    set((state) => ({
      store: {
        ...state.store,
        width,
        height,
      },
    }));
    get().detectOverlaps();
    get().calculateLayoutMetrics();
  } catch (error) {
    console.error('Error updating store dimensions:', error);
  }
},

addZone: async (zoneData) => {
  try {
    const newZone = {
      ...zoneData,
      id: Date.now().toString(),
    };
    
    set((state) => ({
      store: {
        ...state.store,
        zones: [...state.store.zones, newZone],
      },
    }));
    
    // Persist to server
    await addZoneApi(newZone);
    
    get().detectOverlaps();
    get().calculateLayoutMetrics();
  } catch (error) {
    console.error('Error adding zone:', error);
  }
},
```

## Initial Data Loading

Load store data when your app initializes:

```typescript
// In app/layout.tsx or a top-level component:
import { useStoreDesigner } from '@/store/useStoreDesigner';
import { useEffect } from 'react';

export default function Layout({ children }) {
  const { loadStoreFromServer } = useStoreDesigner();
  
  useEffect(() => {
    loadStoreFromServer();
  }, [loadStoreFromServer]);
  
  return (
    // Your layout...
  );
}
```

## Error Handling

All service functions include proper error handling. You can enhance this by adding toast notifications or other UI feedback when API operations fail.
