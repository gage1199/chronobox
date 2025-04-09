# Chronobox Website

This repository contains the source code for the Chronobox website, a digital legacy video journal platform.

## Directory Structure

```
chronobox/
├── css/
│   ├── modules/
│   │   ├── variables.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   └── components.css
│   ├── main.css
│   └── animations.css
├── js/
│   ├── modules/
│   │   ├── auth.js
│   │   └── carousel.js
│   ├── utils/
│   │   ├── lazyLoad.js
│   │   └── errorMonitoring.js
│   ├── tests/
│   │   └── setup.test.js
│   ├── main.js
│   └── dashboard.js
├── dist/
│   ├── js/
│   │   ├── main.bundle.js
│   │   └── dashboard.bundle.js
│   └── styles.min.css
├── webpack.config.js
├── postcss.config.js
└── package.json
```

## Build System

The project uses a modern build system with:
- Webpack for JavaScript bundling and optimization
- PostCSS for CSS processing and optimization
- Babel for JavaScript transpilation

### Build Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Build for development
npm run build:dev

# Watch mode for development
npm run watch
```

## CSS Architecture

The CSS is organized in a modular structure:
- `variables.css`: Design tokens and CSS custom properties
- `base.css`: Reset and base styles
- `layout.css`: Grid and structural components
- `components.css`: Reusable UI components
- `animations.css`: Animation keyframes and transitions

## JavaScript Architecture

### Lazy Loading
The project implements lazy loading for optimal performance:
- Components are loaded on-demand using dynamic imports
- Error boundaries handle loading failures gracefully
- Built-in error monitoring and reporting

### Error Monitoring
Comprehensive error monitoring is implemented:
- Catches uncaught errors and unhandled promises
- Tracks resource loading failures
- Provides user-friendly error messages
- Ready for integration with error tracking services

### Code Splitting
The build system automatically:
- Splits code into manageable chunks
- Creates separate bundles for main and dashboard
- Optimizes vendor code splitting
- Implements efficient caching strategies

## Testing

Run the setup tests to verify the build:
```bash
# Include setup.test.js in your HTML
<script src="js/tests/setup.test.js"></script>
```

The tests verify:
- Lazy loading functionality
- CSS module presence
- Bundle loading
- Error monitoring

## Performance Optimizations

1. **JavaScript**
   - Code splitting and lazy loading
   - Tree shaking for unused code
   - Minification and compression

2. **CSS**
   - Modular architecture
   - Optimized build process
   - Minification and cleanup

3. **Error Handling**
   - Comprehensive error monitoring
   - User-friendly error messages
   - Production-ready error tracking

## Development Guidelines

1. **CSS Changes**
   - Add new styles to appropriate module files
   - Use CSS custom properties from variables.css
   - Follow BEM naming convention

2. **JavaScript Changes**
   - Use lazy loading for new features
   - Implement error handling
   - Add tests for new functionality

3. **Build Process**
   - Run tests before deployment
   - Verify bundle sizes
   - Check error monitoring

## Production Deployment

Before deploying to production:
1. Run full build: `npm run build`
2. Verify all tests pass
3. Check bundle sizes
4. Test error monitoring
5. Verify lazy loading 