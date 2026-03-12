use libmpv_sys::*;
use std::ffi::{CStr, CString};
use std::fs::OpenOptions;
use std::io::Write;
use std::path::Path;
use std::ptr;
use std::env;
use std::thread;
use std::time::Duration;

// 日志函数，同时输出到控制台和文件
fn log_message(message: &str) {
    println!("{}", message);
    
    // 获取可执行文件所在目录
    if let Ok(exe_path) = env::current_exe() {
        if let Some(exe_dir) = exe_path.parent() {
            let log_path = exe_dir.join("mpv_audio_device_test.log");
            
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
    log_message("=== Starting MPV audio device test program ===");
    
    // 获取当前工作目录
    if let Ok(cwd) = env::current_dir() {
        log_message(&format!("Current working directory: {:?}", cwd));
    }
    
    // 获取可执行文件路径
    if let Ok(exe_path) = env::current_exe() {
        log_message(&format!("Executable path: {:?}", exe_path));
    }
    
    // 检查测试文件是否存在
    let test_file = "f:\\2.mkv";
    if Path::new(test_file).exists() {
        log_message(&format!("Test file exists: {}", test_file));
    } else {
        log_message(&format!("Test file does not exist: {}", test_file));
        return;
    }
    
    unsafe {
        log_message("=== Creating MPV instance ===");
        let mpv = mpv_create();
        if mpv.is_null() {
            log_message("=== Failed to create MPV instance ===");
            return;
        }
        log_message("=== MPV instance created ===");
        
        // 设置日志级别
        let log_level = CString::new("all=info").unwrap();
        mpv_set_option_string(mpv, CString::new("msg-level").unwrap().as_ptr(), log_level.as_ptr());
        log_message("=== Set log level to info ===");
        
        // 检查所有可用的音频输出设备
        log_message("=== Checking available audio output devices ===");
        let devices_ptr = mpv_get_property_string(mpv, CString::new("ao-list").unwrap().as_ptr());
        if !devices_ptr.is_null() {
            let devices = CStr::from_ptr(devices_ptr).to_string_lossy().to_string();
            log_message(&format!("=== Available audio output devices: {} ===", devices));
            mpv_free(devices_ptr as *mut std::os::raw::c_void);
        } else {
            log_message("=== No audio output devices found ===");
        }
        
        // 尝试不同的音频输出设备
        let audio_devices = vec!["wasapi", "directsound", "winmm", "auto"];
        for device in &audio_devices {
            let audio_device = CString::new(*device).unwrap();
            let ao_result = mpv_set_option_string(mpv, CString::new("ao").unwrap().as_ptr(), audio_device.as_ptr());
            log_message(&format!("=== Set audio output to {}: {} ===", device, ao_result));
            if ao_result == 0 {
                log_message(&format!("=== Using audio output device: {} ===", device));
                break;
            }
        }
        
        // 设置音量为 100
        let volume_result = mpv_set_option_string(mpv, CString::new("volume").unwrap().as_ptr(), CString::new("100").unwrap().as_ptr());
        log_message(&format!("=== Set volume to 100: {} ===", volume_result));
        
        // 禁用静音
        let mute_result = mpv_set_option_string(mpv, CString::new("mute").unwrap().as_ptr(), CString::new("no").unwrap().as_ptr());
        log_message(&format!("=== Set mute to no: {} ===", mute_result));
        
        // 启用音频
        let aid_result = mpv_set_option_string(mpv, CString::new("aid").unwrap().as_ptr(), CString::new("1").unwrap().as_ptr());
        log_message(&format!("=== Enable audio track 1: {} ===", aid_result));
        
        // 初始化 MPV
        log_message("=== Initializing MPV ===");
        let init_result = mpv_initialize(mpv);
        if init_result < 0 {
            log_message(&format!("=== Failed to initialize MPV: {} ===", init_result));
            mpv_destroy(mpv);
            return;
        }
        log_message(&format!("=== MPV initialized successfully, result: {} ===", init_result));
        
        // 再次检查可用的音频输出设备
        log_message("=== Checking available audio output devices after initialization ===");
        let devices_ptr = mpv_get_property_string(mpv, CString::new("ao-list").unwrap().as_ptr());
        if !devices_ptr.is_null() {
            let devices = CStr::from_ptr(devices_ptr).to_string_lossy().to_string();
            log_message(&format!("=== Available audio output devices: {} ===", devices));
            mpv_free(devices_ptr as *mut std::os::raw::c_void);
        } else {
            log_message("=== No audio output devices found ===");
        }
        
        // 加载测试文件
        let test_file_c = CString::new(test_file).unwrap();
        let args = vec![
            CString::new("loadfile").unwrap(),
            test_file_c,
        ];
        
        let mut c_args: Vec<*const i8> = args.iter().map(|s| s.as_ptr()).collect();
        c_args.push(ptr::null());
        
        log_message(&format!("=== Loading media file: {} ===", test_file));
        if mpv_command(mpv, c_args.as_mut_ptr()) < 0 {
            log_message("=== Failed to load media ===");
        } else {
            log_message("=== Media loaded successfully ===");
            
            // 等待媒体加载
            log_message("=== Waiting for media to load ===");
            thread::sleep(Duration::from_secs(3));
            
            // 检查音频状态
            let mut has_audio = false;
            let has_audio_result = mpv_get_property(mpv, CString::new("has-audio").unwrap().as_ptr(), mpv_format_MPV_FORMAT_FLAG, &mut has_audio as *mut _ as *mut _);
            log_message(&format!("=== Has audio: {}, result: {} ===", has_audio, has_audio_result));
            
            // 检查音频轨道
            let mut aid = 0;
            let aid_result = mpv_get_property(mpv, CString::new("aid").unwrap().as_ptr(), mpv_format_MPV_FORMAT_INT64, &mut aid as *mut _ as *mut _);
            log_message(&format!("=== Current audio track: {}, result: {} ===", aid, aid_result));
            
            // 检查音频编解码器
            let audio_codec_ptr = mpv_get_property_string(mpv, CString::new("audio-codec").unwrap().as_ptr());
            if !audio_codec_ptr.is_null() {
                let audio_codec = CStr::from_ptr(audio_codec_ptr).to_string_lossy().to_string();
                log_message(&format!("=== Audio codec: {} ===", audio_codec));
                mpv_free(audio_codec_ptr as *mut std::os::raw::c_void);
            } else {
                log_message("=== No audio codec found ===");
            }
            
            // 检查音频输出设备
            let audio_device_ptr = mpv_get_property_string(mpv, CString::new("ao").unwrap().as_ptr());
            if !audio_device_ptr.is_null() {
                let audio_device = CStr::from_ptr(audio_device_ptr).to_string_lossy().to_string();
                log_message(&format!("=== Current audio output device: {} ===", audio_device));
                mpv_free(audio_device_ptr as *mut std::os::raw::c_void);
            } else {
                log_message("=== No audio output device found ===");
            }
            
            // 检查音频输出名称
            let audio_out_ptr = mpv_get_property_string(mpv, CString::new("ao-name").unwrap().as_ptr());
            if !audio_out_ptr.is_null() {
                let audio_out = CStr::from_ptr(audio_out_ptr).to_string_lossy().to_string();
                log_message(&format!("=== Current audio output name: {} ===", audio_out));
                mpv_free(audio_out_ptr as *mut std::os::raw::c_void);
            } else {
                log_message("=== No audio output name found ===");
            }
            
            // 检查音量
            let mut volume = 0.0;
            let volume_result = mpv_get_property(mpv, CString::new("volume").unwrap().as_ptr(), mpv_format_MPV_FORMAT_DOUBLE, &mut volume as *mut _ as *mut _);
            log_message(&format!("=== Current volume: {}, result: {} ===", volume, volume_result));
            
            // 检查静音状态
            let mut muted = 0;
            let mute_result = mpv_get_property(mpv, CString::new("mute").unwrap().as_ptr(), mpv_format_MPV_FORMAT_FLAG, &mut muted as *mut _ as *mut _);
            log_message(&format!("=== Muted: {}, result: {} ===", muted, mute_result));
            
            // 尝试手动激活音频轨道
            if aid == 0 {
                log_message("=== Trying to set audio track to 1 ===");
                let set_aid = 1;
                let set_aid_result = mpv_set_property(mpv, CString::new("aid").unwrap().as_ptr(), mpv_format_MPV_FORMAT_INT64, &set_aid as *const _ as *mut _);
                log_message(&format!("=== Set audio track to 1: {} ===", set_aid_result));
                
                // 再次检查音频轨道
                let mut aid_after = 0;
                let aid_after_result = mpv_get_property(mpv, CString::new("aid").unwrap().as_ptr(), mpv_format_MPV_FORMAT_INT64, &mut aid_after as *mut _ as *mut _);
                log_message(&format!("=== After setting, audio track: {}, result: {} ===", aid_after, aid_after_result));
            }
            
            // 等待音频播放
            log_message("=== Playing audio for 10 seconds ===");
            thread::sleep(Duration::from_secs(10));
        }
        
        // 停止播放
        log_message("=== Stopping playback ===");
        let stop_args = vec![
            CString::new("stop").unwrap(),
        ];
        
        let mut stop_c_args: Vec<*const i8> = stop_args.iter().map(|s| s.as_ptr()).collect();
        stop_c_args.push(ptr::null());
        
        mpv_command(mpv, stop_c_args.as_mut_ptr());
        
        // 销毁 MPV 实例
        log_message("=== Destroying MPV instance ===");
        mpv_destroy(mpv);
        log_message("=== MPV instance destroyed ===");
    }
    
    log_message("=== Audio device test completed ===");
    log_message("=== Log file created: mpv_audio_device_test.log ===");
    
    // 等待用户输入
    println!("Press Enter to exit...");
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
}
