import type {
  HardwareInfo,
  CPUInfo,
  GPUInfo,
  MemoryInfo,
  CapabilityAssessment,
} from '../types/hardware';

export class HardwareDetector {
  private static cachedInfo: HardwareInfo | null = null;

  static async detectHardware(): Promise<HardwareInfo> {
    if (this.cachedInfo) {
      return this.cachedInfo;
    }

    const cpu = this.detectCPU();
    const gpus = this.detectGPU();
    const memory = this.detectMemory();

    const info: HardwareInfo = {
      cpu,
      gpus,
      memory,
    };

    this.cachedInfo = info;
    return info;
  }

  private static detectCPU(): CPUInfo {
    return {
      model: navigator.userAgent.includes('Windows') ? 'Unknown CPU' : 'Unknown CPU',
      cores: navigator.hardwareConcurrency || 4,
      threads: navigator.hardwareConcurrency || 4,
      baseSpeedGHz: 3.0,
    };
  }

  private static detectGPU(): GPUInfo[] {
    const gpus: GPUInfo[] = [];

    try {
      const canvas = document.createElement('canvas');
      const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;

      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo
          ? (gl.getParameter as any)(debugInfo.UNMASKED_RENDERER_WEBGL)
          : 'Unknown GPU';

        gpus.push({
          model: renderer,
          vramGB: 2,
          supportsHardwareDecode: true,
          supportsAI: true,
        });
      }
    } catch (e) {
      console.warn('GPU detection failed:', e);
      gpus.push({
        model: 'Unknown GPU',
        vramGB: 2,
        supportsHardwareDecode: true,
        supportsAI: true,
      });
    }

    return gpus;
  }

  private static detectMemory(): MemoryInfo {
    let totalGB = 16;
    let availableGB = 8;

    try {
      const performance = (navigator as any).performance;
      if (performance && performance.memory) {
        totalGB = Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024 / 1024);
        availableGB = Math.round(performance.memory.totalJSHeapSize / 1024 / 1024 / 1024);
      }
    } catch (e) {
      console.warn('Memory detection failed:', e);
    }

    return {
      totalGB: Math.max(totalGB, 4),
      availableGB: Math.max(availableGB, 2),
    };
  }

  static async assessCapabilities(
    _mediaInfo?: { width: number; height: number; codec: string }
  ): Promise<CapabilityAssessment> {
    const hardware = await this.detectHardware();

    const hasEnoughCores = hardware.cpu.cores >= 4;
    const hasEnoughMemory = hardware.memory.totalGB >= 8;
    const hasEnoughVRAM = hardware.gpus.some(g => g.vramGB >= 4);
    const hasAIGPU = hardware.gpus.some(g => g.supportsAI);

    const canPlay4K = hasEnoughCores && hasEnoughMemory;
    const canPlay8K = hasEnoughCores && hasEnoughMemory && hasEnoughVRAM;
    const canUseHardwareDecode = hardware.gpus.some(g => g.supportsHardwareDecode);
    const canUseLocalASR = hasEnoughCores && hasEnoughMemory && hasAIGPU;
    const canUseLocalTranslation = hasEnoughCores && hasEnoughMemory && hasAIGPU && hardware.memory.totalGB >= 16;
    const canUseAIEnhancement = hasEnoughVRAM && hasAIGPU;

    const disabledFeatures: { name: string; reason: string }[] = [];

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
