import { useState } from 'react';
import CopyButton from './CopyButton';

export default function FontPreview({ font, customText }) {
  const displayText = customText || font?.sampleText || '';

  return (
    <div className="space-y-4">
      <div 
        className="font-preview text-2xl"
        style={{ fontFamily: font?.name || 'system-ui' }}
      >
        {displayText}
      </div>
      
      {font && (
        <div className="flex justify-end">
          <CopyButton text={displayText} fontName={font.name} />
        </div>
      )}
    </div>
  );
}
