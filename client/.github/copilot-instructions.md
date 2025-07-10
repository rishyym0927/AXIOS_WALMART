# Copilot Instructions

This is a Next.js 14 store layout designer application with the following tech stack:

- **Framework**: Next.js 14 with App Router and TypeScript
- **Styling**: Tailwind CSS for responsive design
- **State Management**: Zustand for global state
- **3D Graphics**: Three.js with React Three Fiber for interactive 2D layout canvas
- **AI Integration**: Google Gemini AI for layout suggestions
- **Icons**: Lucide React for UI icons

## Project Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Reusable React components
  - `Sidebar.tsx` - Left sidebar for store dimensions and zone management
  - `LayoutCanvas.tsx` - Three.js powered 2D canvas for interactive layout
  - `AIAssistant.tsx` - Right panel for AI-generated layout suggestions
- `src/store/` - Zustand state management
- `src/services/` - External service integrations (AI service)
- `src/types/` - TypeScript type definitions

## Key Features

1. **Interactive 2D Canvas**: Zones are draggable, resizable, and editable using Three.js
2. **Zone Management**: Add, edit, delete zones with customizable properties
3. **AI Suggestions**: Gemini AI generates optimized layouts based on store dimensions
4. **Responsive Design**: Works on desktop and tablet devices
5. **Real-time Updates**: All changes reflect immediately in the canvas

## Development Guidelines

- Use TypeScript for all components and ensure type safety
- Follow React best practices with hooks and functional components
- Keep components modular and focused on single responsibilities
- Use Tailwind CSS classes for styling
- Maintain clean separation between UI, state, and business logic

## Environment Variables

- `NEXT_PUBLIC_GEMINI_API_KEY` - Required for AI layout suggestions
