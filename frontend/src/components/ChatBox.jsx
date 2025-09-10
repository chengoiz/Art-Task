import { useState, useEffect, useRef } from 'react'
import '../styles/Chat.css'

function ChatBox({ pictureId }) {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [ws, setWs] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef(null)
  
  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  // WebSocket connection setup
  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3000')
    
    websocket.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)
      // Request message history for this picture
      websocket.send(JSON.stringify({
        type: 'history',
        pictureId: pictureId
      }))
    }
    
    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        if (data.type === 'history' && data.pictureId === pictureId) {
          // Set messages list to the history items
          setMessages(data.items || [])
        } else if (data.type === 'chat' && data.pictureId === pictureId) {
          // Append new chat message if it's for this picture
          setMessages(prev => [...prev, data])
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }
    
    websocket.onclose = () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    }
    
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error)
      setIsConnected(false)
    }
    
    setWs(websocket)
    
    // Cleanup on unmount
    return () => {
      websocket.close()
    }
  }, [pictureId])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!inputText.trim() || !ws || !isConnected) {
      return
    }
    
    // Send message via WebSocket
    const message = {
      type: 'chat',
      pictureId: pictureId,
      text: inputText.trim(),
      author: 'You',
      ts: Date.now()
    }
    
    ws.send(JSON.stringify(message))
    
    // Clear input after sending
    setInputText('')
  }
  
  const formatTimestamp = (ts) => {
    const date = new Date(ts)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  return (
    <div className="chat">
      <h3>Discussion</h3>
      
      <div className="chat-list">
        {messages.length === 0 ? (
          <p className="chat-empty">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="chat-item">
              <div className="chat-meta">
                <strong>{message.author}</strong>
                <span className="chat-time">{formatTimestamp(message.ts)}</span>
              </div>
              <div className="chat-text">{message.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isConnected ? "Share your thoughts..." : "Connecting..."}
          disabled={!isConnected}
        />
        <button 
          type="submit" 
          className="btn"
          disabled={!isConnected || !inputText.trim()}
        >
          Send
        </button>
      </form>
      
      {!isConnected && (
        <div className="chat-status">
          Connecting to chat server...
        </div>
      )}
    </div>
  )
}

export default ChatBox
