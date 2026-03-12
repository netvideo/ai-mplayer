use std::fs::OpenOptions;
use std::io::Write;
use std::env;

// 日志函数，同时输出到控制台和文件
fn log_message(message: &str) {
    println!("{}", message);
    
    // 获取可执行文件所在目录
    if let Ok(exe_path) = env::current_exe() {
        if let Some(exe_dir) = exe_path.parent() {
            let log_path = exe_dir.join("test_log.log");
            
            // 写入日志文件
            if let Ok(mut log_file) = OpenOptions::new().create(true).append(true).open(&log_path) {
                if let Err(e) = writeln!(log_file, "{}", message) {
                    println!("Failed to write to log file: {}", e);
                } else {
                    println!("Log written to: {:?}", log_path);
                }
            } else {
                println!("Failed to open log file: {:?}", log_path);
            }
        } else {
            println!("Failed to get executable directory");
        }
    } else {
        println!("Failed to get executable path");
    }
}

fn main() {
    log_message("=== Starting test program ===");
    log_message("This is a test message");
    log_message("=== Test program completed ===");
    
    // 等待用户输入
    println!("Press Enter to exit...");
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
}
