import { Link } from 'react-router-dom';
import { Type, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-bg border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Type className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-primary">easy-font-tamil</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-text hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/license" className="text-text hover:text-primary transition-colors">
              License
            </Link>
            <Link to="/contributing" className="text-text hover:text-primary transition-colors">
              Contributing
            </Link>
            <Link to="/tools" className="text-text-secondary hover:text-primary transition-colors">
              Tools (Soon)
            </Link>
          </nav>

          <button className="md:hidden">
            <Menu className="w-6 h-6 text-primary" />
          </button>
        </div>
      </div>
    </header>
  );
}
