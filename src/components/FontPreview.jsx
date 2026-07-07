import { useState } from 'react';
import CopyButton from './CopyButton';
import { useFontLoader } from '../hooks/useFontLoader';

export default function FontPreview({ font, customText, fontSize = 24, fontStyle = 'normal', fontWeight = 'normal' }) {
  const isLoaded = useFontLoader(font);
  const displayText = customText || font?.sampleText || '';

  return (
    <div className="space-y-4">
      <div
        className={`font-preview leading-loose transition-opacity duration-300 ${!isLoaded ? 'opacity-50' : 'opacity-100'}`}
        style={isLoaded ? { 
          fontFamily: `"${font?.name}", system-ui`,
          fontSize: `${fontSize}px`,
          fontStyle,
          fontWeight
        } : { fontSize: `${fontSize}px`, fontStyle, fontWeight }}
      >
        {displayText}
      </div>

      {!isLoaded && font && (
        <p className="text-sm text-text-secondary italic">
          Loading font...
        </p>
      )}

      {font && (
        <div className="flex justify-end border-t border-border dark:border-gray-800 pt-4 mt-2">
          <CopyButton 
            text={displayText} 
            fontName={font.name} 
            fontSize={fontSize}
            fontWeight={fontWeight}
            fontStyle={fontStyle}
          />
        </div>
      )}
    </div>
  );
}
