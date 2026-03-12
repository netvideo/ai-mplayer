import { useTranslation } from 'react-i18next';

interface HelpOverlayProps {
  onClose: () => void;
}

const HelpOverlay = ({ onClose }: HelpOverlayProps) => {
  const { t } = useTranslation();

  const shortcuts = [
    { keys: 'Space', description: '播放/暂停' },
    { keys: 'F', description: '全屏' },
    { keys: 'M', description: '静音' },
    { keys: '←/→', description: '快进/快退 5秒' },
    { keys: '↑/↓', description: '音量增减' },
    { keys: 'C', description: '字幕开关' },
    { keys: 'D', description: '弹幕开关' },
    { keys: ',/.', description: '上一帧/下一帧' },
    { keys: '0-9', description: '跳转到 0%-90%' },
    { keys: 'H', description: '显示帮助' },
  ];

  const features = [
    { icon: '🎬', title: '实时解码播放', desc: '无需转码，直接实时播放各种格式' },
    { icon: '🤖', title: 'AI增强', desc: '根据硬件能力自动启用AI画质增强' },
    { icon: '📝', title: '智能字幕', desc: '内置/外挂/ASR三种字幕，支持自动翻译' },
    { icon: '💬', title: 'P2P弹幕', desc: '可开启弹幕功能，实时互动' },
    { icon: '🌍', title: '多语言', desc: '支持中英文等多语言界面' },
    { icon: '⚡', title: '硬件优化', desc: '自动检测硬件，选择最佳配置' },
  ];

  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold">{t('help.title')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded">
            <span className="text-2xl">✕</span>
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-4">{t('help.shortcuts')}</h3>
            <div className="grid grid-cols-2 gap-3">
              {shortcuts.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-gray-800 p-3 rounded">
                  <kbd className="px-3 py-1 bg-gray-700 rounded text-sm font-mono">{item.keys}</kbd>
                  <span className="text-gray-300">{item.description}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-4">{t('help.features')}</h3>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <div key={idx} className="bg-gray-800 p-4 rounded">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HelpOverlay;
