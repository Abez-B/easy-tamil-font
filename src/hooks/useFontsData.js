import { useState, useEffect } from 'react';

const BASE = import.meta.env.BASE_URL;
const FONTS_URL = `${BASE}meta/fonts.json`;
const FONT_FACES_STYLE_ID = 'easy-font-tamil-faces';

// Module-level cache shared across all hook instances
let cachedData = null;
let fetchPromise = null;

/**
 * Injects a single <style> tag containing @font-face rules for EVERY font.
 *
 * This is called synchronously inside fetchFontsData() — before loading is set
 * to false, before any FontCard renders. When the browser then encounters
 * `font-family: "TAU-Barathi"` on a card element, it already knows the src URL
 * and immediately starts downloading the file. No JavaScript-driven repaint
 * tricks needed; the browser's native font-display pipeline handles everything.
 *
 * font-display: swap → show fallback text instantly, swap to Tamil font when ready.
 */
function injectFontFaces(fonts) {
  if (document.getElementById(FONT_FACES_STYLE_ID)) return; // already injected

  const rules = fonts
    .filter((f) => f.downloadUrl)
    .map((f) => {
      const path = f.downloadUrl.replace(/^\//, '');
      const url = `${BASE}${path}`;
      return `@font-face {\n  font-family: "${f.name}";\n  src: url("${url}") format("truetype");\n  font-display: swap;\n}`;
    })
    .join('\n\n');

  const style = document.createElement('style');
  style.id = FONT_FACES_STYLE_ID;
  style.textContent = rules;
  document.head.appendChild(style);
}

async function fetchFontsData() {
  if (cachedData) return cachedData;

  if (!fetchPromise) {
    fetchPromise = fetch(FONTS_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load fonts.json: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Derive categories dynamically
        const categoryMap = {};
        for (const font of data.fonts) {
          categoryMap[font.category] = (categoryMap[font.category] || 0) + 1;
        }

        cachedData = {
          ...data,
          categories: Object.entries(categoryMap).map(([name, count]) => ({
            name,
            count,
          })),
        };

        // Inject ALL font faces before any component reads loading:false
        injectFontFaces(data.fonts);

        return cachedData;
      })
      .catch((err) => {
        fetchPromise = null; // allow retry
        throw err;
      });
  }

  return fetchPromise;
}

/**
 * Fetches font metadata from public/meta/fonts.json at runtime.
 *
 * On successful load it immediately injects @font-face rules for every font
 * so that when FontCard/FontPreview components render, the browser already
 * has all src URLs registered and can download + swap fonts natively.
 *
 * @returns {{ fonts, categories, metadata, loading, error }}
 */
export function useFontsData() {
  const [state, setState] = useState({
    fonts: [],
    categories: [],
    metadata: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetchFontsData()
      .then((data) => {
        if (!cancelled) {
          setState({
            fonts: data.fonts,
            categories: data.categories,
            metadata: data.metadata,
            loading: false,
            error: null,
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState((prev) => ({ ...prev, loading: false, error: err.message }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
