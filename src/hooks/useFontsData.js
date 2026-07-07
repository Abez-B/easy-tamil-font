import { useState, useEffect } from 'react';

const BASE = import.meta.env.BASE_URL;
const FONTS_URL = `${BASE}meta/fonts.json`;

// Module-level cache shared across all hook instances
let cachedData = null;
let fetchPromise = null;

async function fetchFontsData() {
  if (cachedData) return cachedData;

  if (!fetchPromise) {
    fetchPromise = fetch(FONTS_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load fonts.json: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Derive categories, licenses, and collections dynamically
        const categoryMap = {};
        const licenseSet = new Set();
        const collectionSet = new Set();
        const groupedFontsMap = {};

        for (const font of data.fonts) {
          let baseName = font.name.replace(/^ATM\b/i, 'Heritage');
          let variantName = 'Regular';
          
          const parts = baseName.split(' ');
          const lastPart = parts[parts.length - 1];
          if (/^(Bold|Italic|BoldItalic|Regular)$/i.test(lastPart)) {
             variantName = lastPart;
             parts.pop();
             baseName = parts.join(' ');
          } else if (/^\d$/.test(lastPart) && parts.length > 1) { 
             variantName = `Style ${lastPart}`;
             parts.pop();
             baseName = parts.join(' ');
          }
          
          if (!groupedFontsMap[baseName]) {
             groupedFontsMap[baseName] = {
                ...font,
                name: baseName,
                id: baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                variantsList: [],
                randomWeight: Math.random()
             };
          }
          
          groupedFontsMap[baseName].variantsList.push({
             variantName,
             originalName: font.name,
             downloadUrl: font.downloadUrl,
             fontFamily: font.name,
             id: font.id
          });
        }
        
        const groupedFonts = Object.values(groupedFontsMap).map(f => {
           f.variantsList.sort((a, b) => {
              if (a.variantName === 'Regular') return -1;
              if (b.variantName === 'Regular') return 1;
              return a.variantName.localeCompare(b.variantName);
           });
           return f;
        });

        for (const font of groupedFonts) {
          categoryMap[font.category] = (categoryMap[font.category] || 0) + 1;
          if (font.license) licenseSet.add(font.license);
          if (font.collection) collectionSet.add(font.collection);
        }

        cachedData = {
          ...data,
          fonts: groupedFonts,
          categories: Object.entries(categoryMap).map(([name, count]) => ({
            name,
            count,
          })),
          licenses: Array.from(licenseSet).sort(),
          collections: Array.from(collectionSet).sort(),
        };

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
 * @returns {{ fonts, categories, licenses, collections, metadata, loading, error }}
 */
export function useFontsData() {
  const [state, setState] = useState({
    fonts: [],
    categories: [],
    licenses: [],
    collections: [],
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
            licenses: data.licenses,
            collections: data.collections,
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
