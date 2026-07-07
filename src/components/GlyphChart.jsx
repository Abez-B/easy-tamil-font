export default function GlyphChart({ fontFamily }) {
  const TAMIL_VOWELS = ['அ','ஆ','இ','ஈ','உ','ஊ','எ','ஏ','ஐ','ஒ','ஓ','ஔ'];
  const TAMIL_CONSONANTS = ['க','ங','ச','ஞ','ட','ண','த','ந','ப','ம','ய','ர','ல','வ','ழ','ள','ற','ன'];
  const TAMIL_NUMERALS = ['௦','௧','௨','௩','௪','௫','௬','௭','௮','௯'];

  const renderGrid = (glyphs, title) => (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-text-secondary dark:text-gray-400 mb-3">{title}</h3>
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
        {glyphs.map((glyph) => (
          <div 
            key={glyph}
            className="flex items-center justify-center p-3 rounded-lg bg-bg dark:bg-black border border-border dark:border-gray-800 text-2xl transition-colors hover:border-accent dark:hover:border-gray-600"
            style={{ fontFamily: `"${fontFamily}", system-ui` }}
            title={glyph}
          >
            {glyph}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-bg-secondary dark:bg-gray-900 rounded-xl p-6 mt-6">
      <h2 className="font-semibold text-primary dark:text-white mb-6">Character Support</h2>
      {renderGrid(TAMIL_VOWELS, 'Vowels — உயிரெழுத்துக்கள்')}
      {renderGrid(TAMIL_CONSONANTS, 'Consonants — மெய்யெழுத்துக்கள்')}
      {renderGrid(TAMIL_NUMERALS, 'Tamil Numerals — தமிழ் இலக்கங்கள்')}
    </div>
  );
}
