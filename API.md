# API Documentation

ai-mplayer API 文档包含前端 API 和后端 Rust 命令的完整说明。

---

## 📋 目录

- [前端 API](#前端-api)
- [后端 API](#后端-api)
- [类型定义](#类型定义)
- [错误处理](#错误处理)
- [示例代码](#示例代码)

---

## 前端 API

### TauriPlayerService

播放器核心服务，通过 Tauri 与 libmpv 通信。

#### 获取实例

```typescript
import { TauriPlayerService } from './services/TauriPlayerService';

const playerService = TauriPlayerService.getInstance();
```

#### 方法

##### `loadMedia(filePath: string): Promise<void>`

加载媒体文件。

**参数：**
- `filePath` (string): 媒体文件的完整路径

**示例：**
```typescript
await playerService.loadMedia('C:/Videos/movie.mp4');
```

---

##### `playPause(): Promise<void>`

切换播放/暂停状态。

**示例：**
```typescript
await playerService.playPause();
```

---

##### `stop(): Promise<void>`

停止播放并卸载媒体。

**示例：**
```typescript
await playerService.stop();
```

---

##### `seek(time: number): Promise<void>`

跳转到指定时间。

**参数：**
- `time` (number): 目标时间（秒）

**示例：**
```typescript
await playerService.seek(120); // 跳转到 2:00
```

---

##### `setVolume(volume: number): Promise<void>`

设置音量。

**参数：**
- `volume` (number): 音量级别 (0-1)

**示例：**
```typescript
await playerService.setVolume(0.8); // 80% 音量
```

---

##### `toggleMute(): Promise<boolean>`

切换静音状态。

**返回值：**
- `boolean`: 新的静音状态

**示例：**
```typescript
const isMuted = await playerService.toggleMute();
console.log(`Muted: ${isMuted}`);
```

---

##### `setVideoRect(rect: VideoRect): Promise<void>`

设置视频渲染区域。

**参数：**
- `rect` (VideoRect): 视频区域坐标
  - `left` (number): 左边距比例 (0-1)
  - `right` (number): 右边距比例 (0-1)
  - `top` (number): 上边距比例 (0-1)
  - `bottom` (number): 下边距比例 (0-1)

**示例：**
```typescript
await playerService.setVideoRect({
  left: 0,
  right: 0,
  top: 0,
  bottom: 0.1 // 底部留出 10% 给控制栏
});
```

---

##### `getPlaybackState(): Promise<PlaybackState>`

获取当前播放状态。

**返回值：**
```typescript
interface PlaybackState {
  isPlaying: boolean;   // 是否正在播放
  position: number;     // 当前位置（秒）
  duration: number;     // 总时长（秒）
  volume: number;       // 音量 (0-1)
  muted: boolean;       // 是否静音
}
```

**示例：**
```typescript
const state = await playerService.getPlaybackState();
console.log(`Playing: ${state.isPlaying}`);
console.log(`Progress: ${state.position}/${state.duration}`);
```

---

##### `getMediaInfo(): Promise<MediaInfo>`

获取媒体文件信息。

**返回值：**
```typescript
interface MediaInfo {
  duration: number;
  width?: number;
  height?: number;
  hasVideo: boolean;
  hasAudio: boolean;
  videoCodec?: string;
  audioCodec?: string;
  audioTracks: MediaTrack[];
  subtitleTracks: MediaTrack[];
}

interface MediaTrack {
  id: number;
  type: string;
  language?: string;
  title?: string;
}
```

---

##### `setAudioTrack(trackId: number): Promise<void>`

切换音轨。

**参数：**
- `trackId` (number): 音轨 ID

---

##### `setSubtitleTrack(trackId: number): Promise<void>`

切换字幕轨道。

**参数：**
- `trackId` (number): 字幕轨道 ID

---

### SecureStorageService

安全存储服务，用于加密存储敏感数据。

#### 获取实例

```typescript
import { secureStorage } from './services/SecureStorageService';
```

#### 方法

##### `set(key: string, value: string): Promise<void>`

安全存储数据。

**参数：**
- `key` (string): 存储键名
- `value` (string): 要存储的值

**示例：**
```typescript
await secureStorage.set('api-key', 'sk-xxx');
```

---

##### `get(key: string): Promise<string | null>`

获取安全存储的数据。

**参数：**
- `key` (string): 存储键名

**返回值：**
- `string | null`: 存储的值，如果不存在返回 null

**示例：**
```typescript
const apiKey = await secureStorage.get('api-key');
if (apiKey) {
  console.log('API key retrieved');
}
```

---

##### `delete(key: string): Promise<void>`

删除安全存储的数据。

**参数：**
- `key` (string): 存储键名

---

### Path Validation Utilities

路径验证工具函数。

#### `validateFilePath(filePath: string): string | null`

验证并清理文件路径，防止路径遍历攻击。

**参数：**
- `filePath` (string): 文件路径

**返回值：**
- `string`: 清理后的路径
- `null`: 如果路径不安全

**示例：**
```typescript
import { validateFilePath } from './utils/pathValidation';

const safePath = validateFilePath('C:/Videos/movie.mp4');
if (safePath) {
  await playerService.loadMedia(safePath);
}
```

---

#### `isPathSafe(filePath: string): boolean`

检查路径是否安全。

**参数：**
- `filePath` (string): 文件路径

**返回值：**
- `boolean`: 是否安全

---

#### `isValidOllamaEndpoint(endpoint: string): boolean`

验证 Ollama API 端点 URL。

**参数：**
- `endpoint` (string): API 端点 URL

**返回值：**
- `boolean`: 是否有效

**示例：**
```typescript
const isValid = isValidOllamaEndpoint('http://localhost:11434');
if (isValid) {
  // 使用端点
}
```

---

### Context Hooks

#### `useSettings()`

获取设置上下文。

```typescript
import { useSettings } from './contexts/SettingsContext';

function MyComponent() {
  const { settings, updateSettings } = useSettings();
  
  return (
    <div>
      <p>Language: {settings.language}</p>
      <button onClick={() => updateSettings({ language: 'en-US' })}>
        Switch to English
      </button>
    </div>
  );
}
```

---

#### `useSubtitle()`

获取字幕上下文。

```typescript
import { useSubtitle } from './contexts/SubtitleContext';

function MyComponent() {
  const { state, setEnabled, setCurrentTime } = useSubtitle();
  
  return (
    <div>
      <p>Subtitle: {state.currentCue?.text}</p>
    </div>
  );
}
```

---

## 后端 API

### Rust Commands

#### `secure_store_set`

安全存储敏感数据。

**参数：**
- `key` (String): 存储键名
- `value` (String): 要存储的值

**返回值：**
- `Result<(), String>`: 成功或错误信息

**调用示例：**
```typescript
import { invoke } from '@tauri-apps/api/core';

await invoke('secure_store_set', {
  key: 'api-key',
  value: 'sk-xxx'
});
```

---

#### `secure_store_get`

获取安全存储的数据。

**参数：**
- `key` (String): 存储键名

**返回值：**
- `Result<Option<String>, String>`: 存储的值或错误

**调用示例：**
```typescript
const value = await invoke('secure_store_get', { key: 'api-key' });
```

---

#### `secure_store_delete`

删除安全存储的数据。

**参数：**
- `key` (String): 存储键名

**返回值：**
- `Result<(), String>`: 成功或错误信息

---

#### `get_window_hwnd`

获取窗口句柄（用于 libmpv 集成）。

**返回值：**
- `String`: 窗口句柄字符串

**调用示例：**
```typescript
const hwnd = await invoke('get_window_hwnd');
```

---

### libmpv Plugin API

通过 `tauri-plugin-libmpv-api` 提供：

#### `init(config: MpvConfig): Promise<void>`

初始化 MPV 播放器。

**参数：**
- `config` (MpvConfig): MPV 配置选项

```typescript
interface MpvConfig {
  vo?: string;           // 视频输出驱动
  hwdec?: string;        // 硬件解码
  'keep-open'?: string;  // 保持打开
  'force-window'?: string;
  pause?: string;
}
```

---

#### `command(name: string, args: string[]): Promise<void>`

执行 MPV 命令。

**常用命令：**
- `loadfile`: 加载文件
- `playlist-next`: 下一首
- `playlist-prev`: 上一首
- `screenshot`: 截图

---

#### `setProperty(name: string, value: unknown, format: string): Promise<void>`

设置 MPV 属性。

**常用属性：**
- `volume`: 音量
- `pause`: 暂停状态
- `speed`: 播放速度
- `fullscreen`: 全屏状态

---

#### `getProperty(name: string, format: string): Promise<unknown>`

获取 MPV 属性。

---

#### `setVideoMarginRatio(rect: VideoRect): Promise<void>`

设置视频边距比例。

---

## 类型定义

### TypeScript 类型

```typescript
// 播放状态
interface PlaybackState {
  isPlaying: boolean;
  position: number;
  duration: number;
  volume: number;
  muted: boolean;
}

// 媒体信息
interface MediaInfo {
  duration: number;
  width?: number;
  height?: number;
  hasVideo: boolean;
  hasAudio: boolean;
  videoCodec?: string;
  audioCodec?: string;
  audioTracks: MediaTrack[];
  subtitleTracks: MediaTrack[];
}

// 媒体轨道
interface MediaTrack {
  id: number;
  type: string;
  language?: string;
  title?: string;
}

// 视频区域
interface VideoRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

// 字幕提示
interface SubtitleCue {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
}

// 字幕轨道
interface SubtitleTrack {
  id: number;
  type: 'internal' | 'external' | 'asr';
  language: string;
  name: string;
  cues: SubtitleCue[];
}

// 设置
interface Settings {
  language: string;
  hardware: HardwareInfo | null;
  ai: AISettings;
  subtitles: SubtitleSettings;
  danmaku: DanmakuSettings;
  preferChinaMirror: boolean;
}

// 硬件信息
interface HardwareInfo {
  cpu: { cores: number; speed: number };
  gpu: { model: string; vram: number };
  memory: { total: number; available: number };
}
```

---

## 错误处理

### 前端错误处理

```typescript
try {
  await playerService.loadMedia(filePath);
} catch (error) {
  console.error('Failed to load media:', error);
  // 显示用户友好的错误消息
  showErrorMessage('无法加载媒体文件，请检查文件是否存在');
}
```

### 后端错误处理

Rust 命令返回 `Result<T, String>`：

```typescript
const result = await invoke('some_command', args);
if (result) {
  // 成功
} else {
  // 失败
}
```

---

## 示例代码

### 完整播放器组件

```typescript
import { useEffect, useRef, useState } from 'react';
import { TauriPlayerService } from '../services/TauriPlayerService';

const Player = () => {
  const playerServiceRef = useRef<TauriPlayerService | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    playerServiceRef.current = TauriPlayerService.getInstance();
    
    // 定时更新播放状态
    const interval = setInterval(async () => {
      const state = await playerServiceRef.current?.getPlaybackState();
      if (state) {
        setIsPlaying(state.isPlaying);
        setCurrentTime(state.position);
        setDuration(state.duration);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handlePlayPause = async () => {
    await playerServiceRef.current?.playPause();
  };

  const handleSeek = async (time: number) => {
    await playerServiceRef.current?.seek(time);
  };

  return (
    <div>
      <div className="video-container" />
      <div className="controls">
        <button onClick={handlePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => handleSeek(Number(e.target.value))}
        />
        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>
    </div>
  );
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
```

### 安全存储 API 密钥

```typescript
import { secureStorage } from '../services/SecureStorageService';
import { isValidOllamaEndpoint } from '../utils/pathValidation';

const configureAIService = async (endpoint: string, apiKey: string) => {
  // 验证端点
  if (!isValidOllamaEndpoint(endpoint)) {
    throw new Error('Invalid endpoint URL');
  }

  // 保存到安全存储
  await secureStorage.set('ollama-endpoint', endpoint);
  await secureStorage.set('api-key', apiKey);

  console.log('AI service configured');
};

const getAIConfig = async () => {
  const endpoint = await secureStorage.get('ollama-endpoint');
  const apiKey = await secureStorage.get('api-key');
  
  return { endpoint, apiKey };
};
```

---

## 📚 相关文档

- [DEVELOPMENT.md](./DEVELOPMENT.md) - 开发环境搭建
- [AGENTS.md](./AGENTS.md) - 代码规范
- [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md) - 架构设计

---

**Last Updated**: 2024
