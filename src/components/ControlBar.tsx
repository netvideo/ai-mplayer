import { useTranslation } from 'react-i18next';
import { usePlayer } from '../contexts/PlayerContext';
import { useState } from 'react';

interface ControlBarProps {
  onOpenSettings: () => void;
  onOpenSubtitles: () => void;
  onOpenDanmaku: () => void;
  onOpenAI: () => void;
  onOpenHelp: () => void;
}

const formatTime = (seconds: number): string => {
  if (!isFinite(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const ControlBar = ({
  onOpenSettings,
  onOpenSubtitles,
  onOpenDanmaku,
  onOpenAI,
  onOpenHelp,
}: ControlBarProps) => {
  const { t } = useTranslation();
  const {
    state,
    openFile,
    playPause,
    stop,
    seek,
    setVolume,
    toggleMute,
    toggleFullscreen,
  } = usePlayer();
  const [showControls, setShowControls] = useState(true);

  return (
    <div
      className="bg-gradient-to-t from-black/90 to-transparent p-4"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="mb-3">
        <input
          type="range"
          min={0}
          max={state.duration || 100}
          value={state.currentTime}
          onChange={(e) => seek(parseFloat(e.target.value))}
          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(state.currentTime)}</span>
          <span>{formatTime(state.duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={openFile} className="p-2 hover:bg-white/10 rounded transition">
            <span className="text-xl">📂</span>
          </button>
          <button onClick={stop} disabled={!state.currentFile} className="p-2 hover:bg-white/10 rounded transition disabled:opacity-50">
            <span className="text-xl">⏹️</span>
          </button>
          <button onClick={playPause} disabled={!state.currentFile} className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition disabled:opacity-50">
            <span className="text-2xl">{state.isPlaying ? '⏸️' : '▶️'}</span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="p-2 hover:bg-white/10 rounded transition">
              <span className="text-xl">{state.muted ? '🔇' : '🔊'}</span>
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={state.muted ? 0 : state.volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onOpenSubtitles} className="p-2 hover:bg-white/10 rounded transition" title={t('subtitles.title')}>
            <span className="text-xl">📝</span>
          </button>
          <button onClick={onOpenDanmaku} className="p-2 hover:bg-white/10 rounded transition" title={t('danmaku.settings')}>
            <span className="text-xl">💬</span>
          </button>
          <button onClick={onOpenAI} className="p-2 hover:bg-white/10 rounded transition" title="AI设置">
            <span className="text-xl">🤖</span>
          </button>
          <button onClick={onOpenSettings} className="p-2 hover:bg-white/10 rounded transition" title={t('player.settings')}>
            <span className="text-xl">⚙️</span>
          </button>
          <button onClick={onOpenHelp} className="p-2 hover:bg-white/10 rounded transition" title={t('player.help')}>
            <span className="text-xl">❓</span>
          </button>
          <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded transition" title={t('player.fullscreen')}>
            <span className="text-xl">{state.fullscreen ? '⛶' : '⛶'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlBar;
