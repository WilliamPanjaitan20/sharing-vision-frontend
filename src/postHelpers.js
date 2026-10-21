export const statusTabs = [
  { key: 'publish', label: 'Published' },
  { key: 'draft', label: 'Drafts' },
  { key: 'thrash', label: 'Trashed' },
]

export const emptyPost = { title: '', content: '', category: '' }

export function validatePost(draft) {
  const errors = {}

  if (draft.title.trim().length < 20) {
    errors.title = 'Use at least 20 characters.'
  }
  if (draft.content.trim().length < 200) {
    errors.content = 'Use at least 200 characters.'
  }
  if (draft.category.trim().length < 3) {
    errors.category = 'Use at least 3 characters.'
  }

  return errors
}

export function formatDate(value) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
