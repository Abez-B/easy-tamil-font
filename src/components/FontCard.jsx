import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Download, Heart } from 'lucide-react';
import { useFontLoader } from '../hooks/useFontLoader';
import { getRandomPangram } from '../utils/pangrams';
import { useFavorites } from '../hooks/useFavorites';

export default function FontCard({ font }) {
  const isLoaded = useFontLoader(font);
  const isLegacy = font.category === 'TACE16';
  const [previewText] = useState(() => getRandomPangram());
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const isFav = isFavorite(font.id);

  const categoryBadgeClass = isLegacy ? 'badge-tace16' : 'badge-unicode';

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const a = document.createElement('a');
    a.href = font.downloadUrl;
    a.download = font.downloadUrl.split('/').pop() || font.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Link to={`/font/${font.id}`} className="font-card group flex flex-col h-full" aria-label={font.name}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-primary dark:text-white text-lg group-hover:text-accent dark:group-hover:text-gray-300 transition-colors">
          {font.name}
        </h3>
        <div className="flex items-center shrink-0 ml-2">
          <button 
            onClick={(e) => toggleFavorite(font.id, e)}
            className="p-1 mr-2 text-text-secondary dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            title={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className="w-5 h-5" fill={isFav ? "currentColor" : "none"} color={isFav ? "#ef4444" : "currentColor"} />
          </button>
          <span className={`badge ${categoryBadgeClass}`}>
            {font.category}
          </span>
        </div>
      </div>

      <div className="flex-1">
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
            className={`font-preview mb-3 text-base ${!isLoaded ? 'opacity-50' : 'opacity-100'} transition-opacity`}
            style={isLoaded ? { fontFamily: `"${font.name}", system-ui` } : {}}
          >
            {previewText}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-4 border-t border-border dark:border-gray-800">
        <div className="flex flex-wrap gap-1">
          {font.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="badge">{tag}</span>
          ))}
        </div>
        
        {font.downloadUrl && (
          <button 
            onClick={handleDownload}
            className="p-2 text-text-secondary dark:text-gray-400 hover:text-accent dark:hover:text-white hover:bg-bg-secondary dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label={`Download ${font.name}`}
            title="Download Font"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
      </div>
    </Link>
  );
}
