import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { 
  Home, 
  Library, 
  Share2, 
  Clock, 
  Calendar, 
  FolderOpen, 
  User, 
  LogOut,
  FileText,
  Users,
  ChevronDown
} from 'lucide-react';
import Button from '../ui/Button';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const router = useRouter();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  // Sidebar enhanced with accessibility improvements:
  // - Added aria-current="page" for active nav links
  // - Improved focus states with proper ring colors
  // - User avatar now opens dropdown instead of immediate logout
  // - All clickable elements have minimum height for better tap targets

  // Mock user data - TODO: Replace with real authentication
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    initials: 'JD'
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard Home', icon: Home },
    { href: '/memories', label: 'My Library', icon: Library },
    { href: '/shared', label: 'Shared with Me', icon: Share2 },
    { href: '/scheduled', label: 'Scheduled Messages', icon: Clock },
    { href: '/timeline', label: 'Life Timeline', icon: Calendar },
    { href: '/collections', label: 'Collections', icon: FolderOpen },
    { href: '/profile/setup', label: 'Profile / Setup', icon: User },
  ];

  const legacyItems = [
    { label: 'Digital Will', badge: 'Complete', icon: FileText },
    { label: 'Trusted Contacts', badge: 'Pending', icon: Users },
  ];

  const handleLogout = () => {
    // Call NextAuth signOut function
    signOut({ callbackUrl: '/auth/signin' });
    setIsUserDropdownOpen(false);
  };

  const isActive = (href: string) => router.pathname === href;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ChronoBox</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-12
                  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                  ${isActive(href) 
                    ? 'bg-amber-50 text-amber-700 border-r-2 border-amber-500' 
                    : 'text-gray-700 hover:text-gray-900'
                  }
                `}
                aria-current={isActive(href) ? 'page' : undefined}
                tabIndex={0}
                onClick={onClose}
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </Link>
            ))}

            {/* Legacy Planning Section */}
            <div className="pt-6 mt-6 border-t border-gray-200">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Legacy Planning
              </h3>
              <div className="mt-3 space-y-2">
                {legacyItems.map(({ label, badge, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between px-3 py-2 text-sm text-gray-600"
                  >
                    <div className="flex items-center">
                      <Icon className="w-4 h-4 mr-3" />
                      {label}
                    </div>
                    <span className={`
                      px-2 py-1 text-xs rounded-full
                      ${badge === 'Complete' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                      }
                    `}>
                      {badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Progress */}
            <div className="pt-6 mt-6 border-t border-gray-200">
              <div className="px-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Profile Setup</span>
                  <span className="text-sm text-gray-500">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <Link href="/profile/setup">
                  <Button variant="secondary" size="sm" className="w-full mt-3">
                    Complete Setup
                  </Button>
                </Link>
              </div>
            </div>
          </nav>

          {/* User Profile with Dropdown */}
          <div className="p-4 border-t border-gray-200 relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className={`
                w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-12
                hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              `}
              aria-expanded={isUserDropdownOpen}
              aria-haspopup="true"
              aria-label="User menu"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-medium">
                    {mockUser.initials}
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-gray-900 font-medium">
                    {mockUser.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {mockUser.email}
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isUserDropdownOpen && (
              <>
                {/* Backdrop for mobile */}
                <div 
                  className="fixed inset-0 z-30 lg:hidden"
                  onClick={() => setIsUserDropdownOpen(false)}
                />
                
                {/* Menu */}
                <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors min-h-12 flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        onClose?.();
                      }}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors min-h-12 flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 