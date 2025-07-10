# Store Layout Designer - Architecture Documentation

## Overview

The Store Layout Designer is a modern, interactive web application built with Next.js 14 that enables users to design and optimize 2D store layouts using an interactive Three.js-powered canvas with AI-generated suggestions via Google Gemini AI.

## Tech Stack

### Core Framework & Libraries
- **Next.js 14** - React framework with App Router and TypeScript
- **React 18** - Component-based UI library with functional components and hooks
- **TypeScript** - Type-safe development environment
- **Tailwind CSS** - Utility-first CSS framework for responsive design

### 3D Graphics & Interaction
- **Three.js (v0.160.0)** - 3D graphics library for WebGL
- **React Three Fiber (v8.15.12)** - React renderer for Three.js
- **React Three Drei (v9.92.7)** - Useful helpers and abstractions for React Three Fiber

### State Management & Services
- **Zustand (v4.4.7)** - Lightweight state management solution
- **Google Generative AI (v0.2.1)** - AI integration for layout optimization
- **Lucide React (v0.263.1)** - Icon library for UI components

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Main application page
│   ├── globals.css              # Global styles and Tailwind imports
│   └── favicon.ico
├── components/                   # Reusable React components
│   ├── Navbar.tsx               # Top navigation bar
│   ├── Sidebar.tsx              # Left sidebar main component
│   ├── AIAssistant.tsx          # Right panel for AI suggestions
│   ├── Sidebar/                 # Sidebar sub-components
│   │   ├── StoreDimensions.tsx  # Store size configuration
│   │   ├── ZoneForm.tsx         # Add/edit zone form
│   │   ├── ZoneItem.tsx         # Individual zone list item
│   │   └── ZoneList.tsx         # Zone management list
│   └── LayoutCanvas/            # Three.js canvas components
│       ├── LayoutCanvas.tsx     # Main canvas component
│       ├── StoreFloor.tsx       # 3D floor mesh
│       ├── ZoneModel3D.tsx      # 3D zone representations
│       ├── ResizableZone.tsx    # Interactive 2D zone component
│       ├── GridLines.tsx        # Grid overlay
│       ├── CameraController.tsx # 2D orthographic camera
│       └── 3DCameraControls.tsx # 3D perspective camera controls
├── store/                       # State management
│   └── useStoreDesigner.ts      # Main Zustand store
├── services/                    # External service integrations
│   └── aiService.ts             # Google Gemini AI integration
├── types/                       # TypeScript type definitions
│   └── index.ts                 # Core type definitions
└── hooks/                       # Custom React hooks (placeholder)
```

## Core Types & Data Models

### Zone Interface
```typescript
interface Zone {
  id: string;              // Unique identifier
  name: string;            // Display name (e.g., "Grocery", "Electronics")
  color: string;           // Hex color for visual representation
  x: number;               // X position in meters
  y: number;               // Y position in meters
  width: number;           // Width in meters
  height: number;          // Height in meters
  isOverlapping?: boolean; // Overlap detection flag
}
```

### Store Interface
```typescript
interface Store {
  width: number;    // Store width in meters
  height: number;   // Store height in meters
  zones: Zone[];    // Array of zones in the store
}
```

### Layout Suggestion Interface
```typescript
interface LayoutSuggestion {
  id: string;           // Unique identifier
  name: string;         // Suggestion name
  description: string;  // Strategy description
  zones: Zone[];        // Optimized zone layout
  efficiency: number;   // Efficiency score (1-100)
}
```

### Layout Metrics Interface
```typescript
interface LayoutMetrics {
  utilization: number;      // Percentage of store area covered
  overlappingZones: boolean; // Whether any zones overlap
  unusedSpace: number;      // Square meters of unused space
}
```

## State Management Architecture

### Zustand Store (`useStoreDesigner.ts`)

The application uses a single Zustand store with the following state structure:

#### Core State
- `store: Store` - Main store data with dimensions and zones
- `selectedZone: Zone | null` - Currently selected zone
- `isEditingZone: boolean` - UI state for form editing
- `isGeneratingSuggestions: boolean` - AI loading state
- `suggestions: LayoutSuggestion[]` - AI-generated suggestions
- `is3DView: boolean` - View mode toggle
- `layoutMetrics: LayoutMetrics` - Calculated layout statistics

#### Key Actions
- **Store Management**: `setStoreDimensions`, `resetStore`
- **Zone Operations**: `addZone`, `updateZone`, `deleteZone`, `selectZone`
- **AI Integration**: `setSuggestions`, `setGeneratingSuggestions`, `applySuggestion`
- **Layout Analysis**: `detectOverlaps`, `calculateLayoutMetrics`, `optimizeLayout`
- **UI Controls**: `setEditingZone`, `toggle3DView`

#### Default Configuration
```typescript
const DEFAULT_STORE: Store = {
  width: 30,    // 30 meters
  height: 20,   // 20 meters
  zones: [
    { id: '1', name: 'Grocery', color: '#10b981', x: 2, y: 2, width: 12, height: 8 },
    { id: '2', name: 'Electronics', color: '#3b82f6', x: 16, y: 2, width: 12, height: 8 },
    { id: '3', name: 'Cash Counter', color: '#f59e0b', x: 12, y: 12, width: 6, height: 4 }
  ]
};
```

## Component Architecture

### Main Layout (`page.tsx`)
The root page component orchestrates the three main UI panels:
```typescript
<div className="flex flex-1 overflow-hidden">
  <Sidebar />                    // Left: Store config & zone management
  <div className="flex-1 p-6">
    <LayoutCanvas />             // Center: Interactive 3D/2D canvas
  </div>
  <div className="w-80 p-6">
    <AIAssistant />              // Right: AI suggestions panel
  </div>
