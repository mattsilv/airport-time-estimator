# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

**Development:**
- `npm start` - Start development server with HTTPS on localhost:3000
- `npm run start-remote` - Start dev server accessible on local network
- `npm run build` - Build production version
- `npm test` - Run test suite

**Local Development Notes:**
- Dev server runs with HTTPS using auto-generated certificates (via scripts/generate-cert.js)
- Build process runs with CI=false to avoid treating warnings as errors

## Architecture Overview

**Core Structure:**
- React SPA that calculates optimal airport departure time based on user inputs
- Uses React Router for navigation, Bootstrap for styling, CSS modules for component styles
- Form state managed through custom hooks with URL parameter persistence

**Key Data Flow:**
1. User inputs flight details in FlightForm component
2. useFlightForm hook orchestrates all form logic and calculations  
3. useFormState hook manages form persistence and URL synchronization
4. Calculation happens in useFlightForm useEffect when inputs change
5. Result displayed with calendar integration and receipt breakdown

**State Management:**
- Form state: useFormState hook with URL parameter persistence
- Theme: ThemeContext with localStorage and system preference detection
- No global state management library - uses React hooks and context

**External Integrations:**
- TomTom API for route calculation (requires REACT_APP_TOMTOM_API_KEY)
- Google Analytics 4 tracking
- Google Calendar integration for adding calculated times
- Airport data served from static JSON file

**Form Logic:**
- Base buffer time (30min) + anxiety level (5min per level) + optional buffers
- Checkbox options add specific time buffers (international +40min, TSA Pre +15min, etc.)
- Kids option applies 15% time multiplier to final calculation
- Airport autocomplete with geolocation for route calculation

**Component Organization:**
- /components: Reusable UI components
- /hooks: Custom hooks for form logic and state management  
- /services: External API integrations (TomTom routing)
- /utils: Pure utility functions for time/date formatting
- /config: Configuration objects for form fields and anxiety levels
- /styles: CSS modules for component styling + global theme variables

**Key Files:**
- useFlightForm.js: Main form logic and time calculations
- useFormState.js: Form persistence and URL parameter management
- FlightForm.js: Primary form component with all inputs
- tomtom.js: Route calculation service
- ThemeContext.js: Theme management with system preference detection