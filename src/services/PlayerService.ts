export interface MediaTrack {
  id: number;
  type_: string;
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

export interface PlayerService {
  init(): Promise<void>;
  loadMedia(filePath: string): Promise<void>;
  playPause(): Promise<boolean>;
  stop(): Promise<void>;
  seek(position: number): Promise<void>;
  setVolume(volume: number): Promise<void>;
  toggleMute(): Promise<boolean>;
  getPlaybackState(): Promise<PlaybackState>;
  getMediaInfo(): Promise<MediaInfo>;
  setAudioTrack(trackId: number): Promise<void>;
  setSubtitleTrack(trackId: number): Promise<void>;
  addExternalSubtitle(filePath: string): Promise<void>;
  onStateChange(callback: (state: PlaybackState) => void): () => void;
  pollState(intervalMs?: number): Promise<() => void>;
  destroy(): void;
}
