import React, { useEffect, useState } from 'react';
import { useProductStore } from '@/store/useProductStore';
import { useShelfStore } from '@/store/useShelfStore';
import { useStoreDesigner } from '@/store/useStoreDesigner';
import { Product, ShelfSlot, Zone } from '@/types';
import { Package, Grid, TrendingUp, DollarSign, X, Maximize2, Minimize2, BarChart3, AlertCircle } from 'lucide-react';

interface ShelfAnalyserProps {
  shelfId: string;
  onClose: () => void;
}

export const ShelfAnalyser: React.FC<ShelfAnalyserProps> = ({ shelfId, onClose }) => {
  const { shelves, updateShelf } = useShelfStore();
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
  const [isMaximized, setIsMaximized] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const shelf = shelves.find(s => s.id === shelfId);
  const zone = shelf ? store.zones.find((z: Zone) => z.id === shelf.zoneId) : null;

  useEffect(() => {
    if (shelf && zone) {
      // Convert shelf dimensions from meters to centimeters for slot calculation
      const shelfWidthCm = shelf.width * 100;
      const shelfHeightCm = shelf.height * 100;
      loadShelfAnalysis(shelfId, shelfWidthCm, shelfHeightCm, shelf.category);
    }
  }, [shelfId, shelf?.width, shelf?.height, shelf?.category]); // Fixed: removed function dependencies

  // Update shelf metrics in the shelf store when products change
  useEffect(() => {
    if (currentShelfAnalysis && shelf) {
      // Update the shelf with product information for zone-level metrics
      const updatedShelf = {
        ...shelf,
        products: currentShelfAnalysis.layout.products,
        utilization: currentShelfAnalysis.metrics.utilization,
        revenue: currentShelfAnalysis.metrics.revenue
      };
      updateShelf(shelf.id, updatedShelf);
    }
  }, [currentShelfAnalysis?.metrics?.utilization, currentShelfAnalysis?.metrics?.revenue, currentShelfAnalysis?.layout?.products?.length, shelf?.id]); // Fixed: removed function dependencies and use specific values

  if (!shelf || !zone) {
    return (
      <div className="p-4">
        <div className="text-red-500">Shelf or zone not found</div>
      </div>
    );
  }

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

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <div className="mt-2 text-center">Loading shelf analysis...</div>
        </div>
      </div>
    );
  }

  if (!currentShelfAnalysis) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md text-center">
          <div className="text-gray-500 mb-4">
            <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900">No Shelf Analysis Available</h3>
            <p className="text-gray-600 mt-2">
              Unable to load product analysis for {shelf.name}.
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const { layout, metrics } = currentShelfAnalysis;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${isMaximized ? '' : 'p-8'}`}>
      <div className={`bg-white rounded-lg shadow-xl flex flex-col transition-all duration-300 ${
        isMaximized ? 'w-full h-full' : 'w-full max-w-7xl h-5/6'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Product Manager</h2>
              <p className="text-sm text-gray-600">
                {shelf.name} in {zone.name} ({shelf.category})
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Quick Metrics */}
            <div className="flex gap-4 mr-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{metrics.utilization.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">Usage</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">${metrics.revenue.toFixed(0)}</div>
                <div className="text-xs text-gray-500">Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-700">{metrics.occupiedSlots}/{metrics.totalSlots}</div>
                <div className="text-xs text-gray-500">Slots</div>
              </div>
            </div>
            
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title={isMaximized ? "Minimize" : "Maximize"}
            >
              {isMaximized ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Shelf Layout */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Shelf Layout</h3>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-600">
                    {layout.rows} × {layout.columns} grid ({metrics.totalSlots} slots)
                  </div>
                  {showInstructions && (
                    <button
                      onClick={() => setShowInstructions(false)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Hide tips
                    </button>
                  )}
                </div>
              </div>
              
              {showInstructions && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 text-sm mb-2">💡 How to manage products:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Click</strong> a product from the right panel to select it</li>
                    <li>• <strong>Click</strong> an empty slot to place the selected product</li>
                    <li>• <strong>Click</strong> a filled slot to remove the product</li>
                    <li>• <strong>Drag</strong> products directly from panel to slots</li>
                    <li>• <strong>Drag</strong> products between slots to reorganize</li>
                  </ul>
                </div>
              )}
            </div>

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
                      className={`
                        aspect-square border-2 rounded-lg cursor-pointer transition-all relative group
                        ${slot.isOccupied 
                          ? 'border-blue-500 shadow-lg transform hover:scale-105' 
                          : 'border-gray-300 border-dashed hover:border-blue-400 hover:bg-blue-50'
                        }
                        ${selectedProduct && !slot.isOccupied 
                          ? 'bg-blue-100 border-blue-500 animate-pulse' 
                          : ''
                        }
                      `}
                      onClick={() => handleSlotClick(slot)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, slot)}
                      draggable={slot.isOccupied}
                      onDragStart={(e) => handleSlotDragStart(e, slot)}
                      title={product ? `${product.name} - $${product.price} (drag to move)` : 'Empty slot - Click to place product'}
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
                            <Package size={20} className="mx-auto mb-1 opacity-50" />
                            <div className="text-xs">Empty</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel - Products & Metrics */}
          <div className="w-80 border-l bg-gray-50 flex flex-col">
            
            {/* Detailed Metrics */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 size={16} className="text-blue-600" />
                <h3 className="text-lg font-semibold">Analytics</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{metrics.utilization.toFixed(1)}%</div>
                  <div className="text-xs text-gray-600">Utilization</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">${metrics.revenue.toFixed(2)}</div>
                  <div className="text-xs text-gray-600">Revenue</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{metrics.occupiedSlots}</div>
                  <div className="text-xs text-gray-600">Products</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">{metrics.totalSlots - metrics.occupiedSlots}</div>
                  <div className="text-xs text-gray-600">Empty</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Capacity</span>
                  <span>{metrics.occupiedSlots}/{metrics.totalSlots}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(metrics.utilization, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Product Selection */}
            <div className="flex-1 p-4 overflow-auto">
              <h3 className="text-lg font-semibold mb-3">
                Available Products ({shelf.category})
              </h3>
              
              {selectedProduct && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm text-blue-800">Selected Product:</div>
                  <div className="font-medium text-blue-900">{selectedProduct.name}</div>
                  <div className="text-sm text-blue-700">${selectedProduct.price}</div>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                  >
                    Clear selection
                  </button>
                </div>
              )}

              <div className="space-y-2">
                {categoryProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`
                      p-3 border rounded-lg cursor-pointer transition-all
                      ${selectedProduct?.id === product.id 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
                      }
                    `}
                    onClick={() => setSelectedProduct(
                      selectedProduct?.id === product.id ? null : product
                    )}
                    draggable
                    onDragStart={(e) => handleDragStart(e, product)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded flex items-center justify-center"
                          style={{ backgroundColor: product.color }}
                        >
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{product.name}</div>
                          <div className="text-xs text-gray-500">
                            {product.width}×{product.height}×{product.depth}cm
                          </div>
                        </div>
                      </div>
                      {product.price && (
                        <div className="text-sm font-semibold text-green-600">
                          ${product.price}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {categoryProducts.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No products available for this category</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
