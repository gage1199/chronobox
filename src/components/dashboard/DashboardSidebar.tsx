import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ThemeToggle';

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onQuickRecord: () => void;
}

const navigationItems = [
  { 
    id: 'library', 
    name: 'My Library', 
    icon: '🏛️', 
    href: '#library',
    badge: null 
  },
  { 
    id: 'shared', 
    name: 'Shared with Me', 
    icon: '🤝', 
    href: '#shared',
    badge: 3 
  },
  { 
    id: 'scheduled', 
    name: 'Scheduled Messages', 
    icon: '⏰', 
    href: '#scheduled',
    badge: null 
  },
  { 
    id: 'timeline', 
    name: 'Life Timeline', 
    icon: '📚', 
    href: '#timeline',
    badge: null 
  },
  { 
    id: 'collections', 
    name: 'Collections', 
    icon: '📁', 
    href: '#collections',
    badge: null 
  }
];

const legacyPlanningItems = [
  { 
    name: 'Digital Will', 
    status: 'complete', 
    icon: '✅' 
  },
  { 
    name: 'Trusted Contacts', 
    status: 'pending', 
    icon: '⏳' 
  }
];

export default function DashboardSidebar({ 
  activeSection, 
  onSectionChange, 
  onQuickRecord 
}: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme } = useTheme();

  return (
    <aside className={`
      ${isCollapsed ? 'w-20' : 'w-80'} 
      ${theme === 'light' 
        ? 'bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900 border-r border-gray-200' 
        : 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white border-r border-amber-500/20'
      } 
      shadow-2xl transition-all duration-300 ease-in-out
    `}>
      {/* Header with Logo */}
      <div className={`px-6 py-8 border-b ${
        theme === 'light' ? 'border-gray-200' : 'border-slate-700/50'
      }`}>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden ${
                theme === 'light' 
                  ? 'bg-gradient-to-br from-amber-400 to-amber-600' 
                  : 'bg-gradient-to-br from-amber-400 to-amber-600'
              }`}>
                <Image
                  src="/chronobox-logo.png"
                  alt="ChronoBox Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className={`absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 ${
                theme === 'light' ? 'border-white' : 'border-slate-900'
              }`}></div>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className={`text-xl font-bold ${
                  theme === 'light' 
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent' 
                    : 'bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent'
                }`}>
                  ChronoBox
                </h1>
                <p className={`text-xs ${
                  theme === 'light' ? 'text-gray-600' : 'text-slate-400'
                }`}>
                  Digital Legacy Vault
                </p>
              </div>
            )}
          </Link>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'light' 
                ? 'hover:bg-gray-100 text-gray-600' 
                : 'hover:bg-slate-700/50 text-slate-400'
            }`}
          >
            <svg 
              className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700/50">
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
      </div>

      {/* Quick Record Button - Bellagio inspired luxury CTA */}
      <div className="px-6 py-6 space-y-3">
        <button
          onClick={onQuickRecord}
          className={`
            w-full bg-gradient-to-r from-amber-500 to-amber-600 
            hover:from-amber-600 hover:to-amber-700
            ${theme === 'light' ? 'text-white' : 'text-slate-900'}
            font-semibold py-4 px-6 rounded-xl
            shadow-lg hover:shadow-xl transform hover:scale-105
            transition-all duration-200 ease-out
            border border-amber-400/50
            ${isCollapsed ? 'px-3' : 'px-6'}
          `}
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xl">✨</span>
            {!isCollapsed && <span>Create Memory</span>}
          </div>
        </button>

        {/* Complete Setup Button */}
        <Link href="/profile/setup">
          <button
            className={`
              w-full bg-gradient-to-r from-emerald-500 to-emerald-600 
              hover:from-emerald-600 hover:to-emerald-700
              ${theme === 'light' ? 'text-white' : 'text-slate-900'}
              font-semibold py-3 px-6 rounded-xl
              shadow-lg hover:shadow-xl transform hover:scale-105
              transition-all duration-200 ease-out
              border border-emerald-400/50
              ${isCollapsed ? 'px-3' : 'px-6'}
            `}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">⚙️</span>
              {!isCollapsed && <span>Complete Setup</span>}
            </div>
          </button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-3 pb-4">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.name)}
              className={`
                w-full flex items-center px-4 py-3 rounded-xl text-left
                transition-all duration-200 ease-out
                ${activeSection === item.name 
                  ? theme === 'light'
                    ? 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 border border-amber-300 shadow-lg'
                    : 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/30 shadow-lg'
                  : theme === 'light'
                    ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }
              `}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {!isCollapsed && (
                <>
                  <span className="flex-1 font-medium">{item.name}</span>
                  {item.badge && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      theme === 'light' 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-amber-500 text-slate-900'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Legacy Planning Section */}
      {!isCollapsed && (
        <div className={`px-6 py-4 border-t mt-4 ${
          theme === 'light' ? 'border-gray-200' : 'border-slate-700/50'
        }`}>
          <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
            theme === 'light' ? 'text-gray-500' : 'text-slate-400'
          }`}>
            Legacy Planning
          </h3>
          <div className="space-y-3">
            {legacyPlanningItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1">
                  <p className={`
                    text-sm font-medium
                    ${item.status === 'complete' 
                      ? 'text-emerald-500' 
                      : theme === 'light' ? 'text-amber-600' : 'text-amber-400'
                    }
                  `}>
                    {item.name}
                  </p>
                  <p className={`text-xs capitalize ${
                    theme === 'light' ? 'text-gray-500' : 'text-slate-500'
                  }`}>
                    {item.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Progress Indicator */}
          <div className={`mt-6 p-4 rounded-xl border ${
            theme === 'light' 
              ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200' 
              : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${
                theme === 'light' ? 'text-gray-700' : 'text-slate-300'
              }`}>
                Setup Progress
              </span>
              <span className={`text-sm font-semibold ${
                theme === 'light' ? 'text-amber-600' : 'text-amber-400'
              }`}>
                85%
              </span>
            </div>
            <div className={`w-full rounded-full h-2 ${
              theme === 'light' ? 'bg-gray-200' : 'bg-slate-600'
            }`}>
              <div className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className={`text-xs mt-2 ${
              theme === 'light' ? 'text-gray-600' : 'text-slate-400'
            }`}>
              Almost ready to preserve your legacy
            </p>
          </div>
        </div>
      )}

      {/* Storage Usage */}
      {!isCollapsed && (
        <div className={`px-6 py-4 border-t mt-4 ${
          theme === 'light' ? 'border-gray-200' : 'border-slate-700/50'
        }`}>
          <div className={`p-4 rounded-xl ${
            theme === 'light' 
              ? 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200' 
              : 'bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-500/30'
          }`}>
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">💎</span>
              <div>
                <p className={`font-semibold text-sm ${
                  theme === 'light' ? 'text-blue-900' : 'text-blue-300'
                }`}>
                  Premium Plan
                </p>
                <p className={`text-xs ${
                  theme === 'light' ? 'text-blue-700' : 'text-blue-400'
                }`}>
                  2.3GB of 100GB used
                </p>
              </div>
            </div>
            <div className={`w-full rounded-full h-1.5 ${
              theme === 'light' ? 'bg-blue-200' : 'bg-blue-900/50'
            }`}>
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-1.5 rounded-full" style={{ width: '2.3%' }}></div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
} 