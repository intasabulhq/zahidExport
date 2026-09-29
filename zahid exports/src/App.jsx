import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import CategoryPage from './pages/CategoryPage'
import ProductDetails from './pages/ProductDetails'
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

function NotFound() {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-40 text-center text-stone-900">
      <p className="eyebrow">404 — Page not found</p>
      <h1 className="mt-4 text-4xl font-light">This page doesn’t exist.</h1>
      <a className="mt-8 inline-block underline" href="/">Return to home</a>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/category/:categorySlug" element={<CategoryPage />} />
      <Route path="/products/:productSlug" element={<ProductDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
