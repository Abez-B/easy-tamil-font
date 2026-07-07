import { useState, useMemo, useEffect } from 'react';
import SidebarFilters from '../components/SidebarFilters';
import FontList from '../components/FontList';
import { useFontsData } from '../hooks/useFontsData';
import { Loader2, Menu } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

const SAMPLE_TAMIL = 'தமிழ் எழுத்துருக்கள்';

export default function Home() {
  const { fonts, categories, licenses, collections, loading, error } = useFontsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLicense, setSelectedLicense] = useState('all');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [sortOrder, setSortOrder] = useState('random');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { favorites } = useFavorites();
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // -- Hero Font Cycling Logic --
  const heroFonts = useMemo(() => {
    if (!fonts || fonts.length === 0) return [];
    // Get up to 35 random unicode fonts
    const unicodeFonts = fonts.filter(f => f.category !== 'TACE16');
    return [...unicodeFonts].sort(() => 0.5 - Math.random()).slice(0, 35);
  }, [fonts]);

  useEffect(() => {
    // Dynamically inject @font-face for the hero fonts so they are preloaded
    heroFonts.forEach(font => {
      const fontName = font.name;
      const id = `hero-font-${fontName.replace(/\s+/g, '-')}`;
      if (!document.getElementById(id)) {
        const isAbsolute = /^https?:\/\//.test(font.downloadUrl);
        const baseUrl = import.meta.env.VITE_BASE_PATH || '/';
        const url = isAbsolute
          ? font.downloadUrl
          : `${baseUrl}${font.downloadUrl.replace(/^\//, '')}?v=3`;
        
        const style = document.createElement('style');
        style.id = id;
        style.textContent = `@font-face { font-family: "${fontName}"; src: url("${url}") format("truetype"); font-display: swap; }`;
        document.head.appendChild(style);
      }
    });
  }, [heroFonts]);

  const [currentHeroFontIndex, setCurrentHeroFontIndex] = useState(0);

  useEffect(() => {
    if (heroFonts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHeroFontIndex((prev) => (prev + 1) % heroFonts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [heroFonts]);

  const activeHeroFontName = heroFonts.length > 0 ? heroFonts[currentHeroFontIndex].name : 'var(--font-tamil)';

  const filteredAndSortedFonts = useMemo(() => {
    // Filter
    const filtered = fonts.filter((font) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        font.name.toLowerCase().includes(q) ||
        (font.description && font.description.toLowerCase().includes(q)) ||
        font.tags.some((tag) => tag.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'all' || font.category === selectedCategory;
        
      const matchesLicense =
        selectedLicense === 'all' || font.license === selectedLicense;
        
      const matchesCollection =
        selectedCollection === 'all' || font.collection === selectedCollection;

      const matchesFavorites = showFavoritesOnly ? favorites.includes(font.id) : true;

      return matchesSearch && matchesCategory && matchesLicense && matchesCollection && matchesFavorites;
    });

    // Sort
    return filtered.sort((a, b) => {
      if (sortOrder === 'random') {
        return (a.randomWeight || 0) - (b.randomWeight || 0);
      } else if (sortOrder === 'name-asc') {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === 'name-desc') {
        return b.name.localeCompare(a.name);
      } else if (sortOrder === 'category') {
        return a.category.localeCompare(b.category);
      } else if (sortOrder === 'newest') {
        // Assuming there's a date or added field, if not, fallback to name
        const dateA = a.added || '';
        const dateB = b.added || '';
        return dateB.localeCompare(dateA);
      }
      return 0;
    });
  }, [fonts, searchTerm, selectedCategory, selectedLicense, selectedCollection, sortOrder, showFavoritesOnly, favorites]);

  const isFiltered = searchTerm || selectedCategory !== 'all' || selectedLicense !== 'all' || selectedCollection !== 'all' || showFavoritesOnly;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-section border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-18 relative z-10">
          <div className="max-w-2xl">
            {/* Large decorative Tamil text with gradient */}
            <div className="flex flex-col -space-y-2 sm:-space-y-4 md:-space-y-6 mb-4" aria-hidden="true">
              <div
                className="text-3xl sm:text-4xl md:text-6xl font-bold leading-[1.4] sm:leading-[1.6] md:leading-[1.8] py-2 px-2 tracking-[0.08em] text-gradient transition-all duration-500"
                style={{ fontFamily: `"${activeHeroFontName}", system-ui` }}
              >
                தமிழ்
              </div>
              <div
                className="text-3xl sm:text-4xl md:text-6xl font-bold leading-[1.4] sm:leading-[1.6] md:leading-[1.8] py-2 px-2 tracking-[0.08em] text-gradient transition-all duration-500"
                style={{ fontFamily: `"${activeHeroFontName}", system-ui` }}
              >
                எழுத்துருக்கள்
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-gray-100 mb-3">
              Tamil Font Gallery
            </h1>
            <p className="text-text-secondary dark:text-gray-300 text-lg leading-relaxed mb-6">
              Browse and preview{' '}
              <span className="font-semibold text-gradient">
                {loading ? '…' : `${fonts.length} Tamil fonts`}
              </span>{' '}
              from Tamil Virtual Academy. Free for educational and research use.
            </p>

            {/* Category breakdown — dynamically generated */}
            {!loading && !error && (
              <div className="flex flex-wrap gap-4 text-sm text-text-secondary dark:text-gray-300">
                {categories.map((cat) => (
                  <span key={cat.name} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full inline-block ${
                      cat.name === 'Unicode' ? 'bg-gray-800 dark:bg-gray-400' : 'bg-red-600'
                    }`} />
                    {cat.count} {cat.name} fonts
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Gallery Area ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-8 w-full flex-1 flex flex-col lg:flex-row gap-8">
        {/* Loading state */}
        {loading && (
          <div className="w-full flex items-center justify-center py-24 gap-3 text-text-secondary">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading fonts…</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="w-full text-center py-16">
            <p className="text-red-500 font-medium mb-2">Failed to load font data</p>
            <p className="text-text-secondary text-sm">{error}</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden mb-4 flex justify-between items-center">
              <p className="text-sm text-text-secondary font-medium">
                {isFiltered
                  ? `${filteredAndSortedFonts.length} font${filteredAndSortedFonts.length !== 1 ? 's' : ''} found`
                  : `Showing all ${fonts.length} fonts`}
              </p>
              <button 
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="btn-secondary flex items-center gap-2"
              >
                <Menu className="w-4 h-4" /> Filters
              </button>
            </div>

            {/* Sidebar */}
            <aside className={`lg:w-1/4 shrink-0 ${isMobileSidebarOpen ? 'block' : 'hidden'} lg:block`}>
              <div className="sticky top-24">
                <SidebarFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedLicense={selectedLicense}
                  setSelectedLicense={setSelectedLicense}
                  selectedCollection={selectedCollection}
                  setSelectedCollection={setSelectedCollection}
                  showFavoritesOnly={showFavoritesOnly}
                  setShowFavoritesOnly={setShowFavoritesOnly}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  categories={categories}
                  licenses={licenses}
                  collections={collections}
                />
              </div>
            </aside>

            {/* Font Grid */}
            <div className="lg:w-3/4 flex-1">
              <div className="hidden lg:block mb-6">
                <p className="text-sm text-text-secondary font-medium">
                  {isFiltered
                    ? `${filteredAndSortedFonts.length} font${filteredAndSortedFonts.length !== 1 ? 's' : ''} found`
                    : `Showing all ${fonts.length} fonts`}
                </p>
              </div>

              <FontList fonts={filteredAndSortedFonts} />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
