import React from 'react';
import Link from 'next/link';
import { Plus, Library, Calendar, HardDrive, Video, CalendarDays } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
// Added new reusable components for better UI consistency and accessibility
import SummaryCard from '../components/ui/SummaryCard';
import CollapsibleTip from '../components/ui/CollapsibleTip';

const DashboardPage: React.FC = () => {
  // Mock data - TODO: Replace with real API calls
  // Dashboard refactored for improved accessibility and UI consistency:
  // - Summary cards now use reusable SummaryCard component with proper ARIA labels
  // - Recent activity uses proper list structure with semantic icons
  // - Getting started tips converted to collapsible components
  // - Responsive grid layout with proper breakpoints (sm:, lg:)
  const mockStats = {
    totalMemories: 3,
    storageUsed: 6.5,
    storageTotal: 10,
    pendingMemories: 1
  };

  const storagePercentage = (mockStats.storageUsed / mockStats.storageTotal) * 100;

  return (
    <DashboardLayout pageTitle="Welcome, John">
      {/* Quick Actions */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
          <Link href="/memories/new">
            <Button size="lg" className="w-full sm:w-auto px-8">
              <Plus className="w-5 h-5 mr-2" />
              Create Memory
            </Button>
          </Link>
          <Link href="/profile/setup">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
              Complete Setup
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards - Refactored to use reusable SummaryCard component */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"
        aria-live="polite"
        aria-label="Dashboard summary statistics"
      >
        <SummaryCard
          title="My Library"
          value={mockStats.totalMemories}
          subtext={`${mockStats.totalMemories === 1 ? 'Memory' : 'Memories'} preserved`}
          actionLabel="View Library"
          actionHref="/memories"
          icon={Library}
        />

        <SummaryCard
          title="Life Timeline"
          value={mockStats.pendingMemories}
          subtext={mockStats.totalMemories === 0 ? 'No memories yet' : 'Active timeline'}
          actionLabel="View Timeline"
          actionHref="/timeline"
          icon={Calendar}
        />

        <SummaryCard
          title="Storage"
          value={`${storagePercentage.toFixed(0)}%`}
          subtext=""
          actionLabel="Upgrade Storage"
          actionHref="/profile/storage"
          icon={HardDrive}
          showProgressBar={true}
          progressValue={storagePercentage}
          progressMax={100}
          storageUsed={mockStats.storageUsed}
          storageTotal={mockStats.storageTotal}
        />
      </div>

      {/* Recent Activity */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Recent Activity
        </h2>
        
        {mockStats.totalMemories === 0 ? (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Library className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No memories yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start preserving your legacy by creating your first memory
            </p>
            <Link href="/memories/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Memory
              </Button>
            </Link>
          </Card>
        ) : (
          <ul className="space-y-4" role="list" aria-label="Recent activity list">
            {/* Mock recent activities with proper icons and accessibility */}
            {[
              {
                type: 'memory',
                title: 'Wedding Day Reflections',
                action: 'uploaded',
                time: '2 hours ago'
              },
              {
                type: 'memory',
                title: 'Letter to Future Self',
                action: 'scheduled',
                time: '1 day ago'
              }
            ].map((activity, index) => {
              const ActivityIcon = activity.action === 'uploaded' ? Video : CalendarDays;
              const iconColorClass = activity.action === 'uploaded' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600';
              
              return (
                <li key={index}>
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColorClass}`}>
                        <ActivityIcon className="w-5 h-5" aria-hidden="true" />
                        <span className="sr-only">
                          {activity.action === 'uploaded' ? 'Video upload' : 'Scheduled memory'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action === 'uploaded' ? 'Uploaded' : 'Scheduled'} "{activity.title}"
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <Link href="/memories">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="min-h-12 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          View
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Getting Started Tips - Converted to collapsible components */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Getting Started Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CollapsibleTip
            title="Complete Your Profile"
            description="Add trusted contacts and set up your digital legacy preferences."
            actionLabel="Complete Setup"
            actionHref="/profile/setup"
            isCompleted={false}
            borderColor="border-amber-500"
          />

          <CollapsibleTip
            title="Upload Your First Memory"
            description="Start building your digital legacy with photos, videos, or written memories."
            actionLabel="Create Memory"
            actionHref="/memories/new"
            isCompleted={mockStats.totalMemories > 0}
            borderColor="border-blue-500"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage; 