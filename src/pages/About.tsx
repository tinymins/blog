import './About.css'

const pinnedRepos = [
  {
    name: 'fullstack.rs',
    url: 'https://github.com/tinymins/fullstack.rs',
    description: '全栈脚手架：Rust（Axum + Sea-ORM + PostgreSQL）后端配 React 19 + Router v7 + Tailwind 4 SPA，pnpm + Turborepo monorepo 管理，含 WASM 模块、鉴权、多工作区、5 语言 i18n、暗色模式，一行命令 Docker 部署。',
    language: 'TypeScript',
    langColor: '#3178c6',
    stars: 0,
    homepage: '',
  },
  {
    name: 'drip-table',
    url: 'https://github.com/jd-opensource/drip-table',
    description: '京东开源的低代码表格可视化搭建方案：基于 React + TypeScript，提供拖拽式表格构建、可视化编辑器、模板复用、复杂表头与分组、多种渲染层（Antd / 原生 HTML），1.6k stars。作为核心贡献者参与开发，提交 670+ commits，占总贡献量 57%。',
    language: 'TypeScript',
    langColor: '#3178c6',
    stars: 1666,
    homepage: 'https://drip-table.jd.com',
  },
  {
    name: 'JX3MY',
    url: 'https://github.com/tinymins/JX3MY',
    description: '《剑网3》茗伊插件集 —— Lua 编写的游戏内 PVE 辅助插件集合，30+ 模块覆盖聊天监控、喊话辅助、Roll 点统计、扁平血条、截图工具、共战检查、点数监控、技能可视化、仓库搜索等高频场景，全部开源免费。',
    language: 'Lua',
    langColor: '#000080',
    stars: 153,
    homepage: 'http://jx3.derzh.com/',
  },
  {
    name: 'intercom2wifi.esp',
    url: 'https://github.com/tinymins/intercom2wifi.esp',
    description: 'JB-2201-F03 门禁话机智能化改造：用 D1-Mini（ESP8266 + ESPHome）替换原板，接入 Home Assistant 实现远程开门与门铃推送，让老式有线对讲机融入智能家居体系。',
    language: 'ESPHome',
    langColor: '#cb171e',
    stars: 2,
    homepage: '',
  },
  {
    name: 'PostMessage.NET',
    url: 'https://github.com/tinymins/PostMessage.NET',
    description: 'C# 后台按键模拟工具，使用 Win32 PostMessage API 直接向目标窗口注入按键事件，无需窗口焦点。适用于《剑网3》PVE 多段宏等需要解放双手的场景。',
    language: 'C#',
    langColor: '#178600',
    stars: 30,
    homepage: '',
  },
  {
    name: 'DisposeObject.c',
    url: 'https://github.com/tinymins/DisposeObject.c',
    description: 'C 实现的 Win32 命名 mutex 释放工具：枚举并关闭目标进程的命名互斥量句柄，破除游戏客户端的"同名 mutex 检测"，实现同一台机器多开。',
    language: 'C',
    langColor: '#555555',
    stars: 2,
    homepage: '',
  },
  {
    name: 'vue-boilerplate',
    url: 'https://github.com/tinymins/vue-boilerplate',
    description: 'Vue 2 + TypeScript 项目模板，基于 Webpack 4。同一份代码可构建 SPA 或 Chrome 扩展，集成 HMR、ESLint / Stylelint / vue-eslint、px2rem / px2viewport，附带 cube-ui 与 element-ui 分支。',
    language: 'TypeScript',
    langColor: '#3178c6',
    stars: 4,
    homepage: '',
  },
  {
    name: 'luadata',
    url: 'https://github.com/tinymins/luadata',
    description: 'npm 工具包：JavaScript / TypeScript 与 Lua 数据格式互转，把 JS 数组与对象序列化成 Lua table 字面量，或反向解析回来。配合《剑网3》Lua 插件开发，做配置生成与数据迁移的桥梁。',
    language: 'TypeScript',
    langColor: '#3178c6',
    stars: 5,
    homepage: '',
  },
]

const moreRepos = [
  {
    name: 'font-conv',
    url: 'https://github.com/tinymins/font-conv',
    description: 'Python 字体处理工具：合并 TrueType 字体并自定义 code point 映射，专为简繁中文转换设计；同时支持 OTF ↔ TTF 互转。',
  },
  {
    name: 'PUBGMortar.NET',
    url: 'https://github.com/tinymins/PUBGMortar.NET',
    description: 'Windows 桌面应用：根据水平距离与仰角计算 PUBG 迫击炮的距离设置，辅助玩家精准投射。',
  },
  {
    name: 'eslint-config-lvmcn',
    url: 'https://github.com/tinymins/eslint-config-lvmcn',
    description: '个人 ESLint 配置预设，含 TypeScript 支持，统一全部前端项目的代码风格。',
  },
]

