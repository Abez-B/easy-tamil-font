import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Copy, Check, Keyboard, Code2, Type,
  ChevronDown, ArrowLeftRight,
} from 'lucide-react';
import { useFontsData } from '../hooks/useFontsData';
import { romanize } from 'tamil-romanizer';

// ─────────────────────────────────────────────────────────────────
// 1A. TANGLISH → TAMIL  (fixed syllable-based engine)
// ─────────────────────────────────────────────────────────────────
// Consonant rules: [tanglish_pattern, tamil_base_without_pulli]
// Ordered LONGEST first. Matched case-sensitively.
const CONS_RULES = [
  // 3-char clusters
  ['ksh', 'க்ஷ'], ['Ksh', 'க்ஷ'], ['KSH', 'க்ஷ'],
  // 2-char true clusters
  ['ng',  'ங'], ['NG',  'ங'],
  ['nj',  'ஞ'], ['NJ',  'ஞ'],
  ['nh',  'ண'],
  ['nd',  'ந'],
  ['ch',  'ச'], ['Ch',  'ச'], ['CH',  'ச'],
  ['sh',  'ஷ'], ['Sh',  'ஷ'], ['SH',  'ஷ'],
  ['zh',  'ழ'], ['Zh',  'ழ'], ['ZH',  'ழ'],
  ['th',  'த'], ['TH',  'த'],
  ['Th',  'ட'],
  ['dh',  'த'], ['DH',  'த'],
  ['Dh',  'ட'],
  ['bh',  'ப'], ['Bh',  'ப'], ['BH',  'ப'],
  ['gh',  'க'], ['Gh',  'க'],
  ['ph',  'ப'], ['Ph',  'ப'],
  ['kh',  'க'], ['Kh',  'க'],
  // rr/RR → ற (hard Tamil R — very common convention)
  ['rr',  'ற'], ['RR',  'ற'],
  // NOTE: 'll' is intentionally NOT a cluster; treated as double-l → ல்ல
  // 1-char consonants
  ['k', 'க'], ['K', 'க'],
  ['g', 'க'], ['G', 'க'],
  ['c', 'ச'], ['C', 'ச'],
  ['s', 'ஸ'],
  ['S', 'ஷ'],
  ['j', 'ஜ'], ['J', 'ஜ'],
  ['t', 'ட'],   // retroflex ட (lowercase t)
  ['T', 'த'],   // dental த (uppercase T)
  ['d', 'ட'], ['D', 'ட'],
  ['n', 'ந'],   // dental ந
  ['N', 'ண'],   // retroflex ண (uppercase N)
  ['p', 'ப'], ['P', 'ப'],
  ['b', 'ப'], ['B', 'ப'],
  ['f', 'ப'], ['F', 'ப'],
  ['m', 'ம'], ['M', 'ம'],
  ['y', 'ய'], ['Y', 'ய'],
  ['r', 'ர'],
  ['R', 'ற'],   // hard ற (uppercase R)
  ['l', 'ல'],
  ['L', 'ள'],   // retroflex ள (uppercase L)
  ['v', 'வ'], ['V', 'வ'],
  ['w', 'வ'], ['W', 'வ'],
  ['z', 'ழ'], ['Z', 'ழ'],
  ['h', 'ஹ'], ['H', 'ஹ'],
  ['x', 'க்ஸ'],
  ['q', 'க'], ['Q', 'க'],
];

// Vowel rules: [tanglish, standalone, matra]
// Ordered LONGEST first. Matched case-insensitively.
const VOW_RULES = [
  ['aa', 'ஆ', 'ா'],
  ['ii', 'ஈ', 'ீ'],
  ['ee', 'ஏ', 'ே'],
  ['uu', 'ஊ', 'ூ'],
  ['oo', 'ஓ', 'ோ'],
  ['ai', 'ஐ', 'ை'],
  ['au', 'ஔ', 'ௌ'],
  ['a',  'அ', ''],
  ['i',  'இ', 'ி'],
  ['u',  'உ', 'ு'],
  ['e',  'எ', 'ெ'],
  ['o',  'ஒ', 'ொ'],
];

