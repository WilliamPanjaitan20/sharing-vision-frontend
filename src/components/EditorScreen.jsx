import { useState } from 'react'
import { validatePost } from '../postHelpers.js'

export function EditorScreen({ initial, onCancel, onSave }) {
  const [draft, setDraft] = useState(() => ({
    title: initial?.title ?? '',
    content: initial?.content ?? '',
    category: initial?.category ?? '',
  }))
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setDraft((current) => ({ ...current, [name]: value }))
  }

  const save = async (status) => {
    const nextErrors = validatePost(draft)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) return

    setSaving(true)
    setServerError('')

    try {
      await onSave(draft, status)
    } catch (requestError) {
      setServerError(requestError.message)
      setSaving(false)
    }
  }

  const handleDraftSubmit = (event) => {
    event.preventDefault()
    save('draft')
  }

  return (
    <section className="editor-screen">
      <header className="editor-header">
        <div>
          <button className="back-link" onClick={onCancel}>Back to all posts</button>
          <h1>{initial?.id ? 'Edit article' : 'Add new article'}</h1>
          <p>Shape the story, then decide when it is ready to be read.</p>
        </div>
      </header>

      {serverError ? <div className="alert alert-error" role="alert">{serverError}</div> : null}

      <form onSubmit={handleDraftSubmit} noValidate>
        <Field label="Title" error={errors.title}>
          <input
            name="title"
            value={draft.title}
            onChange={handleChange}
            placeholder="A clear, considered title"
            maxLength="200"
          />
        </Field>

        <Field label="Content" error={errors.content}>
          <textarea
            name="content"
            value={draft.content}
            onChange={handleChange}
            placeholder="Write the article here..."
            rows="12"
          />
        </Field>

        <Field label="Category" error={errors.category}>
          <input
            name="category"
            value={draft.category}
            onChange={handleChange}
            placeholder="e.g. Product, Culture, Engineering"
            maxLength="100"
          />
        </Field>

        <div className="editor-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>Cancel</button>
          <button type="submit" className="secondary-button" disabled={saving}>
            {saving ? 'Saving...' : 'Save draft'}
          </button>
          <button type="button" className="primary-button" onClick={() => save('publish')} disabled={saving}>
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>
    </section>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error ? <small>{error}</small> : null}
    </label>
  )
}
