import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Type, Menu, X, Sun, Moon } from 'lucide-react';

export default function Header({ darkMode, setDarkMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', exact: true },
    { to: '/license', label: 'License' },
    { to: '/contributing', label: 'Contributing' },
    { to: '/tools', label: 'Tools' },
  ];

  const linkClass = ({ isActive }) =>
    `transition-colors ${isActive ? 'text-primary font-semibold' : 'text-text-secondary hover:text-primary'}`;

  return (
    <header className="sticky top-0 z-50 bg-bg border-b border-border backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileOpen(false)}>
            <Type className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-primary">easy-font-tamil</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={linkClass}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center space-x-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-bg-secondary transition-colors"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-bg-secondary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-bg">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col space-y-1">
            {navLinks.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-bg-secondary text-primary font-semibold'
                      : 'text-text-secondary hover:bg-bg-secondary hover:text-primary'
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
