import { useState, useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface Danmaku {
  id: number;
  text: string;
  color: string;
  top: number;
  speed: number;
  createdAt: number;
}

const mockDanmakuList = [
  '666',
  '太好看了！',
  '前排',
  '这个播放器不错',
  'AI功能强大',
  '支持支持',
  '字幕翻译很实用',
  '画质很好',
];

const colors = ['#ffffff', '#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3'];

const DanmakuRenderer = () => {
  const { settings } = useSettings();
  const [danmakus, setDanmakus] = useState<Danmaku[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newDanmaku: Danmaku = {
          id: idCounter.current++,
          text: mockDanmakuList[Math.floor(Math.random() * mockDanmakuList.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          top: Math.random() * 70,
          speed: settings.danmaku.speed + Math.random() * 5,
          createdAt: Date.now(),
        };
        setDanmakus(prev => [...prev, newDanmaku]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.danmaku.speed]);

  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setDanmakus(prev => prev.filter(d => now - d.createdAt < 10000));
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      {danmakus.map((danmaku) => (
        <DanmakuItem
          key={danmaku.id}
          danmaku={danmaku}
          fontSize={settings.danmaku.fontSize}
          opacity={settings.danmaku.opacity}
        />
      ))}
    </div>
  );
};

interface DanmakuItemProps {
  danmaku: Danmaku;
  fontSize: number;
  opacity: number;
}

const DanmakuItem = ({ danmaku, fontSize, opacity }: DanmakuItemProps) => {
  const [position, setPosition] = useState(100);

  useEffect(() => {
    const animation = setInterval(() => {
      setPosition(prev => {
        if (prev < -100) return prev;
        return prev - danmaku.speed / 10;
      });
    }, 16);

    return () => clearInterval(animation);
  }, [danmaku.speed]);

  return (
    <div
      className="absolute whitespace-nowrap"
      style={{
        left: `${position}%`,
        top: `${danmaku.top}%`,
        color: danmaku.color,
        fontSize: `${fontSize}px`,
        opacity: opacity,
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
      }}
    >
      {danmaku.text}
    </div>
  );
};

export default DanmakuRenderer;
