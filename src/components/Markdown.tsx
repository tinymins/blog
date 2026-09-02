import { useEffect, useRef } from 'react'
import { marked } from 'marked'
import { renderMermaid } from '../mermaid'
import 'github-markdown-css/github-markdown.css'
import './Markdown.css'

interface Props {
  content: string
  className: string
  omitFirstHeading?: boolean
}

export default function Markdown({ content, className, omitFirstHeading = false }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const parsed = marked.parse(content, { async: false })
    const html = omitFirstHeading ? parsed.replace(/^<h1[^>]*>.*?<\/h1>\s*/i, '') : parsed
    root.innerHTML = html
    const blocks = Array.from(root.querySelectorAll<HTMLElement>('pre > code.language-mermaid'), code => ({
      source: code.textContent || '',
      element: code.parentElement!,
    }))
    if (blocks.length === 0) return

    const colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
    let generation = 0

    const render = async () => {
      const currentGeneration = ++generation
      const dark = colorScheme.matches

      for (const block of blocks) {
        if (currentGeneration !== generation) return
        try {
          const svg = await renderMermaid(block.source, dark)
          if (currentGeneration !== generation) return
          const diagram = document.createElement('div')
          diagram.className = 'mermaid-diagram'
          diagram.innerHTML = svg
          block.element.replaceWith(diagram)
          block.element = diagram
        } catch (error) {
          if (currentGeneration !== generation) return
          // Leave the original code block readable when rendering fails.
          console.error('Failed to render Mermaid diagram:', error)
        }
      }
    }

    void render()
    colorScheme.addEventListener('change', render)
    return () => {
      generation++
      colorScheme.removeEventListener('change', render)
    }
  }, [content, omitFirstHeading])

  return (
    <div
      ref={rootRef}
      className={`markdown-body ${className}`}
      data-color-mode="auto"
      data-light-theme="light"
      data-dark-theme="dark"
    />
  )
}
