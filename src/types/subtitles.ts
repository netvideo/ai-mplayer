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

export interface SubtitleParser {
  parse(content: string): SubtitleCue[];
}
