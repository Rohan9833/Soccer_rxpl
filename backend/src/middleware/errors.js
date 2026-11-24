export function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Not found.' });
}

// Never leak stack traces or internals to the client.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Invalid JSON payload.' });
  }
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Payload too large.' });
  }
  if (err?.message === 'CORS_NOT_ALLOWED') {
    return res.status(403).json({ success: false, message: 'Origin not allowed.' });
  }
  console.error('[error]', err);
  return res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
}
