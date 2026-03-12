# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with Tauri + React + TypeScript
- Basic player UI with Windows 11 style
- File open dialog integration
- Playback controls (play, pause, stop, seek)
- Volume control and mute functionality
- Time display and progress bar
- Keyboard shortcuts support
- Settings sidebar with tabs
- Help overlay system
- Internationalization (i18n) support
- Chinese and English locales
- Subtitle renderer placeholder
- Danmaku renderer placeholder

### Security
- Implemented secure storage for API keys
- Added path validation utilities
- Configured strict CSP policy
- Restricted file system permissions

## [1.0.0] - 2024-XX-XX

### Added

#### Core Player Features
- Real-time video decoding without transcoding
- Support for multiple video formats (MP4, MKV, AVI, etc.)
- Hardware acceleration support
- Drag and drop file opening
- Full keyboard shortcuts support
- Fullscreen mode
- Picture-in-picture mode

#### UI/UX
- Windows 11 style design
- Clean and intuitive interface
- Responsive layout
- Dark theme
- Smooth animations
- Touch-friendly controls

#### Media Controls
- Play/Pause/Stop
- Seek with progress bar
- Volume control (0-100%)
- Mute toggle
- Speed control (0.5x - 2x)
- Frame stepping

#### Settings
- Language selection
- Subtitle preferences
- Danmaku settings
- AI service configuration
- Hardware acceleration options

#### Internationalization
- Chinese (Simplified) support
- English support
- Easy to add more languages

#### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| Space | Play/Pause |
| F | Toggle fullscreen |
| M | Toggle mute |
| ← | Seek backward 5s |
| → | Seek forward 5s |
| ↑ | Volume up |
| ↓ | Volume down |
| C | Toggle subtitles panel |
| D | Toggle danmaku panel |
| H or ? | Show help |
| S | Open settings |

### Changed
- N/A (Initial release)

### Deprecated
- N/A (Initial release)

### Removed
- N/A (Initial release)

### Fixed
- N/A (Initial release)

### Security
- Implemented secure API key storage
- Added input validation for file paths
- Configured Content Security Policy

## [0.9.0] - Beta Release

### Added
- Beta testing features
- libmpv integration
- Basic subtitle support

### Known Issues
- Drag and drop needs improvement
- Subtitle synchronization pending
- Limited codec support

## [0.1.0] - Alpha Release

### Added
- Initial prototype
- Basic video playback
- Simple UI

---

## Version History

### Semantic Versioning

Given a version number MAJOR.MINOR.PATCH, increment the:

1. **MAJOR** version when you make incompatible API changes
2. **MINOR** version when you add functionality in a backwards compatible manner
3. **PATCH** version when you make backwards compatible bug fixes

### Pre-release Versions

- **Alpha**: Early testing, unstable
- **Beta**: Feature complete, testing phase
- **RC** (Release Candidate): Ready for release, final testing

---

## Release Checklist

Before each release:

- [ ] Update version numbers
- [ ] Update CHANGELOG.md
- [ ] Run full test suite
- [ ] Update documentation
- [ ] Check security advisories
- [ ] Build and test installer
- [ ] Create GitHub release
- [ ] Update website/download links
- [ ] Announce on social media

---

## Future Releases

### Planned for v1.1.0
- [ ] Enhanced subtitle system
- [ ] Complete libmpv integration
- [ ] Playlist support
- [ ] More video format support

### Planned for v1.2.0
- [ ] AI ASR subtitle recognition
- [ ] Real-time subtitle translation
- [ ] P2P danmaku system
- [ ] Video quality enhancement

### Planned for v2.0.0
- [ ] macOS and Linux support
- [ ] DLNA/UPnP casting
- [ ] Online streaming support
- [ ] Plugin system

---

**Note**: Dates are placeholders and should be updated with actual release dates.
