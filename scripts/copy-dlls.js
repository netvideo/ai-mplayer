import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const dllSource = path.join(projectRoot, 'libmpv', 'bin', 'libmpv-2.dll');
const debugTarget = path.join(projectRoot, 'src-tauri', 'target', 'debug');
const releaseTarget = path.join(projectRoot, 'src-tauri', 'target', 'release');

async function copyDll() {
  console.log('📦 Copying libmpv DLLs...');

  if (!fs.existsSync(dllSource)) {
    console.warn('⚠️ libmpv-2.dll not found at', dllSource);
    return;
  }

  [debugTarget, releaseTarget].forEach(target => {
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }

    const targetPath = path.join(target, 'libmpv-2.dll');
    fs.copyFileSync(dllSource, targetPath);
    console.log(`✅ Copied to ${targetPath}`);
  });

  console.log('✅ DLL copy complete!');
}

copyDll().catch(console.error);
