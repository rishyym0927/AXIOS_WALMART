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
   
   Add your API keys to `.env.local`:
   ```
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   CLERK_SECRET_KEY=your_clerk_secret_key_here
   
   # Google Gemini AI
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   To get your Clerk keys:
   - Sign up at [Clerk Dashboard](https://dashboard.clerk.com/)
   - Create a new application
   - Copy the Publishable Key and Secret Key from the API Keys section

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting

### Authentication Issues

**Problem**: Getting "The default export is not a React Component" error or infinite loading on authentication pages.

**Solution**:
1. Ensure you have properly set up your Clerk environment variables in `.env.local`
2. Check that your Clerk application is properly configured in the [Clerk Dashboard](https://dashboard.clerk.com/)
3. Make sure the domain in your Clerk settings matches your development URL (http://localhost:3000)
4. Clear your browser cache and cookies
5. Restart the development server after adding environment variables

**Problem**: Infinite loading or authentication not working.

**Possible causes and solutions**:
- **Missing environment variables**: Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set
- **Incorrect Clerk configuration**: Check your Clerk dashboard settings
- **Network issues**: Check if you can access clerk.com and your internet connection
- **Development server issues**: Try restarting with `npm run dev`

### Backend Connection Issues

**Problem**: "Connection Error" or infinite loading when accessing the app.

**Solution**:
1. Ensure the backend server is running (check the server directory)
2. Verify the backend is accessible on the expected port
3. Check network connectivity
4. The backend may take 30-60 seconds to start up initially
