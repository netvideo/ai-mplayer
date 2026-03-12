import { SettingsProvider } from './contexts/SettingsContext';
import { SubtitleProvider } from './contexts/SubtitleContext';
import Player from './components/Player';

function App() {
  return (
    <SettingsProvider>
      <SubtitleProvider>
        <div className="w-full h-full flex flex-col" style={{ background: 'transparent' }}>
          <Player />
        </div>
      </SubtitleProvider>
    </SettingsProvider>
  );
}

export default App;