</div>
```

### Left Sidebar Components

#### 1. **Sidebar.tsx** - Main Container
- Manages add zone form visibility
- Renders `StoreDimensions` and conditional forms
- Handles zone addition workflow

#### 2. **StoreDimensions.tsx** - Store Configuration
- Real-time dimension editing (width/height)
- Validation (5-100 meters range)
- Update confirmation with change detection

#### 3. **ZoneList.tsx** - Zone Management
- Displays all zones with metadata
- Handles edit mode switching
- Empty state management

#### 4. **ZoneItem.tsx** - Individual Zone Display
- Color indicator and zone details
- Edit/delete action buttons
- Selection highlighting

#### 5. **ZoneForm.tsx** - Zone Creation/Editing
- Form validation and submission
- Color picker (10 predefined colors)
- Position and dimension controls

### Center Canvas Components

#### 1. **LayoutCanvas.tsx** - Main Canvas Controller
- View mode switching (2D/3D)
- Camera management
- Zoom controls and optimization tools
- Layout metrics display

#### 2. **2D View Components**
- **ResizableZone.tsx**: Interactive zone manipulation
  - Drag and drop positioning
  - Corner and edge resizing
  - Real-time boundary validation
  - Visual feedback with handles
- **GridLines.tsx**: Visual grid overlay
- **CameraController.tsx**: Orthographic camera setup

#### 3. **3D View Components**
- **ZoneModel3D.tsx**: 3D zone representations
  - Animated selection effects
  - Height-based visualization
  - Overlap warning indicators
- **StoreFloor.tsx**: 3D floor mesh
- **3DCameraControls.tsx**: Orbit controls for 3D navigation

### Right Panel Components

#### **AIAssistant.tsx** - AI Integration Panel
- Suggestion generation triggers
- Layout strategy recommendations
- Suggestion application with confirmation
- Error handling and loading states

## Canvas & 3D Implementation

### Three.js Integration
The application uses React Three Fiber for declarative Three.js integration:

```typescript
<Canvas>
  {is3DView ? (
    <>
      <PerspectiveCamera makeDefault position={[...]} />
      <CameraControls3D />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      {/* 3D zone models */}
    </>
  ) : (
    <>
      <OrthographicCamera makeDefault />
      <CameraController />
      {/* 2D resizable zones */}
    </>
  )}
  <StoreFloor />
  <GridLines />
