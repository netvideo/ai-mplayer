import type { SubtitleTrack, SubtitleCue } from '../../types/subtitles';
import { SRTParser } from './SRTParser';

export class SubtitleManager {
  private tracks: SubtitleTrack[] = [];
  private currentTrackId: number | null = null;
  private currentTime: number = 0;

  addTrack(track: SubtitleTrack): void {
    this.tracks.push(track);
  }

  removeTrack(trackId: number): void {
    this.tracks = this.tracks.filter(t => t.id !== trackId);
    if (this.currentTrackId === trackId) {
      this.currentTrackId = null;
    }
  }

  setCurrentTrack(trackId: number | null): void {
    if (trackId === null || this.tracks.some(t => t.id === trackId)) {
      this.currentTrackId = trackId;
    }
  }

  getCurrentTrack(): SubtitleTrack | null {
    return this.tracks.find(t => t.id === this.currentTrackId) || null;
  }

  getTracks(): SubtitleTrack[] {
    return [...this.tracks];
  }

  setCurrentTime(time: number): void {
    this.currentTime = time;
  }

  getCurrentCue(): SubtitleCue | null {
    const track = this.getCurrentTrack();
    if (!track) return null;

    return track.cues.find(
      cue => cue.startTime <= this.currentTime && cue.endTime >= this.currentTime
    ) || null;
  }

  async loadSRTFile(content: string, trackId: number, name: string): Promise<SubtitleTrack> {
    const parser = new SRTParser();
    const cues = parser.parse(content);

    const track: SubtitleTrack = {
      id: trackId,
      type: 'external',
      language: 'und',
      name,
      cues,
    };

    this.addTrack(track);
    return track;
  }

  clearAll(): void {
    this.tracks = [];
    this.currentTrackId = null;
  }
}
