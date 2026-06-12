import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function FontCard({ font }) {
  const isLegacy = font.category === 'TACE16';

  const categoryBadgeClass = isLegacy ? 'badge-tace16' : 'badge-unicode';

  return (
    <Link to={`/font/${font.id}`} className="font-card group" aria-label={font.name}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-primary dark:text-white text-lg group-hover:text-accent dark:group-hover:text-gray-300 transition-colors">
          {font.name}
        </h3>
        <span className={`badge ${categoryBadgeClass} shrink-0 ml-2`}>
          {font.category}
        </span>
      </div>

      {isLegacy ? (
        /* TACE16 fonts use ANSI byte encoding, not Unicode.
           Web browsers only support Unicode — there is no reliable
           way to preview TACE16-encoded Tamil glyphs in a browser. */
        <div className="flex items-start gap-2 mb-3 px-3 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
              Legacy Encoding — Preview Unavailable
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 leading-snug">
              TACE16 fonts use an ANSI byte encoding that browsers don't support. 
              Download to use in TACE16-aware software.
            </p>
          </div>
        </div>
      ) : (
        /* Unicode fonts render Tamil text natively in the browser */
        <div
          className="font-preview mb-3 text-base"
          style={{ fontFamily: `"${font.name}", system-ui` }}
        >
          {font.sampleText}
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {font.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="badge">{tag}</span>
        ))}
      </div>
    </Link>
  );
}
