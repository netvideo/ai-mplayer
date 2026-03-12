import { useEffect, useRef, useState, useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useSubtitle } from '../contexts/SubtitleContext';
import SubtitleRenderer from './SubtitleRenderer';
import DanmakuRenderer from './DanmakuRenderer';
import Sidebar from './Sidebar';
import HelpOverlay from './HelpOverlay';
import { open } from '@tauri-apps/plugin-dialog';
import { TauriPlayerService } from '../services/TauriPlayerService';

const formatTime = (seconds: number): string => {
  if (!isFinite(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const Player = () => {
  const { settings } = useSettings();
  const { setCurrentTime: setSubtitleTime } = useSubtitle();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRectRef = useRef<HTMLDivElement>(null);
  const playerService = useRef<TauriPlayerService | null>(null);
  const pollIntervalRef = useRef<number | null>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [muted, setMuted] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'settings' | 'subtitles' | 'danmaku' | 'ai' | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    playerService.current = TauriPlayerService.getInstance();
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Set video rendering area - wait longer for MPV to initialize
  useEffect(() => {
    const updateVideoRect = () => {
      if (!playerService.current) return;
      
      // Render to entire window initially
      playerService.current.setVideoRect({
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      });
    };

    // Delay to ensure MPV is initialized (3 seconds)
    setTimeout(updateVideoRect, 3000);
  }, []);

  const updateState = useCallback(async () => {
    if (!playerService.current) return;
    try {
      const state = await playerService.current.getPlaybackState();
      setIsPlaying(state.isPlaying);
      setCurrentTime(state.position);
      setDuration(state.duration);
      setVolumeState(state.volume);
      setMuted(state.muted);
      setSubtitleTime(state.position);
    } catch (e) {
      console.error('Failed to get playback state:', e);
    }
  }, [setSubtitleTime]);

  useEffect(() => {
    pollIntervalRef.current = window.setInterval(updateState, 500);
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [updateState]);

  const loadVideoFile = async (filePath: string) => {
    console.log('Loading file:', filePath);
    const name = filePath.split('\\').pop() || filePath.split('/').pop() || 'Unknown';
    setFileName(name);
    setCurrentFile(filePath);

    try {
      await playerService.current?.loadMedia(filePath);
      
      // Set video rect after loading
      setTimeout(() => {
        playerService.current?.setVideoRect({
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        });
      }, 500);
      
      const mediaInfo = await playerService.current?.getMediaInfo();
      if (mediaInfo) {
        setDuration(mediaInfo.duration);
      }
    } catch (error) {
      console.error('Failed to load media:', error);
      alert('视频加载失败');
      setFileName(null);
      setCurrentFile(null);
    }
  };

  const openFileDialog = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'Video Files',
          extensions: ['mkv', 'mp4', 'avi', 'mov', 'flv', 'webm']
        }]
      });
      if (selected && typeof selected === 'string') {
        await loadVideoFile(selected);
      }
    } catch (e) {
      console.error('Failed to open file dialog:', e);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const filePath = (file as any).path;
      if (filePath) {
        await loadVideoFile(filePath);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const playPause = async () => {
    try {
      await playerService.current?.playPause();
      updateState();
    } catch (e) {
      console.error('Failed to play/pause:', e);
    }
  };

  const stop = async () => {
    try {
      await playerService.current?.stop();
      setIsPlaying(false);
      setCurrentTime(0);
    } catch (e) {
      console.error('Failed to stop:', e);
    }
  };

  const seek = async (time: number) => {
    try {
      await playerService.current?.seek(time);
      setCurrentTime(time);
    } catch (e) {
      console.error('Failed to seek:', e);
    }
  };

  const setVolume = async (vol: number) => {
    try {
      await playerService.current?.setVolume(vol);
      setVolumeState(vol);
    } catch (e) {
      console.error('Failed to set volume:', e);
    }
  };

  const toggleMute = async () => {
    try {
      const newMuted = await playerService.current?.toggleMute();
      setMuted(newMuted ?? false);
    } catch (e) {
      console.error('Failed to toggle mute:', e);
    }
  };

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        if (sidebarTab || showHelp) {
          setSidebarTab(null);
          setShowHelp(false);
          return;
        }
      }

      if (sidebarTab || showHelp) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          await playPause();
          break;
        case 'KeyF':
          e.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen().catch(() => {});
          }
          break;
        case 'KeyM':
          e.preventDefault();
          await toggleMute();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          await seek(Math.max(0, currentTime - 5));
          break;
        case 'ArrowRight':
          e.preventDefault();
          await seek(Math.min(duration, currentTime + 5));
          break;
        case 'ArrowUp':
          e.preventDefault();
          await setVolume(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          await setVolume(Math.max(0, volume - 0.1));
          break;
        case 'KeyC':
          e.preventDefault();
          setSidebarTab('subtitles');
          break;
        case 'KeyD':
          e.preventDefault();
          setSidebarTab('danmaku');
          break;
        case 'KeyH':
        case 'Slash':
          e.preventDefault();
          setShowHelp(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarTab, showHelp, currentTime, duration, volume]);

  return (
    <div className="h-full flex flex-col relative" style={{ background: currentFile ? 'transparent' : 'black' }}>
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{ minHeight: '400px', background: currentFile ? 'transparent' : 'black' }}
      >
        <div id="mpv-video" ref={videoRectRef} className="w-full h-full" style={{ background: 'transparent' }} />

        {currentFile && (
          <>
            {settings.subtitles.enabled && <SubtitleRenderer />}
            {settings.danmaku.enabled && <DanmakuRenderer />}
          </>
        )}

        {!currentFile && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-gray-400">
              <p className="text-6xl mb-4">🎬</p>
              <p className="text-xl">点击底部按钮或拖放文件</p>
            </div>
          </div>
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
    </div>
  );
};

export default Player;