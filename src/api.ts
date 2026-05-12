const GITHUB_API = 'https://api.github.com'
const OWNER = 'tinymins'
const REPO = 'Blog'

export interface Issue {
  id: number
  number: number
  title: string
  body: string
  html_url: string
  created_at: string
  comments: number
  user: {
    login: string
    avatar_url: string
  }
  labels: Array<{
    name: string
    color: string
  }>
}

export interface ParsedIssue extends Issue {
  publishedAt: string
  bodyContent: string
}

const dateFrontmatterRegex = /^\s*<!--\s*date:\s*([^\s]+(?:T[\d:.+\-Z]+)?)\s*-->\s*\n?/

export function parseIssue(issue: Issue): ParsedIssue {
  const body = issue.body || ''
  const match = body.match(dateFrontmatterRegex)

  if (!match) {
    return {
      ...issue,
      publishedAt: issue.created_at,
      bodyContent: body,
    }
  }

  const publishedAt = new Date(match[1]).toISOString()

  return {
    ...issue,
    publishedAt,
    bodyContent: body.replace(match[0], ''),
  }
}

export async function getIssues(page = 1, perPage = 20): Promise<ParsedIssue[]> {
  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/issues?state=open&creator=${OWNER}&per_page=${perPage}&page=${page}`)
  if (!res.ok) throw new Error(`Failed to fetch issues: ${res.status}`)
  const issues = await res.json() as Issue[]
  return issues.map(parseIssue)
}

export async function getIssue(number: number): Promise<ParsedIssue> {
  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/issues/${number}`)
  if (!res.ok) throw new Error(`Failed to fetch issue: ${res.status}`)
  const issue = await res.json() as Issue
  if (issue.user?.login !== OWNER) throw new Error('Issue not found')
  return parseIssue(issue)
}

export interface Comment {
  id: number
  body: string
  created_at: string
  html_url: string
  user: {
    login: string
    avatar_url: string
    html_url: string
  }
}

export async function getIssueComments(number: number, page = 1, perPage = 30): Promise<Comment[]> {
  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/issues/${number}/comments?per_page=${perPage}&page=${page}`)
  if (!res.ok) throw new Error(`Failed to fetch comments: ${res.status}`)
  return res.json()
}
