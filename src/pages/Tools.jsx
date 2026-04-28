import { Link } from 'react-router-dom';
import { ArrowLeft, Wrench } from 'lucide-react';

export default function Tools() {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-text-secondary hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-bg-secondary rounded-lg p-8 text-center">
          <Wrench className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-primary mb-4">Tools (Coming Soon)</h1>
          <p className="text-text-secondary mb-6">
            We're building powerful tools to help you work with Tamil text:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-bg p-6 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">Unicode Converter</h3>
              <p className="text-sm text-text-secondary">
                Convert between TSCII, ISCII, and Unicode Tamil encodings
              </p>
            </div>
            
            <div className="bg-bg p-6 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">Transliterator</h3>
              <p className="text-sm text-text-secondary">
                Type in Tanglish (English phonetic) and convert to Tamil script
              </p>
            </div>
            
            <div className="bg-bg p-6 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">Translator</h3>
              <p className="text-sm text-text-secondary">
                Translate text from any language to Tamil
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-text-secondary">
              Stay tuned! These tools will be available soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
