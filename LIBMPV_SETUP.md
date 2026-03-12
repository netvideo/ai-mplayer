# libmpv Windows 配置指南

## 前置要求

1. **Visual Studio 2022** (包含 C++ 桌面开发工作负载)
2. **Rust** (最新稳定版)
3. **LLVM/Clang** (可选，用于绑定生成)

## 方案一：使用预编译的 libmpv (推荐)

### 1. 下载 libmpv

从国内镜像下载预编译的 libmpv：

- 清华镜像: https://mirrors.tuna.tsinghua.edu.cn/mpv/
- 阿里云镜像: https://mirrors.aliyun.com/mpv/

下载 `mpv-dev-x86_64-*.7z` 开发包

### 2. 解压并配置

```bash
# 在项目根目录创建 lib 文件夹
mkdir libmpv

# 解压下载的 mpv-dev.7z 到 libmpv 文件夹
# 目录结构应该如下:
# libmpv/
#   include/
#     mpv/
#       client.h
#       render.h
#       ...
#   lib/
#     mpv.lib
#     mpv.dll.a
#   bin/
#     mpv-2.dll
```

### 3. 配置环境变量

设置以下环境变量，或者创建 `.cargo/config.toml`:

```toml
# .cargo/config.toml
[target.x86_64-pc-windows-msvc]
rustflags = [
  "-L", "F:/ai-mplayer12/libmpv/lib",
]
```

### 4. 复制 DLL 到输出目录

在构建时，将 `mpv-2.dll` 复制到可执行文件同级目录。

## 方案二：使用 vcpkg 安装

```bash
# 安装 vcpkg
git clone https://github.com/microsoft/vcpkg
cd vcpkg
.\bootstrap-vcpkg.bat

# 安装 mpv
.\vcpkg install mpv:x64-windows
```

然后在 `.cargo/config.toml` 中配置:

```toml
[target.x86_64-pc-windows-msvc]
rustflags = [
  "-L", "C:/path/to/vcpkg/installed/x64-windows/lib",
]
```

## 更新 Cargo.toml

确认 `src-tauri/Cargo.toml` 包含:

```toml
[dependencies]
mpv = "2.0"
libmpv-sys = "2.0"
```

## 临时方案：使用简化版本进行测试

如果遇到 libmpv 编译问题，可以暂时使用 HTML5 video 标签进行测试。

修改 `Player.tsx`:

```tsx
// 临时使用 HTML5 video
<video
  ref={videoRef}
  className="w-full h-full object-contain"
  controls={false}
  src={state.currentFile || ""}
/>
```

## 构建步骤

```bash
# 安装依赖
npm install

# 开发模式
npm run tauri:dev

# 生产构建
npm run tauri:build
```

## 故障排除

### 链接错误: 无法找到 mpv.lib

确认:
1. libmpv 路径配置正确
2. 使用的是 x64 版本的库
3. Visual Studio 工具链已正确安装

### 运行时错误: 无法找到 mpv-2.dll

将 `mpv-2.dll` 复制到:
- 开发模式: `src-tauri/target/debug/`
- 生产模式: 与 exe 同级目录
