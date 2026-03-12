import type { FormatCheckResult } from '../types/media';
import { useTranslation } from 'react-i18next';

interface FormatWarningModalProps {
  visible: boolean;
  result: FormatCheckResult | null;
  onClose: () => void;
  onUseAnyway: () => void;
  onInstallLibmpv: () => void;
}

const FormatWarningModal = ({
  visible,
  result,
  onClose,
  onUseAnyway,
  onInstallLibmpv,
}: FormatWarningModalProps) => {
  const { t } = useTranslation();

  if (!visible || !result) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚠️</div>
            <div>
              <h3 className="text-lg font-semibold">格式警告</h3>
              <p className="text-sm text-gray-400">
                检测到可能不支持的格式
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">容器格式</span>
            <span className={result.container.supported ? 'text-green-400' : 'text-yellow-400'}>
              {result.container.name}
              {result.container.supported ? ' ✓' : ' ⚠'}
            </span>
          </div>

          {result.warnings.length > 0 && (
            <div className="bg-yellow-900/30 border border-yellow-700 rounded p-3">
              <p className="text-sm font-medium text-yellow-400 mb-2">警告</p>
              <ul className="text-sm text-yellow-300 space-y-1">
                {result.warnings.map((warning, idx) => (
                  <li key={idx}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          {result.suggestions.length > 0 && (
            <div className="bg-blue-900/30 border border-blue-700 rounded p-3">
              <p className="text-sm font-medium text-blue-400 mb-2">建议</p>
              <ul className="text-sm text-blue-300 space-y-1">
                {result.suggestions.map((suggestion, idx) => (
                  <li key={idx}>• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
          >
            取消
          </button>
          <button
            onClick={onUseAnyway}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition"
          >
            仍然播放
          </button>
          <button
            onClick={onInstallLibmpv}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 rounded transition"
          >
            安装 libmpv
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormatWarningModal;