const PULLI = '்';

function tanglishToTamil(text) {
  let out = '';
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    // Pass through non-alpha (spaces, numbers, punctuation)
    if (!/[a-zA-Z]/.test(ch)) {
      out += ch;
      i++;
      continue;
    }

    // Try consonant match — case-sensitive, longest first
    let consBase = null, consLen = 0;
    for (const [pat, base] of CONS_RULES) {
      if (text.startsWith(pat, i)) {
        consBase = base;
        consLen = pat.length;
        break;
      }
    }

    if (consBase !== null) {
      i += consLen;
      // Try vowel immediately after — case-insensitive
      const rest = text.slice(i).toLowerCase();
      let vowMatra = null, vowLen = 0;
      for (const [vPat, , vMatra] of VOW_RULES) {
        if (rest.startsWith(vPat)) {
          vowMatra = vMatra;
          vowLen = vPat.length;
          break;
        }
      }
      out += vowMatra !== null
        ? consBase + vowMatra   // consonant + vowel matra
        : consBase + PULLI;     // consonant alone → pulli
      if (vowMatra !== null) i += vowLen;
      continue;
    }

    // Try standalone vowel — case-insensitive
    const rest = text.slice(i).toLowerCase();
    let matched = false;
    for (const [vPat, vStand] of VOW_RULES) {
      if (rest.startsWith(vPat)) {
        out += vStand;
        i += vPat.length;
        matched = true;
        break;
      }
    }
    if (!matched) { out += ch; i++; }
  }

  return out;
}

// ─────────────────────────────────────────────────────────────────
// 1B. TAMIL → TANGLISH  (powered by tamil-romanizer package)
// ─────────────────────────────────────────────────────────────────
function tamilToTanglish(text) {
  try {
    return romanize(text);
  } catch {
    return text;
  }
}

// ─────────────────────────────────────────────────────────────────
// 2. UNICODE EXPLORER
// ─────────────────────────────────────────────────────────────────
function isTamil(cp) { return cp >= 0x0B80 && cp <= 0x0BFF; }

function exploreUnicode(text) {
  return [...text].map((ch) => {
    const cp = ch.codePointAt(0);
    const hex = cp.toString(16).toUpperCase().padStart(4, '0');
    return { char: ch, codepoint: cp, hex: `U+${hex}`, isTamil: isTamil(cp) };
  });
}

function escapesToChars(text) {
  return text.replace(/U\+([0-9A-Fa-f]{4,6})/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16))
  );
}

// ─────────────────────────────────────────────────────────────────
// Shared utilities
// ─────────────────────────────────────────────────────────────────
function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, []);
  return { copied, copy };
}

