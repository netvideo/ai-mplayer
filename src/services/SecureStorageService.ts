import { invoke } from '@tauri-apps/api/core';

/**
 * Secure storage service for sensitive data like API keys
 * Uses Tauri's secure storage via Rust backend
 */
class SecureStorageService {
  private static instance: SecureStorageService;
  private memoryCache: Map<string, string> = new Map();

  static getInstance(): SecureStorageService {
    if (!SecureStorageService.instance) {
      SecureStorageService.instance = new SecureStorageService();
    }
    return SecureStorageService.instance;
  }

  /**
   * Store a sensitive value securely
   * @param key The key to store under
   * @param value The sensitive value to store
   * @returns Promise that resolves when stored
   */
  async set(key: string, value: string): Promise<void> {
    try {
      // Store in OS-level secure storage via Rust
      await invoke('secure_store_set', { key, value });
      // Also cache in memory for this session
      this.memoryCache.set(key, value);
    } catch (error) {
      console.error(`Failed to securely store key "${key}":`, error);
      throw new Error(`Secure storage failed: ${error}`);
    }
  }

  /**
   * Retrieve a sensitive value from secure storage
   * @param key The key to retrieve
   * @returns The stored value or null if not found
   */
  async get(key: string): Promise<string | null> {
    try {
      // Check memory cache first
      if (this.memoryCache.has(key)) {
        return this.memoryCache.get(key) || null;
      }

      // Retrieve from OS-level secure storage
      const value = await invoke<string | null>('secure_store_get', { key });
      
      // Cache in memory for this session
      if (value) {
        this.memoryCache.set(key, value);
      }
      
      return value;
    } catch (error) {
      console.error(`Failed to retrieve secure key "${key}":`, error);
      return null;
    }
  }

  /**
   * Delete a value from secure storage
   * @param key The key to delete
   */
  async delete(key: string): Promise<void> {
    try {
      await invoke('secure_store_delete', { key });
      this.memoryCache.delete(key);
    } catch (error) {
      console.error(`Failed to delete secure key "${key}":`, error);
      throw new Error(`Secure storage delete failed: ${error}`);
    }
  }

  /**
   * Clear all cached values from memory
   * Call this when user logs out or on app shutdown
   */
  clearCache(): void {
    this.memoryCache.clear();
  }

  /**
   * Check if a key exists in secure storage
   * @param key The key to check
   * @returns True if key exists
   */
  async exists(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }
}

// Export singleton instance
export const secureStorage = SecureStorageService.getInstance();

// Export class for testing
export { SecureStorageService };
