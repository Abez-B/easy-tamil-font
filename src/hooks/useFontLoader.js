import { useState, useEffect } from 'react';

const BASE = import.meta.env.BASE_URL;
const INJECTED_FONTS = new Set();

/**
 * Dynamically injects a @font-face rule for a given font if it hasn't been injected yet.
 * @param {Object} font - The font object containing name and downloadUrl
 * @returns {boolean} - true if the font logic has completed setting up (note: doesn't guarantee font file download completion, just rule injection)
 */
export function useFontLoader(font) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!font || !font.downloadUrl) {
      setIsReady(true);
      return;
    }

    const fontName = font.name;

    if (INJECTED_FONTS.has(fontName)) {
      setIsReady(true);
      return;
    }

    // Mark as injected immediately to prevent duplicate injection from concurrent renders
    INJECTED_FONTS.add(fontName);

    const isAbsolute = /^https?:\/\//.test(font.downloadUrl);
    const url = isAbsolute
      ? font.downloadUrl
      : `${BASE}${font.downloadUrl.replace(/^\//, '')}?v=3`;

    const rule = `@font-face {\n  font-family: "${fontName}";\n  src: url("${url}") format("truetype");\n  font-display: swap;\n}`;

    const style = document.createElement('style');
    style.setAttribute('data-font-name', fontName);
    style.textContent = rule;
    document.head.appendChild(style);

    setIsReady(true);
  }, [font]);

  return isReady;
}
