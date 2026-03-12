import type {
  FormatCheckResult,
  ContainerFormat,
} from '../types/media';
import {
  CONTAINER_FORMATS,
  VIDEO_CODECS,
  AUDIO_CODECS,
} from '../types/media';

export class FormatDetector {
  static getContainerFormat(fileName: string): ContainerFormat | null {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    
    return CONTAINER_FORMATS.find(fmt => 
      fmt.extensions.includes(ext)
    ) || null;
  }

  static checkFormat(fileName: string): FormatCheckResult {
    const container = this.getContainerFormat(fileName);
    
    const result: FormatCheckResult = {
      container: container || { name: 'Unknown', extensions: [], supported: false },
      videoCodec: null,
      audioCodec: null,
      fullySupported: false,
      warnings: [],
      suggestions: [],
    };

    if (!container) {
      result.warnings.push('无法识别的容器格式');
      result.suggestions.push('请使用 MP4 或 WebM 格式');
      return result;
    }

    if (!container.supported) {
      result.warnings.push(`${container.name} 格式浏览器支持有限`);
      result.suggestions.push('建议使用 MP4 格式');
      result.suggestions.push('或者使用 libmpv 播放');
    }

    result.videoCodec = VIDEO_CODECS.find(c => c.name.includes('H.264')) || null;
    result.audioCodec = AUDIO_CODECS.find(c => c.name.includes('AAC')) || null;

    result.fullySupported = container.supported && 
      (result.videoCodec?.supported ?? false) && 
      (result.audioCodec?.supported ?? false);

    if (!result.fullySupported) {
      result.suggestions.push('如需播放所有格式，请集成 libmpv');
    }

    return result;
  }

  static checkVideoPlayback(videoElement: HTMLVideoElement): Promise<boolean> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(false), 5000);

      videoElement.onloadedmetadata = () => {
        clearTimeout(timeout);
        resolve(true);
      };

      videoElement.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };
    });
  }
}
