import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, Loader2 } from 'lucide-react';
import { useFontsData } from '../hooks/useFontsData';
import FontPreview from '../components/FontPreview';

export default function FontDetail() {
  const { id } = useParams();
  const { fonts, loading, error } = useFontsData();

  const font = fonts.find((f) => f.id === id);

  const [customText, setCustomText] = useState(undefined);

  const resolvedCustomText = customText !== undefined
    ? customText
    : (font?.sampleText ?? '');

  useFontsData();

  const categoryBadgeClass = font?.category === 'Unicode'
    ? 'badge-unicode'
    : 'badge-tace16';

  // ── Loading ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex items-center justify-center gap-3 text-text-secondary dark:text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Loading font data…</span>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-red-500 font-medium mb-2">Failed to load font data</p>
        <p className="text-text-secondary dark:text-gray-400 text-sm mb-4">{error}</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Gallery
        </Link>
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────
  if (!font) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-primary dark:text-white mb-4">Font not found</h1>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  // ── Detail ─────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left: preview ── */}
          <div className="lg:col-span-2">
            {/* Font title */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-primary dark:text-white">{font.name}</h1>
                <span className={`badge ${categoryBadgeClass}`}>
                  {font.category}
                </span>
              </div>
              <p className="text-text-secondary dark:text-gray-400">{font.description}</p>
            </div>

            {/* Live preview panel */}
            <div className="bg-bg-secondary dark:bg-gray-900 rounded-xl p-6 mb-6">
              <h2 className="font-semibold text-primary dark:text-white mb-4">Live Preview</h2>

              {font.category === 'TACE16' ? (
                <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4">
                  <p className="font-medium text-amber-800 dark:text-amber-300 mb-1">
                    Legacy Encoding — Browser Preview Unavailable
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                    TACE16 is a pre-Unicode Tamil encoding standard where Tamil characters
                    are stored as ANSI byte values. Modern web browsers only render Unicode,
                    so this font cannot be previewed here. Download the font and use it in
                    TACE16-aware software (e.g. Microsoft Word with TACE16 keyboard layout).
                  </p>
                </div>
              ) : (
                <>
                  {/* textarea — explicit dark classes so browser defaults can't override */}
                  <textarea
                    value={resolvedCustomText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Type your text here to preview…"
                    rows="3"
                    className="
                      w-full px-4 py-3 mb-4 rounded-lg border
                      bg-white dark:bg-gray-800
                      text-gray-900 dark:text-white
                      border-gray-200 dark:border-gray-700
                      placeholder-gray-400 dark:placeholder-gray-500
                      focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400
                      transition-colors resize-none
                    "
                  />
                  <FontPreview font={font} customText={resolvedCustomText} />
                </>
              )}
            </div>
          </div>

          {/* ── Right: metadata ── */}
          <div>
            <div className="bg-bg-secondary dark:bg-gray-900 rounded-xl p-6 sticky top-24">
              <h2 className="font-semibold text-primary dark:text-white mb-4">Font Details</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-medium text-text-secondary dark:text-gray-500 uppercase tracking-wider mb-1">Author</h3>
                  <p className="text-primary dark:text-gray-100">{font.author}</p>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-text-secondary dark:text-gray-500 uppercase tracking-wider mb-1">License</h3>
                  <p className="text-primary dark:text-gray-100">{font.license}</p>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-text-secondary dark:text-gray-500 uppercase tracking-wider mb-1">Variants</h3>
                  <div className="flex flex-wrap gap-1">
                    {font.variants.map((variant) => (
                      <span key={variant} className="badge">{variant}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-text-secondary dark:text-gray-500 uppercase tracking-wider mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {font.tags.map((tag) => (
                      <span key={tag} className="badge">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border dark:border-gray-700 space-y-3">
                  <a
                    href={font.downloadUrl}
                    download
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Font</span>
                  </a>
                  <a
                    href={font.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Source</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
