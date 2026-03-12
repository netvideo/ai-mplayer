import { AIService } from './AIService';

export interface SubtitleCue {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
}

export interface SubtitleTrack {
  id: number;
  type: 'internal' | 'external' | 'asr';
  language: string;
  name: string;
  cues: SubtitleCue[];
}

export class SubtitleService {
  private aiService: AIService;
  private subtitleBuffer: SubtitleCue[] = [];
  private bufferTime: number = 5;

  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  async loadExternalSubtitle(filePath: string): Promise<SubtitleTrack | null> {
    console.log('Loading external subtitle:', filePath);
    const ext = filePath.split('.').pop()?.toLowerCase();

    if (ext === 'srt') {
      return this.parseSRT('');
    } else if (ext === 'ass' || ext === 'ssa') {
      return this.parseASS('');
    }

    return null;
  }

  private parseSRT(content: string): SubtitleTrack {
    const cues: SubtitleCue[] = [
      { id: 1, startTime: 0, endTime: 3, text: '这是第一条字幕' },
      { id: 2, startTime: 3, endTime: 6, text: '这是第二条字幕' },
    ];

    return {
      id: Date.now(),
      type: 'external',
      language: 'zh-CN',
      name: '外挂字幕',
      cues,
    };
  }

  private parseASS(content: string): SubtitleTrack {
    return {
      id: Date.now(),
      type: 'external',
      language: 'zh-CN',
      name: '外挂字幕 (ASS)',
      cues: [],
    };
  }

  selectBestSubtitleTrack(
    tracks: SubtitleTrack[],
    preferredLanguage: string
  ): SubtitleTrack | null {
    const priorityOrder: ('external' | 'internal' | 'asr')[] = ['external', 'internal', 'asr'];

    for (const type of priorityOrder) {
      const track = tracks.find(
        t => t.type === type && t.language === preferredLanguage
      );
      if (track) return track;
    }

    for (const type of priorityOrder) {
      const track = tracks.find(t => t.type === type);
      if (track) return track;
    }

    return null;
  }

  async generateASRSubtitles(
    audioData: ArrayBuffer,
    useLocal: boolean,
    language: string
  ): Promise<SubtitleTrack> {
    const asrResults = await this.aiService.transcribeAudio(
      audioData,
      useLocal,
      language
    );

    const cues: SubtitleCue[] = asrResults.map((result, idx) => ({
      id: idx + 1,
      startTime: result.startTime,
      endTime: result.endTime,
      text: result.text,
    }));

    return {
      id: Date.now(),
      type: 'asr',
      language,
      name: 'ASR 实时字幕',
      cues,
    };
  }

  async translateSubtitles(
    track: SubtitleTrack,
    targetLanguage: string,
    useLocal: boolean
  ): Promise<SubtitleTrack> {
    const translatedCues: SubtitleCue[] = [];

    for (const cue of track.cues) {
      const result = await this.aiService.translateText(
        cue.text,
        track.language,
        targetLanguage,
        useLocal
      );
      translatedCues.push({
        ...cue,
        text: result.translated,
      });
    }

    return {
      ...track,
      id: Date.now(),
      name: `${track.name} (翻译)`,
      cues: translatedCues,
    };
  }

  addToBuffer(cues: SubtitleCue[]): void {
    this.subtitleBuffer.push(...cues);
    this.subtitleBuffer.sort((a, b) => a.startTime - b.startTime);
  }

  getBufferedCue(currentTime: number): SubtitleCue | null {
    const bufferedTime = currentTime + this.bufferTime;
    const cue = this.subtitleBuffer.find(
      c => c.startTime <= bufferedTime && c.endTime >= currentTime
    );
    return cue || null;
  }

  clearBuffer(): void {
    this.subtitleBuffer = [];
  }

  setBufferTime(seconds: number): void {
    this.bufferTime = Math.max(0, Math.min(30, seconds));
  }
}
