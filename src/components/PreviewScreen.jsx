import { useEffect, useState } from 'react'
import { formatDate } from '../postHelpers.js'
import { Loading } from './Loading.jsx'

const postsPerPage = 4

export function PreviewScreen({ posts, loading }) {
  const [page, setPage] = useState(0)
  const totalPages = Math.max(1, Math.ceil(posts.length / postsPerPage))
  const currentPage = Math.min(page, totalPages - 1)
  const visiblePosts = posts.slice(
    currentPage * postsPerPage,
    currentPage * postsPerPage + postsPerPage,
  )

  useEffect(() => {
    setPage(0)
  }, [posts.length])

  return (
    <section className="preview-screen">
      <header className="preview-header">
        <p className="section-label">SV JOURNAL</p>
        <h1>Recent writing</h1>
        <p>Ideas, notes, and practical stories from the team.</p>
      </header>

      {loading ? <Loading /> : null}

      {!loading && visiblePosts.length ? (
        <>
          <div className="article-list">
            {visiblePosts.map((post) => (
              <article key={post.id}>
                <p>{post.category} {'\u00b7'} {formatDate(post.created_date)}</p>
                <h2>{post.title}</h2>
                <div>{post.content}</div>
              </article>
            ))}
          </div>

          {totalPages > 1 ? (
            <nav className="pagination" aria-label="Preview pages">
              <button disabled={currentPage === 0} onClick={() => setPage((current) => current - 1)}>
                Previous
              </button>
              <span>Page {currentPage + 1} of {totalPages}</span>
              <button disabled={currentPage === totalPages - 1} onClick={() => setPage((current) => current + 1)}>
                Next
              </button>
            </nav>
          ) : null}
        </>
      ) : null}

      {!loading && !visiblePosts.length ? (
        <div className="empty-preview">
          <h2>Nothing published yet.</h2>
          <p>Published articles will appear here.</p>
        </div>
      ) : null}
    </section>
  )
}
