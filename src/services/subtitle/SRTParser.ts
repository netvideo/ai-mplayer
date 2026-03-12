import type { SubtitleCue, SubtitleParser } from '../../types/subtitles';

function parseTime(timeStr: string): number {
  const parts = timeStr.split(':');
  const secondsParts = parts[2].split(',');
  
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseInt(secondsParts[0], 10);
  const milliseconds = parseInt(secondsParts[1], 10);

  return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
}

export class SRTParser implements SubtitleParser {
  parse(content: string): SubtitleCue[] {
    const cues: SubtitleCue[] = [];
    
    const blocks = content.trim().split(/\n\n+/);
    
    for (const block of blocks) {
      const lines = block.split('\n');
      
      if (lines.length < 3) continue;
      
      const id = parseInt(lines[0], 10);
      const timeLine = lines[1];
      const textLines = lines.slice(2);
      
      const timeMatch = timeLine.match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
      
      if (!timeMatch) continue;
      
      const startTime = parseTime(timeMatch[1]);
      const endTime = parseTime(timeMatch[2]);
      const text = textLines.join('\n');
      
      cues.push({
        id,
        startTime,
        endTime,
        text,
      });
    }
    
    return cues;
  }
}
