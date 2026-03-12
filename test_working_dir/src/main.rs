use std::env;
use std::fs::File;
use std::io::Write;
use std::path::Path;

fn main() {
    // 获取当前工作目录
    let current_dir = env::current_dir().unwrap();
    println!("Current working directory: {:?}", current_dir);
    
    // 获取可执行文件路径
    let exe_path = env::current_exe().unwrap();
    println!("Executable path: {:?}", exe_path);
    
    // 检查libmpv-2.dll是否存在
    let dll_path = current_dir.join("libmpv-2.dll");
    println!("libmpv-2.dll exists: {}", dll_path.exists());
    
    // 检查测试文件是否存在
    let test_file = Path::new("f:\\2.mkv");
    println!("Test file exists: {}", test_file.exists());
    
    // 写入日志文件
    let log_path = current_dir.join("debug.log");
    let mut log_file = File::create(&log_path).unwrap();
    writeln!(log_file, "Current working directory: {:?}", current_dir).unwrap();
    writeln!(log_file, "Executable path: {:?}", exe_path).unwrap();
    writeln!(log_file, "libmpv-2.dll exists: {}", dll_path.exists()).unwrap();
    writeln!(log_file, "Test file exists: {}", test_file.exists()).unwrap();
    
    println!("Debug information written to: {:?}", log_path);
    println!("Press Enter to exit...");
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
}
