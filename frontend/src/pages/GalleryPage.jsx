import { useState, useMemo, useEffect } from 'react'
import PictureCard from '../components/pictureCard'
import '../styles/Gallery.css'

export default function GalleryPage() {
  const [q, setQ] = useState('')
  const [pictures, setPictures] = useState([])
  const [backendError, setBackendError] = useState(false)

  // Scroll to top when component mounts and fetch pictures from API
  useEffect(() => {
    window.scrollTo(0, 0)
    
    let isMounted = true
    
    // Attempt to fetch pictures from the backend
    fetch('/api/pictures')
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Failed to fetch')
      })
      .then(data => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setPictures(data)
          setBackendError(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          // Show error state instead of fallback pictures
          setBackendError(true)
          setPictures([{
            id: 'error',
            name: 'Backend Connection Error',
            artist: 'System',
            url: 'https://picsum.photos/id/96/800/500', // Error/broken image
            description: 'Unable to connect to the backend server. Please check if the backend is running and try again.'
          }])
        }
      })
    
    return () => {
      isMounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    // If backend error, don't filter - just show the error card
    if (backendError) return pictures
    
    const term = q.trim().toLowerCase()
    if (!term) return pictures
    return pictures.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.artist.toLowerCase().includes(term)
    )
  }, [q, pictures, backendError])

  return (
    <main className="gallery">
      <div className="search-bar">
        <input
          placeholder={backendError ? "Backend connection error - search disabled" : "Search by picture or artist…"}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          disabled={backendError}
        />
      </div>
      <div className="grid">
        {filtered.map(pic => <PictureCard key={pic.id} pic={pic} />)}
      </div>
    </main>
  )
}