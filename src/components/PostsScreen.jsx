import { Pencil, Plus, Trash2 } from 'lucide-react'
import { formatDate, statusTabs } from '../postHelpers.js'
import { Loading } from './Loading.jsx'

export function PostsScreen({ posts, counts, tab, onTab, onNew, onEdit, onTrash, loading }) {
  const items = posts.filter((post) => post.status === tab)
  const activeTab = statusTabs.find((item) => item.key === tab)

  return (
    <section className="posts-screen">
      <header className="page-header">
        <div>
          <h1>All posts</h1>
          <p>
            {posts.length} posts total{' '}
            <span>
              ({counts.publish ?? 0} published, {counts.draft ?? 0} draft{counts.draft === 1 ? '' : 's'}, {' '}
              {counts.thrash ?? 0} trashed)
            </span>
          </p>
        </div>
        <button className="primary-button" onClick={onNew}>
          <Plus />
          Add new article
        </button>
      </header>

      <div className="tabs" role="tablist" aria-label="Article status">
        {statusTabs.map((item) => (
          <button
            key={item.key}
            className={tab === item.key ? 'selected' : ''}
            role="tab"
            aria-selected={tab === item.key}
            onClick={() => onTab(item.key)}
          >
            {item.label} <span>({counts[item.key] ?? 0})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.length ? (
                items.map((post) => (
                  <tr key={post.id}>
                    <td className="title-cell">{post.title}</td>
                    <td>{post.category}</td>
                    <td>{formatDate(post.updated_date)}</td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-button" aria-label={`Edit ${post.title}`} onClick={() => onEdit(post.id)}>
                          <Pencil />
                        </button>
                        {tab !== 'thrash' ? (
                          <button className="icon-button danger" aria-label={`Trash ${post.title}`} onClick={() => onTrash(post.id)}>
                            <Trash2 />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-table">
                    No {activeTab?.label.toLowerCase()} articles yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
