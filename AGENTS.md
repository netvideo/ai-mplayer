# AGENTS.md - Coding Guidelines for ai-mplayer

This file provides guidelines for AI agents working on the ai-mplayer codebase.

## Build Commands

### Frontend (React + TypeScript + Vite)
- `npm run dev` - Start development server (port 3001)
- `npm run build` - Build production frontend
- `npm run preview` - Preview production build

### Backend (Tauri + Rust)
- `npm run tauri:dev` - Start Tauri dev mode with hot reload
- `npm run tauri:build` - Build full application (requires libmpv DLL)
- `npm run copy:dlls` - Copy libmpv DLL to output directory

### Utility Scripts
- `npm run switch:simple` - Switch to simple player mode
- `npm run switch:mpv` - Switch to MPV player mode

## Testing Commands

**Note:** This project currently has no test framework configured. 

To add tests, consider:
- Vitest for frontend unit tests
- `cargo test` for Rust unit tests
- Playwright for E2E testing

To run a single test once added:
```bash
# Frontend (after adding Vitest)
npx vitest run src/path/to/test.ts

# Rust backend
cd src-tauri && cargo test test_name
```

## Code Style Guidelines

### TypeScript/JavaScript (Frontend)

#### Imports
- Use named imports for React hooks: `import { useState, useEffect } from 'react'`
- Order imports: React → Tauri API → Internal modules → Types
- Use absolute imports for internal modules: `import { useSettings } from '../contexts/SettingsContext'`

#### Formatting
- Use 2 spaces for indentation
- Prefer single quotes for strings
- Semicolons are required
- Max line length: 100 characters

#### Naming Conventions
- Components: PascalCase (e.g., `PlayerSimple`, `SubtitleRenderer`)
- Hooks: camelCase starting with "use" (e.g., `useSettings`, `useSubtitle`)
- Types/Interfaces: PascalCase (e.g., `PlaybackState`, `MediaInfo`)
- Constants: UPPER_SNAKE_CASE for true constants
- Files: PascalCase for components, camelCase for utilities

#### Types
- Always use TypeScript strict mode
- Define explicit return types for exported functions
- Use `type` for simple unions, `interface` for object shapes
- Avoid `any` - use `unknown` when type is uncertain

#### Error Handling
- Always wrap async operations in try/catch
- Use `console.error` for errors, `console.warn` for warnings
- Provide user-friendly error messages in UI
- Never silently fail operations

#### React Patterns
- Use functional components with hooks
- Prefer `useRef` for mutable values that don't trigger re-renders
- Clean up effects with return functions
- Use custom hooks for reusable logic (e.g., `useSettings`)

### Rust (Backend)

#### Naming Conventions
- Functions/Variables: snake_case
- Types/Structs: PascalCase
- Constants: UPPER_SNAKE_CASE
- Modules: snake_case

#### Error Handling
- Use `Result<T, E>` for fallible operations
- Prefer `?` operator over match for error propagation
- Log errors with `println!` or proper logging

#### Unsafe Code
- Minimize unsafe blocks
- Document why unsafe is necessary
- Keep unsafe blocks as small as possible

## Architecture

### Project Structure
```
src/
  components/     # React components
  contexts/       # React context providers
  services/       # Business logic (TauriPlayerService)
  types/          # TypeScript type definitions
  i18n/          # Internationalization

src-tauri/
  src/           # Rust source code
  lib/           # libmpv DLL files
  Cargo.toml     # Rust dependencies
  tauri.conf.json # Tauri configuration
```

### Key Patterns
- **State Management**: React Context for global state
- **Media Player**: Singleton service pattern (`TauriPlayerService`)
- **Video Rendering**: Uses tauri-plugin-libmpv with libmpv backend
- **Styling**: Tailwind CSS with custom theme

### MPV Integration
- Uses `tauri-plugin-libmpv-api` for JS→Rust→libmpv communication
- MPV options configured in `MpvConfig`:
  - `vo: gpu-next` - GPU-accelerated video output
  - `hwdec: auto-safe` - Hardware decoding
  - `keep-open: yes` - Keep media loaded
  - `force-window: yes` - Force window creation
  - `pause: yes` - Start paused
- **Required DLLs** (must be in `src-tauri/lib/`):
  - `libmpv-2.dll` (~120MB) - Core MPV library
  - `libmpv-wrapper.dll` - Tauri plugin interface
- **Window Configuration** (`tauri.conf.json`):
  - `transparent: true` - Required for video to render through WebView
- **CSS Requirements**:
  - Video container and parent elements must have transparent background
  - Use `style={{ background: 'transparent' }}` or `bg-transparent` class
- Use `setVideoMarginRatio()` to control video rendering area

## Important Notes

1. **Windows Platform**: Primary target platform
2. **libmpv DLL**: Must be present in `src-tauri/lib/` for builds
3. **File Paths**: Always normalize Windows paths (`\` → `/`)
4. **Async Operations**: MPV operations are async via Tauri invoke
5. **No Tests**: Currently no test infrastructure - add carefully if needed

## Dependencies to Know

- `tauri-plugin-libmpv-api` - MPV video playback
- `@tauri-apps/plugin-dialog` - Native file dialogs
- `react-i18next` - Internationalization
- `tailwindcss` - Styling
- `systeminformation` - System info gathering
