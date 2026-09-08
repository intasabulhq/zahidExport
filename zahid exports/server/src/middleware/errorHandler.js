export function notFound(req, res) {
  res.status(404).json({ error: 'API route not found' })
}

export function errorHandler(error, req, res, next) {
  console.error(error)
  if (res.headersSent) return next(error)
  res.status(error.status || 500).json({ error: error.status ? error.message : 'Internal server error' })
}
