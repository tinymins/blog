import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import PostDetail from './pages/PostDetail'
import NotFound from './pages/NotFound'
import { initAnalytics } from './analytics'
import { useAnalytics } from './useAnalytics'

export default function App() {
  useEffect(() => { initAnalytics() }, [])
  useAnalytics()
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<About />} />
        <Route path="/blog" element={<Home />} />
        <Route path="/post/:number" element={<PostDetail />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
