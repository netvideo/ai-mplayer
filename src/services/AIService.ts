export interface AISettings {
  ollamaEndpoint: string;
  cloudModelEndpoint: string;
  preferLocalModel: boolean;
  apiKey?: string;
}

export interface ASRResult {
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

export interface TranslationResult {
  original: string;
  translated: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export class AIService {
  private settings: AISettings;

  constructor(settings: AISettings) {
    this.settings = settings;
  }

  async checkOllamaAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.settings.ollamaEndpoint}/api/tags`, {
        method: 'GET',
      });
      return response.ok;
    } catch (e) {
      console.warn('Ollama not available:', e);
      return false;
    }
  }

  async getOllamaModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.settings.ollamaEndpoint}/api/tags`);
      const data = await response.json();
      return data.models?.map((m: any) => m.name) || [];
    } catch (e) {
      console.error('Failed to get Ollama models:', e);
      return [];
    }
  }

  async transcribeAudio(
    audioData: ArrayBuffer,
    useLocal: boolean,
    language?: string
  ): Promise<ASRResult[]> {
    if (useLocal) {
      return this.transcribeWithLocalModel(audioData, language);
    }
    return this.transcribeWithCloudModel(audioData, language);
  }

  private async transcribeWithLocalModel(
    audioData: ArrayBuffer,
    language?: string
  ): Promise<ASRResult[]> {
    console.log('Transcribing with local model...');
    return [
      { text: '这是本地ASR识别的示例文本', startTime: 0, endTime: 3, confidence: 0.95 },
    ];
  }

  private async transcribeWithCloudModel(
    audioData: ArrayBuffer,
    language?: string
  ): Promise<ASRResult[]> {
    console.log('Transcribing with cloud model...');
    return [
      { text: '这是云端ASR识别的示例文本', startTime: 0, endTime: 3, confidence: 0.92 },
    ];
  }

  async translateText(
    text: string,
    sourceLang: string,
    targetLang: string,
    useLocal: boolean
  ): Promise<TranslationResult> {
    if (useLocal) {
      return this.translateWithLocalModel(text, sourceLang, targetLang);
    }
    return this.translateWithCloudModel(text, sourceLang, targetLang);
  }

  private async translateWithLocalModel(
    text: string,
    sourceLang: string,
    targetLang: string
  ): Promise<TranslationResult> {
    console.log('Translating with local model...');
    return {
      original: text,
      translated: `[本地翻译] ${text}`,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
    };
  }

  private async translateWithCloudModel(
    text: string,
    sourceLang: string,
    targetLang: string
  ): Promise<TranslationResult> {
    console.log('Translating with cloud model...');
    return {
      original: text,
      translated: `[云端翻译] ${text}`,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
    };
  }

  async enhanceVideoFrame(frameData: ImageData): Promise<ImageData> {
    console.log('Enhancing video frame...');
    return frameData;
  }

  async callOllama(
    prompt: string,
    model: string = 'llama2',
    options?: {
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<string> {
    try {
      const response = await fetch(`${this.settings.ollamaEndpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          options: {
            temperature: options?.temperature ?? 0.7,
            num_predict: options?.maxTokens ?? 512,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.response || '';
    } catch (e) {
      console.error('Ollama call failed:', e);
      throw e;
    }
  }
}
