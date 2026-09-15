import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../../admin/api";
import "./admin.css";
import "./admin-products.css";

const emptyForm = {
  name: "",
  sku: "",
  slug: "",
  description: "",
  material: "",
  finish: "",
  dimensions: "",
  moq: "",
  applications: "",
  images: "",
  imageAlt: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  featured: false,
  status: "draft",
  categoryId: null,
};

const makeSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const splitList = (value, separator = ",") =>
  value
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);

function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [slugEdited, setSlugEdited] = useState(false);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;
    let active = true;
    apiRequest(`/api/products/admin/${id}`)
      .then(({ product }) => {
        if (!active) return;
        setForm({
          name: product.name || "",
          sku: product.sku || "",
          slug: product.slug || "",
          description: product.description || "",
          material: product.material || "",
          finish: product.finish || "",
          dimensions: product.dimensions || "",
          moq: product.moq || "",
          applications: (product.applications || []).join(", "),
          images: (product.images || []).join("\n"),
          imageAlt: product.image_alt || "",
          seoTitle: product.seo_title || "",
          seoDescription: product.seo_description || "",
          seoKeywords: (product.seo_keywords || []).join(", "),
          featured: Boolean(product.featured),
          status: product.status || "draft",
          categoryId: product.category_id || null,
        });
        setSlugEdited(true);
      })
      .catch((requestError) => active && setError(requestError.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [editing, id]);

  const setField = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));
  const handleNameChange = (event) => {
    const name = event.target.value;
    setForm((current) => ({
      ...current,
      name,
      ...(!slugEdited ? { slug: makeSlug(name) } : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      applications: splitList(form.applications),
      images: splitList(form.images, "\n"),
      seoKeywords: splitList(form.seoKeywords),
      categoryId: form.categoryId || null,
    };

    try {
      await apiRequest(editing ? `/api/products/${id}` : "/api/products", {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      navigate("/admin/products", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading product…</div>;

  return (
    <div className="admin-shell">
      <header className="admin-module-topbar">
        <div>
          <Link to="/admin/products">← Products</Link>
          <span>{editing ? "Edit product" : "New product"}</span>
        </div>
      </header>
      <main className="admin-product-form-main">
        <section className="admin-products-heading">
          <div>
            <p className="admin-kicker">Catalogue editor</p>
            <h1>{editing ? "Edit product" : "Add product"}</h1>
            <p>
              Draft products stay private until their status is changed to
              published.
            </p>
          </div>
        </section>
        {error && (
          <p className="admin-module-error" role="alert">
            {error}
          </p>
        )}

        <form className="admin-product-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Identity</legend>
            <div className="admin-form-grid">
              <label className="admin-field-wide">
                <span>Product name *</span>
                <input
                  required
                  minLength="2"
                  maxLength="180"
                  value={form.name}
                  onChange={handleNameChange}
                />
              </label>
              <label>
                <span>SKU *</span>
                <input
                  required
                  minLength="2"
                  maxLength="100"
                  value={form.sku}
                  onChange={(event) => setField("sku", event.target.value)}
                />
              </label>
              <label>
                <span>URL slug *</span>
                <input
                  required
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  value={form.slug}
                  onChange={(event) => {
                    setSlugEdited(true);
                    setField("slug", makeSlug(event.target.value));
                  }}
                />
              </label>
              <label className="admin-field-wide">
                <span>Description * (minimum 20 characters)</span>
                <textarea
                  required
                  minLength="20"
                  rows="5"
                  value={form.description}
                  onChange={(event) =>
                    setField("description", event.target.value)
                  }
                />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Product details</legend>
            <div className="admin-form-grid">
              <label>
                <span>Material</span>
                <input
                  maxLength="200"
                  value={form.material}
                  onChange={(event) => setField("material", event.target.value)}
                />
              </label>
              <label>
                <span>Finish</span>
                <input
                  maxLength="200"
                  value={form.finish}
                  onChange={(event) => setField("finish", event.target.value)}
                />
              </label>
              <label>
                <span>Dimensions</span>
                <input
                  maxLength="200"
                  value={form.dimensions}
                  onChange={(event) =>
                    setField("dimensions", event.target.value)
                  }
                />
              </label>
              <label>
                <span>MOQ</span>
                <input
                  maxLength="100"
                  value={form.moq}
                  onChange={(event) => setField("moq", event.target.value)}
                />
              </label>
              <label className="admin-field-wide">
                <span>Applications (comma separated)</span>
                <input
                  value={form.applications}
                  onChange={(event) =>
                    setField("applications", event.target.value)
                  }
                  placeholder="Hospitality, Retail, Interior Projects"
                />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Images</legend>
            <div className="admin-form-grid">
              <label className="admin-field-wide">
                <span>Image URLs (one per line, maximum 12)</span>
                <textarea
                  rows="5"
                  value={form.images}
                  onChange={(event) => setField("images", event.target.value)}
                  placeholder="https://example.com/product-1.webp"
                />
              </label>
              <label className="admin-field-wide">
                <span>Image alt text</span>
                <input
                  maxLength="240"
                  value={form.imageAlt}
                  onChange={(event) => setField("imageAlt", event.target.value)}
                />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>SEO and publishing</legend>
            <div className="admin-form-grid">
              <label className="admin-field-wide">
                <span>SEO title (maximum 70 characters)</span>
                <input
                  maxLength="70"
                  value={form.seoTitle}
                  onChange={(event) => setField("seoTitle", event.target.value)}
                />
              </label>
              <label className="admin-field-wide">
                <span>SEO description (maximum 170 characters)</span>
                <textarea
                  rows="3"
                  maxLength="170"
                  value={form.seoDescription}
                  onChange={(event) =>
                    setField("seoDescription", event.target.value)
                  }
                />
              </label>
              <label className="admin-field-wide">
                <span>SEO keywords (comma separated)</span>
                <input
                  value={form.seoKeywords}
                  onChange={(event) =>
                    setField("seoKeywords", event.target.value)
                  }
                />
              </label>
              <label>
                <span>Status</span>
                <select
                  value={form.status}
                  onChange={(event) => setField("status", event.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) =>
                    setField("featured", event.target.checked)
                  }
                />
                <span>Featured product</span>
              </label>
            </div>
          </fieldset>

          <div className="admin-form-actions">
            <Link to="/admin/products">Cancel</Link>
            <button type="submit" disabled={saving}>
              {saving ? "Saving…" : editing ? "Save changes" : "Create product"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AdminProductForm;
