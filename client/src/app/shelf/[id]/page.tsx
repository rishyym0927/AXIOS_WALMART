'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useShelfStore } from '@/store/useShelfStore';
import { useProductStore } from '@/store/useProductStore';
import { useStoreDesigner } from '@/store/useStoreDesigner';
import { 
  Package, ArrowLeft, Grid, TrendingUp, DollarSign, 
  BarChart3, AlertCircle, Plus, RefreshCw, Sparkles 
} from 'lucide-react';
import { Product, ShelfSlot, Shelf, Zone } from '@/types';
import { fetchShelvesForZone } from '@/services/storeService';
import AxiosAutoPlacement from '@/components/AxiosAutoPlacement';

export default function ShelfProductPage() {
  const params = useParams();
  const router = useRouter();
  const shelfId = params.id as string;
  
  const { shelves, loadShelvesForZone } = useShelfStore();
  const { store } = useStoreDesigner();
  const {
    currentShelfAnalysis,
    availableProducts,
    isLoading,
    loadShelfAnalysis,
    addProductToShelf,
    removeProductFromShelf,
    getProductsByCategory,
    moveProduct
  } = useProductStore();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [draggedProduct, setDraggedProduct] = useState<Product | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<'initial' | 'store' | 'shelves' | 'analysis' | 'complete'>('initial');
  
  // Find shelf and zone
  const [shelf, setShelf] = useState<Shelf | null>(null);
  const [zone, setZone] = useState<Zone | null>(null);

  // Initial load - get store data
  useEffect(() => {
    setLoadingState('store');
    
    // Ensure store data is loaded
    if (store.zones.length === 0) {
      // Load store data
      try {
        const fetchStore = async () => {
          try {
            // The store state has hydrated itself on mount
            console.log('Store loaded successfully');
            setLoadingState('shelves');
          } catch (error: any) {
            console.error('Failed to load store:', error);
            setPageError('Failed to load store data. Please try again later.');
          }
        };
        fetchStore();
      } catch (error: any) {
        console.error('Error in store loading:', error);
        setPageError('Failed to load store data. Please try again later.');
      }
    } else {
      setLoadingState('shelves');
    }
  }, []);

  // Once store is loaded, find the shelf and its zone
  useEffect(() => {
    if (loadingState !== 'shelves' || !shelfId) return;
    
    // First try to find shelf in current state
    const existingShelf = shelves.find(s => s.id === shelfId);
    
    if (existingShelf) {
      setShelf(existingShelf);
      const existingZone = store.zones.find(z => z.id === existingShelf.zoneId);
      if (existingZone) {
        setZone(existingZone);
        setLoadingState('analysis');
      } else {
        // Zone not found, need to load it
        setPageError(`Zone ${existingShelf.zoneId} not found for shelf ${shelfId}`);
      }
    } else {
      // If shelf not found in current state, we need to search through all zones
      console.log('Shelf not found in current state, searching zones...');
      
      const searchZones = async () => {
        try {
          // Look through all zones to find the shelf
          for (const zoneItem of store.zones) {
            console.log(`Checking zone ${zoneItem.id} for shelf ${shelfId}`);
            try {
              const zoneShelves = await fetchShelvesForZone(zoneItem.id);
              const foundShelf = zoneShelves.find(s => s.id === shelfId);
              if (foundShelf) {
                console.log(`Found shelf ${shelfId} in zone ${zoneItem.id}`);
                setShelf(foundShelf);
                setZone(zoneItem);
                loadShelvesForZone(zoneItem.id);
                setLoadingState('analysis');
                return;
              }
            } catch (error) {
              console.error(`Error checking zone ${zoneItem.id}:`, error);
            }
          }
          
          // If we get here, we didn't find the shelf in any zone
          setPageError(`Shelf ${shelfId} not found in any zone`);
        } catch (error) {
          console.error('Error searching for shelf:', error);
          setPageError('Failed to locate shelf. Please try again later.');
        }
      };
      
      searchZones();
    }
  }, [loadingState, shelfId, shelves, store.zones]);

  // Once shelf and zone are found, load shelf analysis
  useEffect(() => {
    if (loadingState !== 'analysis' || !shelf || !zone) return;
    
    console.log('Loading shelf analysis with zone:', zone.id, 'shelf:', shelf.id);
    // Convert shelf dimensions from meters to centimeters for slot calculation
    const shelfWidthCm = shelf.width * 100;
    const shelfHeightCm = shelf.height * 100;
    
    loadShelfAnalysis(shelf.id, shelfWidthCm, shelfHeightCm, shelf.category);
    setLoadingState('complete');
  }, [loadingState, shelf, zone]);

  // Show loading state
  if (loadingState !== 'complete' || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-700">
            {loadingState === 'store' && "Loading store data..."}
            {loadingState === 'shelves' && "Finding shelf information..."}
            {loadingState === 'analysis' && "Loading product data..."}
            {loadingState === 'complete' && isLoading && "Processing shelf analysis..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error if there is one
  if (pageError || !shelf || !zone || !currentShelfAnalysis) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <div className="flex">
            <AlertCircle className="h-6 w-6 mr-2" />
            <p>{pageError || "Shelf or zone not found. Please ensure the shelf exists and try again."}</p>
          </div>
          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Return to Dashboard
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { layout, metrics } = currentShelfAnalysis;
  const categoryProducts = getProductsByCategory(shelf.category);

  const handleSlotClick = (slot: ShelfSlot) => {
    if (slot.isOccupied) {
      // Remove product
      removeProductFromShelf(slot.id);
      setSelectedProduct(null);
    } else if (selectedProduct) {
      // Add product
      addProductToShelf(selectedProduct.id, slot.id);
      setSelectedProduct(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, product: Product) => {
    setDraggedProduct(product);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent, slot: ShelfSlot) => {
    e.preventDefault();
    if (draggedProduct && !slot.isOccupied) {
      addProductToShelf(draggedProduct.id, slot.id);
    }
    setDraggedProduct(null);
  };

  const handleSlotDragStart = (e: React.DragEvent, slot: ShelfSlot) => {
    if (slot.isOccupied && slot.productId) {
      e.dataTransfer.setData('slotId', slot.id);
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleSlotDrop = (e: React.DragEvent, targetSlot: ShelfSlot) => {
    e.preventDefault();
    const sourceSlotId = e.dataTransfer.getData('slotId');
    if (sourceSlotId && !targetSlot.isOccupied && sourceSlotId !== targetSlot.id) {
      moveProduct(sourceSlotId, targetSlot.id);
    }
  };

  const getProductInSlot = (slot: ShelfSlot): Product | undefined => {
    if (!slot.productId || !currentShelfAnalysis) return undefined;
    return currentShelfAnalysis.layout.products.find(p => p.id === slot.productId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with breadcrumbs */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => router.push(`/zone/${zone.id}`)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Zone
          </button>
          <span className="text-gray-500">/</span>
          <span className="font-medium">{shelf.name} Products</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{shelf.name}</h1>
        <div className="text-sm text-gray-500">
          {zone.name} - {shelf.category} shelf ({shelf.width}m × {shelf.height}m)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar - Available products */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Package className="mr-2 text-blue-600" />
              <h2 className="text-lg font-medium">Available Products</h2>
            </div>
            <div className="text-xs text-gray-500">
              {categoryProducts.length} products
            </div>
          </div>
          
          <p className="mb-4 text-sm text-gray-600">
            Drag products to the shelf or click to select, then click on an empty slot.
          </p>
          
          <div className="grid grid-cols-2 gap-2 max-h-[500px] overflow-y-auto">
            {categoryProducts.map(product => (
              <div
                key={product.id}
                className={`flex flex-col items-center p-2 rounded cursor-pointer transition-all ${
                  selectedProduct?.id === product.id
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
                style={{ minHeight: '90px' }}
                onClick={() => setSelectedProduct(product)}
                draggable
                onDragStart={(e) => handleDragStart(e, product)}
              >
                <div
                  className="w-8 h-8 mb-1 rounded"
                  style={{ backgroundColor: product.color }}
                ></div>
                <div className="text-xs text-center font-medium">{product.name}</div>
                <div className="text-xs">${product.price}</div>
              </div>
            ))}
          </div>
          
          {categoryProducts.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500">No products available for this category</p>
            </div>
          )}
        </div>

        {/* Main content - Shelf layout */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium flex items-center">
              <Grid className="mr-2 text-blue-600" />
              Shelf Layout
            </h2>
            
            <div className="flex gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span>{metrics.occupiedSlots} Filled</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-300 rounded-full mr-1"></div>
                <span>{metrics.totalSlots - metrics.occupiedSlots} Empty</span>
              </div>
            </div>
          </div>

          {/* Shelf instructions */}
          {showInstructions && (
            <div className="mb-6 bg-blue-50 border border-blue-100 rounded-md p-4 text-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-blue-800">Instructions</span>
                <button 
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => setShowInstructions(false)}
                >
                  Hide
                </button>
              </div>
              <ul className="text-blue-700 space-y-1">
                <li>• <strong>Click</strong> an empty slot to place the selected product</li>
                <li>• <strong>Click</strong> a filled slot to remove the product</li>
                <li>• <strong>Drag</strong> products directly from panel to slots</li>
                <li>• <strong>Drag</strong> products between slots to reorganize</li>
              </ul>
            </div>
          )}

          {/* Shelf Grid */}
          <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50 min-h-96">
            <div 
              className="grid gap-2 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
                gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
                maxWidth: '600px',
                aspectRatio: `${layout.columns} / ${layout.rows}`
              }}
            >
              {layout.slots.map((slot) => {
                const product = getProductInSlot(slot);
                return (
                  <div
                    key={slot.id}
                    className={`aspect-square border ${
                      slot.isOccupied
                        ? 'border-gray-400 bg-white'
                        : 'border-dashed border-gray-300 bg-gray-100'
                    } rounded overflow-hidden group relative`}
                    onClick={() => handleSlotClick(slot)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, slot)}
                    draggable={slot.isOccupied}
                    onDragStart={(e) => handleSlotDragStart(e, slot)}
                  >
                    {product ? (
                      <div
                        className="w-full h-full rounded-lg flex flex-col items-center justify-center text-white font-medium relative overflow-hidden cursor-move"
                        style={{ backgroundColor: product.color }}
                      >
                        <Package className="w-6 h-6 mb-1" />
                        <div className="text-xs text-center px-1 leading-tight">
                          {product.name.split(' ')[0]}
                        </div>
                        <div className="text-xs opacity-90">${product.price}</div>
                        
                        {/* Remove button */}
                        <button
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeProductFromShelf(slot.id);
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          {selectedProduct ? (
                            <span className="text-xs text-blue-600">Click to place</span>
                          ) : (
                            <span className="text-xs">Empty</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics footer */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Space Utilization</p>
            <p className="text-xl font-semibold">{metrics.utilization.toFixed(1)}%</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Fill Rate</p>
            <p className="text-xl font-semibold">
              {metrics.occupiedSlots} / {metrics.totalSlots} slots
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="rounded-full bg-amber-100 p-3 mr-4">
            <DollarSign className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Revenue Potential</p>
            <p className="text-xl font-semibold">${metrics.revenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* AI Product Placement */}
      <div className="mt-8">
        <AxiosAutoPlacement
          zone={zone}
          shelves={[shelf]}
          products={availableProducts}
          autoGenerate={true}
          onPlacementsGenerated={(result) => {
            console.log('AI Placement Results:', result);
            // Here you could automatically apply the placements or show them to the user
          }}
        />
      </div>
    </div>
  );
}