</Canvas>
```

### Interaction System
- **2D Mode**: Direct manipulation with drag/resize handles
- **3D Mode**: Orbit controls with click selection
- **Raycasting**: Mouse interaction detection
- **Real-time Updates**: Immediate visual feedback

### Visual Features
- Gradient backgrounds and lighting
- Color-coded zones with transparency
- Overlap detection with red highlighting
- Selection indicators and hover effects
- Responsive design with proper scaling

## AI Service Integration

### Google Gemini Integration (`aiService.ts`)

#### Core Functionality
```typescript
class AIService {
  private genAI: GoogleGenerativeAI | null = null;
  
  async generateLayoutSuggestions(
    storeWidth: number,
    storeHeight: number,
    existingZones: Zone[]
  ): Promise<LayoutSuggestion[]>
}
```

#### AI Prompt Strategy
The service generates contextual prompts that include:
- Store dimensions and current zone configuration
- Optimization strategies (customer flow, revenue, efficiency)
- Constraint requirements (no overlaps, zone preservation)
- JSON response format specification

#### Fallback System
- Graceful degradation when API is unavailable
- Predefined layout suggestions based on common retail patterns
- Error handling with user-friendly messages

#### Response Processing
- JSON parsing with validation
- Zone positioning optimization
- Boundary checking and overlap prevention
- Efficiency scoring integration

## Layout Analysis & Optimization

### Overlap Detection Algorithm
```typescript
const doZonesOverlap = (zone1: Zone, zone2: Zone): boolean => {
  return !(
    zone1.x + zone1.width <= zone2.x ||
    zone1.x >= zone2.x + zone2.width ||
    zone1.y + zone1.height <= zone2.y ||
    zone1.y >= zone2.y + zone2.height
  );
};
```

### Metrics Calculation
- **Space Utilization**: Percentage of store area covered by zones
- **Overlap Detection**: Boolean flag for any overlapping zones
- **Unused Space**: Calculated remaining floor area
- **Real-time Updates**: Triggered on any zone modification

### Automatic Layout Optimization
- Resolves overlaps through intelligent repositioning
- Maintains zone sizes while optimizing placement
- Uses grid-based positioning for clean layouts

## Performance Optimizations

### React Optimizations
- Dynamic imports for Three.js components (SSR compatibility)
- Memoized geometries and materials in 3D components
- Efficient state updates with Zustand

### Three.js Optimizations
- Reusable geometries and materials
- Proper cleanup in useEffect hooks
- Optimized raycasting for interactions

### Memory Management
- Component unmounting cleanup
- Camera position resets on view changes
- Event listener management

## Development Features

### TypeScript Integration
- Strict type checking enabled
- Comprehensive interface definitions
- Type-safe state management

### Hot Reload Support
- Next.js development server
- Component-level hot reloading
- State persistence during development

### Error Boundaries & Handling
- AI service error recovery
- Form validation with user feedback
- Canvas error fallbacks

## Environment Configuration

### Required Environment Variables
```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### Development Setup
```bash
npm install          # Install dependencies
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run start        # Production server
```

## Future Architecture Considerations

### Scalability Enhancements
- Backend API integration for data persistence
- User authentication and multi-store management
- Real-time collaboration features
- Advanced analytics and reporting

### Feature Extensions
- Import/export functionality
- Template library management
- Advanced 3D visualization with furniture
- Mobile-responsive touch interactions

### Performance Improvements
- WebGL optimization for large layouts
- Progressive loading for complex scenes
- Worker threads for heavy calculations
- Caching strategies for AI suggestions

## Browser Compatibility

### Supported Browsers
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### WebGL Requirements
- WebGL 2.0 support required for Three.js
- Hardware acceleration recommended
- Minimum 4GB RAM for optimal performance

This architecture provides a solid foundation for a modern, interactive store layout design application with room for future enhancements and scalability.
