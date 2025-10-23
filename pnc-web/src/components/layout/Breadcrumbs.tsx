import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const MIT_GREEN = '#108040';
const MIT_BLUE = '#1a56db';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={item.label} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
            )}
            <Link href={item.href} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-600">
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};


export default Breadcrumbs;
