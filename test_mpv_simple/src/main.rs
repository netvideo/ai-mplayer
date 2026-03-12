use libmpv_sys::*;
use std::ffi::{CStr, CString};
use std::ptr;

fn main() {
    println!("Testing MPV initialization...");
    
    unsafe {
        // 创建 MPV 实例
        let mpv = mpv_create();
        if mpv.is_null() {
            println!("Failed to create MPV instance");
            return;
        }
        println!("MPV instance created successfully");
        
        // 初始化 MPV
        let init_result = mpv_initialize(mpv);
        if init_result < 0 {
            println!("Failed to initialize MPV: {}", init_result);
            mpv_destroy(mpv);
            return;
        }
        println!("MPV initialized successfully, result: {}", init_result);
        
        // 销毁 MPV 实例
        mpv_destroy(mpv);
        println!("MPV instance destroyed");
    }
    
    println!("Test completed successfully");
    println!("Press Enter to exit...");
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
}
