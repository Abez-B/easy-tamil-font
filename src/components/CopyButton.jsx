import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function CopyButton({ text, fontName, fontSize = 24, fontWeight = 'normal', fontStyle = 'normal' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const htmlContent = `<span style="font-family: '${fontName}'; font-size: ${fontSize}px; font-weight: ${fontWeight}; font-style: ${fontStyle};">${text.replace(/\n/g, '<br>')}</span>`;
      
      // Use modern Clipboard API to write both plain text and HTML
      const clipboardItem = new ClipboardItem({
        'text/plain': new Blob([text], { type: 'text/plain' }),
        'text/html': new Blob([htmlContent], { type: 'text/html' })
      });
      await navigator.clipboard.write([clipboardItem]);
    } catch (err) {
      // Fallback for older browsers (only copies plain text)
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
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
          <Check className="w-4 h-4 text-green-600" />
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
