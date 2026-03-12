# 🖱️ 拖放功能测试指南

## 🔍 请按以下步骤操作并告诉我结果！

### 1. 打开浏览器控制台
- 按 **F12**
- 点击 **Console** 标签

### 2. 观察启动日志
控制台应该显示：
```
Setting up drag/drop handlers
Adding event listeners to: <div ...>
```

### 3. 测试拖放

#### 步骤 A - 拖入文件
1. 从资源管理器拖一个视频文件
2. 拖到播放器窗口上
3. **观察控制台**

#### 应该看到的日志：
```
dragOver event
===== DROP EVENT TRIGGERED =====
dataTransfer available: true
Files length: 1
File to load: video.mp4
=== loadVideoFile called ===
File: video.mp4 ...
```

#### 步骤 B - 如果没有看到任何拖放日志
可能是：
- 拖放区域问题
- 请把控制台**从第一行开始**的所有内容告诉我

### 4. 点击打开按钮测试
点击底部 📂 图标，选择文件，应该能工作！

### 📋 请告诉我：

1. **控制台显示了什么？（从 "Setting up drag/drop handlers" 开始的所有内容

2. **拖放时有没有蓝色背景？**（拖到窗口上时背景会变蓝吗？

3. **点击打开按钮能工作吗？
