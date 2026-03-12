import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface SubtitleTrack {
  id: number;
  type: 'internal' | 'external' | 'asr';
  language: string;
  title: string;
}

interface MediaInfo {
  duration: number;
  width: number;
  height: number;
  hasVideo: boolean;
  hasAudio: boolean;
  subtitleTracks: SubtitleTrack[];
  audioTracks: { id: number; language: string; title: string }[];
}

interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  fullscreen: boolean;
  currentFile: string | null;
  mediaInfo: MediaInfo | null;
  currentSubtitleTrack: SubtitleTrack | null;
  currentAudioTrack: number | null;
  buffer: number;
  playerReady: boolean;
  _tick: number;
}

interface PlayerContextType {
  state: PlayerState;
  playerRef: React.RefObject<HTMLDivElement>;
  openFile: () => void;
  playPause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  setSubtitleTrack: (track: SubtitleTrack | null) => void;
  setAudioTrack: (trackId: number | null) => void;
  loadMedia: (filePath: string, fileName?: string) => Promise<void>;
  addExternalSubtitle: (filePath: string) => Promise<void>;
  refreshState: () => void;
}

const defaultState: PlayerState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  muted: false,
  fullscreen: false,
  currentFile: null,
  mediaInfo: null,
  currentSubtitleTrack: null,
  currentAudioTrack: null,
  buffer: 0,
  playerReady: true,
  _tick: 0,
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlayerState>(defaultState);
  const playerRef = useRef<HTMLDivElement>(null);

  const updateState = (updates: Partial<PlayerState>) => {
    setState(prev => ({ ...prev, ...updates, _tick: prev._tick + 1 }));
  };

  const refreshState = () => {
    setState(prev => ({ ...prev, _tick: prev._tick + 1 }));
  };

  const openFile = async () => {
    try {
      const { open } = await import('@tauri-apps/api/dialog');
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: 'Media Files',
            extensions: ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mp3', 'wav', 'flac', 'aac', 'm4a'],
          },
        ],
      });

      if (selected && typeof selected === 'string') {
        await loadMedia(selected);
      }
    } catch (e) {
      console.log('Using HTML5 file input');
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*,audio/*';
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const url = URL.createObjectURL(file);
          await loadMedia(url, file.name);
        }
      };
      input.click();
    }
  };

  const loadMedia = async (filePath: string, fileName?: string) => {
    updateState({
      currentFile: filePath,
      isPlaying: true,
      currentTime: 0,
      duration: 0,
      mediaInfo: {
        duration: 3600,
        width: 1920,
        height: 1080,
        hasVideo: true,
        hasAudio: true,
        subtitleTracks: [
          { id: 1, type: 'internal', language: 'zh-CN', title: '中文字幕' },
        ],
        audioTracks: [
          { id: 1, language: 'zh-CN', title: '中文音轨' },
        ],
      },
    });
  };

  const playPause = () => {
    updateState({ isPlaying: !state.isPlaying });
  };

  const stop = () => {
    updateState({ isPlaying: false, currentTime: 0 });
  };

  const seek = (time: number) => {
    updateState({ currentTime: time });
  };

  const setVolume = (volume: number) => {
    const clamped = Math.max(0, Math.min(1, volume));
    updateState({ volume: clamped });
  };

  const toggleMute = () => {
    updateState({ muted: !state.muted });
  };

  const toggleFullscreen = () => {
    updateState({ fullscreen: !state.fullscreen });
  };

  const setSubtitleTrack = (track: SubtitleTrack | null) => {
    updateState({ currentSubtitleTrack: track });
  };

  const setAudioTrack = (trackId: number | null) => {
    updateState({ currentAudioTrack: trackId });
  };

  const addExternalSubtitle = async (filePath: string) => {
    console.log('Add external subtitle:', filePath);
  };

  return (
    <PlayerContext.Provider
      value={{
        state,
        playerRef,
        openFile,
        playPause,
        stop,
        seek,
        setVolume,
        toggleMute,
        toggleFullscreen,
        setSubtitleTrack,
        setAudioTrack,
        loadMedia,
        addExternalSubtitle,
        refreshState,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
}
