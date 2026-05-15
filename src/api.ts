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

export interface Label {
  name: string
  color: string
}

export interface SearchResult {
  total: number
  items: ParsedIssue[]
}

export class RateLimitError extends Error {
  constructor() {
    super('rate-limit')
    this.name = 'RateLimitError'
  }
}

const SEARCH_CACHE_TTL_MS = 5 * 60_000
const SEARCH_CACHE_MAX = 50
const LABELS_CACHE_TTL_MS = 30 * 60_000

interface CacheEntry<T> {
  value: T
  expireAt: number
}

const searchCache = new Map<string, CacheEntry<SearchResult>>()
let labelsCache: CacheEntry<Label[]> | null = null

function readSearchCache(key: string): SearchResult | null {
  const entry = searchCache.get(key)
  if (!entry) return null
  if (entry.expireAt <= Date.now()) {
    searchCache.delete(key)
    return null
  }
  // refresh LRU position
  searchCache.delete(key)
  searchCache.set(key, entry)
  return entry.value
}

function writeSearchCache(key: string, value: SearchResult) {
  if (searchCache.has(key)) searchCache.delete(key)
  searchCache.set(key, { value, expireAt: Date.now() + SEARCH_CACHE_TTL_MS })
  while (searchCache.size > SEARCH_CACHE_MAX) {
    const oldest = searchCache.keys().next().value
    if (oldest === undefined) break
    searchCache.delete(oldest)
  }
}

function buildSearchQ(keyword: string, labels: string[]): string {
  // GitHub search treats `"`, `\`, `(`, `)` as syntax; `+ > < * @ : /` and
  // a leading `-` may be interpreted as operators/qualifiers; bare AND/OR/NOT
  // act as boolean operators. Strip them all so the input is treated literally.
  const cleaned = keyword
    .replace(/["\\()]/g, ' ')
    .replace(/[+><*@:/]/g, ' ')
    .replace(/(^|\s)-/g, '$1 ')
    .replace(/\b(AND|OR|NOT)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const fixed = `repo:${OWNER}/${REPO} author:${OWNER} type:issue state:open`
  // Quote as a phrase to suppress any remaining operator interpretation.
  const titlePart = cleaned ? `"${cleaned}" in:title` : ''
  const labelPart = labels
    .map(l => `label:"${l.replace(/"/g, '')}"`)
    .join(' ')
  return [titlePart, fixed, labelPart].filter(Boolean).join(' ')
}

export function searchCacheKey(keyword: string, labels: string[]): string {
  return buildSearchQ(keyword, labels)
}

export async function searchIssues(
  keyword: string,
  labels: string[] = [],
  signal?: AbortSignal,
): Promise<SearchResult> {
  const trimmed = keyword.trim()
  if (!trimmed && labels.length === 0) return { total: 0, items: [] }
  const q = buildSearchQ(keyword, labels)
  const cached = readSearchCache(q)
  if (cached) return cached
  // Rely on the publishedAt resort below (which honors `<!-- date: ... -->`
  // frontmatter overrides), so don't pass a redundant API sort.
  const params = new URLSearchParams({ q, per_page: '50' })
  const res = await fetch(`${GITHUB_API}/search/issues?${params}`, { signal })
  if (res.status === 403 || res.status === 429) throw new RateLimitError()
  if (!res.ok) throw new Error(`Search failed: ${res.status}`)
  const data = await res.json() as { total_count: number; items: Issue[] }
  const items = data.items
    .map(parseIssue)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  const result: SearchResult = { total: data.total_count, items }
  writeSearchCache(q, result)
  return result
}

export async function getLabels(): Promise<Label[]> {
  if (labelsCache && labelsCache.expireAt > Date.now()) return labelsCache.value
  const all: Label[] = []
  const perPage = 100
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/labels?per_page=${perPage}&page=${page}`)
    if (!res.ok) throw new Error(`Failed to load labels: ${res.status}`)
    const batch = await res.json() as Label[]
    all.push(...batch)
    if (batch.length < perPage) break
  }
  labelsCache = { value: all, expireAt: Date.now() + LABELS_CACHE_TTL_MS }
  return all
}
