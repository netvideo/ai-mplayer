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
        
        // 设置日志级别为 debug
        let log_level = CString::new("all=debug").unwrap();
        mpv_set_option_string(mpv, CString::new("msg-level").unwrap().as_ptr(), log_level.as_ptr());
        
        // 设置音频输出设备为 wasapi
        let audio_device = CString::new("wasapi").unwrap();
        let ao_result = mpv_set_option_string(mpv, CString::new("ao").unwrap().as_ptr(), audio_device.as_ptr());
        println!("Set audio output to wasapi: {}", ao_result);
        
        // 设置音量为 100
        let volume_result = mpv_set_option_string(mpv, CString::new("volume").unwrap().as_ptr(), CString::new("100").unwrap().as_ptr());
        println!("Set volume to 100: {}", volume_result);
        
        // 初始化 MPV
        let init_result = mpv_initialize(mpv);
        if init_result < 0 {
            println!("Failed to initialize MPV: {}", init_result);
            mpv_destroy(mpv);
            return;
        }
        println!("MPV initialized successfully, result: {}", init_result);
        
        // 加载测试文件
        let test_file = CString::new("f:\\2.mkv").unwrap();
        let args = vec![
            CString::new("loadfile").unwrap(),
            test_file,
        ];
        
        let mut c_args: Vec<*const i8> = args.iter().map(|s| s.as_ptr()).collect();
        c_args.push(ptr::null());
        
        println!("Loading media...");
        if mpv_command(mpv, c_args.as_mut_ptr()) < 0 {
            println!("Failed to load media");
        } else {
            println!("Media loaded successfully");
            
            // 等待一段时间，让媒体有时间加载
            std::thread::sleep(std::time::Duration::from_secs(5));
            
            // 检查媒体信息
            let media_title_ptr = mpv_get_property_string(mpv, CString::new("media-title").unwrap().as_ptr());
            if !media_title_ptr.is_null() {
                let media_title = CStr::from_ptr(media_title_ptr).to_string_lossy().to_string();
                println!("Media title: {}", media_title);
                mpv_free(media_title_ptr as *mut std::os::raw::c_void);
            }
            
            // 尝试获取音频相关信息
            let props = vec![
                "has-audio",
                "aid",
                "audio-codec",
                "audio-format",
                "audio-samplerate",
                "ao",
                "ao-name"
            ];
            
            for prop in &props {
                let prop_c = CString::new(*prop).unwrap();
                let prop_ptr = mpv_get_property_string(mpv, prop_c.as_ptr());
                if !prop_ptr.is_null() {
                    let prop_value = CStr::from_ptr(prop_ptr).to_string_lossy().to_string();
                    println!("{}: {}", prop, prop_value);
                    mpv_free(prop_ptr as *mut std::os::raw::c_void);
                } else {
                    println!("{}: (null)", prop);
                }
            }
            
            // 尝试设置音频轨道
            println!("Trying to set audio track to 1...");
            let set_aid_args = vec![
                CString::new("set").unwrap(),
                CString::new("aid").unwrap(),
                CString::new("1").unwrap(),
            ];
            
            let mut set_aid_c_args: Vec<*const i8> = set_aid_args.iter().map(|s| s.as_ptr()).collect();
            set_aid_c_args.push(ptr::null());
            
            let set_aid_result = mpv_command(mpv, set_aid_c_args.as_mut_ptr());
            println!("Set audio track to 1: {}", set_aid_result);
            
            // 再次检查音频相关信息
            println!("After setting audio track:");
            for prop in &props {
                let prop_c = CString::new(*prop).unwrap();
                let prop_ptr = mpv_get_property_string(mpv, prop_c.as_ptr());
                if !prop_ptr.is_null() {
                    let prop_value = CStr::from_ptr(prop_ptr).to_string_lossy().to_string();
                    println!("{}: {}", prop, prop_value);
                    mpv_free(prop_ptr as *mut std::os::raw::c_void);
                } else {
                    println!("{}: (null)", prop);
                }
            }
            
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
