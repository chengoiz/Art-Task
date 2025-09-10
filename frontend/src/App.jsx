import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import GalleryPage from './pages/GalleryPage'
import PicturePage from './pages/PicturePage'
import './App.css'
import './styles/Header.css'
import './styles/Button.css'

function Header() {
  return (
    <header className="app-header">
      <h1 className="brand">Art Talks</h1>
    </header>
  )
}

function App() {
  return (
    <Router>
      <div className="app">
        <Header />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<GalleryPage />} />
            <Route path="/picture/:id" element={<PicturePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
