import { VirtuosoGrid } from 'react-virtuoso';
import FontCard from './FontCard';

export default function FontList({ fonts }) {
  if (fonts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary dark:text-gray-400">No fonts found matching your search.</p>
      </div>
    );
  }

  return (
    <VirtuosoGrid
      useWindowScroll
      data={fonts}
      listClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      itemContent={(index, font) => <FontCard font={font} />}
    />
  );
}
