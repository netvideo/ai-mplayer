import { createContext, useContext, useState, useRef, ReactNode } from 'react';
import type { SubtitleTrack, SubtitleCue } from '../types/subtitles';
import { SubtitleManager } from '../services/subtitle/SubtitleManager';

interface SubtitleState {
  enabled: boolean;
  currentTrack: SubtitleTrack | null;
  tracks: SubtitleTrack[];
  currentCue: SubtitleCue | null;
  fontSize: number;
}

interface SubtitleContextType {
  state: SubtitleState;
  subtitleManager: SubtitleManager;
  setEnabled: (enabled: boolean) => void;
  setCurrentTrack: (trackId: number | null) => void;
  addTrack: (track: SubtitleTrack) => void;
  removeTrack: (trackId: number) => void;
  setCurrentTime: (time: number) => void;
  setFontSize: (size: number) => void;
}

const defaultState: SubtitleState = {
  enabled: true,
  currentTrack: null,
  tracks: [],
  currentCue: null,
  fontSize: 24,
};

const SubtitleContext = createContext<SubtitleContextType | undefined>(undefined);

export function SubtitleProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SubtitleState>(defaultState);
  const subtitleManagerRef = useRef<SubtitleManager>(new SubtitleManager());

  const updateFromManager = () => {
    setState(prev => ({
      ...prev,
      tracks: subtitleManagerRef.current.getTracks(),
      currentTrack: subtitleManagerRef.current.getCurrentTrack(),
      currentCue: subtitleManagerRef.current.getCurrentCue(),
    }));
  };

  const setEnabled = (enabled: boolean) => {
    setState(prev => ({ ...prev, enabled }));
  };

  const setCurrentTrack = (trackId: number | null) => {
    subtitleManagerRef.current.setCurrentTrack(trackId);
    updateFromManager();
  };

  const addTrack = (track: SubtitleTrack) => {
    subtitleManagerRef.current.addTrack(track);
    updateFromManager();
  };

  const removeTrack = (trackId: number) => {
    subtitleManagerRef.current.removeTrack(trackId);
    updateFromManager();
  };

  const setCurrentTime = (time: number) => {
    subtitleManagerRef.current.setCurrentTime(time);
    updateFromManager();
  };

  const setFontSize = (size: number) => {
    setState(prev => ({ ...prev, fontSize: size }));
  };

  return (
    <SubtitleContext.Provider
      value={{
        state,
        subtitleManager: subtitleManagerRef.current,
        setEnabled,
        setCurrentTrack,
        addTrack,
        removeTrack,
        setCurrentTime,
        setFontSize,
      }}
    >
      {children}
    </SubtitleContext.Provider>
  );
}

export function useSubtitle() {
  const context = useContext(SubtitleContext);
  if (context === undefined) {
    throw new Error('useSubtitle must be used within SubtitleProvider');
  }
  return context;
}
