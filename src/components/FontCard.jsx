import { Link } from 'react-router-dom';

export default function FontCard({ font }) {
  const categoryBadgeClass = font.category === 'Unicode'
    ? 'badge-unicode'
    : 'badge-tace16';

  return (
    <Link to={`/font/${font.id}`} className="font-card group" aria-label={font.name}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-primary text-lg group-hover:text-accent transition-colors">
          {font.name}
        </h3>
        <span className={`badge ${categoryBadgeClass} shrink-0 ml-2`}>
          {font.category}
        </span>
      </div>

      <div
        className="font-preview mb-3 text-base"
        style={{ fontFamily: `"${font.name}", system-ui` }}
      >
        {font.sampleText}
      </div>

      <div className="flex flex-wrap gap-1">
        {font.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="badge">{tag}</span>
        ))}
      </div>
    </Link>
  );
}
