function CataloguePagination({ page, hasMore, onPageChange }) {
  if (page === 1 && !hasMore) return null
  return <nav className="catalogue-pagination" aria-label="Product pages">
    <button type="button" className="btn" disabled={page === 1} onClick={() => onPageChange(page - 1)}>← Previous</button>
    <span aria-live="polite">Page {page}</span>
    <button type="button" className="btn" disabled={!hasMore} onClick={() => onPageChange(page + 1)}>Next →</button>
  </nav>
}

export default CataloguePagination
