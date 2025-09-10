import { Link } from 'react-router-dom'

export default function PictureCard({ pic }) {
  return (
    <div className="card">
      <img src={pic.url} alt={pic.name} className="thumb" />
      <div className="card-body">
        <h3>{pic.name}</h3>
        <p className="artist">{pic.artist}</p>
        <p>{pic.description}</p>
        <Link className="btn" to={`/picture/${pic.id}`}>Discuss</Link>
      </div>
    </div>
  )
}