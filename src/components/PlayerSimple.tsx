import { useEffect, useRef, useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useSubtitle } from '../contexts/SubtitleContext';
import SubtitleRenderer from './SubtitleRenderer';
import DanmakuRenderer from './DanmakuRenderer';
import Sidebar from './Sidebar';
import HelpOverlay from './HelpOverlay';
import { open } from '@tauri-apps/plugin-dialog';
import { convertFileSrc } from '@tauri-apps/api/core';

const formatTime = (seconds: number): string => {
  if (!isFinite(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const PlayerSimple = () => {
  const { settings } = useSettings();
  const { setCurrentTime: setSubtitleTime } = useSubtitle();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // No TauriPlayerService needed for simple mode
  }, []);

  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [muted, setMuted] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'settings' | 'subtitles' | 'danmaku' | 'ai' | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    let intervalId: number | null = null;

    const pollState = async () => {
      const video = videoRef.current;
      if (!video) return;
      setIsPlaying(!video.paused);
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
      setVolumeState(video.volume);
      setMuted(video.muted);
      setSubtitleTime(video.currentTime);
    };

    intervalId = window.setInterval(pollState, 500);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

 const loadVideoFile = (filePath: string) => {
    console.log('Loading file:', filePath);
    const name = filePath.split('\\').pop() || filePath.split('/').pop() || 'Unknown';
    setFileName(name);
    setDuration(0);
    setCurrentFile(filePath);

    // Use Tauri's convertFileSrc to get a URL that can be loaded in webview
    const assetUrl = convertFileSrc(filePath);
    console.log('Asset URL:', assetUrl);
    
    const video = videoRef.current;
    if (!video) return;

    video.src = assetUrl;
    video.load();

    video.onloadedmetadata = () => {
      setDuration(video.duration);
      video.play().catch(() => console.log('Auto-play blocked'));
    };

    video.onerror = (e) => {
      console.error('Failed to load video:', e);
      setCurrentFile(null);
      setFileName(null);
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      console.log('File dropped:', file.name);
      // For drag and drop, use file.path if available
      const filePath = (file as any).path;
      if (filePath) {
        loadVideoFile(filePath);
      } else {
        alert('无法加载拖拽的文件');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const stop = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const playPause = () => {
    const video = videoRef.current;
    if (!video) return;

    video.paused ? video.play() : video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted ? video.muted = false : video.muted = true;
  };

  const setVolume = (value: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = value;
    video.muted = false;
  };

  const seek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
  };

  const openFileDialog = async () => {
    console.log('Opening file dialog...');
    try {
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'Video Files',
          extensions: ['mkv', 'mp4', 'avi', 'mov', 'flv', 'webm']
        }]
      });
      if (selected && typeof selected === 'string') {
        console.log('Selected file:', selected);
        await loadVideoFile(selected);
      }
    } catch (e) {
      console.error('Failed to open file dialog:', e);
    }
  };

  return (
    <div className="h-full flex flex-col relative" style={{ background: 'transparent' }}>
      <div
        ref={containerRef}
        className="flex-1 relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{ minHeight: '400px', background: 'transparent' }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          controls={false}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
          onTimeUpdate={() => {
            setCurrentTime(videoRef.current?.currentTime || 0);
          }}
        />

        {!currentFile && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ background: 'black' }}>
            <div className="text-center text-gray-400">
              <p className="text-6xl mb-4">🎬</p>
              <p className="text-xl">点击底部按钮或拖放文件</p>
            </div>
          </div>
        )}

        {currentFile && (
          <>
            {settings.subtitles.enabled && <SubtitleRenderer />}
            {settings.danmaku.enabled && <DanmakuRenderer />}
          </>
        )}

        {fileName && (
          <div className="absolute top-4 left-4 bg-black/70 px-4 py-2 rounded-lg text-sm text-white z-10">
            📁 {fileName}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-t from-black/90 to-transparent p-4 relative z-20">
        <div className="mb-3">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={openFileDialog} className="p-2 hover:bg-white/10 rounded transition">
              <span className="text-xl">📂</span>
            </button>
            <button onClick={stop} disabled={!currentFile} className="p-2 hover:bg-white/10 rounded transition disabled:opacity-50">
              <span className="text-xl">⏹️</span>
            </button>
            <button onClick={playPause} disabled={!currentFile} className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition disabled:opacity-50">
              <span className="text-2xl">{isPlaying ? '⏸️' : '▶️'}</span>
            </button>
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="p-2 hover:bg-white/10 rounded transition">
                <span className="text-xl">{muted ? '🔇' : '🔊'}</span>
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarTab('subtitles')} className="p-2 hover:bg-white/10 rounded transition">
              <span className="text-xl">📝</span>
            </button>
            <button onClick={() => setSidebarTab('danmaku')} className="p-2 hover:bg-white/10 rounded transition">
              <span className="text-xl">💬</span>
            </button>
            <button onClick={() => setSidebarTab('ai')} className="p-2 hover:bg-white/10 rounded transition">
              <span className="text-xl">🤖</span>
            </button>
            <button onClick={() => setSidebarTab('settings')} className="p-2 hover:bg-white/10 rounded transition">
              <span className="text-xl">⚙️</span>
            </button>
            <button onClick={() => setShowHelp(true)} className="p-2 hover:bg-white/10 rounded transition">
              <span className="text-xl">❓</span>
            </button>
          </div>
        </div>
      </div>

      {sidebarTab && (
        <Sidebar
          activeTab={sidebarTab}
          onClose={() => setSidebarTab(null)}
        />
      )}

      {showHelp && (
        <HelpOverlay onClose={() => setShowHelp(false)} />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,audio/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const url = URL.createObjectURL(file);
            loadVideoFile(url);
          }
        }}
      />
    </div>
  );
};

export default PlayerSimple;
