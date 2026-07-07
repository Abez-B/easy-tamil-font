import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('ezhuthurukal-favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ezhuthurukal-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (fontId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFavorites((prev) =>
      prev.includes(fontId)
        ? prev.filter((id) => id !== fontId)
        : [...prev, fontId]
    );
  };

  const isFavorite = (fontId) => favorites.includes(fontId);

  return { favorites, toggleFavorite, isFavorite };
}
