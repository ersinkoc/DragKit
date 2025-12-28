# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-12-28

### Added

#### Core Features
- ✨ Zero-dependency drag and drop system with micro-kernel architecture
- 🎯 Draggable elements with customizable handles and previews
- 📦 Droppable zones with type-based acceptance filtering
- 📋 Sortable lists (vertical and horizontal)
- 🔲 Sortable grids with column support
- 🎨 FLIP animation system for smooth reordering
- 🔍 Multiple collision detection algorithms (rectangle, center, pointer, closest)

#### Core Plugins (Auto-loaded)
- **drag-manager** - Draggable element lifecycle and state management
- **drop-manager** - Droppable zone registration and accept logic
- **sortable-engine** - List and grid sorting with animation
- **pointer-sensor** - Mouse and pointer event handling with activation constraints
- **touch-sensor** - Touch event support for mobile devices
- **collision-detector** - Hit testing with multiple algorithms

#### Type System
- 📝 Full TypeScript support with strict mode
- 🔒 Complete type definitions for all APIs
- ✅ Type-safe event system
- 🎯 Generics for plugin and event handlers

#### Utilities
- 🧰 Array manipulation (arrayMove, arrayInsert, arrayRemove, arraySwap)
- 📐 Geometry calculations (collision, center, distance)
- 🌐 DOM utilities (scrollable ancestors, cloning, visibility)
- 🎬 Animation utilities (FLIP technique)
- 📜 Scroll utilities (auto-scroll calculations)

#### Developer Experience
- 📦 Dual package (ESM + CJS)
- 🌳 Tree-shakeable exports
- 📖 Comprehensive inline documentation (JSDoc)
- 🎨 Clean, intuitive API design
- ⚡ Bundle size < 5KB (core)

### Technical Details

#### Architecture
- Implemented micro-kernel pattern with plugin registry
- Type-safe event bus for inter-component communication
- Plugin system with lifecycle hooks
- Lazy-loadable optional plugins

#### Browser API Usage
- PointerEvents API for unified input handling
- TouchEvents for mobile support
- MutationObserver (ready for future features)
- ResizeObserver (ready for future features)
- requestAnimationFrame for smooth animations
- getBoundingClientRect for position calculations

#### Build & Tooling
- **tsup** for bundling (ESM + CJS)
- **TypeScript 5.3** with strict mode
- **Vitest** for testing framework
- **ESLint** for code quality
- **GitHub Actions** for CI/CD

### Package Information

- **Package Name**: `@oxog/dragkit`
- **Version**: 1.0.0
- **Bundle Size**: 14.55 KB (not minified), target < 5KB minified+gzipped
- **Dependencies**: 0 (zero runtime dependencies)
- **License**: MIT
- **Author**: Ersin KOÇ
- **Repository**: https://github.com/ersinkoc/dragkit
- **Homepage**: https://dragkit.oxog.dev

### Browser Support

- Chrome 55+
- Firefox 52+
- Safari 13+
- Edge 79+
- Mobile Safari 13+
- Chrome Android 55+

### Notes

This is the initial release of DragKit. The package provides a solid foundation for drag and drop interactions with:
- Production-ready core functionality
- Extensible plugin architecture
- Framework adapters (React, Vue, Svelte) planned for future releases
- Optional plugins (keyboard, auto-scroll, multi-drag, etc.) planned for future releases

[1.0.0]: https://github.com/ersinkoc/dragkit/releases/tag/v1.0.0