export default function About() {
  return (
    <div className="about">
      <section className="about-hero">
        <img className="about-avatar" src="/assets/avatar.png" alt="Emil Zhai" />
        <div className="about-hero-text">
          <h1 className="about-name">Emil Zhai</h1>
          <p className="about-role">AI Engineer · Frontend Developer · Game Developer</p>
          <p className="about-bio">
            从游戏开发（C++/LUA）转前端，再转 AI 工程师；目前在做 TokimoOS 系统、App、Agent 开发。
          </p>
          <div className="about-links">
            <a className="about-link-btn" target="_blank" rel="noopener noreferrer" href="https://github.com/tinymins">
              <svg height="16" viewBox="0 0 16 16" width="16" aria-hidden="true"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>
              GitHub
            </a>
            <a className="about-link-btn" href="mailto:root@vmins.com">Email</a>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">AI Native</h2>
        <div className="ai-native-card">
          <div className="ai-native-badge">AI Engineer</div>
          <p className="ai-native-desc">
            以 Agent、工具调用与工程化工作流为核心，把 AI 融入产品设计、系统开发、调试与交付。
          </p>
          <ul className="ai-native-list">
            <li>
              <span className="ai-dot" />
              <span><strong>Agent 开发</strong> — 设计多步骤任务规划、工具调用与上下文管理，让智能体连接真实系统并完成复杂工程任务。</span>
            </li>
            <li>
              <span className="ai-dot" />
              <span><strong>应用工程</strong> — 使用 TypeScript、React 与现代前端工程体系构建可维护、可迭代的产品体验。</span>
            </li>
            <li>
              <span className="ai-dot" />
              <span><strong>游戏开发背景</strong> — 从 C++ / LUA 游戏开发积累性能、架构与复杂交互经验，并迁移到 AI 与应用开发。</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">Tech Stack</h2>
        <div className="about-stack">
          <p>TypeScript &middot; React &middot; C++ &middot; LUA &middot; Node.js &middot; Python</p>
          <p>AI Agent &middot; Tool Use &middot; App Development &middot; Frontend Engineering &middot; Game Systems</p>
        </div>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">Projects</h2>
        <article className="project-card project-card-featured">
          <div className="project-card-header">
            <a
              className="project-name"
              href="https://tokimo.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              TokimoOS
            </a>
            <div className="project-card-right">
              <a
                className="project-live"
                href="https://tokimo.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                Website ↗
              </a>
              <a
                className="project-live"
                href="https://github.com/tokimo-lab"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
              </a>
            </div>
          </div>
          <p className="project-desc">
            正在开发的系统、App 与 Agent 项目集合，探索 AI Native 的个人操作系统与应用体验。
          </p>
          <div className="project-tags">
            <span>AI</span>
            <span>Agent</span>
            <span>System</span>
            <span>App</span>
          </div>
        </article>

        <div className="projects-grid">
          {pinnedRepos.map(repo => (
            <article className="project-card" key={repo.name}>
              <div className="project-card-header">
                <a className="project-name" href={repo.url} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a>
              </div>
              <p className="project-desc">{repo.description}</p>
              <div className="project-footer">
                <span className="project-language">
                  <span className="project-language-dot" style={{ backgroundColor: repo.langColor }} />
                  {repo.language}
                </span>
                <span className="project-stars">★ {repo.stars}</span>
                {repo.homepage && (
                  <a className="project-homepage" href={repo.homepage} target="_blank" rel="noopener noreferrer">
                    Homepage ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        <article className="project-card project-card-featured project-card-more">
          <div className="project-card-header">
            <span className="project-name">更多项目</span>
            <a
              className="project-live"
              href="https://github.com/tinymins?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
            >
              全部仓库 ↗
            </a>
          </div>
          <ul className="more-projects-list">
            {moreRepos.map(repo => (
              <li key={repo.name}>
                <a href={repo.url} target="_blank" rel="noopener noreferrer">{repo.name}</a>
                <span className="more-projects-sep"> — </span>
                <span className="more-projects-desc">{repo.description}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="about-section about-contact">
        <h2 className="about-section-title">Contact</h2>
        <p>GitHub: <a href="https://github.com/tinymins" target="_blank" rel="noopener noreferrer">tinymins</a></p>
        <p>Email: <a href="mailto:root@vmins.com">root@vmins.com</a></p>
      </section>
    </div>
  )
}
