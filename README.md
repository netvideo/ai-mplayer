# ai-mplayer - Windows 11 智能播放器

<p align="center">
  <img src="src-tauri/icons/icon.png" alt="ai-mplayer Logo" width="120">
</p>

<p align="center">
  <strong>一个功能强大的 Windows 11 智能媒体播放器</strong>
</p>

<p align="center">
  <a href="#-功能特性">功能特性</a> •
  <a href="#-快速开始">快速开始</a> •
  <a href="#-系统要求">系统要求</a> •
  <a href="#-安装指南">安装指南</a> •
  <a href="#-使用指南">使用指南</a> •
  <a href="#-文档">文档</a> •
  <a href="#-贡献">贡献</a> •
  <a href="#-许可证">许可证</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/platform-Windows%2011-blue" alt="Platform">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/version-1.0.0-orange" alt="Version">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome">
</p>

---

## 🎯 项目简介

ai-mplayer 是一个专为 Windows 11 设计的现代化智能媒体播放器，采用 **Tauri** 构建高性能原生应用，结合 **React** 提供流畅的用户体验。支持实时解码播放、AI 增强、智能字幕处理等先进功能。

### 为什么选择 ai-mplayer？

- 🚀 **极致性能** - 基于 Rust + libmpv，实时解码无转码
- 🤖 **AI 增强** - 集成 Ollama 和主流大模型 API
- 🎬 **智能字幕** - 支持 ASR 自动识别、实时翻译
- 💬 **P2P 弹幕** - WebRTC 实现去中心化弹幕系统
- 🎨 **精美设计** - Windows 11 原生风格 UI
- 🌍 **国际化** - 中文优先，支持多语言

---

## ✨ 功能特性

### 核心播放功能

| 功能 | 状态 | 说明 |
|------|------|------|
| 📂 文件打开 | ✅ | 支持点击和拖放打开视频文件 |
| ▶️ 播放控制 | ✅ | 播放/暂停/停止，进度条拖动 |
| 🔊 音量控制 | ✅ | 音量调节和静音功能 |
| ⏱️ 时间显示 | ✅ | 当前时间和总时长显示 |
| ⌨️ 快捷键 | ✅ | 空格暂停、F全屏、方向键控制 |

### 高级功能

| 功能 | 状态 | 说明 |
|------|------|------|
| 🤖 AI ASR | 🚧 | 自动语音识别生成字幕 |
| 🌐 AI 翻译 | 🚧 | 实时字幕翻译 |
| ✨ AI 增强 | 🚧 | 视频画质增强 |
| 💬 P2P 弹幕 | 🚧 | 去中心化弹幕系统 |
| 🔧 硬件检测 | ✅ | 自动检测 CPU/GPU/内存 |
| 📊 格式支持 | ✅ | 自动检测媒体格式兼容性 |

> **图例说明：** ✅ 已完成 | 🟡 部分完成 | 🚧 开发中 | ⏳ 规划中

---

## 💻 系统要求

### 最低要求

- **操作系统**: Windows 11 (64-bit)
- **内存**: 4 GB RAM
- **存储**: 500 MB 可用空间
- **显卡**: 支持 DirectX 12
- **网络**: 可选（用于 AI 功能）

### 推荐配置

- **操作系统**: Windows 11 23H2 或更高
- **内存**: 8 GB RAM 或更多
- **存储**: 1 GB 可用空间（SSD 推荐）
- **显卡**: NVIDIA/AMD 独立显卡（支持硬件解码）
- **网络**: 宽带连接（用于 AI 功能）

---

## 🚀 快速开始

### 方法一：下载预构建版本（推荐）

