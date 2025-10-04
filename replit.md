# JoxAI Solutions Website

## Overview
This is a static website for JoxAI Solutions, a company offering AI, automation, and web development services. The website is built with pure HTML, CSS, and JavaScript, featuring modern animations, a chatbot interface, and interactive elements.

## Project Structure
```
joxaisolweb/
├── index.html          # Main landing page
├── about.html          # About page
├── portfolio.html      # Portfolio showcase
├── survey.html         # Customer feedback survey
├── css/                # All stylesheets
│   ├── styles.css      # Main styles
│   ├── animations.css  # Animation effects
│   ├── chatbot.css     # Chatbot styles
│   ├── portfolio.css   # Portfolio styles
│   └── responsive.css  # Mobile responsiveness
├── js/                 # JavaScript files
│   ├── main.js         # Core functionality
│   ├── animations.js   # Animation logic
│   ├── chatbot.js      # Chatbot functionality
│   ├── three-scene.js  # 3D visual effects
│   └── smooth-scroll.js
├── assets/             # Images and logos
├── components/         # Reusable HTML components
└── proyectos/          # Project detail pages

server.py               # Python HTTP server for development
```

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Libraries**: Three.js (3D graphics), Font Awesome (icons)
- **Server**: Python 3.11 HTTP server
- **Deployment**: Configured for Replit autoscale deployment

## Features
- Modern, responsive design
- Interactive chatbot assistant
- 3D visual effects with Three.js
- Portfolio showcase with project details
- Customer survey system
- Contact forms (Netlify Forms integration)
- Smooth scrolling animations
- Mobile-friendly navigation

## Development
The website runs on a Python HTTP server that serves static files from the `joxaisolweb` directory.

### Running Locally
The server is configured to run on:
- Host: 0.0.0.0 (accepts all connections)
- Port: 5000
- Cache control headers are disabled for development

### Cache Control
The server sends no-cache headers to prevent browser caching issues during development. This ensures changes are immediately visible without hard refreshes.

