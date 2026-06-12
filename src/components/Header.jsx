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
    `transition-colors ${isActive ? 'text-primary dark:text-white font-semibold' : 'text-text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-white'}`;

  return (
    <header className="sticky top-0 z-50 bg-bg dark:bg-black border-b border-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileOpen(false)}>
            <Type className="w-6 h-6 text-primary dark:text-white" />
            <span className="text-xl font-bold text-primary dark:text-white">easy-font-tamil</span>
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
              className="p-2 rounded-lg text-text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-bg-secondary dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-bg-secondary dark:hover:bg-gray-800 transition-colors"
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
        <div className="md:hidden border-t border-border bg-bg dark:bg-black">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col space-y-1">
            {navLinks.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-bg-secondary dark:bg-gray-800 text-primary dark:text-white font-semibold'
                      : 'text-text-secondary dark:text-gray-300 hover:bg-bg-secondary dark:hover:bg-gray-800 hover:text-primary dark:hover:text-white'
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
