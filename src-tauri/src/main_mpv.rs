#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use anyhow::Result;
use parking_lot::Mutex;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tauri::State;

#[derive(Debug, Serialize, Deserialize, Clone)]
struct MediaTrack {
    id: i64,
    type_: String,
    language: Option<String>,
    title: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct MediaInfo {
    duration: f64,
    width: Option<i64>,
    height: Option<i64>,
    has_video: bool,
    has_audio: bool,
    video_codec: Option<String>,
    audio_codec: Option<String>,
    audio_tracks: Vec<MediaTrack>,
    subtitle_tracks: Vec<MediaTrack>,
}

#[derive(Debug, Serialize, Deserialize)]
struct PlaybackState {
    is_playing: bool,
    position: f64,
    duration: f64,
    volume: i64,
    muted: bool,
}

#[derive(Debug, Clone, Default)]
struct PlayerStateInternal {
    is_playing: bool,
    position: f64,
    duration: f64,
    volume: i64,
    muted: bool,
    current_file: Option<String>,
    audio_tracks: Vec<MediaTrack>,
    subtitle_tracks: Vec<MediaTrack>,
}

struct AppState {
    player: Mutex<PlayerStateInternal>,
}

#[tauri::command]
async fn init_player(_state: State<'_, AppState>) -> Result<(), String> {
    Ok(())
}

#[tauri::command]
async fn load_media(file_path: String, state: State<'_, AppState>) -> Result<(), String> {
    let mut player = state.player.lock();
    player.current_file = Some(file_path);
    player.duration = 3600.0;
    player.position = 0.0;
    player.is_playing = true;
    player.audio_tracks = vec![
        MediaTrack { id: 1, type_: "audio".to_string(), language: Some("zh-CN".to_string()), title: Some("中文音轨".to_string()) },
        MediaTrack { id: 2, type_: "audio".to_string(), language: Some("en-US".to_string()), title: Some("English Audio".to_string()) },
    ];
    player.subtitle_tracks = vec![
        MediaTrack { id: 1, type_: "sub".to_string(), language: Some("zh-CN".to_string()), title: Some("中文字幕".to_string()) },
        MediaTrack { id: 2, type_: "sub".to_string(), language: Some("en-US".to_string()), title: Some("English Subtitle".to_string()) },
    ];
    Ok(())
}

#[tauri::command]
async fn play_pause(state: State<'_, AppState>) -> Result<bool, String> {
    let mut player = state.player.lock();
    if player.current_file.is_none() {
        return Ok(false);
    }
    player.is_playing = !player.is_playing;
    Ok(player.is_playing)
}

#[tauri::command]
async fn stop(state: State<'_, AppState>) -> Result<(), String> {
    let mut player = state.player.lock();
    player.is_playing = false;
    player.position = 0.0;
    Ok(())
}

#[tauri::command]
async fn seek(position: f64, state: State<'_, AppState>) -> Result<(), String> {
    let mut player = state.player.lock();
    player.position = position.max(0.0).min(player.duration);
    Ok(())
}

#[tauri::command]
async fn set_volume(volume: i64, state: State<'_, AppState>) -> Result<(), String> {
    let mut player = state.player.lock();
    player.volume = volume.max(0).min(100);
    Ok(())
}

#[tauri::command]
async fn toggle_mute(state: State<'_, AppState>) -> Result<bool, String> {
    let mut player = state.player.lock();
    player.muted = !player.muted;
    Ok(player.muted)
}

#[tauri::command]
async fn get_playback_state(state: State<'_, AppState>) -> Result<PlaybackState, String> {
    let mut player = state.player.lock();
    
    if player.is_playing {
        player.position += 0.1;
        if player.position >= player.duration {
            player.is_playing = false;
            player.position = player.duration;
        }
    }

    Ok(PlaybackState {
        is_playing: player.is_playing,
        position: player.position,
        duration: player.duration,
        volume: player.volume,
        muted: player.muted,
    })
}

#[tauri::command]
async fn get_media_info(state: State<'_, AppState>) -> Result<MediaInfo, String> {
    let player = state.player.lock();
    
    Ok(MediaInfo {
        duration: player.duration,
        width: Some(1920),
        height: Some(1080),
        has_video: true,
        has_audio: true,
        video_codec: Some("h264".to_string()),
        audio_codec: Some("aac".to_string()),
        audio_tracks: player.audio_tracks.clone(),
        subtitle_tracks: player.subtitle_tracks.clone(),
    })
}

#[tauri::command]
async fn set_audio_track(_track_id: i64, _state: State<'_, AppState>) -> Result<(), String> {
    Ok(())
}

#[tauri::command]
async fn set_subtitle_track(_track_id: i64, _state: State<'_, AppState>) -> Result<(), String> {
    Ok(())
}

#[tauri::command]
async fn add_external_subtitle(_file_path: String, _state: State<'_, AppState>) -> Result<(), String> {
    Ok(())
}

#[tauri::command]
async fn get_dropped_file_path(file_name: String) -> Result<String, String> {
    let home_dir = std::env::var("TEMP")
        .or_else(|_| std::env::var("LOCALAPPDATA"))
        .unwrap_or_else(|_| "C:\".to_string());
    
    let path = format!("{}/{}", home_dir, file_name);
    Ok(path)
}

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            player: Mutex::new(PlayerStateInternal::default()),
        })
        .invoke_handler(tauri::generate_handler![
            init_player,
            load_media,
            play_pause,
            stop,
            seek,
            set_volume,
            toggle_mute,
            get_playback_state,
            get_media_info,
            set_audio_track,
            set_subtitle_track,
            add_external_subtitle,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
