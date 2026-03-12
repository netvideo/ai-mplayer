# 贡献指南 (Contributing Guide)

感谢您对 ai-mplayer 的兴趣！我们欢迎各种形式的贡献。

---

## 📋 目录

- [行为准则](#-行为准则)
- [如何贡献](#-如何贡献)
- [开发流程](#-开发流程)
- [代码规范](#-代码规范)
- [提交规范](#-提交规范)
- [Pull Request 流程](#-pull-request-流程)
- [审查流程](#-审查流程)
- [常见问题](#-常见问题)

---

## 📜 行为准则

### 我们的承诺

作为这个项目的贡献者和维护者，我们承诺：

- 🤝 **友善和包容** - 欢迎所有人，不论经验水平
- 💬 **尊重和耐心** - 保持建设性的讨论
- 🎯 **专注于解决问题** - 技术讨论保持专业
- 🌟 **接纳不同观点** - 鼓励多样化的想法

### 不可接受的行为

- ❌ 使用歧视性语言或人身攻击
- ❌ 骚扰、侮辱他人
- ❌ 发布垃圾信息
- ❌ 未经同意分享他人私人信息

详细行为准则请参考 [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)

---

## 🎯 如何贡献

### 您可以通过以下方式贡献

1. **🐛 报告 Bug** - 帮助改进软件质量
2. **💡 提出新功能** - 分享您的想法
3. **📝 改进文档** - 让文档更清晰
4. **🔧 提交代码** - 实现新功能或修复 Bug
5. **🎨 UI/UX 设计** - 改进用户界面
6. **🌍 翻译** - 帮助国际化
7. **📢 推广** - 让更多人知道这个项目

### 开始之前

1. **阅读文档** - 了解项目架构和代码规范
2. **查看 Issue** - 检查是否已有相关的 issue
3. **参与讨论** - 在 Discussion 中交流想法

---

## 🔄 开发流程

### 1. Fork 仓库

```bash
# 点击 GitHub 页面上的 Fork 按钮
# 或者使用 GitHub CLI
gh repo fork [your-username]/ai-mplayer
```

### 2. 克隆您的 Fork

```bash
git clone https://github.com/YOUR_USERNAME/ai-mplayer.git
cd ai-mplayer
```

### 3. 添加上游仓库

```bash
git remote add upstream https://github.com/[your-username]/ai-mplayer.git
```

### 4. 创建功能分支

```bash
# 确保您在 develop 分支
git checkout develop
git pull upstream develop

# 创建功能分支
git checkout -b feature/your-feature-name

# 或者修复分支
git checkout -b bugfix/issue-description
```

### 5. 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run tauri:dev

# ... 编写代码 ...
```

详细开发环境搭建请参考 [DEVELOPMENT.md](./DEVELOPMENT.md)

### 6. 提交更改

```bash
# 添加更改
git add .

# 提交（遵循提交规范）
git commit -m "feat: add amazing new feature"

# 推送到您的 Fork
git push origin feature/your-feature-name
```

### 7. 创建 Pull Request

1. 访问您的 Fork 页面
2. 点击 "Compare & pull request"
3. 填写 PR 模板
4. 提交 PR

---

## 📝 代码规范

### TypeScript/JavaScript

#### 代码风格

我们使用 ESLint + Prettier 保持代码风格一致：

```bash
# 检查代码风格
npm run lint

# 自动修复
npm run lint:fix
```

#### 命名规范

```typescript
// ✅ 组件: PascalCase
const PlayerComponent = () => { }

// ✅ 函数: camelCase
const playVideo = () => { }

// ✅ 常量: UPPER_SNAKE_CASE
const SEEK_STEP_SECONDS = 5;

// ✅ 类型: PascalCase
interface PlaybackState { }
```

#### 代码示例

```typescript
// ✅ 好的示例
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface MediaState {
  isPlaying: boolean;
  currentTime: number;
}

const useMediaPlayer = (): MediaState => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return { isPlaying, currentTime };
};
```

更多规范请参考 [AGENTS.md](./AGENTS.md)

### Rust

#### 代码风格

```bash
# 检查 Rust 代码
cd src-tauri && cargo clippy

# 格式化
cd src-tauri && cargo fmt
```

#### 命名规范

```rust
// ✅ 函数: snake_case
fn play_video() { }

// ✅ 结构体: PascalCase
struct MediaInfo { }

// ✅ 常量: UPPER_SNAKE_CASE
const DEFAULT_VOLUME: f64 = 1.0;
```

---

## 💬 提交规范

### Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型 (Type)

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(player): add keyboard shortcuts` |
| `fix` | 修复 bug | `fix(mpv): resolve rendering issue` |
| `docs` | 文档更新 | `docs(readme): update install guide` |
| `style` | 代码格式 | `style(components): format with prettier` |
| `refactor` | 重构 | `refactor(services): extract utils` |
| `perf` | 性能优化 | `perf(player): optimize video rendering` |
| `test` | 测试相关 | `test(player): add unit tests` |
| `chore` | 构建/工具 | `chore(deps): update dependencies` |
| `security` | 安全修复 | `security(storage): encrypt API keys` |

### Scope（可选）

- `player` - 播放器功能
- `ui` - 用户界面
- `subtitle` - 字幕系统
- `danmaku` - 弹幕系统
- `ai` - AI 功能
- `docs` - 文档
- `deps` - 依赖

### Subject

- 使用祈使语气（"Add" 而非 "Added"）
- 首字母小写
- 不要以句号结尾
- 不超过 50 个字符

### Body（可选）

- 详细说明更改的原因和内容
- 每行不超过 72 个字符
- 解释"什么"和"为什么"，而不是"如何"

### Footer（可选）

- 关联 issue：`Closes #123`, `Fixes #456`
- 破坏性更改：`BREAKING CHANGE: ...`

### 完整示例

```
feat(player): add keyboard shortcuts for playback control

Add comprehensive keyboard shortcuts to improve user experience:
- Space: Play/Pause
- F: Toggle fullscreen
- M: Toggle mute
- Arrow keys: Seek and volume control

These shortcuts match common media player conventions and
make the app more accessible for keyboard users.

Closes #42
```

---

## 🔀 Pull Request 流程

### PR 模板

创建 PR 时，请使用以下模板：

```markdown
## 描述
简要描述这个 PR 做了什么。

## 更改类型
请勾选适用的选项：
- [ ] Bug 修复（非破坏性）
- [ ] 新功能（非破坏性）
- [ ] 破坏性更改
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化
- [ ] 其他

## 测试
- [ ] 我已测试这些更改
- [ ] 我添加了新的测试
- [ ] 所有测试通过

## 相关 Issue
Closes #(issue number)
Fixes #(issue number)

## 截图（如适用）
[如果有 UI 更改，请添加截图]

## 检查清单
- [ ] 我的代码遵循项目的代码规范
- [ ] 我已经自我审查了代码
- [ ] 我已经更新了相关文档
- [ ] 我的更改不会产生新的警告
- [ ] 我已经添加了测试（如适用）
```

### PR 流程

1. **创建 PR** - 从您的功能分支到 `develop` 分支
2. **填写模板** - 提供清晰的描述
3. **检查 CI** - 确保所有检查通过
4. **请求审查** - 至少一位维护者审查
5. **处理反馈** - 根据审查意见修改
6. **合并** - 审查通过后由维护者合并

---

## 👀 审查流程

### 代码审查标准

审查者会检查：

- ✅ **功能正确性** - 代码是否按预期工作
- ✅ **代码质量** - 是否遵循代码规范
- ✅ **测试覆盖** - 是否有适当的测试
- ✅ **文档更新** - 相关文档是否已更新
- ✅ **性能影响** - 是否引入性能问题
- ✅ **安全考虑** - 是否有安全隐患

### 审查反馈

作为作者：

1. **保持开放心态** - 审查是为了改进代码
2. **及时响应** - 尽快处理审查意见
3. **询问澄清** - 不理解的地方大胆提问
4. **解释决定** - 说明设计决策的原因

作为审查者：

1. **友善和建设性** - 提出改进建议而非批评
2. **具体明确** - 指出具体问题和改进方法
3. **区分优先级** - 标注哪些是阻塞性的，哪些是建议性的
4. **认可好的代码** - 表扬写得好的部分

---

## 🐛 报告 Bug

### Bug 报告模板

```markdown
## 问题描述
清晰简洁地描述 Bug。

## 复现步骤
1. 打开应用
2. 点击 '...'
3. 选择 '...'
4. 出现错误

## 预期行为
描述您期望发生什么。

## 实际行为
描述实际发生了什么。

## 环境信息
- OS: [例如 Windows 11 23H2]
- ai-mplayer 版本: [例如 1.0.0]
- libmpv 版本: [如果知道]

## 截图
[如适用，添加截图]

## 日志
```
[粘贴相关错误日志]
```

## 其他信息
[任何其他相关信息]
```

### 提交 Bug 报告

1. 检查是否已有相同 issue
2. 使用模板创建新 issue
3. 添加适当的标签
4. 分配给相关维护者

---

## 💡 提出新功能

### 功能请求模板

```markdown
## 功能描述
简要描述您想要的功能。

## 使用场景
描述这个功能将如何使用。

## 预期行为
描述您期望这个功能如何工作。

## 可能的实现
[可选] 如果您有实现想法，请分享。

## 替代方案
[可选] 描述您考虑过的替代方案。

## 附加信息
[任何其他相关信息或截图]
```

### 功能请求流程

1. 检查是否已有类似请求
2. 使用模板创建新 issue
3. 添加 `enhancement` 标签
4. 等待社区反馈
5. 维护者会评估并决定是否纳入路线图

---

## ❓ 常见问题

### Q: 我是新手，可以贡献吗？

**A**: 当然可以！我们欢迎所有经验水平的贡献者。您可以：
- 从文档改进开始
- 修复简单的 Bug
- 参与讨论和测试
- 改进 UI/UX

### Q: 如何找到可以贡献的 issue？

**A**: 查看带有以下标签的 issue：
- `good first issue` - 适合新手
- `help wanted` - 需要帮助
- `documentation` - 文档相关
- `bug` - Bug 修复

### Q: 我的 PR 多久会被审查？

**A**: 通常：
- 简单修复：1-3 天
- 功能 PR：3-7 天
- 重大更改：1-2 周

### Q: PR 被拒绝了怎么办？

**A**: 不要灰心！审查者会说明原因：
1. 仔细阅读反馈
2. 根据建议修改
3. 重新提交

### Q: 如何成为维护者？

**A**: 持续贡献并展示：
- 代码质量
- 社区参与
- 项目理解
- 维护者会主动邀请

---

## 📚 资源

- [DEVELOPMENT.md](./DEVELOPMENT.md) - 开发环境搭建
- [AGENTS.md](./AGENTS.md) - 代码规范
- [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md) - 架构设计
- [API.md](./API.md) - API 文档

---

## 💬 联系方式

- **GitHub Discussions**: [讨论区](https://github.com/[your-username]/ai-mplayer/discussions)
- **Issues**: [问题反馈](https://github.com/[your-username]/ai-mplayer/issues)
- **邮件**: [your-email@example.com]

---

## 🙏 感谢

感谢所有贡献者！您的努力让这个项目变得更好。

<a href="https://github.com/[your-username]/ai-mplayer/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=[your-username]/ai-mplayer" alt="Contributors" />
</a>

---

**再次感谢您的贡献！** 🎉
