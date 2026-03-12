import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const args = process.argv.slice(2);
const mode = args[0] || 'simple';

const mainRsPath = path.join(projectRoot, 'src-tauri', 'src', 'main.rs');
const mainSimpleRsPath = path.join(projectRoot, 'src-tauri', 'src', 'main_simple.rs');
const mainMpvRsPath = path.join(projectRoot, 'src-tauri', 'src', 'main_mpv.rs');

const cargoTomlPath = path.join(projectRoot, 'src-tauri', 'Cargo.toml');

async function switchToSimple() {
  console.log('🔄 Switching to SIMPLE mode (no libmpv)...');

  if (fs.existsSync(mainRsPath) && !fs.existsSync(mainMpvRsPath)) {
    console.log('📦 Backing up mpv version...');
    fs.copyFileSync(mainRsPath, mainMpvRsPath);
  }

  if (fs.existsSync(mainSimpleRsPath)) {
    console.log('🔧 Using simple player...');
    fs.copyFileSync(mainSimpleRsPath, mainRsPath);
  }

  console.log('✅ Switched to SIMPLE mode. You can now run: npm run tauri:dev');
}

async function switchToMpv() {
  console.log('🔄 Switching to MPV mode...');

  if (fs.existsSync(mainMpvRsPath)) {
    console.log('🔧 Using mpv player...');
    fs.copyFileSync(mainMpvRsPath, mainRsPath);
    console.log('✅ Switched to MPV mode. Make sure libmpv is configured (see LIBMPV_SETUP.md)');
  } else {
    console.log('❌ main_mpv.rs not found. Make sure you have the mpv version.');
    process.exit(1);
  }
}

if (mode === 'simple') {
  await switchToSimple();
} else if (mode === 'mpv') {
  await switchToMpv();
} else {
  console.log('Usage: node scripts/switch-player.js [simple|mpv]');
  console.log('  simple - Use simplified player (no libmpv required)');
  console.log('  mpv    - Use libmpv player');
}
