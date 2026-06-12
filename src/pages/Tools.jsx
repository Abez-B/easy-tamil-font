import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Copy, Check, Keyboard, Code2, Type, ChevronDown,
} from 'lucide-react';
import { useFontsData } from '../hooks/useFontsData';

// ─────────────────────────────────────────────────────────────────
// 1A. TANGLISH → TAMIL  (rule-based, real-time)
// ─────────────────────────────────────────────────────────────────
const CONSONANTS = {
  // 3-char clusters (longest first)
  'Ksh': 'க்ஷ', 'ksh': 'க்ஷ',
  // 2-char clusters — ASPIRATES (common in borrowed names like Bharath, Ghee)
  'Bh': 'ப', 'bh': 'ப',
  'Gh': 'க', 'gh': 'க',
  'Kh': 'க', 'kh': 'க',
  'Ph': 'ப', 'ph': 'ப',
  // 2-char clusters — Tamil specific
  'ng': 'ங', 'NG': 'ங',
  'nj': 'ஞ', 'NJ': 'ஞ',
  'nh': 'ண', 'NH': 'ண',
  'nd': 'ந', 'ND': 'ந',
  'ch': 'ச', 'Ch': 'ச', 'CH': 'ச',
  'sh': 'ஷ', 'Sh': 'ஷ', 'SH': 'ஷ',
  'zh': 'ழ', 'Zh': 'ழ', 'ZH': 'ழ',
  'dh': 'த', 'Dh': 'த', 'DH': 'த',
  'th': 'த', 'TH': 'த',
  'Th': 'ட',               // uppercase Th = retroflex ட
  'Dh': 'ட',
  'rr': 'ற', 'RR': 'ற',
  'll': 'ள', 'LL': 'ள',
  'nn': 'ன', 'NN': 'ன',
  // 1-char — lowercase and uppercase both mapped
  'k': 'க', 'K': 'க',
  'g': 'க', 'G': 'க',
  'c': 'ச', 'C': 'ச',
  's': 'ஸ', 'S': 'ஸ',
  't': 'ட', // lowercase t = retroflex ட
  'T': 'த', // uppercase T = dental த
  'd': 'ட', 'D': 'ட',
  'n': 'ந', 'N': 'ண',     // uppercase N = retroflex ண
  'p': 'ப', 'P': 'ப',
  'b': 'ப', 'B': 'ப',
  'f': 'ப', 'F': 'ப',
  'm': 'ம', 'M': 'ம',
  'y': 'ய', 'Y': 'ய',
  'j': 'ஜ', 'J': 'ஜ',
  'r': 'ர',                // lowercase r = ர
  'R': 'ற',               // uppercase R = ற
  'l': 'ல', 'L': 'ள',    // uppercase L = retroflex ள
  'v': 'வ', 'V': 'வ',
  'w': 'வ', 'W': 'வ',
  'z': 'ழ', 'Z': 'ழ',
  'h': 'ஹ', 'H': 'ஹ',
  'x': 'க்ஸ', 'X': 'க்ஸ',
  'q': 'க்', 'Q': 'க்',
};

const VOWEL_STANDALONE = {
  'aa': 'ஆ', 'ii': 'ஈ', 'ee': 'ஏ', 'uu': 'ஊ', 'oo': 'ஓ',
  'ai': 'ஐ', 'au': 'ஔ',
  'a': 'அ', 'i': 'இ', 'u': 'உ', 'e': 'எ', 'o': 'ஒ',
};

const VOWEL_MATRA = {
  'aa': 'ா', 'ii': 'ீ', 'ee': 'ே', 'uu': 'ூ', 'oo': 'ோ',
  'ai': 'ை', 'au': 'ௌ',
  'a': '',  // implicit — base consonant already encodes 'a'
  'i': 'ி', 'u': 'ு', 'e': 'ெ', 'o': 'ொ',
};

const PULLI = '்';
const CONS_KEYS = Object.keys(CONSONANTS).sort((a, b) => b.length - a.length);
const VOW_KEYS  = Object.keys(VOWEL_STANDALONE).sort((a, b) => b.length - a.length);

