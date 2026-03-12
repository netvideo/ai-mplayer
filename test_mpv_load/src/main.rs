use std::fs::OpenOptions;
use std::io::Write;
use std::env;
use std::path::Path;

// 日志函数，同时输出到控制台和文件
fn log_message(message: &str) {
    println!("{}", message);
    
    // 获取可执行文件所在目录
    if let Ok(exe_path) = env::current_exe() {
        if let Some(exe_dir) = exe_path.parent() {
            let log_path = exe_dir.join("mpv_load_test.log");
            
            // 写入日志文件
            if let Ok(mut log_file) = OpenOptions::new().create(true).append(true).open(&log_path) {
                if let Err(e) = writeln!(log_file, "{}", message) {
                    println!("Failed to write to log file: {}", e);
                }
            }
        }
    }
}

fn main() {
    log_message("=== Starting MPV load test program ===");
    
    // 获取当前工作目录
    if let Ok(cwd) = env::current_dir() {
        log_message(&format!("Current working directory: {:?}", cwd));
    }
    
    // 获取可执行文件路径
    if let Ok(exe_path) = env::current_exe() {
        log_message(&format!("Executable path: {:?}", exe_path));
        
        // 检查 libmpv-2.dll 文件是否存在
        if let Some(exe_dir) = exe_path.parent() {
            let dll_path = exe_dir.join("libmpv-2.dll");
            if dll_path.exists() {
                log_message(&format!("libmpv-2.dll found at: {:?}", dll_path));
            } else {
                log_message(&format!("libmpv-2.dll not found at: {:?}", dll_path));
                return;
            }
        }
    }
    
    // 尝试加载 libmpv-2.dll
    log_message("=== Trying to load libmpv-2.dll ===");
    unsafe {
        let lib = match libloading::Library::new("libmpv-2.dll") {
            Ok(lib) => {
                log_message("=== libmpv-2.dll loaded successfully ===");
                lib
            },
            Err(e) => {
                log_message(&format!("=== Failed to load libmpv-2.dll: {} ===", e));
                return;
            }
        };
        
        // 尝试获取 mpv_create 函数
        type MpvCreateFn = unsafe extern "C" fn() -> *mut std::os::raw::c_void;
        match lib.get::<MpvCreateFn>(b"mpv_create") {
            Ok(mpv_create) => {
                log_message("=== mpv_create function found ===");
                
                // 尝试调用 mpv_create 函数
                let mpv = mpv_create();
                if !mpv.is_null() {
                    log_message("=== mpv_create called successfully ===");
                } else {
                    log_message("=== mpv_create returned null ===");
                }
            },
            Err(e) => {
                log_message(&format!("=== Failed to get mpv_create function: {} ===", e));
            }
        }
    }
    
    log_message("=== MPV load test completed ===");
    
    // 等待用户输入
    println!("Press Enter to exit...");
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
}
