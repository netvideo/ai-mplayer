export interface MediaInfo {
  duration: number;
  width: number;
  height: number;
  hasVideo: boolean;
  hasAudio: boolean;
  videoCodec: string;
  audioCodec: string;
  bitrate: number;
  subtitleTracks: SubtitleTrack[];
  audioTracks: AudioTrack[];
}

export interface SubtitleTrack {
  id: number;
  type: 'internal' | 'external' | 'asr';
  language: string;
  title: string;
}

export interface AudioTrack {
  id: number;
  language: string;
  title: string;
}

export const SUPPORTED_FORMATS = [
  'mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm',
  'mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma',
];

export const SUPPORTED_VIDEO_CODECS = ['h264', 'h265', 'vp9', 'av1', 'mpeg4'];
export const SUPPORTED_AUDIO_CODECS = ['aac', 'mp3', 'flac', 'opus', 'vorbis'];

export class MediaService {
  static async probeFile(filePath: string): Promise<MediaInfo | null> {
    console.log('Probing media file:', filePath);
    return {
      duration: 3600,
      width: 1920,
      height: 1080,
      hasVideo: true,
      hasAudio: true,
      videoCodec: 'h264',
      audioCodec: 'aac',
      bitrate: 8000000,
      subtitleTracks: [
        { id: 1, type: 'internal', language: 'zh-CN', title: '中文（内置）' },
        { id: 2, type: 'internal', language: 'en-US', title: 'English' },
      ],
      audioTracks: [
        { id: 1, language: 'zh-CN', title: '中文音轨' },
        { id: 2, language: 'en-US', title: 'English Audio' },
      ],
    };
  }

  static checkFormatSupport(filePath: string): { supported: boolean; missingCodecs: string[] } {
    const ext = filePath.split('.').pop()?.toLowerCase() || '';
    const supported = SUPPORTED_FORMATS.includes(ext);
    return {
      supported,
      missingCodecs: supported ? [] : [ext],
    };
  }

  static async getDecoderInstallUrl(codec: string, preferChinaMirror: boolean): Promise<string> {
    const chinaMirrors: Record<string, string> = {
      'h265': 'https://mirrors.tuna.tsinghua.edu.cn/videolan/',
      'av1': 'https://mirrors.aliyun.com/videolan/',
    };

    const internationalUrls: Record<string, string> = {
      'h265': 'https://www.videolan.org/vlc/',
      'av1': 'https://www.videolan.org/vlc/',
    };

    if (preferChinaMirror && chinaMirrors[codec]) {
      return chinaMirrors[codec];
    }
    return internationalUrls[codec] || 'https://www.videolan.org/vlc/';
  }
}
