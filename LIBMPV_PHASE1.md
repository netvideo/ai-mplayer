# 🎯 libmpv 集成 - 阶段 1

## 目标
配置 Rust 后端，创建基础的 libmpv 绑定，实现简单的播放控制。

## 步骤

### 1. 备份当前版本
```bash
cd src-tauri
copy Cargo.toml Cargo.toml.backup
copy src/main.rs src/main.rs.backup
```

### 2. 更新 Cargo.toml 添加 libmpv 依赖
```toml
[dependencies]
mpv = "2.0"
libmpv-sys = "2.0"
parking_lot = "0.12"
anyhow = "1.0"
thiserror = "1.0"
```

### 3. 创建 libmpv 播放器模块
- 创建 `src/mpv_player.rs`
- 初始化 libmpv
- 实现基本的播放/暂停/停止
- 实现进度和音量控制

### 4. 创建 Tauri 命令
- 创建 Tauri 命令来调用 libmpv 功能
- 暴露给前端

### 5. 更新前端
- 创建 `TauriMpvPlayerService.ts`
- 更新 PlayerSimple 或创建新的 PlayerTauri 组件

---

## 注意事项
- libmpv 需要正确的 DLL 在可执行文件同级目录
- 需要处理视频渲染到窗口
- 需要处理字幕和音轨

---

## 测试
- 测试基本播放功能
- 测试进度控制
- 测试音量控制
