import './About.css'

const pinnedRepos = [
  {
    name: 'fullstack.rs',
    url: 'https://github.com/tinymins/fullstack.rs',
    description: 'Production-ready full-stack boilerplate: Rust (Axum) backend + React 19 SPA, managed as a pnpm monorepo. Auth, multi-workspace, i18n (5 langs), dark mode, WASM, one-command Docker.',
    language: 'TypeScript',
    langColor: '#3178c6',
    stars: 0,
    homepage: '',
  },
  {
    name: 'vue-boilerplate',
    url: 'https://github.com/tinymins/vue-boilerplate',
    description: 'Boilerplate for building SPA or chrome extension with Vue.js 2',
    language: 'TypeScript',
    langColor: '#3178c6',
    stars: 4,
    homepage: '',
  },
  {
    name: 'JX3MY',
    url: 'https://github.com/tinymins/JX3MY',
    description: '剑侠情缘网络版叁砭芑插件集',
    language: 'Lua',
    langColor: '#000080',
    stars: 153,
    homepage: 'http://jx3.derzh.com/',
  },
  {
    name: 'PostMessage.NET',
    url: 'https://github.com/tinymins/PostMessage.NET',
    description: 'C#后台模拟按键 适用于《剑网3》PVE多段宏、以及其他需要解放双手的场景',
    language: 'C#',
    langColor: '#178600',
    stars: 30,
    homepage: '',
  },
  {
    name: 'DisposeObject.c',
    url: 'https://github.com/tinymins/DisposeObject.c',
    description: 'Dispose object from other process by object id.',
    language: 'C',
    langColor: '#555555',
    stars: 2,
    homepage: '',
  },
  {
    name: 'typecho-plugin-Access',
    url: 'https://github.com/tinymins/typecho-plugin-Access',
    description: 'Typecho Access 插件',
    language: 'CSS',
    langColor: '#663399',
    stars: 1,
    homepage: 'https://kotori.love/archives/typecho-plugin-access.html',
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
        <a
          className="project-card project-card-featured"
          href="https://github.com/tinymins"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="project-card-header">
            <span className="project-name">TokimoOS</span>
            <div className="project-card-right">
              <span className="project-live">GitHub ↗</span>
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
        </a>

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
      </section>

      <section className="about-section about-contact">
        <h2 className="about-section-title">Contact</h2>
        <p>GitHub: <a href="https://github.com/tinymins" target="_blank" rel="noopener noreferrer">tinymins</a></p>
        <p>Email: <a href="mailto:root@vmins.com">root@vmins.com</a></p>
      </section>
    </div>
  )
}
