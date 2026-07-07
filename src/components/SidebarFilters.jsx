import { Search, Filter, SortAsc } from 'lucide-react';

export default function SidebarFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedLicense,
  setSelectedLicense,
  selectedCollection,
  setSelectedCollection,
  showFavoritesOnly,
  setShowFavoritesOnly,
  sortOrder,
  setSortOrder,
  categories = [],
  licenses = [],
  collections = [],
}) {
  return (
    <div className="w-full bg-bg-secondary dark:bg-gray-900 rounded-xl p-6 border border-border dark:border-gray-800">
      <h2 className="font-semibold text-primary dark:text-white mb-6 flex items-center gap-2">
        <Filter className="w-5 h-5" />
        Filters & Sort
      </h2>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label htmlFor="font-search" className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
            <input
              id="font-search"
              type="text"
              placeholder="Name, description, tags…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field !pl-10 w-full"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Favorites Toggle */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showFavoritesOnly}
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              className="w-4 h-4 text-accent border-border rounded focus:ring-accent dark:focus:ring-red-500 bg-white dark:bg-gray-800"
            />
            <span className="text-sm font-medium text-text-secondary dark:text-gray-300">Show Favorites Only</span>
          </label>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="font-category" className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-2">
            Category
          </label>
          <select
            id="font-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field w-full appearance-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name} ({cat.count})
              </option>
            ))}
          </select>
        </div>

        {/* License */}
        <div>
          <label htmlFor="font-license" className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-2">
            License
          </label>
          <select
            id="font-license"
            value={selectedLicense}
            onChange={(e) => setSelectedLicense(e.target.value)}
            className="input-field w-full appearance-none cursor-pointer"
          >
            <option value="all">All Licenses</option>
            {licenses.map((lic) => (
              <option key={lic} value={lic}>
                {lic}
              </option>
            ))}
          </select>
        </div>

        {/* Collection */}
        {collections.length > 0 && (
          <div>
            <label htmlFor="font-collection" className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-2">
              Collection
            </label>
            <select
              id="font-collection"
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="input-field w-full appearance-none cursor-pointer"
            >
              <option value="all">All Collections</option>
              {collections.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sort */}
        <div className="pt-4 border-t border-border dark:border-gray-800">
          <label htmlFor="font-sort" className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-2 flex items-center gap-2">
            <SortAsc className="w-4 h-4" /> Sort By
          </label>
          <select
            id="font-sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="input-field w-full appearance-none cursor-pointer"
          >
            <option value="random">Random</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="newest">Newest</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>
    </div>
  );
}
