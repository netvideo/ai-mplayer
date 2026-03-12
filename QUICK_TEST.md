# 🚀 快速测试指南

## 当前配置状态

✅ tauri.conf.json 已简化 - 无 bundle，无图标要求
✅ 构建缓存已清理
✅ Rust 代码已简化 - 无编译错误

## 测试步骤

### 1. 清理所有缓存（重要！）
```bash
# 在项目根目录运行
cd src-tauri
rmdir /s /q target  # Windows
# 或者
rm -rf target        # Linux/Mac
cd ..
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发模式
```bash
npm run tauri:dev
```

## 如果还有问题

### 方案 A: 使用纯前端模式（推荐先试这个）

暂时跳过 Tauri，直接测试前端 UI：
```bash
npm run dev
```

然后在浏览器打开 http://localhost:1420

### 方案 B: 检查环境

确保已安装：
- Node.js 18+
- Rust 1.70+ (`rustc --version`)
- Visual Studio C++ Build Tools

### 方案 C: 重新初始化 Tauri

如果持续有问题，可以尝试重新初始化 Tauri 部分。

## 当前可用的功能

即使没有完整的 Tauri，前端 UI 已经完全可用：
- 简洁的播放器界面
- 控制栏（播放/暂停/音量等）
- 设置面板
- 字幕和弹幕系统
- 帮助系统

## 说明

当前配置已最小化，移除了所有可能引起问题的设置。先按照上述步骤测试！
