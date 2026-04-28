import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, Loader2 } from 'lucide-react';
import { useFontsData } from '../hooks/useFontsData';
import FontPreview from '../components/FontPreview';

export default function FontDetail() {
  const { id } = useParams();
  const { fonts, loading, error } = useFontsData();

  const font = fonts.find((f) => f.id === id);

  // Initialize with sample text once font is available.
  // We intentionally allow undefined until data loads.
  const [customText, setCustomText] = useState(undefined);

  // Once font loads for the first time, seed the textarea
  const resolvedCustomText = customText !== undefined
    ? customText
    : (font?.sampleText ?? '');

  useFontsData(); // ensures @font-face rules are injected even on direct navigation

  const categoryBadgeClass = font?.category === 'Unicode'
    ? 'badge-unicode'
    : 'badge-tace16';

  // ── Loading ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex items-center justify-center gap-3 text-text-secondary">
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
        <p className="text-text-secondary text-sm mb-4">{error}</p>
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
          <h1 className="text-2xl font-bold text-primary mb-4">Font not found</h1>
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
        <Link to="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: preview */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-primary">{font.name}</h1>
                <span className={`badge ${categoryBadgeClass}`}>
                  {font.category}
                </span>
              </div>
              <p className="text-text-secondary">{font.description}</p>
            </div>

        <div className="bg-bg-secondary rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="font-semibold text-primary">Live Preview</h2>
            <span className="text-xs text-text-secondary max-w-[200px] text-right">
              Note: Some browsers may not display preview due to font file format. Download works in all browsers.
            </span>
          </div>
          <textarea
            value={resolvedCustomText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Type your text here to preview…"
            className="input-field mb-4"
            rows="3"
          />
          <FontPreview font={font} customText={resolvedCustomText} />
        </div>
          </div>

          {/* Right: metadata */}
          <div>
            <div className="bg-bg-secondary rounded-xl p-6 sticky top-24">
              <h2 className="font-semibold text-primary mb-4">Font Details</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">Author</h3>
                  <p className="text-primary">{font.author}</p>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">License</h3>
                  <p className="text-primary">{font.license}</p>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">Variants</h3>
                  <div className="flex flex-wrap gap-1">
                    {font.variants.map((variant) => (
                      <span key={variant} className="badge">{variant}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {font.tags.map((tag) => (
                      <span key={tag} className="badge">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
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
