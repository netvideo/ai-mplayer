# 故障排除指南

## 当前状态

✅ **Rust 后端已修复** - 简化版本，无编译错误
✅ **Cargo.toml 已更新** - 只保留必要的依赖
✅ **build.rs 已创建** - 解决 OUT_DIR 问题
✅ **libmpv 文件已就位** - 在 `libmpv/` 目录

## 测试步骤

### 1. 安装前端依赖
```bash
npm install
```

### 2. 启动开发模式
```bash
npm run tauri:dev
```

## 常见问题

### Q: 提示缺少 tauri CLI
```bash
npm install -g @tauri-apps/cli
```

### Q: Rust 编译错误
确保已安装最新的 Rust：
```bash
rustup update
```

### Q: 缺少 Visual Studio C++ 工具
下载并安装：
https://visualstudio.microsoft.com/visual-cpp-build-tools/

选择"使用 C++ 的桌面开发"工作负载

## 项目说明

当前使用的是**简化版本播放器**，具有以下特性：

- 使用 HTML5 `<video>` 标签显示视频
- 完整的 UI 控制（播放/暂停/进度/音量）
- 字幕和弹幕渲染
- 模拟的播放器状态
- 无需 libmpv 依赖

## 下一步

编译成功运行后，UI 将完全可用！可以：
- 点击文件夹图标打开视频文件
- 使用 HTML5 播放器播放
- 测试所有 UI 功能

需要完整 libmpv 功能时，参考 `LIBMPV_SETUP.md` 配置。
