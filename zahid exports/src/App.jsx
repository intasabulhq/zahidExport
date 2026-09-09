import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Products from "./pages/Products"
import CategoryPage from "./pages/CategoryPage"
import ProductDetails from "./pages/ProductDetails"
import About from "./pages/About"
import Contact from "./pages/Contact"
import { AdminAuthProvider } from "./admin/AdminAuthContext"
import ProtectedAdminRoute from "./admin/ProtectedAdminRoute"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminPlaceholder from "./pages/admin/AdminPlaceholder"

function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/category/:categorySlug" element={<CategoryPage />} />
        <Route path="/products/:productSlug" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminPlaceholder title="Products" />} />
          <Route path="/admin/products/new" element={<AdminPlaceholder title="Add product" />} />
          <Route path="/admin/products/:id/edit" element={<AdminPlaceholder title="Edit product" />} />
          <Route path="/admin/enquiries" element={<AdminPlaceholder title="Enquiries" />} />
          <Route path="/admin/categories" element={<AdminPlaceholder title="Categories" />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  )
}

export default App
