import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import TopTabs from '../TopTabs';

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  pageTitle 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock user data - TODO: Replace with real authentication
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    initials: 'JD'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile unless opened, visible on large screens */}
      <div className="hidden lg:block">
        <Sidebar 
          isOpen={true} 
          onClose={() => setSidebarOpen(false)} 
        />
      </div>
      
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
      </div>

      {/* Main content area */}
      <div className="lg:ml-64">
        {/* Top navigation */}
        <TopNav 
          onMenuClick={() => setSidebarOpen(true)}
          isSidebarOpen={sidebarOpen}
          user={mockUser}
        />

        {/* Top Tabs - Main navigation for Personal Legacy, Create, Family */}
        <TopTabs />

        {/* Page content - REMOVED ALL EXCESSIVE SPACING */}
        <main className="px-4 py-2 sm:px-6 lg:px-8">
          {pageTitle && (
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {pageTitle}
              </h1>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 