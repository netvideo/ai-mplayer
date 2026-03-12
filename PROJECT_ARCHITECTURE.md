# ai-mplayer 项目架构文档

## 技术栈

### 前端
- **React 18**: UI框架
- **TypeScript**: 类型安全
- **Vite**: 构建工具
- **Tailwind CSS**: 样式框架
- **i18next**: 国际化
- **Tauri API**: 原生系统交互

### 后端（Tauri）
- **Rust**: 原生性能
- **libmpv**: 媒体播放引擎（待集成）
- **sysinfo**: 系统信息获取
- **serde**: 序列化

## 项目结构

```
ai-mplayer/
├── src/                          # 前端源码
│   ├── components/               # React组件
│   │   ├── Player.tsx           # 播放器主界面
│   │   ├── ControlBar.tsx       # 控制栏
│   │   ├── Sidebar.tsx          # 侧边栏（设置/字幕/弹幕/AI）
│   │   ├── SubtitleRenderer.tsx # 字幕渲染
│   │   ├── DanmakuRenderer.tsx  # 弹幕渲染
│   │   └── HelpOverlay.tsx      # 帮助覆盖层
│   ├── contexts/                 # React Context状态管理
│   │   ├── PlayerContext.tsx    # 播放器状态
│   │   └── SettingsContext.tsx  # 设置状态
│   ├── services/                 # 业务逻辑服务
│   │   ├── MediaService.ts      # 媒体文件处理
│   │   ├── HardwareService.ts   # 硬件检测
│   │   ├── AIService.ts         # AI服务（ASR/翻译/Ollama）
│   │   └── SubtitleService.ts   # 字幕处理
│   ├── i18n/                     # 国际化
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── zh-CN.ts
│   │       └── en-US.ts
│   ├── App.tsx                   # 主应用组件
│   ├── main.tsx                  # 入口
│   └── index.css                 # 样式
├── src-tauri/                    # Tauri后端
│   ├── src/
│   │   └── main.rs              # Rust主程序
│   ├── Cargo.toml               # Rust依赖
│   └── tauri.conf.json          # Tauri配置
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 核心功能模块

### 1. 播放器核心（待完善）
- 集成libmpv实现实时解码播放
- 支持硬件加速解码
- 格式检测与解码器管理

### 2. 硬件检测与自动配置
- CPU/GPU/内存检测
- 能力评估
- 自动选择最佳配置
- 禁用不支持的功能并显示原因

### 3. 字幕系统
- 优先级：外挂 > 内置 > ASR
- SRT/ASS格式支持
- AI实时ASR识别
- AI字幕翻译（本地/云端）
- 缓冲机制抵消延迟

### 4. AI增强
- Ollama API集成
- 主流大模型API支持
- 本地/云端模型选择
- 画质增强

### 5. P2P弹幕
- WebRTC实现
- 弹幕渲染与样式
- 弹幕设置

### 6. 国际化
- 中文/英文支持
- 易扩展其他语言

### 7. 国内优先
- 国内源配置
- 国内库优先选择

## 待开发功能

### 高优先级
- [ ] 集成libmpv到Tauri
- [ ] 实现媒体文件实时解码
- [ ] 完善格式检测和解码器安装引导
- [ ] 实现真实的硬件检测
- [ ] 字幕缓冲与同步机制

### 中优先级
- [ ] ASR模型集成（Whisper等）
- [ ] 翻译模型集成
- [ ] P2P弹幕网络
- [ ] 更多大模型API支持

### 低优先级
- [ ] 更多语言支持
- [ ] 主题定制
- [ ] 播放历史记录
- [ ] 播放列表

## 安装与开发

### 前置要求
- Node.js 18+
- Rust 1.70+
- Tauri CLI

### 开发命令
```bash
# 安装依赖
npm install

# 开发模式
npm run tauri:dev

# 构建生产版本
npm run tauri:build
```

## 设计原则

1. **简洁UI**: 遵循Windows 11设计风格
2. **性能优先**: 实时解码，不转码
3. **智能适配**: 根据硬件自动配置
4. **用户友好**: 详细的帮助提示
5. **国内优先**: 镜像源和库优先选择国内
