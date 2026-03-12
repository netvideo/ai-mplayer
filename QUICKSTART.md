# ai-mplayer 快速开始指南

## 环境准备

### 1. 安装 Node.js
下载并安装 Node.js 18 或更高版本：
https://nodejs.org/

### 2. 安装 Rust
下载并安装 Rust：
https://www.rust-lang.org/tools/install

Windows用户可以使用 `rustup-init.exe`

### 3. 安装 Tauri CLI
```bash
npm install -g @tauri-apps/cli
```

### 4. 安装系统依赖（Windows）
安装 Visual Studio Build Tools（包含C++开发工具）：
https://visualstudio.microsoft.com/visual-cpp-build-tools/

## 项目安装

```bash
# 进入项目目录
cd ai-mplayer12

# 安装依赖
npm install
```

## 开发运行

```bash
# 启动开发服务器
npm run tauri:dev
```

这将同时启动：
- Vite 开发服务器（http://localhost:1420）
- Tauri 应用窗口

## 项目构建

```bash
# 构建生产版本
npm run tauri:build
```

构建完成后，安装包位于：
`src-tauri/target/release/bundle/`

## 下一步

项目框架已搭建完成，接下来需要：

1. **集成 libmpv** - 实现真正的媒体播放功能
2. **完善硬件检测** - 使用 Rust 获取真实硬件信息
3. **集成 AI 模型** - 实现 ASR 和翻译功能
4. **P2P 弹幕** - 实现弹幕网络功能

详细信息请查看 `PROJECT_ARCHITECTURE.md`
