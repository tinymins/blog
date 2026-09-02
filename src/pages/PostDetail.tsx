import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getIssue } from '../api'
import type { ParsedIssue } from '../api'
import Comments from '../components/Comments'
import Markdown from '../components/Markdown'
import { countWords, readingTime } from '../utils'
import './PostDetail.css'

export default function PostDetail() {
  const { number } = useParams<{ number: string }>()
  const [issue, setIssue] = useState<ParsedIssue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!number) return
    getIssue(parseInt(number))
      .then(setIssue)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [number])

  if (loading) return <div className="detail-state">Loading...</div>
  if (error || !issue) return (
    <div className="detail-state detail-error-state">
      <p>文章不存在或加载失败</p>
      <Link to="/blog">← 返回列表</Link>
    </div>
  )

  const wordCount = countWords(issue.bodyContent || '')
  const minutes = readingTime(wordCount)

  return (
    <div className="post-detail">
      <nav className="detail-nav">
        <Link to="/blog">← 所有文章</Link>
      </nav>
      <article className="detail-article">
        <h1 className="detail-title">{issue.title}</h1>
        <div className="detail-meta">
          <time>{new Date(issue.publishedAt).toLocaleDateString('zh-CN')}</time>
          <span className="detail-reading-info">{wordCount} 字 · 约 {minutes} 分钟</span>
          {issue.labels.map(label => (
            <span
              key={label.name}
              className="post-label"
              style={{ background: `#${label.color}20`, color: `#${label.color}`, borderColor: `#${label.color}40` }}
            >
              {label.name}
            </span>
          ))}
          <a
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="detail-github-link"
          >
            在 GitHub 查看 ↗
          </a>
        </div>
        <Markdown
          className="detail-body"
          content={issue.bodyContent || ''}
          omitFirstHeading
        />
      </article>
      <Comments issueNumber={issue.number} issueUrl={issue.html_url} totalComments={issue.comments} />
    </div>
  )
}
