import { Link } from 'react-router-dom';
import { ArrowLeft, Github, FileJson, FolderPlus } from 'lucide-react';

export default function Contributing() {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-text-secondary hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-bg-secondary rounded-lg p-8">
          <h1 className="text-3xl font-bold text-primary mb-6">Contributing to easy-font-tamil</h1>
          
          <div className="space-y-6 text-text">
            <section>
              <p className="text-text-secondary leading-relaxed">
                We welcome contributions from the community! This project aims to be a comprehensive 
                showcase of Tamil fonts. You can help by adding new fonts, improving metadata, or 
                suggesting enhancements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">Adding a New Font</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">1</span>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Fork the Repository</h3>
                    <p className="text-text-secondary">
                      Click the "Fork" button on GitHub to create your own copy of the repository.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">2</span>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Clone Locally</h3>
                    <p className="text-text-secondary mb-2">Clone your fork to your local machine:</p>
                    <code className="block bg-bg p-3 rounded text-sm overflow-x-auto">
                      git clone https://github.com/YOUR_USERNAME/easy-font-tamil.git
                    </code>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">3</span>
                  <div>
                    <h3 className="font-semibold text-primary mb-1 flex items-center">
                      <FolderPlus className="w-5 h-5 mr-2" />
                      Add Font Files
                    </h3>
                    <p className="text-text-secondary mb-2">Create a folder for your font and add the font files:</p>
                    <code className="block bg-bg p-3 rounded text-sm overflow-x-auto">
                      mkdir -p public/fonts/font-name<br />
                      cp your-font.ttf public/fonts/font-name/Regular.ttf
                    </code>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">4</span>
                  <div>
                    <h3 className="font-semibold text-primary mb-1 flex items-center">
                      <FileJson className="w-5 h-5 mr-2" />
                      Update Font Metadata
                    </h3>
                    <p className="text-text-secondary mb-2">Add an entry to <code className="bg-bg px-1 rounded">public/meta/fonts.json</code>:</p>
                    <pre className="block bg-bg p-3 rounded text-sm overflow-x-auto">
{`{
  "id": "unique-font-id",
  "name": "Font Name",
  "category": "Unicode|TACE16|Other",
  "variants": ["Regular", "Bold"],
  "author": "Author Name",
  "license": "License type",
  "source": "Source URL",
  "description": "Description of the font",
  "tags": ["tag1", "tag2"],
  "sampleText": "வணக்கம் தமிழ் எழுத்துருக்கள் அழகானவை",
  "filename": "Regular.ttf"
}`}
                    </pre>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">5</span>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Commit and Push</h3>
                    <p className="text-text-secondary mb-2">Commit your changes and push to your fork:</p>
                    <code className="block bg-bg p-3 rounded text-sm overflow-x-auto">
                      git add .<br />
                      git commit -m "Add Font Name"<br />
                      git push origin main
                    </code>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">6</span>
                  <div>
                    <h3 className="font-semibold text-primary mb-1 flex items-center">
                      <Github className="w-5 h-5 mr-2" />
                      Create Pull Request
                    </h3>
                    <p className="text-text-secondary">
                      Go to the original repository and create a Pull Request. Include a detailed 
                      description of the font you're adding.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">License Guidelines</h2>
              <ul className="list-disc list-inside space-y-2 text-text-secondary">
                <li>Only add fonts that are free for <strong>educational and research use</strong></li>
                <li>Include proper <strong>attribution</strong> to the font creator</li>
                <li>Link to the <strong>original source</strong> of the font</li>
                <li>Include a <strong>license file</strong> in the font folder if available</li>
                <li>Verify the font is not restricted for commercial use without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">Font Metadata Fields</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-primary">Field</th>
                    <th className="text-left py-2 px-3 text-primary">Description</th>
                    <th className="text-left py-2 px-3 text-primary">Required</th>
                  </tr>
                </thead>
                <tbody className="text-text-secondary">
                  <tr className="border-b border-border">
                    <td className="py-2 px-3"><code className="bg-bg px-1 rounded">id</code></td>
                    <td className="py-2 px-3">Unique identifier (lowercase, hyphenated)</td>
                    <td className="py-2 px-3">Yes</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-3"><code className="bg-bg px-1 rounded">name</code></td>
                    <td className="py-2 px-3">Display name of the font</td>
                    <td className="py-2 px-3">Yes</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-3"><code className="bg-bg px-1 rounded">category</code></td>
                    <td className="py-2 px-3">Unicode, TACE16, or Other</td>
                    <td className="py-2 px-3">Yes</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-3"><code className="bg-bg px-1 rounded">author</code></td>
                    <td className="py-2 px-3">Font creator or organization</td>
                    <td className="py-2 px-3">Yes</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-3"><code className="bg-bg px-1 rounded">license</code></td>
                    <td className="py-2 px-3">License type or description</td>
                    <td className="py-2 px-3">Yes</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-3"><code className="bg-bg px-1 rounded">source</code></td>
                    <td className="py-2 px-3">URL to original font source</td>
                    <td className="py-2 px-3">Yes</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-3"><code className="bg-bg px-1 rounded">description</code></td>
                    <td className="py-2 px-3">Brief description of the font</td>
                    <td className="py-2 px-3">Yes</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-3"><code className="bg-bg px-1 rounded">tags</code></td>
                    <td className="py-2 px-3">Array of keywords for search</td>
                    <td className="py-2 px-3">No</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-3"><code className="bg-bg px-1 rounded">sampleText</code></td>
                    <td className="py-2 px-3">Tamil text for preview</td>
                    <td className="py-2 px-3">No</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">Questions or Issues?</h2>
              <p className="text-text-secondary">
                If you have questions or encounter issues while contributing, please open an 
                <a href="https://github.com/your-repo/issues" className="text-primary hover:underline ml-1">
                  issue on GitHub
                </a>
                . We're happy to help!
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
