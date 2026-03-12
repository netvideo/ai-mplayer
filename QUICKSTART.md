# 快速开始指南

在 5 分钟内运行 ai-mplayer！

---

## 📋 目录

- [系统要求](#-系统要求)
- [安装步骤](#-安装步骤)
- [运行应用](#-运行应用)
- [基本操作](#-基本操作)
- [常见问题](#-常见问题)
- [下一步](#-下一步)

---

## 🖥️ 系统要求

### 最低配置

- **操作系统**: Windows 11 (64-bit)
- **内存**: 4 GB RAM
- **存储**: 500 MB 可用空间

### 必需软件

1. **Node.js** 18+ - [下载](https://nodejs.org/)
2. **Rust** 1.70+ - [下载](https://rustup.rs/)
3. **Visual Studio 2022** 或 Build Tools - [下载](https://visualstudio.microsoft.com/)

---

## 📦 安装步骤

### 方式一：使用预构建版本（最简单）

1. 访问 [Releases](https://github.com/[your-username]/ai-mplayer/releases)
2. 下载 `ai-mplayer_1.0.0_x64-setup.exe`
3. 双击安装
4. 从开始菜单启动

### 方式二：从源码构建

#### 步骤 1: 克隆仓库

```bash
git clone https://github.com/[your-username]/ai-mplayer.git
cd ai-mplayer
```

#### 步骤 2: 安装依赖

```bash
npm install
```

这将安装：
- React + TypeScript
- Tauri 依赖
- Tailwind CSS
- i18next 等

#### 步骤 3: 配置 libmpv

```bash
# 自动复制 DLL 文件
npm run copy:dlls

# 或手动复制到 src-tauri/lib/ 目录：
# - libmpv-2.dll
# - libmpv-wrapper.dll
```

**注意**: 首次运行会自动下载依赖。

---

## 🚀 运行应用

### 开发模式

```bash
# 启动开发服务器（推荐）
npm run tauri:dev
```

这将：
- 启动 Vite 开发服务器 (http://localhost:3001)
- 启动 Tauri 应用窗口
- 启用热重载

### 生产模式

```bash
# 构建生产版本
npm run tauri:build

# 运行安装程序
./src-tauri/target/release/bundle/msi/ai-mplayer_1.0.0_x64_en-US.msi
```

### 浏览器模式（前端开发）

```bash
# 仅启动前端（不使用 Tauri 功能）
npm run dev

# 访问 http://localhost:3001
```

---

## 🎮 基本操作

### 打开视频

| 方法 | 操作 |
|------|------|
| 点击 📂 | 点击工具栏的文件夹图标 |
| 拖放 | 直接将视频文件拖到窗口 |
| 快捷键 | 按 `Ctrl + O` |

### 播放控制

| 操作 | 方法 |
|------|------|
| 播放/暂停 | 点击播放按钮 或按 `空格` |
| 全屏 | 按 `F` 键 |
| 静音 | 按 `M` 键 或点击音量图标 |
| 前进/后退 | 按 `←` / `→` 方向键（5秒） |
| 音量调节 | 按 `↑` / `↓` 方向键 |
| 打开设置 | 按 `S` 键 或点击 ⚙️ 图标 |
| 显示帮助 | 按 `H` 或 `?` |

### 完整快捷键列表

```
空格      - 播放/暂停
F         - 全屏
M         - 静音
← →       - 前进/后退 5 秒
↑ ↓       - 音量增减
Ctrl+O    - 打开文件
S         - 打开设置
C         - 字幕设置
D         - 弹幕设置
H 或 ?    - 显示帮助
Esc       - 退出全屏
```

---

## ❓ 常见问题

### Q: 安装失败，提示找不到 libmpv

**A**: 
```bash
# 确保 DLL 文件存在
ls src-tauri/lib/

# 应该看到：
# - libmpv-2.dll
# - libmpv-wrapper.dll

# 如果不存在，运行：
npm run copy:dlls
```

### Q: npm install 很慢或失败

**A**:
```bash
# 使用国内镜像
npm config set registry https://registry.npmmirror.com

# 然后重新安装
npm install
```

### Q: Rust 编译失败

**A**:
```bash
# 更新 Rust
rustup update

# 清理并重建
cd src-tauri
cargo clean
cargo build
```

### Q: 视频无法播放

**A**:
1. 检查文件格式是否支持 (MP4, MKV, AVI 等)
2. 查看 Rust 控制台输出
3. 检查是否有错误日志

### Q: 界面显示异常

**A**:
```bash
# 清除缓存
rm -rf node_modules/.vite
rm -rf src-tauri/target/debug

# 重新安装
npm install
npm run tauri:dev
```

### Q: Windows 11 上窗口透明效果不工作

**A**: 
确保 `tauri.conf.json` 中设置了：
```json
{
  "windows": [{
    "transparent": true
  }]
}
```

---

## 📖 下一步

### 用户

- 阅读 [用户指南](./README.md#-使用指南)
- 配置 [AI 功能](./API.md)
- 查看 [常见问题](./TROUBLESHOOTING.md)

### 开发者

- 阅读 [开发指南](./DEVELOPMENT.md)
- 查看 [架构设计](./PROJECT_ARCHITECTURE.md)
- 阅读 [API 文档](./API.md)
- 了解 [代码规范](./AGENTS.md)

### 贡献者

- 阅读 [贡献指南](./CONTRIBUTING.md)
- 查看 [行为准则](./CODE_OF_CONDUCT.md)
- 浏览 [待办事项](./PROJECT_SUMMARY.md)

---

## 💡 提示

1. **热重载**: 开发时修改代码会自动刷新
2. **日志**: 按 `Ctrl+Shift+I` 打开 DevTools 查看日志
3. **重置**: 删除 `%APPDATA%/ai-mplayer` 可重置设置
4. **反馈**: 有问题请在 [Issues](https://github.com/[your-username]/ai-mplayer/issues) 反馈

---

## 🎯 验证安装

运行以下命令验证环境：

```bash
# 检查 Node.js
node --version  # v18.x.x 或更高

# 检查 Rust
rustc --version  # 1.70.x 或更高

# 检查 Tauri
npm run tauri -- --version

# 运行应用
npm run tauri:dev
```

如果一切正常，您会看到 ai-mplayer 窗口！

---

**现在您可以开始使用 ai-mplayer 了！** 🎉

遇到问题？查看 [故障排除指南](./TROUBLESHOOTING.md) 或 [提交 Issue](https://github.com/[your-username]/ai-mplayer/issues)。
