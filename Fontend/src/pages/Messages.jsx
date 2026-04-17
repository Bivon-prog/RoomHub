import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { Send } from 'lucide-react'

export default function Messages() {
  const { user } = useAuth()
  const [params] = useSearchParams()
  const [inbox, setInbox] = useState([])
  const [activeId, setActiveId] = useState(params.get('to') ? Number(params.get('to')) : null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  useEffect(() => { fetchInbox() }, [])
  useEffect(() => { if (activeId) fetchConversation(activeId) }, [activeId])

  async function fetchInbox() {
    const { data } = await api.get('/messages/inbox/')
    setInbox(data)
    if (!activeId && data.length > 0) setActiveId(data[0].user_id)
  }

  async function fetchConversation(id) {
    const { data } = await api.get(`/messages/${id}/`)
    setMessages(data)
  }

  async function sendMessage(e) {
    e.preventDefault()
    if (!text.trim()) return
    await api.post('/messages/', { receiver: activeId, content: text })
    setText('')
    fetchConversation(activeId)
  }

  return (
    <div className="page messages-page">
      <div className="inbox-list">
        <h2>Messages</h2>
        {inbox.map(c => (
          <div key={c.user_id} className={`inbox-item ${activeId===c.user_id?'active':''}`} onClick={()=>setActiveId(c.user_id)}>
            <strong>{c.username}</strong>
            <p>{c.last_message}</p>
            {c.unread > 0 && <span className="unread-badge">{c.unread}</span>}
          </div>
        ))}
        {inbox.length === 0 && <p className="empty">No conversations yet.</p>}
      </div>

      <div className="chat-window">
        {activeId ? (
          <>
            <div className="chat-messages">
              {messages.map(m => (
                <div key={m.id} className={`chat-bubble ${m.sender===user?.id?'mine':'theirs'}`}>
                  <p>{m.content}</p>
                  <span>{new Date(m.created_at).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
            <form className="chat-input" onSubmit={sendMessage}>
              <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message..." />
              <button type="submit" className="btn-primary"><Send size={16}/></button>
            </form>
          </>
        ) : <div className="empty">Select a conversation</div>}
      </div>
    </div>
  )
}
