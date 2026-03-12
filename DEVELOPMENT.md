# 开发指南 (Development Guide)

本指南帮助开发者快速搭建 ai-mplayer 的开发环境并开始贡献代码。

---

## 📋 目录

- [环境要求](#-环境要求)
- [快速开始](#-快速开始)
- [项目结构](#-项目结构)
- [开发工作流](#-开发工作流)
- [构建命令](#-构建命令)
- [调试技巧](#-调试技巧)
- [代码规范](#-代码规范)
- [提交规范](#-提交规范)
- [常见问题](#-常见问题)

---

## 🖥️ 环境要求

### 必需依赖

#### 1. Node.js

```bash
# 使用 nvm-windows 安装（推荐）
nvm install 20
nvm use 20

# 验证安装
node --version  # v20.x.x
npm --version   # 10.x.x
```

#### 2. Rust

```bash
# 使用 rustup 安装
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# Windows: 下载并运行 rustup-init.exe

# 验证安装
rustc --version    # 1.70+
cargo --version
```

#### 3. Windows SDK

安装 **Visual Studio 2022** 并选择以下工作负载：
- 使用 C++ 的桌面开发
- Windows 11 SDK (10.0.22621.0 或更高)

#### 4. WebView2 Runtime

Windows 11 已预装。如缺失，从 [Microsoft Edge WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) 下载。

### 可选依赖

- **Git**: 版本控制
- **VS Code**: 推荐的 IDE
- **Tauri CLI**: `cargo install tauri-cli`

---

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/[your-username]/ai-mplayer.git
cd ai-mplayer
```

### 2. 安装依赖

```bash
# 前端依赖
npm install

# Rust 依赖（首次运行会自动安装）
cd src-tauri
cargo fetch
cd ..
```

### 3. 配置 libmpv

```bash
# 复制 libmpv DLL 到正确位置
npm run copy:dlls

# 或者手动复制
# 确保 src-tauri/lib/ 目录下有:
# - libmpv-2.dll
# - libmpv-wrapper.dll
```

### 4. 启动开发服务器

```bash
# 方式一：完整开发模式（推荐）
npm run tauri:dev

# 方式二：仅前端开发（浏览器）
npm run dev

# 方式三：分别启动
# 终端 1: npm run dev
# 终端 2: cd src-tauri && cargo run
```

### 5. 访问应用

- **完整模式**: 自动打开 Tauri 窗口
- **浏览器模式**: 访问 http://localhost:3001

---

## 📁 项目结构

```
ai-mplayer/
├── 📁 src/                     # 前端源码
│   ├── 📁 components/          # React 组件
│   │   ├── Player.tsx         # 播放器主界面
│   │   ├── ControlBar.tsx     # 控制栏
│   │   ├── Sidebar.tsx        # 侧边栏
│   │   ├── SubtitleRenderer.tsx
│   │   ├── DanmakuRenderer.tsx
│   │   └── HelpOverlay.tsx
│   ├── 📁 contexts/            # React Context
│   │   ├── PlayerContext.tsx
│   │   ├── SettingsContext.tsx
│   │   └── SubtitleContext.tsx
│   ├── 📁 services/            # 业务逻辑
│   │   ├── TauriPlayerService.ts
│   │   ├── AIService.ts
│   │   ├── HardwareService.ts
│   │   ├── SecureStorageService.ts
│   │   └── subtitle/
│   │       ├── SubtitleManager.ts
│   │       └── SRTParser.ts
│   ├── 📁 types/               # TypeScript 类型
│   ├── 📁 utils/               # 工具函数
│   ├── 📁 i18n/                # 国际化
│   ├── App.tsx
│   └── main.tsx
│
├── 📁 src-tauri/               # Tauri 后端
│   ├── 📁 src/
│   │   └── main.rs            # Rust 主程序
│   ├── 📁 capabilities/        # 权限配置
│   ├── 📁 icons/               # 应用图标
│   ├── 📁 lib/                 # libmpv DLL
│   ├── Cargo.toml
│   └── tauri.conf.json
│
├── 📁 docs/                    # 文档（可选）
├── 📁 scripts/                 # 构建脚本
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 🔄 开发工作流

### 分支策略

```
main           # 生产分支，稳定版本
develop        # 开发分支，集成测试
feature/*      # 功能分支
bugfix/*       # 修复分支
hotfix/*       # 紧急修复
release/*      # 发布分支
```

### 开发流程

```bash
# 1. 从 develop 创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# 2. 开发并提交代码
# ... 编写代码 ...
git add .
git commit -m "feat: add new feature"

# 3. 推送到远程
git push origin feature/my-feature

# 4. 创建 Pull Request 到 develop 分支

# 5. Code Review 后合并
```

---

## 🔨 构建命令

### 前端构建

```bash
# 开发模式（热重载）
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview

# 类型检查
npx tsc --noEmit

# 代码检查
npm run lint
```

### Tauri 构建

```bash
# 开发模式
npm run tauri:dev

# 构建生产版本
npm run tauri:build

# 仅构建前端（Tauri 开发模式）
npm run tauri:build:front
```

### 工具脚本

```bash
# 复制 DLL 文件
npm run copy:dlls

# 切换播放器模式
npm run switch:simple   # 简单模式
npm run switch:mpv      # MPV 模式
```

### 测试

```bash
# 前端测试（需要配置 Vitest）
npx vitest

# Rust 测试
cd src-tauri
cargo test

# 运行单个测试
cargo test test_name
```

---

## 🐛 调试技巧

### 前端调试

#### Chrome DevTools

Tauri 应用可以使用 Chrome DevTools 调试：

1. 启动应用后按 `Ctrl+Shift+I` (Windows) 或 `Cmd+Option+I` (macOS)
2. 或使用快捷键 `F12`
3. 在 Console 查看日志
4. 在 Network 查看网络请求
5. 在 Elements 检查 DOM

#### VS Code 调试

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "attach",
      "name": "Tauri Frontend",
      "port": 9222,
      "webRoot": "${workspaceFolder}",
      "sourceMapPathOverrides": {
        "tauri:///*": "${workspaceFolder}/*"
      }
    }
  ]
}
```

### Rust 调试

#### 日志输出

```rust
// 在 Rust 代码中使用 println! 或 log 宏
println!("Debug: value = {}", value);
eprintln!("Error: {}", error);
```

#### VS Code 调试 Rust

1. 安装 "rust-analyzer" 扩展
2. 在代码中设置断点
3. 按 F5 启动调试

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "lldb",
      "request": "launch",
      "name": "Tauri Backend",
      "cargo": {
        "args": ["build", "--manifest-path=src-tauri/Cargo.toml"]
      },
      "args": []
    }
  ]
}
```

### 常见问题调试

#### 问题 1: libmpv 无法加载

```bash
# 检查 DLL 是否存在
ls src-tauri/lib/

# 确认 DLL 在正确位置
# 应该在 src-tauri/lib/ 目录下，不是 src-tauri/target/
```

#### 问题 2: 视频无法播放

```bash
# 查看 Rust 控制台输出
# 检查 MPV 日志
tail -f src-tauri/mpv_debug.log
```

#### 问题 3: 热重载不工作

```bash
# 重启开发服务器
# 清除缓存
rm -rf node_modules/.vite
npm run tauri:dev
```

---

## 📝 代码规范

### TypeScript/JavaScript

#### 命名规范

```typescript
// 组件: PascalCase
const PlayerComponent = () => { }

// 函数: camelCase
const playVideo = () => { }

// 常量: UPPER_SNAKE_CASE
const SEEK_STEP_SECONDS = 5;

// 类型: PascalCase
interface PlaybackState { }
type PlayerMode = 'simple' | 'mpv';

// 文件: 与组件/功能同名
// Player.tsx, useSettings.ts, TauriPlayerService.ts
```

#### 代码格式

```typescript
// 使用 2 空格缩进
// 使用单引号
// 行尾分号
// 最大行长度 100 字符

// ✅ 好的示例
const formatTime = (seconds: number): string => {
  if (!isFinite(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// ❌ 不好的示例
function formatTime(seconds) {
    if(seconds<0)return"00:00"
    const mins=Math.floor(seconds/60)
    const secs=Math.floor(seconds%60)
    return mins.toString().padStart(2,'0')+":"+secs.toString().padStart(2,'0')
}
```

#### 导入排序

```typescript
// 1. React
import { useState, useEffect } from 'react';

// 2. Tauri API
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';

// 3. 内部模块
import { useSettings } from '../contexts/SettingsContext';
import { TauriPlayerService } from '../services/TauriPlayerService';

// 4. 类型
import type { PlaybackState, MediaInfo } from '../types/player';
```

### Rust

#### 命名规范

```rust
// 函数/变量: snake_case
fn play_video() { }
let current_time = 0.0;

// 类型/结构体: PascalCase
struct MediaInfo { }
type PlayerResult<T> = Result<T, PlayerError>;

// 常量: UPPER_SNAKE_CASE
const DEFAULT_VOLUME: f64 = 1.0;

// 模块: snake_case
mod player_service;
```

#### 错误处理

```rust
// ✅ 好的示例
fn load_media(path: &str) -> Result<(), String> {
    let file = fs::File::open(path)
        .map_err(|e| format!("Failed to open file: {}", e))?;
    
    // 处理文件...
    Ok(())
}

// ❌ 不好的示例
fn load_media(path: &str) {
    let file = fs::File::open(path).unwrap(); // 可能 panic
}
```

---

## 📤 提交规范

### Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型 (Type)

- **feat**: 新功能
- **fix**: 修复 bug
- **docs**: 文档更新
- **style**: 代码格式（不影响功能）
- **refactor**: 重构
- **perf**: 性能优化
- **test**: 测试相关
- **chore**: 构建/工具
- **security**: 安全修复

### 示例

```bash
# 新功能
feat(player): add keyboard shortcuts for playback control

# 修复
fix(mpv): resolve video rendering issue on Windows 11

# 文档
docs(readme): update installation instructions

# 重构
refactor(services): extract common logic to utils

# 安全
security(storage): encrypt API keys using OS keychain
```

---

## ❓ 常见问题

### Q: 构建失败，提示找不到 libmpv

**A**: 
1. 确保 DLL 文件在 `src-tauri/lib/` 目录
2. 运行 `npm run copy:dlls`
3. 检查 DLL 是否为 64 位版本

### Q: 热重载很慢

**A**:
1. 确保使用 SSD
2. 关闭不必要的 VS Code 扩展
3. 增加 Node.js 内存限制：`NODE_OPTIONS="--max-old-space-size=4096"`

### Q: Rust 编译报错

**A**:
1. 更新 Rust: `rustup update`
2. 清理构建: `cargo clean`
3. 重新构建: `cargo build`

### Q: 如何添加新功能？

**A**:
1. 阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)
2. 从 develop 分支创建 feature 分支
3. 编写代码和测试
4. 提交 Pull Request

### Q: 如何报告 Bug？

**A**:
1. 检查是否已存在相同 issue
2. 使用 issue 模板创建新 issue
3. 提供详细的复现步骤
4. 附上错误日志和截图

---

## 📚 更多资源

- [AGENTS.md](./AGENTS.md) - 编码规范详细说明
- [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md) - 架构设计
- [API.md](./API.md) - API 接口文档
- [Tauri 文档](https://tauri.app/v1/guides/)
- [React 文档](https://react.dev/)
- [Rust 文档](https://doc.rust-lang.org/)

---

## 💡 提示

1. **经常提交**: 小步提交，便于回滚和 review
2. **写测试**: 新功能必须包含测试
3. **更新文档**: 代码变更时同步更新文档
4. **保持同步**: 定期 pull 最新代码避免冲突
5. **寻求帮助**: 遇到问题及时在 Discussion 提问

---

**Happy Coding!** 🎉
