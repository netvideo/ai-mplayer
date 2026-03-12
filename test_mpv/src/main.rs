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
        
        // 设置日志级别为 verbose，以便查看更多调试信息
        let log_level = CString::new("all=debug").unwrap();
        mpv_set_option_string(mpv, CString::new("msg-level").unwrap().as_ptr(), log_level.as_ptr());
        
        // 尝试不同的音频输出设备
        let audio_devices = vec!["auto", "wasapi", "directsound", "winmm"];
        for device in &audio_devices {
            let audio_device = CString::new(*device).unwrap();
            let ao_result = mpv_set_option_string(mpv, CString::new("ao").unwrap().as_ptr(), audio_device.as_ptr());
            println!("Set audio output to {}: {}", device, ao_result);
            if ao_result == 0 {
                break;
            }
        }
        
        // 设置音量为 100
        let volume_result = mpv_set_option_string(mpv, CString::new("volume").unwrap().as_ptr(), CString::new("100").unwrap().as_ptr());
        println!("Set volume to 100: {}", volume_result);
        
        // 启用音频
        let aid_result = mpv_set_option_string(mpv, CString::new("aid").unwrap().as_ptr(), CString::new("auto").unwrap().as_ptr());
        println!("Enable audio: {}", aid_result);
        
        // 初始化 MPV
        let init_result = mpv_initialize(mpv);
        if init_result < 0 {
            println!("Failed to initialize MPV: {}", init_result);
            mpv_destroy(mpv);
            return;
        }
        println!("MPV initialized successfully with audio enabled, result: {}", init_result);
        
        // 检查可用的音频输出设备
        let devices_ptr = mpv_get_property_string(mpv, CString::new("ao-list").unwrap().as_ptr());
        if !devices_ptr.is_null() {
            let devices = CStr::from_ptr(devices_ptr).to_string_lossy().to_string();
            println!("Available audio output devices: {}", devices);
            mpv_free(devices_ptr as *mut std::os::raw::c_void);
        }
        
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
            
            // 等待一段时间，让媒体有时间加载
            std::thread::sleep(std::time::Duration::from_secs(5));
            
            // 检查媒体文件信息
            let media_title_ptr = mpv_get_property_string(mpv, CString::new("media-title").unwrap().as_ptr());
            if !media_title_ptr.is_null() {
                let media_title = CStr::from_ptr(media_title_ptr).to_string_lossy().to_string();
                println!("Media title: {}", media_title);
                mpv_free(media_title_ptr as *mut std::os::raw::c_void);
            }
            
            // 检查是否有音频轨道
            let mut audio = false;
            let audio_result = mpv_get_property(mpv, CString::new("has-audio").unwrap().as_ptr(), mpv_format_MPV_FORMAT_FLAG, &mut audio as *mut _ as *mut _);
            println!("Has audio: {}, result: {}", audio, audio_result);
            
            // 检查音频轨道数量
            let mut audio_count = 0;
            let audio_count_result = mpv_get_property(mpv, CString::new("aid-list").unwrap().as_ptr(), mpv_format_MPV_FORMAT_NODE, &mut audio_count as *mut _ as *mut _);
            println!("Audio track count result: {}", audio_count_result);
            
            // 检查音频是否启用
            let mut aid = 0;
            let aid_result = mpv_get_property(mpv, CString::new("aid").unwrap().as_ptr(), mpv_format_MPV_FORMAT_INT64, &mut aid as *mut _ as *mut _);
            println!("Current audio track: {}, result: {}", aid, aid_result);
            
            // 检查音量
            let mut volume = 0.0;
            let volume_result = mpv_get_property(mpv, CString::new("volume").unwrap().as_ptr(), mpv_format_MPV_FORMAT_DOUBLE, &mut volume as *mut _ as *mut _);
            println!("Current volume: {}, result: {}", volume, volume_result);
            
            // 检查音频输出设备
            let audio_device_ptr = mpv_get_property_string(mpv, CString::new("ao").unwrap().as_ptr());
            if !audio_device_ptr.is_null() {
                let audio_device = CStr::from_ptr(audio_device_ptr).to_string_lossy().to_string();
                println!("Current audio output device: {}", audio_device);
                mpv_free(audio_device_ptr as *mut std::os::raw::c_void);
            }
            
            // 检查音频输出状态
            let audio_out_ptr = mpv_get_property_string(mpv, CString::new("ao-name").unwrap().as_ptr());
            if !audio_out_ptr.is_null() {
                let audio_out = CStr::from_ptr(audio_out_ptr).to_string_lossy().to_string();
                println!("Current audio output: {}", audio_out);
                mpv_free(audio_out_ptr as *mut std::os::raw::c_void);
            }
            
            // 检查音频编解码器
            let audio_codec_ptr = mpv_get_property_string(mpv, CString::new("audio-codec").unwrap().as_ptr());
            if !audio_codec_ptr.is_null() {
                let audio_codec = CStr::from_ptr(audio_codec_ptr).to_string_lossy().to_string();
                println!("Audio codec: {}", audio_codec);
                mpv_free(audio_codec_ptr as *mut std::os::raw::c_void);
            }
            
            // 检查音频格式
            let audio_format_ptr = mpv_get_property_string(mpv, CString::new("audio-format").unwrap().as_ptr());
            if !audio_format_ptr.is_null() {
                let audio_format = CStr::from_ptr(audio_format_ptr).to_string_lossy().to_string();
                println!("Audio format: {}", audio_format);
                mpv_free(audio_format_ptr as *mut std::os::raw::c_void);
            }
            
            // 检查音频采样率
            let mut audio_sample_rate = 0;
            let audio_sample_rate_result = mpv_get_property(mpv, CString::new("audio-samplerate").unwrap().as_ptr(), mpv_format_MPV_FORMAT_INT64, &mut audio_sample_rate as *mut _ as *mut _);
            println!("Audio sample rate: {}, result: {}", audio_sample_rate, audio_sample_rate_result);
            
            // 手动设置音频轨道为1
            let set_aid_result = mpv_set_property(mpv, CString::new("aid").unwrap().as_ptr(), mpv_format_MPV_FORMAT_INT64, &1 as *const _ as *mut _);
            println!("Set audio track to 1: {}", set_aid_result);
            
            // 再次检查音频轨道
            let mut aid_after = 0;
            let aid_after_result = mpv_get_property(mpv, CString::new("aid").unwrap().as_ptr(), mpv_format_MPV_FORMAT_INT64, &mut aid_after as *mut _ as *mut _);
            println!("After setting, audio track: {}, result: {}", aid_after, aid_after_result);
            
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