1. 访问 [Releases](https://github.com/[your-username]/ai-mplayer/releases) 页面
2. 下载最新版本的 `.msi` 安装包
3. 双击安装包按提示完成安装
4. 从开始菜单启动 ai-mplayer

### 方法二：从源码构建

#### 前置要求

- [Node.js](https://nodejs.org/) 18+ 
- [Rust](https://rustup.rs/) 1.70+
- [Visual Studio 2022](https://visualstudio.microsoft.com/) (Windows SDK)

#### 构建步骤

```bash
# 1. 克隆仓库
git clone https://github.com/[your-username]/ai-mplayer.git
cd ai-mplayer

# 2. 安装依赖
npm install

# 3. 运行开发版本
npm run tauri:dev

# 4. 构建生产版本
npm run tauri:build
```

详细构建说明请参考 [开发指南](./DEVELOPMENT.md)

---

## 📖 使用指南

### 基本操作

| 操作 | 方法 |
|------|------|
| 打开文件 | 点击 📂 按钮或按 `Ctrl+O` |
| 播放/暂停 | 点击播放按钮或按 `空格` |
| 全屏 | 按 `F` 键 |
| 静音 | 按 `M` 键或点击音量图标 |
| 前进/后退 | 按 `←` / `→` 方向键（5秒） |
| 音量调节 | 按 `↑` / `↓` 方向键 |
| 打开设置 | 点击 ⚙️ 按钮或按 `S` |
| 显示帮助 | 按 `H` 或 `?` |

### 文件拖放

支持直接将视频文件拖放到播放器窗口中打开。

### 字幕设置

- 按 `C` 键打开字幕设置面板
- 支持外挂字幕文件（SRT 格式）
- 自动加载同名字幕文件

### 弹幕设置

- 按 `D` 键打开弹幕面板
- 支持调整弹幕透明度、速度、字体大小

---

## 📚 文档

### 用户文档

- [快速开始指南](./QUICKSTART.md) - 5分钟上手
- [常见问题解答](./TROUBLESHOOTING.md) - 故障排除
- [隐私政策](./PRIVACY.md) - 数据处理方式
- [使用条款](./DISCLAIMER.md) - 免责声明

### 开发文档

- [项目架构](./PROJECT_ARCHITECTURE.md) - 技术架构详解
- [开发指南](./DEVELOPMENT.md) - 开发环境搭建
- [代码规范](./AGENTS.md) - 编码规范
- [API 文档](./API.md) - 接口文档
- [安全政策](./SECURITY.md) - 安全相关信息

### 项目文档

- [项目总结](./PROJECT_SUMMARY.md) - 项目里程碑
- [变更日志](./CHANGELOG.md) - 版本更新记录
- [贡献指南](./CONTRIBUTING.md) - 如何参与贡献
- [第三方许可](./THIRD_PARTY_LICENSES.md) - 依赖许可证

---

## 🛠️ 技术栈

### 前端

- **框架**: React 18 + TypeScript
- **构建**: Vite 5
- **样式**: Tailwind CSS
- **状态**: React Context
- **国际化**: i18next
- **UI 组件**: 自定义组件

### 后端

- **框架**: Tauri 2.0 (Rust)
- **媒体引擎**: libmpv
- **系统交互**: Tauri API
- **序列化**: serde

### 开发工具

- **类型检查**: TypeScript
- **代码规范**: ESLint + Prettier
- **版本控制**: Git
- **CI/CD**: GitHub Actions

---

## 🤝 贡献

我们欢迎所有形式的贡献！

### 如何贡献

1. **Fork** 本仓库
2. 创建你的 **Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **提交** 你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. **推送** 到分支 (`git push origin feature/AmazingFeature`)
5. 创建 **Pull Request**

详细指南请参考 [CONTRIBUTING.md](./CONTRIBUTING.md)

### 贡献者

感谢所有为本项目做出贡献的人！

<a href="https://github.com/[your-username]/ai-mplayer/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=[your-username]/ai-mplayer" alt="Contributors" />
</a>

---

## 📄 许可证

本项目采用 [MIT 许可证](./LICENSE) 开源。

```
MIT License

Copyright (c) 2024 ai-mplayer contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

本项目包含的第三方组件有各自的许可证，详见 [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md)

---

## 🔒 安全

如果您发现安全漏洞，请负责任地披露：

- **GitHub Security Advisories**: [提交安全报告](https://github.com/[your-username]/ai-mplayer/security/advisories)
- **邮箱**: [your-security-email@example.com]

请不要在公开 issue 中披露安全漏洞。

详细信息请参考 [SECURITY.md](./SECURITY.md)

---

## 💬 社区

- **GitHub Discussions**: [加入讨论](https://github.com/[your-username]/ai-mplayer/discussions)
- **问题反馈**: [提交 Issue](https://github.com/[your-username]/ai-mplayer/issues)
- **邮件联系**: [your-email@example.com]

---

## 🗺️ 路线图

### 近期计划（v1.1.0）

- [ ] 完善字幕系统
- [ ] 集成 libmpv 完整功能
- [ ] 添加播放列表
- [ ] 支持更多视频格式

### 中期计划（v1.2.0）

- [ ] AI ASR 字幕识别
- [ ] 实时字幕翻译
- [ ] P2P 弹幕系统
- [ ] 视频画质增强

### 长期计划（v2.0.0）

- [ ] 支持 macOS 和 Linux
- [ ] DLNA/UPnP 投屏
- [ ] 在线流媒体支持
- [ ] 插件系统

---

## 🌟 赞助支持

如果这个项目对您有帮助，请考虑支持我们：

- ⭐ **Star** 这个项目
- 🐛 **报告** Bug
- 💡 **提出** 新功能建议
- 🔧 **贡献** 代码

---

<p align="center">
  Made with ❤️ by ai-mplayer contributors
</p>

<p align="center">
  <a href="https://github.com/[your-username]/ai-mplayer">GitHub</a> •
  <a href="https://github.com/[your-username]/ai-mplayer/issues">Issues</a> •
  <a href="https://github.com/[your-username]/ai-mplayer/releases">Releases</a>
</p>