function CopyBtn({ text, size = 'sm' }) {
  const { copied, copy } = useCopy();
  return (
    <button
      onClick={() => copy(text)}
      title="Copy to clipboard"
      className={`inline-flex items-center gap-1.5 rounded-lg transition-all
        ${size === 'xs'
          ? 'px-2 py-1 text-xs'
          : 'px-3 py-1.5 text-sm'
        }
        ${copied
          ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
    >
      {copied
        ? <><Check className="w-3.5 h-3.5" /> Copied!</>
        : <><Copy className="w-3.5 h-3.5" /> Copy</>
      }
    </button>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
      {children}
    </label>
  );
}

function Textarea({ value, onChange, placeholder, rows = 4, readOnly, style, id }) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      rows={rows}
      style={style}
      className="w-full px-4 py-3 rounded-xl border resize-none
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-white
        border-gray-200 dark:border-gray-700
        placeholder-gray-400 dark:placeholder-gray-500
        focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400
        transition-colors text-base leading-relaxed"
    />
  );
}

// ─────────────────────────────────────────────────────────────────
// TOOL 1 — Transliterator
// ─────────────────────────────────────────────────────────────────
const QUICK_TIPS = [
  { key: 'aa',       val: 'ஆ — long A' },
  { key: 'ii / ee',  val: 'ஈ — long I' },
  { key: 'uu / oo',  val: 'ஊ — long U' },
  { key: 'ai',       val: 'ஐ' },
  { key: 'au',       val: 'ஔ' },
  { key: 'zh',       val: 'ழ — unique Tamil zh' },
  { key: 'rr / R',   val: 'ற — hard Tamil R' },
  { key: 'L',        val: 'ள — retroflex L' },
  { key: 'N',        val: 'ண — retroflex N' },
  { key: 'Th',       val: 'ட — retroflex T' },
  { key: 'th / T',   val: 'த — dental T' },
  { key: 'sh / Sh',  val: 'ஷ' },
  { key: 'ch',       val: 'ச' },
  { key: 'ng',       val: 'ங' },
  { key: 'nj',       val: 'ஞ' },
  { key: 'll',       val: 'ல்ல — double L' },
  { key: 'LL',       val: 'ள்ள — double retroflex L' },
];

const EXAMPLES = [
  { tanglish: 'vanakkam', tamil: 'வணக்கம்', note: '(use N for ண)' },
  { tanglish: 'vaNakkam', tamil: 'வணக்கம்' },
  { tanglish: 'tamiZH',   tamil: 'தமிழ்' },
  { tanglish: 'nalla',    tamil: 'நல்ல' },
  { tanglish: 'iLLai',    tamil: 'இல்லை' },
  { tanglish: 'Chennai',  tamil: 'சென்னை' },
];

function TransliteratorTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('tanglish'); // 'tanglish' | 'tamil'
  const [showTips, setShowTips] = useState(false);

  const output = mode === 'tanglish'
    ? tanglishToTamil(input)
    : tamilToTanglish(input);

  const isTamilMode = mode === 'tamil';

  const handleSwap = () => {
    const newMode = isTamilMode ? 'tanglish' : 'tamil';
    setMode(newMode);
    setInput(output);
  };

  return (
    <div className="space-y-5">
      {/* Mode toggle */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden text-sm shadow-sm">
          <button
            onClick={() => { setMode('tanglish'); setInput(''); }}
            className={`px-4 py-2.5 font-medium transition-colors ${
              !isTamilMode
                ? 'bg-red-600 text-white'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            Tanglish → Tamil
          </button>
          <button
            onClick={() => { setMode('tamil'); setInput(''); }}
            className={`px-4 py-2.5 font-medium transition-colors border-l border-gray-200 dark:border-gray-700 ${
              isTamilMode
                ? 'bg-red-600 text-white'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            Tamil → Tanglish
          </button>
        </div>
        <button
          onClick={handleSwap}
          title="Swap input/output"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
            border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300
            hover:border-red-400 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400
            transition-all"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span className="hidden sm:inline">Swap</span>
        </button>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {isTamilMode ? (
          <>Paste Tamil script and get phonetic Tanglish.
            {' '}Example: <span style={{ fontFamily: "'Noto Sans Tamil', system-ui" }}>வணக்கம்</span>
            {' → vanakkam'}
          </>
        ) : (
          <>Type Tanglish (English phonetics) and see Tamil script instantly.
            {' '}Example: <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-red-600 dark:text-red-400">vaNakkam</code>
            {' → '}
            <span style={{ fontFamily: "'Noto Sans Tamil', system-ui" }}>வணக்கம்</span>
          </>
        )}
      </p>

      {/* I/O panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <FieldLabel>{isTamilMode ? 'Tamil Input' : 'Tanglish Input'}</FieldLabel>
          <Textarea
            id="transliterator-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isTamilMode ? 'Paste Tamil text… e.g. வணக்கம்' : 'Type here… e.g. vaNakkam'}
            rows={5}
            style={isTamilMode ? { fontFamily: "'Noto Sans Tamil', system-ui", fontSize: '1.15rem' } : undefined}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <FieldLabel>{isTamilMode ? 'Tanglish Output' : 'Tamil Output'}</FieldLabel>
            <CopyBtn text={output} />
          </div>
          <Textarea
            id="transliterator-output"
            value={output}
            readOnly
            placeholder={isTamilMode ? 'Tanglish will appear here…' : 'Tamil script will appear here…'}
            rows={5}
            style={!isTamilMode ? { fontFamily: "'Noto Sans Tamil', system-ui", fontSize: '1.15rem' } : undefined}
          />
        </div>
      </div>

      {/* Quick examples — Tanglish mode */}
      {!isTamilMode && (
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {EXAMPLES.map(({ tanglish, tamil }) => (
              <button
                key={tanglish}
                onClick={() => setInput(tanglish)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
                  bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                  hover:border-red-400 dark:hover:border-red-500 transition-all group"
              >
                <code className="text-red-600 dark:text-red-400 font-mono">{tanglish}</code>
                <span className="text-gray-400">→</span>
                <span className="text-gray-700 dark:text-gray-200" style={{ fontFamily: "'Noto Sans Tamil', system-ui" }}>{tamil}</span>
              </button>
            ))}
          </div>

          {/* Key conventions */}
          <button
            onClick={() => setShowTips(!showTips)}
            className="flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
          >
            <span className={`transition-transform inline-block ${showTips ? 'rotate-90' : ''}`}>▶</span>
            Key conventions
          </button>
          {showTips && (
            <div className="mt-3 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
              {QUICK_TIPS.map(({ key, val }) => (
                <div
                  key={key}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                    bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
                >
                  <code className="font-mono text-red-600 dark:text-red-400 shrink-0">{key}</code>
                  <span className="text-gray-400">→</span>
                  <span className="text-gray-700 dark:text-gray-200">{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TOOL 2 — Unicode Explorer
// ─────────────────────────────────────────────────────────────────
function UnicodeExplorerTool() {
  const [input, setInput] = useState('');
  const [escInput, setEscInput] = useState('');

  const chars = input ? exploreUnicode(input) : [];
  const converted = escapesToChars(escInput);

  return (
    <div className="space-y-6">
      {/* Section A — breakdown */}
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Enter any Tamil text to see the Unicode code point for each character.
        </p>
        <FieldLabel>Enter Tamil text</FieldLabel>
        <Textarea
          id="unicode-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. வணக்கம்"
          rows={2}
          style={{ fontFamily: "'Noto Sans Tamil', system-ui", fontSize: '1.2rem' }}
        />

        {chars.length > 0 && (
          <div className="mt-4">
            {/* Cards on mobile, table on md+ */}
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:hidden gap-2">
              {chars.map(({ char, codepoint, hex, isTamil: isTa }, idx) => (
                <button
                  key={idx}
                  onClick={() => navigator.clipboard.writeText(hex)}
                  title={`Click to copy ${hex}`}
                  className={`flex flex-col items-center p-3 rounded-xl border transition-all
                    hover:border-red-400 dark:hover:border-red-500 active:scale-95
                    ${isTa
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                >
                  <span className="text-2xl mb-1" style={{ fontFamily: "'Noto Sans Tamil', system-ui" }}>
                    {char === ' ' ? '␣' : char}
                  </span>
                  <code className="text-xs font-mono text-red-600 dark:text-red-400">{hex}</code>
                  <span className="text-xs text-gray-400 mt-0.5">{codepoint}</span>
                </button>
              ))}
            </div>

            {/* Table on md+ */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <th className="px-4 py-2.5 text-left">Char</th>
                    <th className="px-4 py-2.5 text-left">Code Point</th>
                    <th className="px-4 py-2.5 text-left">Decimal</th>
                    <th className="px-4 py-2.5 text-left">Type</th>
                    <th className="px-4 py-2.5 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {chars.map(({ char, codepoint, hex, isTamil: isTa }, idx) => (
                    <tr key={idx} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                      <td className="px-4 py-3 text-xl font-bold" style={{ fontFamily: "'Noto Sans Tamil', system-ui" }}>
                        {char === ' ' ? '␣' : char}
                      </td>
                      <td className="px-4 py-3">
                        <code className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded font-mono">
                          {hex}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{codepoint}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium
                          ${isTa
                            ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}>
                          {isTa ? 'Tamil' : 'Other'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigator.clipboard.writeText(hex)}
                          className="text-xs text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          Copy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Section B — escape converter */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Convert Unicode escapes like{' '}
          <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-red-600 dark:text-red-400">U+0B95</code>
          {' '}to actual characters.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Unicode Escapes Input</FieldLabel>
            <Textarea
              id="unicode-escape-input"
              value={escInput}
              onChange={(e) => setEscInput(e.target.value)}
              placeholder="e.g. U+0B95 U+0BC1"
              rows={3}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <FieldLabel>Characters</FieldLabel>
              <CopyBtn text={converted} />
            </div>
            <Textarea
              id="unicode-escape-output"
              value={converted}
              readOnly
              rows={3}
              style={{ fontFamily: "'Noto Sans Tamil', system-ui", fontSize: '1.2rem' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TOOL 3 — Font Tester
// ─────────────────────────────────────────────────────────────────
function FontTesterTool() {
  const { fonts, loading } = useFontsData();
  const [text, setText] = useState('வணக்கம் உலகம்! தமிழ் எழுத்துருக்கள்.');
  const [selectedFont, setSelectedFont] = useState('');
  const [fontSize, setFontSize] = useState(32);

  const font = fonts.find(f => f.name === selectedFont) || fonts[0];
  const fontName = font?.name || '';

  const codepoints = [...text].map(ch => ({
    ch,
    cp: `U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`,
    isTamil: ch.codePointAt(0) >= 0x0B80 && ch.codePointAt(0) <= 0x0BFF,
  }));

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Preview any Unicode Tamil text in every font from our gallery. Select a font, adjust the size, and inspect per-character Unicode code points.
      </p>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Font</FieldLabel>
          <div className="relative">
            <select
              id="font-tester-select"
              value={selectedFont || fontName}
              onChange={e => setSelectedFont(e.target.value)}
              disabled={loading}
              className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border text-sm
                bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                border-gray-200 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              {loading
                ? <option>Loading fonts…</option>
                : fonts.map(f => (
                    <option key={f.id} value={f.name}>{f.name} — {f.category}</option>
                  ))
              }
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <FieldLabel>Size: {fontSize}px</FieldLabel>
          <div className="flex items-center gap-3 h-10">
            <span className="text-xs text-gray-400">12</span>
            <input
              type="range" min={12} max={72} step={2}
              value={fontSize}
              onChange={e => setFontSize(Number(e.target.value))}
              className="flex-1 accent-red-600"
              id="font-size-slider"
            />
            <span className="text-xs text-gray-400">72</span>
          </div>
        </div>
      </div>

      {/* Text input */}
      <div>
        <FieldLabel>Unicode Tamil Input</FieldLabel>
        <Textarea
          id="font-tester-input"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or paste Unicode Tamil here…"
          rows={3}
          style={{ fontFamily: "'Noto Sans Tamil', system-ui", fontSize: '1.1rem' }}
        />
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Preview
            </span>
            {fontName && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-medium">
                {fontName}
              </span>
            )}
          </div>
          <CopyBtn text={text} />
        </div>
        <div
          className="px-5 py-4 text-gray-900 dark:text-white min-h-[3.5em] break-words"
          style={{
            fontFamily: fontName ? `"${fontName}", 'Noto Sans Tamil', system-ui` : 'system-ui',
            fontSize: `${fontSize}px`,
            lineHeight: 1.7,
          }}
        >
          {text || <span className="text-gray-400 dark:text-gray-500 text-base">Preview will appear here…</span>}
        </div>
      </div>

      {/* Font metadata */}
      {font && (
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-medium">
            {font.category}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            {font.license}
          </span>
          {font.variants?.length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              {font.variants.length} variant{font.variants.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      {/* Codepoints breakdown */}
      {text.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-red-600 dark:text-red-400 hover:underline list-none flex items-center gap-1">
            <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
            Unicode code points ({[...text].length} chars)
          </summary>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {codepoints.map(({ ch, cp, isTamil: isTa }, i) => (
              <button
                key={i}
                title={`Click to copy ${cp}`}
                onClick={() => navigator.clipboard.writeText(cp)}
                className={`flex flex-col items-center px-2 py-1.5 rounded-lg border cursor-pointer
                  text-xs transition-all hover:border-red-400 dark:hover:border-red-500 active:scale-95
                  ${isTa
                    ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
              >
                <span className="text-lg leading-tight" style={{ fontFamily: fontName ? `"${fontName}", 'Noto Sans Tamil', system-ui` : 'Noto Sans Tamil' }}>
                  {ch === ' ' ? '␣' : ch}
                </span>
                <span className="mt-0.5 font-mono text-[10px] text-gray-500 dark:text-gray-400">{cp}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">Click any tile to copy its code point.</p>
        </details>
      )}

      {/* Legacy font note */}
      <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm">
        <p className="text-amber-800 dark:text-amber-300 font-medium mb-1">Need legacy font encoding?</p>
        <p className="text-amber-700 dark:text-amber-400">
          For converting Unicode Tamil to Bamini, TAB, Vanavil, Shree Lipi and other legacy formats, use{' '}
          <a
            href="https://tamilfontconverter.co.in/unicode_to_non_unicode.html"
            target="_blank" rel="noreferrer"
            className="underline hover:text-amber-900 dark:hover:text-amber-200"
          >
            tamilfontconverter.co.in
          </a>.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN TOOLS PAGE
// ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'transliterator', label: 'Transliterator',  icon: Keyboard, desc: 'Tanglish ↔ Tamil' },
  { id: 'unicode',        label: 'Unicode',          icon: Code2,    desc: 'Code points & escapes' },
  { id: 'font-tester',   label: 'Font Tester',       icon: Type,     desc: 'Preview in any font' },
];

export default function Tools() {
  const [activeTab, setActiveTab] = useState('transliterator');

  return (
    <div className="min-h-screen">
      {/* Page hero */}
      <div className="hero-section border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-10 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400
              hover:text-red-600 dark:hover:text-red-400 mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-gray-100 mb-2">
            Tamil Tools
          </h1>
          <p className="text-text-secondary dark:text-gray-400 text-base">
            Utilities for working with Tamil text — all free, all run in your browser.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Tab bar — horizontally scrollable on mobile */}
        <div className="flex overflow-x-auto gap-2 pb-1 mb-5 scrollbar-hide">
          {TABS.map(({ id, label, icon: Icon, desc }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                transition-all border whitespace-nowrap shrink-0
                ${activeTab === id
                  ? 'bg-red-600 dark:bg-red-600 text-white border-red-600 dark:border-red-600 shadow-md'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 hover:text-red-600 dark:hover:text-red-400'
                }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
              <span className={`hidden md:inline text-xs ${activeTab === id ? 'text-red-200' : 'text-gray-400 dark:text-gray-500'}`}>
                — {desc}
              </span>
            </button>
          ))}
        </div>

        {/* Tool panel */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 sm:p-6 md:p-8">
          {activeTab === 'transliterator' && <TransliteratorTool />}
          {activeTab === 'unicode'        && <UnicodeExplorerTool />}
          {activeTab === 'font-tester'    && <FontTesterTool />}
        </div>
      </div>
    </div>
  );
}
