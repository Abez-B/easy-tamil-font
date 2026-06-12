import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

export default function LicenseBanner() {
  return (
    <div className="bg-bg dark:bg-black border-b border-border py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
        <span className="text-sm text-text-secondary dark:text-gray-300">
          All fonts are for <span className="font-semibold text-primary dark:text-white">educational and research purposes only</span>
          <Link to="/license" className="ml-2 inline-flex items-center text-primary dark:text-white hover:underline">
            Learn more
            <ExternalLink className="w-3 h-3 ml-1" />
          </Link>
        </span>
      </div>
    </div>
  );
}