function tanglishToTamil(text) {
  let out = '';
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (!/[a-zA-Z]/.test(ch)) { out += ch; i++; continue; }

    // Try consonant (case-sensitive match, covers both lower and upper entries above)
    let cons = null, consLen = 0;
    for (const k of CONS_KEYS) {
      if (text.startsWith(k, i)) { cons = CONSONANTS[k]; consLen = k.length; break; }
    }

    if (cons !== null) {
      i += consLen;
      // Try vowel after consonant
      let matra = null, vowLen = 0;
      for (const k of VOW_KEYS) {
        if (text.slice(i).toLowerCase().startsWith(k)) {
          matra = VOWEL_MATRA[k]; vowLen = k.length; break;
        }
      }
      if (matra !== null) { out += cons + matra; i += vowLen; }
      else { out += cons + PULLI; }
      continue;
    }

    // Try standalone vowel (case-insensitive)
    let matched = false;
    for (const k of VOW_KEYS) {
      if (text.slice(i).toLowerCase().startsWith(k)) {
        out += VOWEL_STANDALONE[k]; i += k.length; matched = true; break;
      }
    }
    if (!matched) { out += ch; i++; }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────
// 1B. TAMIL → TANGLISH  (ported from tamil-translite python lib)
// ─────────────────────────────────────────────────────────────────
const LETTER_RULE = {
  "அ":"a","ஆ":"aa","இ":"i","ஈ":"ee","உ":"u","ஊ":"oo","எ":"e","ஏ":"ye","ஐ":"ai","ஒ":"o","ஓ":"o","ஃ":"ak",
  "க்":"k","க":"ga","கா":"gaa","கி":"gi","கீ":"gee","கு":"gu","கூ":"goo","கெ":"ge","கே":"ge","கை":"gai","கொ":"go","கோ":"go","கௌ":"gau",
  "ங்":"ng","ங":"nga","ஙா":"ngaa","ஙி":"ngi","ஙீ":"ngee","ஙு":"ngu","ஙூ":"ngoo","ஙெ":"nge","ஙே":"ngae","ஙை":"ngai","ஙொ":"ngo","ஙோ":"ngoo","ஙௌ":"ngau",
  "ச்":"ch","ச":"sa","சா":"saa","சி":"si","சீ":"see","சு":"su","சூ":"soo","செ":"se","சே":"sae","சை":"sai","சொ":"so","சோ":"so","சௌ":"sau",
  "ஞ்":"nj","ஞ":"nja","ஞா":"njaa","ஞி":"nji","ஞீ":"njee","ஞு":"nju","ஞூ":"njoo","ஞெ":"njae","ஞே":"njae","ஞை":"njai","ஞொ":"njo","ஞோ":"njo","ஞௌ":"njau",
  "ட்":"t","ட":"da","டா":"daa","டி":"di","டீ":"dee","டு":"du","டூ":"doo","டெ":"de","டே":"dae","டை":"dai","டொ":"do","டோ":"do","டௌ":"dau",
  "ண்":"n","ண":"na","ணா":"naa","ணி":"ni","ணீ":"nee","ணு":"nu","ணூ":"noo","ணெ":"ne","ணே":"nae","ணை":"nai","ணொ":"no","ணோ":"no","ணௌ":"nau",
  "த்":"th","த":"dha","தா":"dhaa","தி":"dhi","தீ":"dhee","து":"dhu","தூ":"dhoo","தெ":"dhe","தே":"dhae","தை":"dhai","தொ":"dho","தோ":"dho","தௌ":"dheu",
  "ந்":"n","ந":"na","நா":"naa","நி":"ni","நீ":"nee","நு":"nu","நூ":"noo","நெ":"ne","நே":"nae","நை":"nai","நொ":"no","நோ":"no","நௌ":"neu",
  "ப்":"p","ப":"ba","பா":"baa","பி":"bi","பீ":"bee","பு":"bu","பூ":"boo","பெ":"be","பே":"bae","பை":"bai","பொ":"bo","போ":"bo","பௌ":"bau",
  "ம்":"m","ம":"ma","மா":"maa","மி":"mi","மீ":"mee","மு":"mu","மூ":"moo","மெ":"me","மே":"mae","மை":"mai","மொ":"mo","மோ":"mo","மௌ":"mau",
  "ய்":"i","ய":"ya","யா":"yaa","யி":"yi","யீ":"yee","யு":"yu","யூ":"yoo","யெ":"ye","யே":"yae","யை":"yai","யொ":"yo","யோ":"yo","யௌ":"yau",
  "ர்":"r","ர":"ra","ரா":"raa","ரி":"ri","ரீ":"ree","ரு":"ru","ரூ":"roo","ரெ":"re","ரே":"rae","ரை":"rai","ரொ":"ro","ரோ":"ro","ரௌ":"rau",
  "ல்":"l","ல":"la","லா":"laa","லி":"li","லீ":"lee","லு":"lu","லூ":"loo","லெ":"le","லே":"lae","லை":"lai","லொ":"lo","லோ":"lo","லௌ":"lau",
  "வ்":"v","வ":"va","வா":"vaa","வி":"vi","வீ":"vee","வு":"vu","வூ":"voo","வெ":"ve","வே":"vae","வை":"vai","வொ":"vo","வோ":"vo","வௌ":"vau",
  "ழ்":"zh","ழ":"zha","ழா":"zhaa","ழி":"zhi","ழீ":"zhee","ழு":"zhu","ழூ":"zhoo","ழெ":"zhe","ழே":"zhae","ழை":"zhai","ழொ":"zho","ழோ":"zho","ழௌ":"zhau",
  "ள்":"l","ள":"la","ளா":"laa","ளி":"li","ளீ":"lee","ளு":"lu","ளூ":"loo","ளெ":"le","ளே":"lae","ளை":"lai","ளொ":"lo","ளோ":"lo","ளௌ":"lau",
  "ற்":"r","ற":"ra","றா":"raa","றி":"ri","றீ":"ree","று":"ru","றூ":"roo","றெ":"re","றே":"rae","றை":"rai","றொ":"ro","றோ":"ro","றௌ":"rau",
  "ன்":"n","ன":"na","னா":"naa","னி":"ni","னீ":"nee","னு":"nu","னூ":"noo","னெ":"ne","னே":"ne","னை":"nai","னொ":"no","னோ":"no","னௌ":"nau",
  "ஔ":"au",
  "ஹ்":"h","ஹ":"ha","ஹா":"haa","ஹி":"hi","ஹீ":"hee","ஹு":"hu","ஹூ":"hoo","ஹெ":"he","ஹே":"he","ஹை":"hai","ஹொ":"ho","ஹோ":"ho","ஹௌ":"hau",
  "ஜ்":"j","ஜ":"ja","ஜா":"jaa","ஜி":"ji","ஜீ":"jee","ஜு":"ju","ஜூ":"joo","ஜெ":"je","ஜே":"je","ஜை":"jai","ஜொ":"jo","ஜோ":"jo","ஜௌ":"jau",
  "ஷ்":"sh","ஷ":"sha","ஷா":"shaa","ஷி":"shi","ஷீ":"shee","ஷு":"shu","ஷூ":"shoo","ஷெ":"she","ஷே":"she","ஷை":"shai","ஷொ":"sho","ஷோ":"sho","ஷௌ":"shau",
  "ஸ்":"s","ஸ":"sa","ஸா":"saa","ஸி":"si","ஸீ":"see","ஸு":"su","ஸூ":"soo","ஸெ":"se","ஸே":"se","ஸை":"sai","ஸொ":"so","ஸோ":"so","ஸௌ":"sau",
  "ஸ்ரீ":"shri","ஶ்":"s",
};

const KA_RULE = {"க":"ka","கா":"kaa","கி":"ki","கீ":"kee","கு":"ku","கூ":"koo","கெ":"ke","கே":"kae","கை":"kai","கொ":"ko","கோ":"ko","கௌ":"kau"};
const SA_RULE = {"ச":"cha","சா":"chaa","சி":"chi","சீ":"chee","சு":"chu","சூ":"choo","செ":"che","சே":"chae","சை":"chai","சொ":"cho","சோ":"cho","சௌ":"chau"};
const TA_RULE = {"ட":"ta","டா":"taa","டி":"ti","டீ":"tee","டு":"tu","டூ":"too","டெ":"te","டே":"tae","டை":"tai","டொ":"to","டோ":"to","டௌ":"tau"};
const PA_RULE = {"ப":"pa","பா":"paa","பி":"pi","பீ":"pee","பு":"pu","பூ":"poo","பெ":"pe","பே":"pae","பை":"pai","பொ":"po","போ":"po","பௌ":"pau"};
const THA_RULE = {"த":"tha","தா":"thaa","தி":"thi","தீ":"thee","து":"thu","தூ":"thoo","தெ":"the","தே":"thae","தை":"thai","தொ":"tho","தோ":"tho","தௌ":"thau"};

const VALLINAM = ["க","ச","ட","த","ப","ற"];
const MELLINAM = ["ங","ஞ","ண","ந","ம","ன"];
const IDAIYINAM = ["ய","ர","ல","வ","ழ","ள"];
const EXTRAS_KEYS = ["","ா","ி","ீ","ு","ூ","ெ","ே","ை","ொ","ோ","ௌ"];

const SPECIAL_CASE = {
  "பலம்":"balam","பாரதி":"bharathi","பூமி":"boomi","பாரதம்":"bharatham",
  "பயந்து":"bayanthu","பயம்":"bayam","பிடி":"pidi","படு":"padu",
  "சரி":"seri","சென்னை":"chennai","பெங்களூர்":"bengaloor",
};

function olipeyarppu(wordStart, tamWord, prevComb, nextNextChar, nextChar) {
  const vallinaComb = [...VALLINAM,...MELLINAM,...IDAIYINAM,"ஸ","ஷ"].map(l => l + "்");

  if (wordStart) {
    if (EXTRAS_KEYS.some(e => tamWord === "க" + e)) return KA_RULE[tamWord] ?? LETTER_RULE[tamWord] ?? '';
    if (EXTRAS_KEYS.some(e => tamWord === "த" + e)) return THA_RULE[tamWord] ?? LETTER_RULE[tamWord] ?? '';
    if (EXTRAS_KEYS.slice(2).some(e => tamWord === "ட" + e)) return TA_RULE[tamWord] ?? LETTER_RULE[tamWord] ?? '';
    if (EXTRAS_KEYS.some(e => tamWord === "ப" + e)) return PA_RULE[tamWord] ?? LETTER_RULE[tamWord] ?? '';
    return LETTER_RULE[tamWord] ?? '';
  }

  if (tamWord === "க" && prevComb === "று") return "ka";

  if (vallinaComb.includes(prevComb)) {
    let r = '';
    if (prevComb === "ன்") {
      if (tamWord === "று") return "dru";
      if (tamWord === "றி") return "dri";
      if (tamWord === "ற") return "dra";
      if (tamWord === "றை") return "drai";
      if (EXTRAS_KEYS.some(e => tamWord === "ப" + e)) return LETTER_RULE[tamWord] ?? '';
    }
    if (r === '' && ["க்","ச்","ட்","த்","ப்","ற்","ஷ்","ஸ்"].includes(prevComb)) {
      r += KA_RULE[tamWord] ?? '';
      r += SA_RULE[tamWord] ?? '';
      r += TA_RULE[tamWord] ?? '';
      r += THA_RULE[tamWord] ?? '';
      r += PA_RULE[tamWord] ?? '';
    }
    if (r === '') r = LETTER_RULE[tamWord] ?? '';
    return r;
  }

  if (tamWord === "ற்" && nextNextChar === "ற") return "t";

  return LETTER_RULE[tamWord] ?? '';
}

function tamilToTanglish(text) {
  // Apply special cases
  let processed = text;
  for (const [k, v] of Object.entries(SPECIAL_CASE)) {
    processed = processed.replaceAll(k, v);
  }

  let result = '';
  let wordStart = true;
  let i = 0;

  while (i < processed.length) {
    const twoChar = processed.slice(i, i + 2);
    const oneChar = processed[i];
    const prevComb = i >= 2 ? processed.slice(i - 2, i) : '';
    const nextChar = i + 1 < processed.length ? processed[i + 1] : '';
    const nextNextChar = i + 2 < processed.length ? processed[i + 2] : '';

    if (LETTER_RULE[twoChar] !== undefined) {
      result += olipeyarppu(wordStart, twoChar, prevComb, nextNextChar, nextChar);
      i++; // skip next Tamil char (it was part of the combo)
      wordStart = false;
    } else if (LETTER_RULE[oneChar] !== undefined) {
      result += olipeyarppu(wordStart, oneChar, prevComb, nextNextChar, nextChar);
      wordStart = false;
    } else {
      result += oneChar;
    }

    i++;
    wordStart = false;
    const BOUNDARIES = ' \n,;:\'-_().#@%*';
    if (i < processed.length && BOUNDARIES.includes(processed[i - 1])) {
      wordStart = true;
    }
  }
  return result.trim();
}

// ─────────────────────────────────────────────────────────────────
// 2. UNICODE EXPLORER
// ─────────────────────────────────────────────────────────────────
function exploreUnicode(text) {
  return [...text].map((ch) => {
    const cp = ch.codePointAt(0);
    const hex = cp.toString(16).toUpperCase().padStart(4, '0');
    const name = isTamil(cp) ? 'Tamil' : 'Other';
    return { char: ch, codepoint: cp, hex: `U+${hex}`, name };
  });
}

function isTamil(cp) {
  return (cp >= 0x0B80 && cp <= 0x0BFF);
}

function escapesToChars(text) {
  return text.replace(/U\+([0-9A-Fa-f]{4,6})/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16))
  );
}

