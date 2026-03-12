export interface HardwareInfo {
  cpu: {
    model: string;
    cores: number;
    threads: number;
    baseSpeedGHz: number;
  };
  gpu: {
    model: string;
    vramGB: number;
    supportsHardwareDecode: boolean;
    supportsAI: boolean;
  }[];
  memory: {
    totalGB: number;
    availableGB: number;
  };
  storage: {
    freeGB: number;
  };
}

export interface CapabilityAssessment {
  canPlay4K: boolean;
  canPlay8K: boolean;
  canUseHardwareDecode: boolean;
  canUseLocalASR: boolean;
  canUseLocalTranslation: boolean;
  canUseAIEnhancement: boolean;
  recommendedDecoder: 'software' | 'hardware';
  disabledFeatures: { name: string; reason: string }[];
}

export class HardwareService {
  private static hardwareInfo: HardwareInfo | null = null;

  static async detectHardware(): Promise<HardwareInfo> {
    if (this.hardwareInfo) {
      return this.hardwareInfo;
    }

    const info: HardwareInfo = {
      cpu: {
        model: 'Unknown CPU',
        cores: navigator.hardwareConcurrency || 4,
        threads: navigator.hardwareConcurrency || 4,
        baseSpeedGHz: 3.0,
      },
      gpu: [
        {
          model: 'Unknown GPU',
          vramGB: 2,
          supportsHardwareDecode: true,
          supportsAI: true,
        },
      ],
      memory: {
        totalGB: 16,
        availableGB: 8,
      },
      storage: {
        freeGB: 100,
      },
    };

    try {
      if (navigator.userAgent.includes('Windows')) {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            info.gpu[0].model = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          }
        }
      }
    } catch (e) {
      console.warn('GPU detection failed:', e);
    }

    this.hardwareInfo = info;
    return info;
  }

  static async assessCapabilities(
    mediaInfo?: { width: number; height: number; codec: string }
  ): Promise<CapabilityAssessment> {
    const hardware = await this.detectHardware();
    const disabledFeatures: { name: string; reason: string }[] = [];

    const hasEnoughCores = hardware.cpu.cores >= 4;
    const hasEnoughMemory = hardware.memory.totalGB >= 8;
    const hasEnoughVRAM = hardware.gpu.some(g => g.vramGB >= 4);
    const hasAIGPU = hardware.gpu.some(g => g.supportsAI);

    const canPlay4K = hasEnoughCores && hasEnoughMemory;
    const canPlay8K = hasEnoughCores && hasEnoughMemory && hasEnoughVRAM;
    const canUseHardwareDecode = hardware.gpu.some(g => g.supportsHardwareDecode);
    const canUseLocalASR = hasEnoughCores && hasEnoughMemory && hasAIGPU;
    const canUseLocalTranslation = hasEnoughCores && hasEnoughMemory && hasAIGPU && hardware.memory.totalGB >= 16;
    const canUseAIEnhancement = hasEnoughVRAM && hasAIGPU;

    if (!canUseLocalASR) {
      disabledFeatures.push({
        name: '本地ASR',
        reason: `需要4核CPU、8GB内存和支持AI的GPU（当前: ${hardware.cpu.cores}核/${hardware.memory.totalGB}GB）`,
      });
    }

    if (!canUseLocalTranslation) {
      disabledFeatures.push({
        name: '本地翻译',
        reason: `需要16GB内存（当前: ${hardware.memory.totalGB}GB）`,
      });
    }

    if (!canUseAIEnhancement) {
      disabledFeatures.push({
        name: 'AI画质增强',
        reason: '需要4GB以上显存的支持AI的GPU',
      });
    }

    return {
      canPlay4K,
      canPlay8K,
      canUseHardwareDecode,
      canUseLocalASR,
      canUseLocalTranslation,
      canUseAIEnhancement,
      recommendedDecoder: canUseHardwareDecode ? 'hardware' : 'software',
      disabledFeatures,
    };
  }
}
