import { useSettings } from '../contexts/SettingsContext';
import { useSubtitle } from '../contexts/SubtitleContext';

const SubtitleRenderer = () => {
  const { settings } = useSettings();
  const { state: subtitleState } = useSubtitle();

  if (!settings.subtitles.enabled || !subtitleState.enabled) return null;
  if (!subtitleState.currentCue) return null;

  return (
    <div className="absolute bottom-24 left-0 right-0 flex justify-center pointer-events-none">
      <div
        className="bg-black/70 px-6 py-3 rounded-lg max-w-4xl text-center"
        style={{ fontSize: `${settings.subtitles.fontSize}px` }}
      >
        {subtitleState.currentCue.text}
      </div>
    </div>
  );
};

export default SubtitleRenderer;
