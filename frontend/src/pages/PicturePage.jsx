import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ChatBox from '../components/ChatBox'
import '../styles/PicturePage.css'

function PicturePage() {
  const { id } = useParams()
  const [picture, setPicture] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Scroll to top immediately when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Separate effect for fetching data
  useEffect(() => {
    let isMounted = true
    
    // Fetch pictures from backend and find the one with matching id
    fetch('/api/pictures')
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Failed to fetch')
      })
      .then(data => {
        if (isMounted && Array.isArray(data)) {
          const foundPicture = data.find(pic => pic.id === id)
          setPicture(foundPicture || null)
          setLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(true)
          setLoading(false)
        }
      })
    
    return () => {
      isMounted = false
    }
  }, [id])

  // Scroll to top whenever the content changes
  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0)
    }
  }, [loading, picture, error])

  // Loading state
  if (loading) {
    return (
      <div className="picture-page">
        <div className="pic-left">
          <h2>Loading...</h2>
          <p>Fetching picture details...</p>
        </div>
      </div>
    )
  }

  // Error state (backend down)
  if (error) {
    return (
      <div className="picture-page">
        <div className="pic-left">
          <h2>Backend Connection Error</h2>
          <p>Unable to connect to the backend server. Please check if the backend is running and try again.</p>
          <Link to="/" className="btn">Back to Gallery</Link>
        </div>
      </div>
    )
  }
  
  // Picture not found
  if (!picture) {
    return (
      <div className="picture-page">
        <div className="pic-left">
          <h2>Picture not found</h2>
          <p>The picture you're looking for doesn't exist.</p>
          <Link to="/" className="btn">Back to Gallery</Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="picture-page">
      <div className="pic-left">
        <div className="picture-back">
          <Link to="/" className="back-btn">← Back to Gallery</Link>
        </div>
        <div className="picture-meta">
          <div className="picture-title-row">
            <h2>{picture.name}</h2>
            <p className="artist">by {picture.artist}</p>
          </div>
        </div>
        <img 
          src={picture.url} 
          alt={`${picture.name} by ${picture.artist}`}
          className="picture-large"
          onLoad={() => window.scrollTo(0, 0)}
        />
      </div>
      
      <div className="pic-right">
        <ChatBox pictureId={id} />
      </div>
    </div>
  )
}

export default PicturePage
