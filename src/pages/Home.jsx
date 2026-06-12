import { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import FontList from '../components/FontList';
import { useFontsData } from '../hooks/useFontsData';
import { Loader2 } from 'lucide-react';

const SAMPLE_TAMIL = 'தமிழ் எழுத்துருக்கள்';

export default function Home() {
  const { fonts, categories, loading, error } = useFontsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFonts = useMemo(() => {
    return fonts.filter((font) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        font.name.toLowerCase().includes(q) ||
        font.description.toLowerCase().includes(q) ||
        font.tags.some((tag) => tag.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'all' || font.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [fonts, searchTerm, selectedCategory]);

  const isFiltered = searchTerm || selectedCategory !== 'all';

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <div
              className="text-5xl md:text-6xl font-bold mb-4 leading-tight text-text dark:text-white"
              style={{ fontFamily: 'system-ui' }}
              aria-hidden="true"
            >
              {SAMPLE_TAMIL}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-gray-100 mb-3">
              Tamil Font Gallery
            </h1>
            <p className="text-text-secondary dark:text-gray-300 text-lg leading-relaxed mb-6">
              Browse and preview{' '}
              <span className="font-semibold text-accent dark:text-indigo-400">
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
                      cat.name === 'Unicode' ? 'bg-indigo-500' : 'bg-emerald-500'
                    }`} />
                    {cat.count} {cat.name} fonts
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Gallery ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3 text-text-secondary">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading fonts…</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-500 font-medium mb-2">Failed to load font data</p>
            <p className="text-text-secondary text-sm">{error}</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
            />

            {/* Results count */}
            <p className="text-sm text-text-secondary mb-6">
              {isFiltered
                ? `${filteredFonts.length} font${filteredFonts.length !== 1 ? 's' : ''} found`
                : `Showing all ${fonts.length} fonts`}
            </p>

            <FontList fonts={filteredFonts} />
          </>
        )}
      </section>
    </div>
  );
}
