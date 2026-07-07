import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, Loader2, RefreshCw, Bold, Italic, Heart } from 'lucide-react';
import { useFontsData } from '../hooks/useFontsData';
import { useFavorites } from '../hooks/useFavorites';
import FontPreview from '../components/FontPreview';
import GlyphChart from '../components/GlyphChart';
import { getRandomPangram, getRandomParagraph, PANGRAMS } from '../utils/pangrams';

export default function FontDetail() {
  const { id } = useParams();
  const { fonts, loading, error } = useFontsData();

  const font = fonts.find((f) => f.id === id);

  const [customText, setCustomText] = useState(undefined);
  const [fontSize, setFontSize] = useState(32);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [activeMode, setActiveMode] = useState('custom');
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const { toggleFavorite, isFavorite } = useFavorites();

  const isFav = font ? isFavorite(font.id) : false;

  useEffect(() => {
    setSelectedVariantIndex(0);
  }, [font?.id]);

  const activeVariant = font?.variantsList?.[selectedVariantIndex] || font;
  
  // Create a proxy object for components that expect standard font structure
  const fontForPreview = {
    ...font,
    name: activeVariant?.originalName || activeVariant?.fontFamily || font?.name,
    downloadUrl: activeVariant?.downloadUrl || font?.downloadUrl
  };

  const isLegacy = font?.category === 'TACE16';
  
  const categoryBadgeClass = !isLegacy
    ? 'badge-unicode'
    : 'badge-tace16';

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    if (mode === 'sentence') {
      let next;
      do { next = getRandomPangram(); } while (next === customText && PANGRAMS.length > 1);
      setCustomText(next);
    } else if (mode === 'paragraph') {
      setCustomText(getRandomParagraph(3));
    } else if (mode === 'alphabet') {
      setCustomText('அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ க ச ட த ந ப ம ய ர ல வ ழ ள ற ன');
    } else if (mode === 'numerals') {
      setCustomText('௦ ௧ ௨ ௩ ௪ ௫ ௬ ௭ ௮ ௯ 0 1 2 3 4 5 6 7 8 9');
    } else {
      setCustomText('');
    }
  };

  const resolvedCustomText = customText !== undefined
    ? customText
    : (font?.sampleText ?? '');

  useFontsData();

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
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-primary dark:text-white">{font.name} {activeVariant?.variantName && activeVariant.variantName !== 'Regular' ? activeVariant.variantName : ''}</h1>
                <button 
                  onClick={(e) => toggleFavorite(font.id, e)}
                  className="p-1.5 rounded-full bg-white dark:bg-gray-800 border border-border shadow-sm text-text-secondary dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  title={isFav ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className="w-5 h-5" fill={isFav ? "currentColor" : "none"} color={isFav ? "#ef4444" : "currentColor"} />
                </button>
                <span className={`badge ${categoryBadgeClass}`}>
                  {font.category}
                </span>
              </div>
              <p className="text-text-secondary dark:text-gray-400">{font.description}</p>
            </div>

            {/* Live preview panel */}
            <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-border rounded-xl p-6 mb-6 shadow-sm">
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
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {['custom', 'sentence', 'paragraph', 'alphabet', 'numerals'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => handleModeChange(mode)}
                        className={`px-3 py-1 text-sm rounded-full capitalize transition-colors ${
                          activeMode === mode
                            ? 'bg-accent text-white border border-accent'
                            : 'bg-white dark:bg-gray-800 text-text-secondary dark:text-gray-400 border border-border dark:border-gray-700 hover:border-accent dark:hover:border-accent'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                    {(activeMode === 'sentence' || activeMode === 'paragraph') && (
                      <button
                        onClick={() => handleModeChange(activeMode)}
                        className="p-1.5 rounded-full bg-bg-secondary dark:bg-gray-800 text-text-secondary dark:text-gray-400 hover:text-accent transition-colors border border-border dark:border-gray-700"
                        title="Get another random text"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* textarea — explicit dark classes so browser defaults can't override */}
                  <textarea
                    value={resolvedCustomText}
                    onChange={(e) => {
                      setCustomText(e.target.value);
                      setActiveMode('custom');
                    }}
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
                  
                  <div className="flex flex-wrap items-center gap-4 mb-4 bg-white/80 dark:bg-black/50 p-3 rounded-lg border border-border dark:border-zinc-800 backdrop-blur-sm">
                    <div className="flex-1 flex items-center gap-4 min-w-[200px]">
                      <label htmlFor="fontSizeSlider" className="text-sm font-medium text-text-secondary dark:text-gray-400 whitespace-nowrap">
                        Size: {fontSize}px
                      </label>
                      <input
                        id="fontSizeSlider"
                        type="range"
                        min="12"
                        max="96"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 border-l border-border dark:border-gray-700 pl-4">
                      <button
                        onClick={() => setIsBold(!isBold)}
                        className={`p-1.5 rounded-md transition-colors ${isBold ? 'bg-accent text-white' : 'text-text-secondary dark:text-gray-400 hover:bg-bg-secondary dark:hover:bg-gray-700'}`}
                        title="Toggle Bold"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsItalic(!isItalic)}
                        className={`p-1.5 rounded-md transition-colors ${isItalic ? 'bg-accent text-white' : 'text-text-secondary dark:text-gray-400 hover:bg-bg-secondary dark:hover:bg-gray-700'}`}
                        title="Toggle Italic"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <FontPreview 
                    font={fontForPreview} 
                    customText={resolvedCustomText} 
                    fontSize={fontSize} 
                    fontWeight={isBold ? 'bold' : 'normal'}
                    fontStyle={isItalic ? 'italic' : 'normal'}
                  />
                </>
              )}
            </div>
            
            {!isLegacy && <GlyphChart fontFamily={font.name} />}
          </div>

          {/* ── Right: metadata ── */}
          <div>
            <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-border shadow-sm rounded-xl p-6 sticky top-24">
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
                  <h3 className="text-xs font-medium text-text-secondary dark:text-gray-500 uppercase tracking-wider mb-2">Select Variant</h3>
                  <div className="flex flex-col gap-2">
                    {font.variantsList?.map((variant, idx) => (
                      <button
                        key={variant.variantName}
                        onClick={() => setSelectedVariantIndex(idx)}
                        className={`text-left px-3 py-2 rounded-lg text-sm transition-colors border ${
                          idx === selectedVariantIndex
                            ? 'bg-accent/10 border-accent text-accent dark:text-red-400 font-semibold'
                            : 'bg-white dark:bg-gray-800 border-transparent text-text-secondary dark:text-gray-400 hover:border-border dark:hover:border-gray-600'
                        }`}
                      >
                        {variant.variantName}
                      </button>
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
                    href={activeVariant.downloadUrl || font.downloadUrl}
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
