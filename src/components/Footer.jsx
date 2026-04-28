import { Link } from 'react-router-dom';
import { Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-primary mb-2">easy-font-tamil</h3>
            <p className="text-sm text-text-secondary">
              A community-driven Tamil font showcase and indexing platform.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-primary mb-2">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-text-secondary hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/license" className="text-text-secondary hover:text-primary transition-colors">
                  License
                </Link>
              </li>
              <li>
                <Link to="/contributing" className="text-text-secondary hover:text-primary transition-colors">
                  Contributing
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-primary mb-2">Source</h3>
            <p className="text-sm text-text-secondary mb-2">
              Fonts provided by Tamil Virtual Academy
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="mailto:tamilvu@yahoo.com"
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-text-secondary">
          <p>© 2026 easy-font-tamil. Fonts are exclusively for educational and research purposes.</p>
        </div>
      </div>
    </footer>
  );
}
