import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';

interface SidebarProps {
  activeTab: 'settings' | 'subtitles' | 'danmaku' | 'ai';
  onClose: () => void;
}

const Sidebar = ({ activeTab, onClose }: SidebarProps) => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettings();

  const renderSettingsContent = () => {
    switch (activeTab) {
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('settings.general')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">语言</label>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSettings({ language: e.target.value })}
                    className="w-full bg-gray-800 rounded px-3 py-2"
                  >
                    <option value="zh-CN">简体中文</option>
                    <option value="en-US">English</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">优先使用国内源</span>
                  <input
                    type="checkbox"
                    checked={settings.preferChinaMirror}
                    onChange={(e) => updateSettings({ preferChinaMirror: e.target.checked })}
                    className="w-4 h-4"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">播放设置</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">硬件解码</label>
                  <select
                    defaultValue="auto"
                    className="w-full bg-gray-800 rounded px-3 py-2"
                  >
                    <option value="auto">自动</option>
                    <option value="auto-safe">自动（安全）</option>
                    <option value="auto-copy">自动（拷贝）</option>
                    <option value="yes">强制开启</option>
                    <option value="no">关闭</option>
                  </select>
                </div>
              </div>
            </div>

            {settings.hardware && (
              <div>
                <h3 className="text-lg font-semibold mb-4">硬件信息</h3>
                <div className="text-sm text-gray-400 space-y-2">
                  <p>CPU: {settings.hardware.cpu.cores} 核心</p>
                  <p>内存: {settings.hardware.memory.total} GB</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'subtitles':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span>{t('subtitles.enable')}</span>
              <input
                type="checkbox"
                checked={settings.subtitles.enabled}
                onChange={(e) => updateSettings({
                  subtitles: { ...settings.subtitles, enabled: e.target.checked }
                })}
                className="w-4 h-4"
              />
            </div>

            {settings.subtitles.enabled && (
              <>
                <div>
                  <h4 className="font-medium mb-2">{t('subtitles.track')}</h4>
                  <div className="space-y-2">
                    <div className="w-full text-left px-3 py-2 rounded bg-blue-600">
                      <div className="text-sm">中文字幕</div>
                      <div className="text-xs text-gray-300">内置 · zh-CN</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">字号</label>
                  <input
                    type="range"
                    min={12}
                    max={48}
                    value={settings.subtitles.fontSize}
                    onChange={(e) => updateSettings({
                      subtitles: { ...settings.subtitles, fontSize: parseInt(e.target.value) }
                    })}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{settings.subtitles.fontSize}px</span>
                </div>
              </>
            )}
          </div>
        );

      case 'danmaku':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span>{t('danmaku.enable')}</span>
              <input
                type="checkbox"
                checked={settings.danmaku.enabled}
                onChange={(e) => updateSettings({
                  danmaku: { ...settings.danmaku, enabled: e.target.checked }
                })}
                className="w-4 h-4"
              />
            </div>

            {settings.danmaku.enabled && (
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">不透明度</label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={settings.danmaku.opacity}
                    onChange={(e) => updateSettings({
                      danmaku: { ...settings.danmaku, opacity: parseFloat(e.target.value) }
                    })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">速度</label>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={settings.danmaku.speed}
                    onChange={(e) => updateSettings({
                      danmaku: { ...settings.danmaku, speed: parseInt(e.target.value) }
                    })}
                    className="w-full"
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span>{t('ai.enhancement')}</span>
              <input
                type="checkbox"
                checked={settings.ai.enhancementEnabled}
                onChange={(e) => updateSettings({
                  ai: { ...settings.ai, enhancementEnabled: e.target.checked }
                })}
                className="w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <span>{t('ai.asr')}</span>
              <input
                type="checkbox"
                checked={settings.ai.asrEnabled}
                onChange={(e) => updateSettings({
                  ai: { ...settings.ai, asrEnabled: e.target.checked }
                })}
                className="w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <span>{t('ai.translation')}</span>
              <input
                type="checkbox"
                checked={settings.ai.translationEnabled}
                onChange={(e) => updateSettings({
                  ai: { ...settings.ai, translationEnabled: e.target.checked }
                })}
                className="w-4 h-4"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Ollama 端点</label>
              <input
                type="text"
                value={settings.ai.ollamaEndpoint}
                onChange={(e) => updateSettings({
                  ai: { ...settings.ai, ollamaEndpoint: e.target.value }
                })}
                className="w-full bg-gray-800 rounded px-3 py-2"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="absolute right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-800 flex flex-col z-50">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold">
          {activeTab === 'settings' ? t('settings.general') :
            activeTab === 'subtitles' ? t('subtitles.title') :
              activeTab === 'danmaku' ? t('danmaku.settings') : 'AI设置'}
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded">
          <span className="text-xl">✕</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {renderSettingsContent()}
      </div>
    </div>
  );
};

export default Sidebar;
