import FontCard from './FontCard';

export default function FontList({ fonts }) {
  if (fonts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">No fonts found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {fonts.map((font) => (
        <FontCard key={font.id} font={font} />
      ))}
    </div>
  );
}
