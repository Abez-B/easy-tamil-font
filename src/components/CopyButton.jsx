import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import copyToClipboard from 'copy-to-clipboard';

export default function CopyButton({ text, fontName }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="btn-secondary flex items-center space-x-2"
      title={`Copy text rendered in ${fontName}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>Copy Text</span>
        </>
      )}
    </button>
  );
}
