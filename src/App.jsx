import { useCallback, useEffect, useMemo, useState } from 'react'
import { Eye, FilePlus2, FileText } from 'lucide-react'
import { api } from './api.js'
import { EditorScreen } from './components/EditorScreen.jsx'
import { Loading } from './components/Loading.jsx'
import { NavItem } from './components/NavItem.jsx'
import { PostsScreen } from './components/PostsScreen.jsx'
import { PreviewScreen } from './components/PreviewScreen.jsx'
import { emptyPost, statusTabs } from './postHelpers.js'

function App() {
  const [screen, setScreen] = useState('posts')
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('publish')
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadPosts = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      setPosts(await api.list())
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const navigate = (nextScreen) => {
    setError('')
    setNotice('')
    setScreen(nextScreen)
  }

  const startNew = () => {
    setEditing({ ...emptyPost })
    navigate('editor')
  }

  const startEdit = async (id) => {
    setError('')

    try {
      setEditing(await api.get(id))
      navigate('editor')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleTrash = async (id) => {
    if (!window.confirm('Move this article to Trashed?')) return

    setError('')

    try {
      await api.trash(id)
      setNotice('Article moved to Trashed.')
      await loadPosts()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleSave = async (draft, status) => {
    const saved = editing?.id
      ? await api.update(editing.id, { ...draft, status })
      : await api.create({ ...draft, status })

    await loadPosts()
    setScreen('posts')
    setNotice(`Article ${editing?.id ? 'updated' : 'created'} as ${saved.status === 'publish' ? 'Published' : 'Draft'}.`)
  }

  const counts = useMemo(() => {
    return statusTabs.reduce(
      (result, tab) => ({
        ...result,
        [tab.key]: posts.filter((post) => post.status === tab.key).length,
      }),
      {},
    )
  }, [posts])

  const publishedPosts = useMemo(
    () => posts.filter((post) => post.status === 'publish'),
    [posts],
  )

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => navigate('posts')}>
          SV Journal
        </button>

        <nav aria-label="Primary navigation">
          <NavItem active={screen === 'posts'} icon={<FileText />} onClick={() => navigate('posts')}>
            All Posts
          </NavItem>
          <NavItem active={screen === 'editor' && !editing?.id} icon={<FilePlus2 />} onClick={startNew}>
            Add New
          </NavItem>
          <NavItem active={screen === 'preview'} icon={<Eye />} onClick={() => navigate('preview')}>
            Preview
          </NavItem>
        </nav>

        <p className="sidebar-note">A focused space for publishing thoughtful work.</p>
      </aside>

      <main className="content">
        {error ? <div className="alert alert-error" role="alert">{error}</div> : null}
        {notice ? <div className="alert alert-success" role="status">{notice}</div> : null}

        {screen === 'posts' ? (
          <PostsScreen
            posts={posts}
            counts={counts}
            tab={activeTab}
            onTab={setActiveTab}
            onNew={startNew}
            onEdit={startEdit}
            onTrash={handleTrash}
            loading={loading}
          />
        ) : null}

        {screen === 'editor' ? (
          <EditorScreen
            key={editing?.id ?? 'new'}
            initial={editing}
            onCancel={() => navigate('posts')}
            onSave={handleSave}
          />
        ) : null}

        {screen === 'preview' ? <PreviewScreen posts={publishedPosts} loading={loading} /> : null}
      </main>
    </div>
  )
}

export default App
