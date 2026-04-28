import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import fontsData from '../data/fonts.json';
import FontPreview from '../components/FontPreview';
import CopyButton from '../components/CopyButton';

export default function FontDetail() {
  const { id } = useParams();
  const [customText, setCustomText] = useState('');

  const font = fontsData.fonts.find((f) => f.id === id);

  if (!font) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-primary mb-2">Font not found</h1>
          <Link to="/" className="btn-primary inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const categoryBadgeClass = font.category === 'Unicode' 
    ? 'badge-unicode' 
    : 'badge-tace16';

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-text-secondary hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-primary">{font.name}</h1>
                <span className={`badge ${categoryBadgeClass}`}>
                  {font.category}
                </span>
              </div>
              <p className="text-text-secondary">{font.description}</p>
            </div>

            <div className="bg-bg-secondary rounded-lg p-6 mb-6">
              <h2 className="font-semibold text-primary mb-4">Live Preview</h2>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type your text here to preview..."
                className="input-field mb-4"
                rows="3"
              />
              <FontPreview font={font} customText={customText} />
            </div>
          </div>

          <div>
            <div className="bg-bg-secondary rounded-lg p-6 sticky top-24">
              <h2 className="font-semibold text-primary mb-4">Font Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-text-secondary mb-1">Author</h3>
                  <p className="text-primary">{font.author}</p>
                </div>

                <div>
                  <h3 className="text-sm text-text-secondary mb-1">License</h3>
                  <p className="text-primary">{font.license}</p>
                </div>

                <div>
                  <h3 className="text-sm text-text-secondary mb-1">Variants</h3>
                  <div className="flex flex-wrap gap-1">
                    {font.variants.map((variant) => (
                      <span key={variant} className="badge bg-bg-secondary text-text-secondary">
                        {variant}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-text-secondary mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {font.tags.map((tag) => (
                      <span key={tag} className="badge bg-bg-secondary text-text-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <a
                    href={font.downloadUrl}
                    download
                    className="btn-primary w-full flex items-center justify-center space-x-2 mb-3"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Font</span>
                  </a>
                  <a
                    href={font.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View on TamilVu</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
