import { Search, Filter } from 'lucide-react';

export default function SearchBar({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search fonts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field pl-10 appearance-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Unicode">Unicode</option>
            <option value="TACE16">TACE16</option>
          </select>
        </div>
      </div>
    </div>
  );
}
