import { init, destroy, command, setProperty, getProperty, setVideoMarginRatio, MpvConfig } from 'tauri-plugin-libmpv-api';

let initialized = false;

export interface MediaTrack {
  id: number;
  type: string;
  language?: string;
  title?: string;
}

export interface MediaInfo {
  duration: number;
  width?: number;
  height?: number;
  hasVideo: boolean;
  hasAudio: boolean;
  videoCodec?: string;
  audioCodec?: string;
  audioTracks: MediaTrack[];
  subtitleTracks: MediaTrack[];
}

export interface PlaybackState {
  isPlaying: boolean;
  position: number;
  duration: number;
  volume: number;
  muted: boolean;
}

export class TauriPlayerService {
  private static instance: TauriPlayerService;
  private stateListeners: Array<(state: PlaybackState) => void> = [];
  private unlisten: (() => void) | null = null;

  private constructor() {}

  static getInstance(): TauriPlayerService {
    if (!TauriPlayerService.instance) {
      TauriPlayerService.instance = new TauriPlayerService();
    }
    return TauriPlayerService.instance;
  }

async init(): Promise<void> {
    if (!initialized) {
      try {
        console.log('=== Initializing mpv ===');
        
        const mpvConfig: MpvConfig = {
          initialOptions: {
            'vo': 'gpu-next',
            'hwdec': 'auto-safe',
            'keep-open': 'yes',
            'force-window': 'yes',
            'pause': 'yes',
          },
          observedProperties: [],
        };
        
        console.log('MPV config:', mpvConfig);
        await init(mpvConfig);
        initialized = true;
        console.log('=== mpv initialized ===');
      } catch (error) {
        console.error('=== Failed to initialize mpv:', error);
        throw error;
      }
    }
  }

  async loadMedia(filePath: string): Promise<void> {
    try {
      console.log('=== Entering loadMedia method ===');
      
      // Check if mpv is initialized
      if (!initialized) {
        console.log('=== mpv not initialized, initializing now ===');
        await this.init();
      }
      
      // Convert Windows backslashes to forward slashes for mpv
      const normalizedPath = filePath.replace(/\\/g, '/');
      console.log('Loading media:', normalizedPath);
      
      console.log('=== Calling command(loadfile) ===');
      
      await command('loadfile', [normalizedPath, 'replace']);
      console.log('Media loaded successfully');
      
      // Auto-play after loading with error handling
      console.log('=== Setting pause to false ===');
      try {
        await setProperty('pause', false);
        console.log('Auto-play enabled');
      } catch (e) {
        console.error('Failed to set auto-play:', e);
      }
      console.log('=== loadMedia method completed ===');
    } catch (error) {
      console.error('Failed to load media:', error);
      // Clean up on error
      try {
        await this.stop();
      } catch (cleanupError) {
        console.error('Failed to clean up:', cleanupError);
      }
      throw error;
    }
  }

  async playPause(): Promise<boolean> {
    const paused = await getProperty('pause', 'flag') as boolean;
    await setProperty('pause', !paused);
    return !paused;
  }

  async stop(): Promise<void> {
    await command('stop');
  }

  async seek(position: number): Promise<void> {
    await command('seek', [position, 'absolute']);
  }

  async setVolume(volume: number): Promise<void> {
    await setProperty('volume', Math.floor(volume * 100));
  }

  async setVideoRect(rect: { left: number; right: number; top: number; bottom: number }): Promise<void> {
    if (!initialized) {
      return;
    }
    
    // Convert pixel values to ratios (0-1)
    const left = rect.left / window.innerWidth;
    const right = rect.right / window.innerWidth;
    const top = rect.top / window.innerHeight;
    const bottom = rect.bottom / window.innerHeight;
    
    await setVideoMarginRatio({ left, right, top, bottom });
  }

  async toggleMute(): Promise<boolean> {
    const muted = await getProperty('mute', 'flag') as boolean;
    await setProperty('mute', !muted);
    return !muted;
  }

  async getPlaybackState(): Promise<PlaybackState> {
    try {
      const [position, duration, volume, muted, pause] = await Promise.all([
        getProperty('time-pos', 'double'),
        getProperty('duration', 'double'),
        getProperty('volume', 'int64'),
        getProperty('mute', 'flag'),
        getProperty('pause', 'flag'),
      ]);
      
      return {
        isPlaying: pause === false,
        position: (position as number) || 0,
        duration: (duration as number) || 0,
        volume: ((volume as number) || 100) / 100,
        muted: (muted as boolean) || false,
      };
    } catch (error) {
      console.error('Failed to get playback state:', error);
      return {
        isPlaying: false,
        position: 0,
        duration: 0,
        volume: 1,
        muted: false,
      };
    }
  }

  async getMediaInfo(): Promise<MediaInfo> {
    try {
      const [duration, width, height, video, audio, videoCodec, audioCodec] = await Promise.all([
        getProperty('duration', 'double'),
        getProperty('width', 'int64'),
        getProperty('height', 'int64'),
        getProperty('video', 'string'),
        getProperty('audio', 'string'),
        getProperty('video-codec', 'string'),
        getProperty('audio-codec', 'string'),
      ]);
      
      return {
        duration: (duration as number) || 0,
        width: (width as number) || 0,
        height: (height as number) || 0,
        hasVideo: (video as string) !== 'no',
        hasAudio: (audio as string) !== 'no',
        videoCodec: (videoCodec as string) || undefined,
        audioCodec: (audioCodec as string) || undefined,
        audioTracks: [],
        subtitleTracks: [],
      };
    } catch {
      return {
        duration: 0,
        hasVideo: false,
        hasAudio: false,
        audioTracks: [],
        subtitleTracks: [],
      };
    }
  }

  async setAudioTrack(trackId: number): Promise<void> {
    await setProperty('aid', trackId);
  }

  async setSubtitleTrack(trackId: number): Promise<void> {
    await setProperty('sid', trackId);
  }

  async addExternalSubtitle(filePath: string): Promise<void> {
    await command('sub-add', [filePath]);
  }

  async getVideoFrame(): Promise<string | null> {
    return null;
  }

  onStateChange(callback: (state: PlaybackState) => void): () => void {
    this.stateListeners.push(callback);
    return () => {
      this.stateListeners = this.stateListeners.filter(cb => cb !== callback);
    };
  }

  // 移除 pollState 方法，避免重复的状态更新
  // async pollState(intervalMs: number = 500): Promise<() => void> {
  //   if (this.pollInterval) {
  //     clearInterval(this.pollInterval);
  //   }
  //   
  //   this.pollInterval = window.setInterval(async () => {
  //     try {
  //       const state = await this.getPlaybackState();
  //       this.stateListeners.forEach(cb => cb(state));
  //     } catch {
  //       // Ignore poll errors
  //     }
  //   }, intervalMs);
  // 
  //   return () => {
  //     if (this.pollInterval) {
  //       clearInterval(this.pollInterval);
  //       this.pollInterval = null;
  //     }
  //   };
  // }

  destroy(): void {
    this.stateListeners = [];
    
    if (this.unlisten) {
      this.unlisten();
      this.unlisten = null;
    }
    
    if (initialized) {
      destroy();
      initialized = false;
    }
  }
}
