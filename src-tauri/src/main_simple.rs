#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::webview::Color;
use tauri::Manager;

use base64::{engine::general_purpose::STANDARD as BASE64, Engine as _};
use std::fs;
use tauri::command;

#[command]
fn read_file_base64(path: String) -> Result<String, String> {
    let data = fs::read(&path).map_err(|e| format!("Failed to read file: {}", e))?;
    Ok(BASE64.encode(&data))
}

#[derive(Default)]
struct AppState;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .manage(AppState)
        .setup(|app| {
            println!("=== App started with simple player ===");

            if let Some(window) = app.get_webview_window("main") {
                println!("=== Main window found ===");
                let _ = window.set_title("ai-mplayer - 智能媒体播放器");
                let _ = window.set_focus();

                // Set webview background to transparent
                #[cfg(target_os = "windows")]
                {
                    println!("=== Setting webview transparent background ===");

                    let webviews = window.webview_windows();
                    for (_id, webview) in webviews {
                        let _: Result<_, _> = webview.set_background_color(Some(Color(0, 0, 0, 0)));
                        let _: Result<_, _> =
                            webview.eval("document.body.style.background = 'transparent';");
                        let _: Result<_, _> = webview
                            .eval("document.documentElement.style.background = 'transparent';");
                        println!("=== Webview background set to transparent ===");
                    }
                }
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
