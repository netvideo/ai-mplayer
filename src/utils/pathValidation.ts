/**
 * Path validation utilities to prevent path traversal attacks
 */

// Dangerous path patterns to detect
const DANGEROUS_PATTERNS = [
  /\.\./,           // Parent directory references
  /\/etc\//,        // System directories (Linux/macOS)
  /\/proc\//,       // Process info
  /\/sys\//,        // System info
  /C:\\\\Windows\\/, // Windows system
  /C:\\\\Program\s*(Files|Data)/i,
  /%.*%/,           // Environment variable expansion
  /^~/,             // Home directory shorthand (unexpanded)
];

// Allowed file extensions for media files
const ALLOWED_MEDIA_EXTENSIONS = [
  '.mp4', '.m4v', '.mkv', '.avi', '.mov', '.wmv',
  '.flv', '.webm', '.mpg', '.mpeg', '.m2v', '.ts',
  '.3gp', '.ogv', '.srt', '.ass', '.ssa', '.vtt',
  '.sub', '.idx'
];

/**
 * Validate and sanitize a file path
 * @param filePath The path to validate
 * @returns Sanitized path or null if invalid
 */
export function validateFilePath(filePath: string): string | null {
  if (!filePath || typeof filePath !== 'string') {
    return null;
  }

  // Normalize path separators
  let normalized = filePath.replace(/\\/g, '/');

  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(normalized)) {
      console.warn(`Path validation failed: dangerous pattern detected in "${filePath}"`);
      return null;
    }
  }

  // Check file extension
  const extension = normalized.toLowerCase().slice(normalized.lastIndexOf('.'));
  if (!ALLOWED_MEDIA_EXTENSIONS.includes(extension)) {
    console.warn(`Path validation failed: unsupported extension "${extension}"`);
    return null;
  }

  // Remove null bytes
  normalized = normalized.replace(/\0/g, '');

  return normalized;
}

/**
 * Check if a path is within allowed directories
 * @param filePath The path to check
 * @returns True if path is safe
 */
export function isPathSafe(filePath: string): boolean {
  if (!validateFilePath(filePath)) {
    return false;
  }

  // Additional checks for Windows
  if (filePath.match(/^[A-Z]:\\\\/i)) {
    // Block system drives except user directories
    const systemPaths = ['C:\\\\Windows', 'C:\\\\Program Files', 'C:\\\\ProgramData'];
    for (const sysPath of systemPaths) {
      if (filePath.toLowerCase().startsWith(sysPath.toLowerCase())) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Extract filename from a path safely
 * @param filePath The path
 * @returns Safe filename or null
 */
export function getSafeFilename(filePath: string): string | null {
  if (!filePath) return null;
  
  const normalized = filePath.replace(/\\/g, '/');
  const parts = normalized.split('/');
  const filename = parts[parts.length - 1];
  
  // Validate filename
  if (!filename || filename.length > 255) {
    return null;
  }
  
  // Check for dangerous characters
  if (/[<>:"|?*\x00-\x1f]/.test(filename)) {
    return null;
  }
  
  return filename;
}

/**
 * Sanitize a string for safe use in file paths
 * @param input The string to sanitize
 * @returns Sanitized string
 */
export function sanitizeFilename(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/[\\/<>:"|?*\x00-\x1f]/g, '_')  // Replace dangerous chars
    .replace(/\s+/g, ' ')                      // Normalize whitespace
    .trim()                                    // Remove leading/trailing spaces
    .slice(0, 255);                            // Limit length
}

/**
 * Validate a URL for safe external API calls
 * @param url The URL to validate
 * @returns True if URL is safe
 */
export function isValidApiUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const parsed = new URL(url);
    
    // Require HTTPS for external APIs
    if (parsed.protocol !== 'https:') {
      // Allow localhost HTTP for development
      if (parsed.hostname !== 'localhost' && parsed.hostname !== '127.0.0.1') {
        return false;
      }
    }
    
    // Block dangerous schemes
    if (['javascript:', 'data:', 'vbscript:', 'file:'].includes(parsed.protocol)) {
      return false;
    }
    
    // Block private IP ranges for external APIs
    if (parsed.hostname.match(/^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate Ollama endpoint URL
 * @param endpoint The endpoint URL
 * @returns True if valid Ollama endpoint
 */
export function isValidOllamaEndpoint(endpoint: string): boolean {
  if (!isValidApiUrl(endpoint)) {
    return false;
  }

  try {
    const parsed = new URL(endpoint);
    
    // Ollama typically runs on localhost or local network
    if (parsed.hostname === 'localhost' || 
        parsed.hostname === '127.0.0.1' ||
        parsed.hostname.endsWith('.local')) {
      return true;
    }
    
    // For external endpoints, require HTTPS
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export default {
  validateFilePath,
  isPathSafe,
  getSafeFilename,
  sanitizeFilename,
  isValidApiUrl,
  isValidOllamaEndpoint,
  ALLOWED_MEDIA_EXTENSIONS,
};
