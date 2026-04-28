import { Link } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';

export default function License() {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-text-secondary hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-bg-secondary rounded-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Scale className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Font License Information</h1>
          </div>

          <div className="space-y-6 text-text">
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">Educational & Research Use Only</h2>
              <p className="text-text-secondary leading-relaxed">
                All fonts available on this website are exclusively for <strong>educational and research purposes</strong>. 
                These fonts are provided to help researchers, students, and enthusiasts explore and study Tamil typography.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">Font Source</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                The fonts featured on this website are provided by <strong>Tamil Virtual Academy</strong> 
                (Tamil Virtual Academy - Government of Tamil Nadu). They are the original creators and maintainers 
                of these Tamil Unicode and TACE16 fonts.
              </p>
              <a
                href="https://www.tamilvu.org/ta/tkbd-index-341488"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center"
              >
                Visit Tamil Virtual Academy
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">Usage Guidelines</h2>
              <ul className="list-disc list-inside space-y-2 text-text-secondary">
                <li>Fonts may be used for <strong>educational purposes</strong> (learning, teaching, research)</li>
                <li>Fonts may be used for <strong>personal projects</strong> related to Tamil language study</li>
                <li>Proper <strong>attribution</strong> to Tamil Virtual Academy is required</li>
                <li>Fonts should not be used for <strong>commercial purposes</strong> without permission</li>
                <li>Font files should not be <strong>redistributed</strong> without proper licensing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">Commercial Use</h2>
              <p className="text-text-secondary leading-relaxed">
                For commercial use of these fonts, please contact Tamil Virtual Academy directly or visit their 
                official website for licensing information and permissions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">Disclaimer</h2>
              <p className="text-text-secondary leading-relaxed">
                This website is a community-driven showcase project. We do not claim ownership of any fonts 
                displayed. All font rights belong to their respective creators and owners. For any concerns 
                regarding font usage or licensing, please contact Tamil Virtual Academy at 
                <a href="mailto:tamilvu@yahoo.com" className="text-primary hover:underline ml-1">
                  tamilvu@yahoo.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">Categories</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-primary mb-2">Tamil Unicode Fonts</h3>
                  <p className="text-text-secondary">
                    The Government of Tamil Nadu has announced Tamil Unicode as the standard encoding for 
                    Tamil digital content. These fonts follow the Unicode standard for maximum compatibility.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">TACE16 Fonts</h3>
                  <p className="text-text-secondary">
                    TACE16 (Tamil Association of Computing Experts 16-bit) is an alternate standard encoding 
                    for Tamil. These fonts are included for compatibility with legacy systems.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
