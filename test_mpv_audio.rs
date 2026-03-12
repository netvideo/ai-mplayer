use libmpv_sys::*;
use std::ffi::{CStr, CString};
use std::ptr;

fn main() {
    unsafe {
        // 创建 MPV 实例
        let mpv = mpv_create();
        if mpv.is_null() {
            println!("Failed to create MPV instance");
            return;
        }
        
        // 设置音频输出设备为默认设备
        let audio_device = CString::new("auto").unwrap();
        mpv_set_option_string(mpv, CString::new("ao").unwrap().as_ptr(), audio_device.as_ptr());
        
        // 设置音量为 100
        mpv_set_option_string(mpv, CString::new("volume").unwrap().as_ptr(), CString::new("100").unwrap().as_ptr());
        
        // 启用音频
        mpv_set_option_string(mpv, CString::new("aid").unwrap().as_ptr(), CString::new("auto").unwrap().as_ptr());
        
        // 初始化 MPV
        if mpv_initialize(mpv) < 0 {
            println!("Failed to initialize MPV");
            mpv_destroy(mpv);
            return;
        }
        
        println!("MPV initialized successfully with audio enabled");
        
        // 加载测试文件
        let test_file = CString::new("f:\\2.mkv").unwrap();
        let args = vec![
            CString::new("loadfile").unwrap(),
            test_file,
        ];
        
        let mut c_args: Vec<*const i8> = args.iter().map(|s| s.as_ptr()).collect();
        c_args.push(ptr::null());
        
        if mpv_command(mpv, c_args.as_mut_ptr()) < 0 {
            println!("Failed to load media");
        } else {
            println!("Media loaded successfully");
            
            // 等待一段时间，让音频有时间播放
            std::thread::sleep(std::time::Duration::from_secs(10));
        }
        
        // 停止播放
        let stop_args = vec![
            CString::new("stop").unwrap(),
        ];
        
        let mut stop_c_args: Vec<*const i8> = stop_args.iter().map(|s| s.as_ptr()).collect();
        stop_c_args.push(ptr::null());
        
        mpv_command(mpv, stop_c_args.as_mut_ptr());
        
        // 销毁 MPV 实例
        mpv_destroy(mpv);
        println!("MPV instance destroyed");
    }
}