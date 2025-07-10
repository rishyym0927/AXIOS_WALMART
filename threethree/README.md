# Store Layout Designer

A modern, interactive web application for designing 2D store layouts with AI-powered optimization suggestions built with Next.js 14 and Three.js.

## Features

- **Interactive 2D Canvas**: Design store layouts using a Three.js powered interactive grid
- **Zone Management**: Add, edit, and delete zones (Grocery, Electronics, Cash Counter, etc.)
- **Drag & Drop**: Zones are fully draggable and resizable within the store boundaries
- **AI Suggestions**: Get optimal layout recommendations using Google Gemini AI
- **Real-time Updates**: All changes reflect immediately across the interface
- **Responsive Design**: Works seamlessly on desktop and tablet devices
- **Default Layout**: Starts with a 30m × 20m store with 3 pre-defined zones

## Tech Stack

- **Next.js 14** - React framework with App Router
- **React 18** - Component-based UI library
- **TypeScript** - Type-safe development
- **Three.js + React Three Fiber** - 3D graphics and interactive canvas
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first styling
- **Google Gemini AI** - AI-powered layout optimization
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd threethree
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Add your Gemini API key to `.env.local`:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.
