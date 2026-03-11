# Aesthetic Center Reservation System - Frontend

## Overview

This is a **full-stack developer test project** for **Mitoni Systems LLC**, implementing a comprehensive reservation management system for aesthetic centers. The frontend application provides an intuitive interface for managing staff, services, and appointment scheduling with advanced drag-and-drop functionality.

## 🏗️ Backend Repository

The backend API for this project is maintained in a separate repository:
**[Aesthetic Center Test Backend](https://github.com/nikatopu/aesthetic-center-test-backend)**

## 🚀 Technology Stack

- **React 18** - Modern React with Hooks and Context API
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **CSS3** - Modern styling with Flexbox, Grid, and animations
- **JavaScript ES6+** - Modern JavaScript features and syntax

## 🏛️ Architectural Choices

### Component Architecture

The application follows **Atomic Design principles**:

```
src/components/
├── atoms/           # Basic UI elements (Button, Modal, EmptyState, Toast)
└── organisms/       # Complex components (ReservationCard, Modals)
```

### State Management

- **Global Context** - Centralized state for specialists, services, and custom fields
- **Local State** - Component-specific state managed with useState/useEffect
- **Toast Context** - Global notification system with queue management

### Data Flow Pattern

```
API Client → Global Context → Page Components → Organisms → Atoms
```

## 📁 File Distribution & Structure

```
src/
├── api/
│   └── client.js              # Centralized API configuration and endpoints
├── components/
│   ├── atoms/
│   │   ├── Button/            # Reusable button component
│   │   ├── EmptyState/        # No-data state component
│   │   ├── Modal/             # Base modal with animations
│   │   └── Toast/             # Toast notification system
│   └── organisms/
│       ├── ReservationCard/   # Individual reservation display
│       ├── ReservationModal/  # Reservation CRUD modal
│       ├── ServiceModal/      # Service management modal
│       ├── StaffModal/        # Staff management modal
│       └── CustomFieldModal/  # Dynamic field creation
├── hooks/
│   └── useSchedule.jsx        # Custom hook for reservation logic
├── pages/
│   ├── Schedule/              # Main scheduling interface
│   ├── Services/              # Service & custom field management
│   └── Staff/                 # Staff member management
├── store/
│   └── GlobalContext.jsx     # Global state management
└── utils/
    ├── timeGrid.js            # Time slot calculations and positioning
    ├── reservationUtils.js    # Reservation data processing utilities
    └── testDeletedServices.js # Testing utilities for edge cases
```

## 🔌 API Integration & Setup

### API Client Configuration

```javascript
// src/api/client.js
const client = axios.create({
  baseURL: "http://localhost:5000/api",
});
```

### API Endpoints Structure

- **Specialists**: `/specialists` - CRUD operations for staff management
- **Services**: `/services` - Service management with custom fields
- **Custom Fields**: `/services/fields` - Dynamic field creation and ordering
- **Reservations**: `/reservations` - Appointment scheduling and management

### Request/Response Patterns

- **Consistent Error Handling** - Standardized error responses with toast notifications
- **Optimistic Updates** - UI updates before API confirmation for better UX
- **Data Validation** - Client-side validation before API requests

## 🎨 Key Features & Implementation

### 1. Interactive Schedule Grid

- **Drag & Drop Reservations** - Move appointments between specialists and time slots
- **Real-time Conflict Detection** - Visual feedback for scheduling conflicts
- **Synchronized Scrolling** - Time labels scroll with reservation grid
- **30-minute Time Slots** - Granular scheduling precision

### 2. Dynamic Service Management

- **Custom Fields** - Create and manage additional service properties
- **Column Reordering** - Drag-and-drop column organization with localStorage persistence
- **Field Deletion** - Safe removal of custom fields with data integrity checks

### 3. Robust Error Handling

- **Deleted Service Recovery** - Graceful handling of missing service references
- **Toast Notification System** - User-friendly error and success messaging
- **Data Integrity Validation** - Automatic cleanup of invalid references

### 4. Modern UI/UX Design

- **Responsive Layout** - Mobile-friendly design with flexible grids
- **Modern Animations** - Smooth transitions and hover effects
- **Accessibility Features** - ARIA labels, keyboard navigation, screen reader support
- **Professional Styling** - Consistent design system with modern aesthetics

## 🔧 Development Setup

### Prerequisites

- Node.js 14+ and npm
- Backend API running on `http://localhost:5000`

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm start
# Opens http://localhost:3000

# Build for production
npm run build

# Run tests
npm test
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

## 🧪 Testing Strategy

### Component Testing

- **Unit Tests** - Individual component functionality
- **Integration Tests** - Component interaction and data flow
- **Toast System Testing** - Notification queue and display logic

### Edge Case Handling

- **Deleted Services** - Reservations with missing service references
- **Drag & Drop Edge Cases** - Invalid drops and conflict resolution
- **Network Failures** - API error handling and user feedback

## 🚦 State Management Patterns

### Global Context Structure

```javascript
{
  specialists: [],      // Staff members data
  services: [],         // Available services
  customFields: [],     // Dynamic service fields
  refreshData: fn       // Centralized data refresh function
}
```

### Local State Patterns

- **Form Management** - Controlled components with validation
- **Modal States** - Open/close and data passing patterns
- **Drag States** - Drag position and conflict tracking

## 🔐 Data Integrity & Validation

### Client-Side Validation

- **Form Validation** - Required fields and data type checking
- **Service Reference Validation** - Ensure valid service IDs in reservations
- **Time Slot Validation** - Prevent scheduling conflicts

### Server Communication

- **Error Boundaries** - Graceful error handling and user feedback
- **Retry Logic** - Automatic retry for failed requests
- **Data Synchronization** - Consistent state between client and server

## 🎯 Performance Optimizations

### Rendering Optimizations

- **React.memo** - Prevent unnecessary re-renders
- **Virtual Scrolling** - Efficient handling of large time grids
- **Debounced Inputs** - Optimized search and filter performance

### State Management

- **Selective Re-renders** - Context splitting for performance
- **LocalStorage Caching** - Persist user preferences
- **Optimistic Updates** - Immediate UI feedback

## 📱 Responsive Design

### Breakpoint Strategy

- **Desktop First** - Primary development target
- **Tablet Adaptation** - Optimized touch interactions
- **Mobile Responsive** - Collapsed layouts and touch-friendly controls

### Touch Interactions

- **Mobile Drag & Drop** - Touch-optimized reservation moving
- **Gesture Support** - Swipe and tap interactions
- **Keyboard Navigation** - Full accessibility support

---

## 📝 License & Development Notes

This project was developed as a technical assessment for **Mitoni Systems LLC** to demonstrate full-stack development capabilities, modern React patterns, and professional software engineering practices.

**Developer**: Nika Topuria  
**Company**: Mitoni Systems LLC  
**Project Type**: Full-Stack Developer Assessment

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
