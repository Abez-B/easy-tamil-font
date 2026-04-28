import { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import FontList from '../components/FontList';
import fontsData from '../data/fonts.json';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFonts = useMemo(() => {
    return fontsData.fonts.filter((font) => {
      const matchesSearch = font.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        font.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        font.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || font.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Tamil Font Gallery</h1>
          <p className="text-text-secondary">
            Browse and preview Tamil fonts from Tamil Virtual Academy
          </p>
        </div>

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <FontList fonts={filteredFonts} />
      </div>
    </div>
  );
}
