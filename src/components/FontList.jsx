import { useState, useEffect } from 'react';
import FontCard from './FontCard';

export default function FontList({ fonts }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30; // 30 fonts per page works well for 3 columns

  // Reset to first page when the fonts list changes (e.g., during a search)
  useEffect(() => {
    setCurrentPage(1);
  }, [fonts]);

  if (fonts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary dark:text-gray-400">No fonts found matching your search.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(fonts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFonts = fonts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 rounded-md transition-colors ${
            currentPage === i
              ? 'bg-primary text-white'
              : 'bg-surface dark:bg-surface-dark border dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-12 mb-8 space-x-1 sm:space-x-2 text-sm sm:text-base">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 mx-1 rounded-md bg-surface dark:bg-surface-dark border dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="hidden sm:inline-block px-4 py-2 mx-1 rounded-md bg-surface dark:bg-surface-dark border dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              1
            </button>
            {startPage > 2 && <span className="mx-1 hidden sm:inline-block">...</span>}
          </>
        )}
        
        {pages}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="mx-1 hidden sm:inline-block">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="hidden sm:inline-block px-4 py-2 mx-1 rounded-md bg-surface dark:bg-surface-dark border dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 mx-1 rounded-md bg-surface dark:bg-surface-dark border dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedFonts.map((font) => (
          <FontCard key={font.id} font={font} />
        ))}
      </div>
      {renderPagination()}
    </div>
  );
}