// ─────────────────────────────────────────────────────────────────
// Shared copy hook
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

// ─────────────────────────────────────────────────────────────────
// Shared UI primitives
// ─────────────────────────────────────────────────────────────────
function CopyBtn({ text }) {
  const { copied, copy } = useCopy();
  return (
    <button
      onClick={() => copy(text)}
      title="Copy to clipboard"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg
        bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200
        hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
    >
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function Label({ children }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider
      text-gray-500 dark:text-gray-400 mb-1.5">
      {children}
    </label>
  );
}

function Textarea({ value, onChange, placeholder, rows = 4, readOnly, style }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      rows={rows}
      style={style}
      className="w-full px-4 py-3 rounded-xl border resize-none
        bg-white dark:bg-gray-800
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
  { key: 'aa', val: 'ஆ' }, { key: 'ii', val: 'ஈ' }, { key: 'ee', val: 'ஏ' },
  { key: 'uu', val: 'ஊ' }, { key: 'oo', val: 'ஓ' }, { key: 'ai', val: 'ஐ' },
  { key: 'au', val: 'ஔ' }, { key: 'zh', val: 'ழ' }, { key: 'rr / RR', val: 'ற' },
  { key: 'll / LL', val: 'ள' }, { key: 'N', val: 'ண' }, { key: 'Th', val: 'ட' },
  { key: 'T', val: 'த' }, { key: 'ng', val: 'ங' }, { key: 'Bh', val: 'ப (aspirate)' },
  { key: 'R', val: 'ற' }, { key: 'L', val: 'ள' }, { key: 'sh / Sh', val: 'ஷ' },
];

function TransliteratorTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('tanglish'); // 'tanglish' | 'tamil'

  const output = mode === 'tanglish'
    ? tanglishToTamil(input)
    : tamilToTanglish(input);

  const isTamilMode = mode === 'tamil';

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-500 dark:text-gray-400">Direction:</span>
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm">
          <button
            onClick={() => { setMode('tanglish'); setInput(''); }}
            className={`px-4 py-2 font-medium transition-colors ${
              !isTamilMode
                ? 'bg-red-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Tanglish → Tamil
          </button>
          <button
            onClick={() => { setMode('tamil'); setInput(''); }}
            className={`px-4 py-2 font-medium transition-colors border-l border-gray-200 dark:border-gray-700 ${
              isTamilMode
                ? 'bg-red-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Tamil → Tanglish
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {isTamilMode ? (
          <>Paste Tamil script and get phonetic Tanglish instantly.
            <strong className="text-gray-700 dark:text-gray-300"> Example: </strong>
            <span style={{ fontFamily: "'Noto Sans Tamil', system-ui" }}>வணக்கம்</span>
            {' → vanakkam'}
          </>
        ) : (
          <>Type English phonetics (Tanglish) and see Tamil script instantly.
            <strong className="text-gray-700 dark:text-gray-300"> Example: </strong>
            <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-red-600 dark:text-red-400">
              BhaaraTh
            </code>
            {' → '}
            <span style={{ fontFamily: "'Noto Sans Tamil', system-ui" }}>பாரத்</span>
          </>
        )}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>{isTamilMode ? 'Tamil Input' : 'Tanglish Input'}</Label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isTamilMode ? 'Paste Tamil text… e.g. வணக்கம்' : 'Type here… e.g. BhaaraTh'}
            rows={5}
            style={isTamilMode ? { fontFamily: "'Noto Sans Tamil', system-ui", fontSize: '1.15rem' } : undefined}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label>{isTamilMode ? 'Tanglish Output' : 'Tamil Output'}</Label>
            <CopyBtn text={output} />
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder={isTamilMode ? 'Tanglish will appear here…' : 'Tamil script will appear here…'}
            rows={5}
            style={!isTamilMode ? { fontFamily: "'Noto Sans Tamil', system-ui", fontSize: '1.15rem' } : undefined}
          />
        </div>
      </div>

      {/* Quick reference — only in Tanglish→Tamil mode */}
      {!isTamilMode && (
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-red-600 dark:text-red-400
            hover:underline list-none flex items-center gap-1">
            <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
            Key conventions
          </summary>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {QUICK_TIPS.map(({ key, val }) => (
              <div key={key}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                  bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm">
                <code className="font-mono text-red-600 dark:text-red-400">{key}</code>
                <span className="text-gray-400">→</span>
                <span className="text-gray-800 dark:text-gray-200">{val}</span>
              </div>
            ))}
          </div>
        </details>
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
        <Label>Enter Tamil text</Label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. வணக்கம்"
          rows={2}
          style={{ fontFamily: "'Noto Sans Tamil', system-ui", fontSize: '1.2rem' }}
        />

        {chars.length > 0 && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="pb-2 pr-4">Char</th>
                  <th className="pb-2 pr-4">Code Point</th>
                  <th className="pb-2 pr-4">Decimal</th>
                  <th className="pb-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {chars.map(({ char, codepoint, hex, name }, idx) => (
                  <tr key={idx}
                    className="border-t border-gray-100 dark:border-gray-800">
                    <td className="py-2 pr-4 font-bold text-xl"
                      style={{ fontFamily: "'Noto Sans Tamil', system-ui" }}>{char}</td>
                    <td className="py-2 pr-4">
                      <code className="bg-red-50 dark:bg-red-900/30 text-red-700
                        dark:text-red-300 px-2 py-0.5 rounded font-mono">{hex}</code>
                    </td>
                    <td className="py-2 pr-4 text-gray-500 dark:text-gray-400">{codepoint}</td>
                    <td className="py-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium
                        ${name === 'Tamil'
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                        {name}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section B — escape converter */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Convert Unicode escapes like <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5
          rounded text-red-600 dark:text-red-400">U+0B95</code> to actual characters.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Unicode Escapes Input</Label>
            <Textarea
              value={escInput}
              onChange={(e) => setEscInput(e.target.value)}
              placeholder="e.g. U+0B95 U+0BC1"
              rows={3}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label>Characters</Label>
              <CopyBtn text={converted} />
            </div>
            <Textarea
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
// TOOL 4 — Font Tester
// ─────────────────────────────────────────────────────────────────
function FontTesterTool() {
  const { fonts, loading } = useFontsData();
  const [text, setText] = useState('வணக்கம் உலகம்! தமிழ் எழுத்துருக்கள்.');
  const [selectedFont, setSelectedFont] = useState('');
  const [fontSize, setFontSize] = useState(32);
  const { copied, copy } = useCopy();

  // Pick default font when data loads
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
        Preview any Unicode Tamil text in every font from our gallery. Select a font,
        adjust the size, and inspect per-character Unicode code points.
      </p>

      {/* Controls row */}
      <div className="flex flex-wrap gap-3 items-end">
        {/* Font selector */}
        <div className="flex-1 min-w-[180px]">
          <Label>Font</Label>
          <div className="relative">
            <select
              value={selectedFont || fontName}
              onChange={e => setSelectedFont(e.target.value)}
              disabled={loading}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-xl border text-sm
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
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
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4
              text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Size slider */}
        <div className="min-w-[160px]">
          <Label>Size: {fontSize}px</Label>
          <input
            type="range"
            min={12} max={72} step={2}
            value={fontSize}
            onChange={e => setFontSize(Number(e.target.value))}
            className="w-full accent-red-600"
          />
        </div>
      </div>

      {/* Text input */}
      <div>
        <Label>Unicode Tamil Input</Label>
        <Textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or paste Unicode Tamil here…"
          rows={3}
          style={{ fontFamily: "'Noto Sans Tamil', system-ui", fontSize: '1.1rem' }}
        />
      </div>

      {/* Rendered preview */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700
        bg-gray-50 dark:bg-gray-800/50 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider
            text-gray-500 dark:text-gray-400">
            {fontName || 'Select a font'}
          </span>
          <CopyBtn text={text} />
        </div>
        <div
          style={{
            fontFamily: fontName ? `"${fontName}", 'Noto Sans Tamil', system-ui` : 'system-ui',
            fontSize: `${fontSize}px`,
            lineHeight: 1.7,
            wordBreak: 'break-word',
          }}
          className="text-gray-900 dark:text-white min-h-[3em]"
        >
          {text || <span className="text-gray-400 dark:text-gray-500 text-base">Preview will appear here…</span>}
        </div>
      </div>

      {/* Font metadata badge */}
      {font && (
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/40
            text-red-700 dark:text-red-300 font-medium">{font.category}</span>
          <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800
            text-gray-600 dark:text-gray-400">{font.license}</span>
          {font.variants?.length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800
              text-gray-600 dark:text-gray-400">{font.variants.length} variant{font.variants.length > 1 ? 's' : ''}</span>
          )}
        </div>
      )}

      {/* Unicode codepoints breakdown */}
      {text.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-red-600 dark:text-red-400
            hover:underline list-none flex items-center gap-1">
            <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
            Unicode code points ({[...text].length} chars)
          </summary>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {codepoints.map(({ ch, cp, isTamil }, i) => (
              <div
                key={i}
                title={cp}
                onClick={() => navigator.clipboard.writeText(cp)}
                className={`flex flex-col items-center px-2 py-1.5 rounded-lg border cursor-pointer
                  text-xs transition-colors hover:border-red-400 dark:hover:border-red-500
                  ${
                    isTamil
                      ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
              >
                <span
                  className="text-lg leading-tight"
                  style={{ fontFamily: fontName ? `"${fontName}", 'Noto Sans Tamil', system-ui` : 'Noto Sans Tamil' }}
                >
                  {ch === ' ' ? '␣' : ch}
                </span>
                <span className="mt-0.5 font-mono text-[10px] text-gray-500 dark:text-gray-400">{cp}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">Click any tile to copy its code point.</p>
        </details>
      )}

      {/* Legacy font note */}
      <div className="rounded-xl border border-amber-200 dark:border-amber-800
        bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm">
        <p className="text-amber-800 dark:text-amber-300 font-medium mb-1">Need legacy font encoding?</p>
        <p className="text-amber-700 dark:text-amber-400">
          For converting Unicode Tamil to Bamini, TAB, Vanavil, Shree Lipi and other
          legacy formats, use{' '}
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
  { id: 'unicode',        label: 'Unicode Explorer', icon: Code2,    desc: 'Code points & escapes' },
  { id: 'font-tester',   label: 'Font Tester',       icon: Type,     desc: 'Preview in any gallery font' },
];

export default function Tools() {
  const [activeTab, setActiveTab] = useState('transliterator');

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400
            hover:text-gray-900 dark:hover:text-white mb-8 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Gallery
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tamil Tools</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Utilities for working with Tamil text — all free, most run entirely in your browser.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map(({ id, label, icon: Icon, desc }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                transition-all border
                ${activeTab === id
                  ? 'bg-red-600 dark:bg-red-500 text-white border-red-600 dark:border-red-500 shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              <span className={`hidden sm:inline text-xs ${activeTab === id ? 'text-red-200' : 'text-gray-400 dark:text-gray-500'}`}>
                — {desc}
              </span>
            </button>
          ))}
        </div>

        {/* Tool panel */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800
          shadow-sm p-6 md:p-8">
          {activeTab === 'transliterator' && <TransliteratorTool />}
          {activeTab === 'unicode'         && <UnicodeExplorerTool />}
          {activeTab === 'font-tester'     && <FontTesterTool />}
        </div>
      </div>
    </div>
  );
}