## Recent Changes
- **2025-10-04**: Complete Website Optimization & Standardization
  
  **Initial Setup:**
  - Installed Python 3.11 for static file serving
  - Created HTTP server with cache control headers
  - Configured workflow for development server
  - Set up deployment configuration for Replit autoscale
  
  **Design & UX Improvements:**
  - Fixed Open Graph meta tags (absolute URLs, proper syntax)
  - Added favicon to all pages to prevent 404 errors
  - Created comprehensive responsive.css for mobile/tablet/desktop support
  - Implemented design-improvements.css with modern color palette and effects
  - Updated all HTML pages with new styles and meta tags
  
  **Portfolio Page Redesign:**
  - Completely redesigned portfolio.html to match index.html modern design
  - Added identical hero section with Three.js 3D effects and floating cards
  - Removed all redundant inline particle scripts (400+ lines removed)
  - Unified with shared JavaScript files (three-scene.js, animations.js, main.js)
  - Removed duplicate navbar toggle code (now uses main.js)
  
  **Navigation Standardization (ALL 7 pages):**
  - Standardized navbar structure across index, about, portfolio, project-tour, and 3 project detail pages
  - Removed inconsistent nav-logo elements from project pages
  - Unified all navigation links (removed #inicio, now uses consistent paths)
  - Ensured identical menu order: Inicio → Servicios → Nosotros → Portafolio → Contacto
  - Mobile navigation (hamburger menu) works identically on all pages
  
  **Project Pages Enhancement:**
  - Enhanced all 3 project pages (chatbot-banco, ecommerce-seo, rpa-facturas)
  - Fixed navigation links (replaced broken #nosotros with ../about.html)
  - Added design-improvements.css and responsive.css
  - Fixed Open Graph images to use absolute URLs
  - Added mobile navigation with consistent toggle functionality
  - Added favicon to prevent 404 errors
  
  **Technical Fixes:**
  - Implemented depth-aware chatbot navigation with dynamic path calculation
  - Supports navigation from any directory level (multi-level nesting)
  - Fixed all CSS/JS paths to use correct relative paths (../ for subdirectories)
  - Removed ~400 lines of redundant inline code from portfolio.html
  - All pages now share the same scripts for consistency and maintainability
  
  **Code Quality:**
  - Eliminated code duplication across pages
  - Centralized navigation logic in main.js
  - Centralized animations in animations.js
  - Centralized 3D effects in three-scene.js
  - Improved maintainability and performance

  **Project Tour Page Enhancement (project-tour.html):**
  - Added extensive geometric shape animations to header
  - Implemented 17 different geometric elements (cubos, cuadrados, círculos, triángulos, hexágonos, líneas, anillos)
  - Created 11 dynamic animation keyframes (float3D, rotate360, pulse, drift, glow, spinAndFloat, rotateHex, lineSlide, lineGlow, ringPulse, twinkle)
  - 15 twinkling particles distributed across the header
  - Replaced inline navbar script with shared main.js for consistency
  - Optimized navbar alignment and button positioning
  - All animations work in harmony to create an energetic, modern aesthetic

  **Quote Widget System (Sistema de Cotizaciones):**
  - Removed "Consulta Gratuita" button from navbar
  - Created floating quote icon (calculator icon with purple gradient)
  - Implemented comprehensive quote request form connected to Netlify Forms
  - Smart conditional logic:
    * Project selection shows modification options
    * Contact preference (email/WhatsApp/SMS) shows phone field when needed
    * Quote type (General/Customizada/Normal) shows relevant options
    * General: displays Full-Pack info (Responsive + IA + Automation)
    * Customizada: shows checkbox selection of services
    * Normal: shows specific service selection with description field
  - Form validation and automatic submission handling
  - Success message with auto-close functionality
  - Responsive design for mobile/desktop
  - Files: quote-widget.css, quote-widget.js

  **Complete Mobile & Tablet Responsive Optimization:**
  - **Horizontal overflow fixes:**
    * html/body overflow-x: hidden on tablets (≤1024px) and mobile (≤768px)
    * Universal max-width: 100% on all elements
    * max-width: 100vw on containers and backgrounds
  
  - **Breakpoint coverage:**
    * Tablets (≤1024px): Grid adjustments, widget positioning, overflow prevention
    * Mobile (≤768px): Touch-friendly buttons (44px min-height), single-column layouts
    * Small mobile (≤480px): Further text size reduction, simplified layouts
    * Landscape (≤500px height): Reduced vertical spacing, optimized modals
  
  - **Project Tour page responsive:**
    * Geometric shapes scaled down on mobile (35-50px)
    * Complex shapes hidden on very small screens
    * Modal and cards 100% width on mobile
    * Navbar simplified for mobile
  
  - **Widget optimizations:**
    * Quote widget: 95% width on mobile, 90vh max-height
    * Chatbot: Fullscreen when open on mobile
    * Survey: Adjusted positioning to avoid overlap
    * All widgets positioned correctly on tablets
  
  - **Touch-friendly improvements:**
    * 44px minimum touch targets (iOS guidelines)
    * 16px font-size on inputs (prevents iOS zoom)
    * Improved spacing between interactive elements
  
  - **Page-specific fixes:**
    * Portfolio: Responsive filters, 1-column grid on mobile
    * About: Team grid single column, adjusted padding
    * Project pages: Responsive hero, meta in column layout, results grid optimized
  
  - **Media elements:**
    * All images, videos, iframes: max-width: 100%, auto height
    * Prevent any element from causing horizontal scroll

## User Preferences
None specified yet.

## Notes
- The website uses Netlify Forms for contact and survey submissions
- External CDN dependencies: Three.js, Font Awesome, Google Fonts
- All content is in Spanish (target market: Latin America)
