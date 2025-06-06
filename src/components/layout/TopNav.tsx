import React, { useState } from 'react';
import { Menu, Sun, Moon, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';

interface TopNavProps {
  onMenuClick: () => void;
  user?: {
    name: string;
    email: string;
    initials: string;
  };
}

const TopNav: React.FC<TopNavProps> = ({ 
  onMenuClick, 
  user = { name: 'John Doe', email: 'john@example.com', initials: 'JD' }
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    console.log('Theme toggled:', !isDarkMode ? 'dark' : 'light');
  };

  const handleLogout = () => {
    console.log('Logout from user menu');
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden p-2"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </Button>

        {/* Page title area (can be customized per page) */}
        <div className="flex-1 lg:ml-0 ml-4">
          {/* This can be populated by individual pages */}
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2 rounded-full"
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </Button>

          {/* User menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
              aria-label="User menu"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
            >
              {/* User avatar */}
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.initials}
                </span>
              </div>
              
              {/* User info (hidden on mobile) */}
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-gray-900">
                  {user.name}
                </div>
                <div className="text-xs text-gray-500 truncate max-w-32">
                  {user.email}
                </div>
              </div>
              
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Button>

            {/* Dropdown menu */}
            {isUserMenuOpen && (
              <>
                {/* Backdrop for mobile */}
                <div 
                  className="fixed inset-0 z-30 sm:hidden"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                
                {/* Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-900 border-b border-gray-100 sm:hidden">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-gray-500 truncate">{user.email}</div>
                    </div>
                    
                    <button
                      onClick={() => {
                        console.log('Profile clicked');
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Profile Settings
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav; 