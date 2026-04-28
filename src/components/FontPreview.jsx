import { useState } from 'react';
import CopyButton from './CopyButton';

export default function FontPreview({ font, customText }) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const displayText = customText || font?.sampleText || '';

  const handleFontLoad = () => {
    setFontLoaded(true);
  };

  const handleFontError = () => {
    setFontLoaded(false);
  };

  return (
    <div className="space-y-4">
      <div
        className="font-preview text-2xl leading-loose"
        style={{ fontFamily: `"${font?.name}", system-ui` }}
        onLoad={handleFontLoad}
        onError={handleFontError}
      >
        {displayText}
      </div>

      {!fontLoaded && font && (
        <p className="text-sm text-text-secondary italic">
          Note: Font preview may not display due to browser security restrictions. 
          You can still download the font file below.
        </p>
      )}

      {font && (
        <div className="flex justify-end">
          <CopyButton text={displayText} fontName={font.name} />
        </div>
      )}
    </div>
  );
}
