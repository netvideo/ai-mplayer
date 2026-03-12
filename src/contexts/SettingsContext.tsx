import { createContext, useContext, useState, ReactNode } from 'react';

interface HardwareInfo {
  cpu: { cores: number; speed: number };
  gpu: { model: string; vram: number };
  memory: { total: number; available: number };
}

interface AISettings {
  enhancementEnabled: boolean;
  asrEnabled: boolean;
  translationEnabled: boolean;
  preferLocalModel: boolean;
  ollamaEndpoint: string;
  cloudModelEndpoint: string;
}

interface SubtitleSettings {
  enabled: boolean;
  preferredLanguage: string;
  translationEnabled: boolean;
  translateTo: string;
  fontSize: number;
}

interface DanmakuSettings {
  enabled: boolean;
  opacity: number;
  speed: number;
  fontSize: number;
}

interface Settings {
  language: string;
  hardware: HardwareInfo | null;
  ai: AISettings;
  subtitles: SubtitleSettings;
  danmaku: DanmakuSettings;
  preferChinaMirror: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  detectHardware: () => Promise<void>;
}

const defaultSettings: Settings = {
  language: 'zh-CN',
  hardware: null,
  ai: {
    enhancementEnabled: false,
    asrEnabled: true,
    translationEnabled: false,
    preferLocalModel: true,
    ollamaEndpoint: 'http://localhost:11434',
    cloudModelEndpoint: '',
  },
  subtitles: {
    enabled: true,
    preferredLanguage: 'zh-CN',
    translationEnabled: false,
    translateTo: 'zh-CN',
    fontSize: 24,
  },
  danmaku: {
    enabled: false,
    opacity: 0.8,
    speed: 8,
    fontSize: 24,
  },
  preferChinaMirror: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const detectHardware = async () => {
    try {
      // Hardware detection should be done via Tauri backend
      // For now, use browser APIs as fallback
      const cpu = { cores: navigator.hardwareConcurrency || 4, speed: 3.0 };
      const memory = { total: 16, available: 8 };
      const gpu = { model: 'Unknown', vram: 2 };

      updateSettings({
        hardware: { cpu, gpu, memory },
      });
    } catch (error) {
      console.error('Hardware detection failed:', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, detectHardware }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
