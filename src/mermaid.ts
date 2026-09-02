let renderQueue: Promise<unknown> = Promise.resolve()
let nextDiagramId = 0

export function renderMermaid(source: string, dark: boolean): Promise<string> {
  // Mermaid configuration is global, so keep initialization and rendering together.
  const result = renderQueue.then(async () => {
    const { default: mermaid } = await import('mermaid')
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      suppressErrorRendering: true,
      theme: dark ? 'dark' : 'default',
    })

    // Rendering needs a connected element for text measurement. Keep temporary
    // SVGs outside the article and always remove them, including on parse errors.
    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.top = '0'
    container.style.left = '0'
    container.style.visibility = 'hidden'
    container.style.pointerEvents = 'none'
    container.setAttribute('aria-hidden', 'true')
    document.body.append(container)
    try {
      const { svg } = await mermaid.render(`mermaid-${++nextDiagramId}`, source, container)
      return svg
    } finally {
      container.remove()
    }
  })

  // A malformed diagram must not prevent later diagrams from rendering.
  renderQueue = result.catch(() => undefined)
  return result
}
