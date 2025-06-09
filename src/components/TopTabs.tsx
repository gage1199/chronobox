import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// TopTabs component for main navigation between Personal Legacy, Create, and Family sections
// Features: responsive design, accessibility, active state management, smooth hover effects

const TopTabs: React.FC = () => {
  const router = useRouter();

  const tabs = [
    { 
      label: 'Personal Legacy', 
      href: '/legacy',
      description: 'Your personal videos and messages'
    },
    { 
      label: 'Create', 
      href: '/create',
      description: 'Create new memories and content'
    },
    { 
      label: 'Family', 
      href: '/family',
      description: 'Family timeline and shared memories'
    }
  ];

  const isActive = (href: string) => {
    return router.pathname.startsWith(href);
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <nav 
          className="flex space-x-4 overflow-x-auto scrollbar-hide" 
          role="tablist"
          aria-label="Main navigation tabs"
        >
          {tabs.map(({ label, href, description }) => {
            const active = isActive(href);
            
            return (
              <Link
                key={href}
                href={href}
                role="tab"
                aria-selected={active}
                aria-label={`${label} - ${description}`}
                className={`
                  relative px-4 py-4 font-medium text-sm whitespace-nowrap transition-colors duration-200
                  hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
                  after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 
                  after:h-0.5 after:bg-amber-600 after:transition-transform after:duration-200
                  ${active 
                    ? 'text-amber-600 after:scale-x-100' 
                    : 'text-gray-700 after:scale-x-0'
                  }
                `}
              >
                <span className="relative">
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default TopTabs; 