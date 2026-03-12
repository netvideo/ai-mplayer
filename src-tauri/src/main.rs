#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use base64::engine::general_purpose::STANDARD as BASE64;
use base64::Engine;
use std::fs;
use std::io::Read;
use std::io::Write;
use std::path::PathBuf;
use tauri::Manager;

/// Get the secure storage directory
fn get_secure_dir(app_handle: &tauri::AppHandle) -> PathBuf {
    // Use Tauri 2.0 path API
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .expect("Failed to get app data directory");
    let secure_dir = app_dir.join("secure");

    // Create directory if it doesn't exist
    if !secure_dir.exists() {
        fs::create_dir_all(&secure_dir).expect("Failed to create secure directory");
    }

    secure_dir
}

/// Simple XOR encryption for sensitive data (base64 encoded)
/// Note: This provides basic obfuscation. For production, use proper encryption.
fn encrypt_data(data: &str, key: &[u8]) -> String {
    let encrypted: Vec<u8> = data
        .bytes()
        .enumerate()
        .map(|(i, b)| b ^ key[i % key.len()])
        .collect();
    BASE64.encode(&encrypted)
}

fn decrypt_data(encrypted: &str, key: &[u8]) -> Option<String> {
    let decoded = BASE64.decode(encrypted).ok()?;
    let decrypted: Vec<u8> = decoded
        .iter()
        .enumerate()
        .map(|(i, b)| b ^ key[i % key.len()])
        .collect();
    String::from_utf8(decrypted).ok()
}

fn get_encryption_key() -> Vec<u8> {
    // Generate a key based on machine-specific data
    // In production, this should use OS-level secure enclaves or keychains
    let machine_id = format!("{}", std::process::id());
    machine_id.bytes().collect()
}

/// Store a value securely
#[tauri::command]
fn secure_store_set(
    app_handle: tauri::AppHandle,
    key: String,
    value: String,
) -> Result<(), String> {
    let secure_dir = get_secure_dir(&app_handle);
    let file_path = secure_dir.join(format!("{}.enc", key));

    let encryption_key = get_encryption_key();
    let encrypted = encrypt_data(&value, &encryption_key);

    let mut file =
        fs::File::create(&file_path).map_err(|e| format!("Failed to create secure file: {}", e))?;

    file.write_all(encrypted.as_bytes())
        .map_err(|e| format!("Failed to write secure data: {}", e))?;

    Ok(())
}

/// Retrieve a value from secure storage
#[tauri::command]
fn secure_store_get(app_handle: tauri::AppHandle, key: String) -> Result<Option<String>, String> {
    let secure_dir = get_secure_dir(&app_handle);
    let file_path = secure_dir.join(format!("{}.enc", key));

    if !file_path.exists() {
        return Ok(None);
    }

    let mut file =
        fs::File::open(&file_path).map_err(|e| format!("Failed to open secure file: {}", e))?;

    let mut encrypted = String::new();
    file.read_to_string(&mut encrypted)
        .map_err(|e| format!("Failed to read secure data: {}", e))?;

    let encryption_key = get_encryption_key();
    let decrypted = decrypt_data(&encrypted, &encryption_key)
        .ok_or_else(|| "Failed to decrypt data".to_string())?;

    Ok(Some(decrypted))
}

/// Delete a value from secure storage
#[tauri::command]
fn secure_store_delete(app_handle: tauri::AppHandle, key: String) -> Result<(), String> {
    let secure_dir = get_secure_dir(&app_handle);
    let file_path = secure_dir.join(format!("{}.enc", key));

    if file_path.exists() {
        fs::remove_file(&file_path).map_err(|e| format!("Failed to delete secure file: {}", e))?;
    }

    Ok(())
}

/// Get window handle (for libmpv integration)
#[tauri::command]
fn get_window_hwnd(window: tauri::Window) -> String {
    #[cfg(target_os = "windows")]
    {
        let hwnd = window.hwnd().unwrap().0 as usize;
        hwnd.to_string()
    }
    #[cfg(not(target_os = "windows"))]
    {
        String::new()
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_libmpv::init())
        .invoke_handler(tauri::generate_handler![
            get_window_hwnd,
            secure_store_set,
            secure_store_get,
            secure_store_delete,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
