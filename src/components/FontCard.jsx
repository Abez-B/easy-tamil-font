import { Link } from 'react-router-dom';

export default function FontCard({ font }) {
  const categoryBadgeClass = font.category === 'Unicode' 
    ? 'badge-unicode' 
    : 'badge-tace16';

  return (
    <Link to={`/font/${font.id}`} className="font-card">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-primary text-lg">{font.name}</h3>
        <span className={`badge ${categoryBadgeClass}`}>
          {font.category}
        </span>
      </div>
      
      <div 
        className="font-preview mb-3"
        style={{ fontFamily: font.name }}
      >
        {font.sampleText}
      </div>
      
      <div className="flex flex-wrap gap-1">
        {font.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="badge bg-bg-secondary text-text-secondary">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
