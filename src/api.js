const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (response.status === 204) return null
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    const detail = body.fields ? Object.values(body.fields)[0] : body.error
    throw new Error(detail || 'Something went wrong. Please try again.')
  }
  return body
}

export const api = {
  list: () => request('/article/100/0'),
  get: (id) => request(`/article/${id}`),
  create: (payload) => request('/article/', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/article/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  trash: (id) => request(`/article/${id}`, { method: 'DELETE' }),
}
