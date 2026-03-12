#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

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
        .invoke_handler(tauri::generate_handler![get_window_hwnd])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
