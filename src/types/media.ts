export interface VideoCodec {
  name: string;
  supported: boolean;
  required: string[];
}

export interface AudioCodec {
  name: string;
  supported: boolean;
  required: string[];
}

export interface ContainerFormat {
  name: string;
  extensions: string[];
  supported: boolean;
}

export interface FormatCheckResult {
  container: ContainerFormat;
  videoCodec: VideoCodec | null;
  audioCodec: AudioCodec | null;
  fullySupported: boolean;
  warnings: string[];
  suggestions: string[];
}

export const CONTAINER_FORMATS: ContainerFormat[] = [
  { name: 'MP4', extensions: ['mp4', 'm4v'], supported: true },
  { name: 'WebM', extensions: ['webm'], supported: true },
  { name: 'MKV', extensions: ['mkv'], supported: false },
  { name: 'AVI', extensions: ['avi'], supported: false },
  { name: 'MOV', extensions: ['mov'], supported: true },
  { name: 'WMV', extensions: ['wmv'], supported: false },
  { name: 'FLV', extensions: ['flv'], supported: false },
];

export const VIDEO_CODECS: VideoCodec[] = [
  { name: 'H.264/AVC', supported: true, required: [] },
  { name: 'H.265/HEVC', supported: false, required: ['libmpv'] },
  { name: 'VP9', supported: true, required: [] },
  { name: 'AV1', supported: false, required: ['libmpv'] },
];

export const AUDIO_CODECS: AudioCodec[] = [
  { name: 'AAC', supported: true, required: [] },
  { name: 'MP3', supported: true, required: [] },
  { name: 'Opus', supported: true, required: [] },
  { name: 'Vorbis', supported: true, required: [] },
  { name: 'FLAC', supported: true, required: [] },
  { name: 'EAC3/Dolby Digital Plus', supported: false, required: ['libmpv'] },
  { name: 'DTS', supported: false, required: ['libmpv'] },
];
