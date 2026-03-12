export interface CPUInfo {
  model: string;
  cores: number;
  threads: number;
  baseSpeedGHz: number;
}

export interface GPUInfo {
  model: string;
  vramGB: number;
  supportsHardwareDecode: boolean;
  supportsAI: boolean;
}

export interface MemoryInfo {
  totalGB: number;
  availableGB: number;
}

export interface HardwareInfo {
  cpu: CPUInfo;
  gpus: GPUInfo[];
  memory: MemoryInfo;
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
