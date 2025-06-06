import React from 'react';
import Link from 'next/link';
import { Plus, Library, Calendar, HardDrive } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const DashboardPage: React.FC = () => {
  // Mock data - TODO: Replace with real API calls
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
      <div className="mb-8">
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* My Library Card */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Library className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {mockStats.totalMemories}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            My Library
          </h3>
          <p className="text-gray-600 mb-4">
            {mockStats.totalMemories === 1 ? 'Memory' : 'Memories'} preserved
          </p>
          <Link href="/memories">
            <Button variant="ghost" size="sm" className="w-full">
              View Library
            </Button>
          </Link>
        </Card>

        {/* Life Timeline Card */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {mockStats.pendingMemories}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Life Timeline
          </h3>
          <p className="text-gray-600 mb-4">
            {mockStats.totalMemories === 0 ? 'No memories yet' : 'Active timeline'}
          </p>
          <Link href="/timeline">
            <Button variant="ghost" size="sm" className="w-full">
              View Timeline
            </Button>
          </Link>
        </Card>

        {/* Storage Card */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <HardDrive className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {storagePercentage.toFixed(0)}%
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Storage
          </h3>
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>{mockStats.storageUsed} GB used</span>
              <span>{mockStats.storageTotal} GB total</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full text-amber-600 hover:text-amber-700">
            Upgrade Storage
          </Button>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
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
          <div className="space-y-4">
            {/* Mock recent activities */}
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
            ].map((activity, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Library className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action === 'uploaded' ? 'Uploaded' : 'Scheduled'} "{activity.title}"
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Link href="/memories">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Getting Started Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 border-l-4 border-amber-500">
            <h3 className="font-medium text-gray-900 mb-2">
              Complete Your Profile
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Add trusted contacts and set up your digital legacy preferences.
            </p>
            <Link href="/profile/setup">
              <Button variant="ghost" size="sm">
                Complete Setup
              </Button>
            </Link>
          </Card>

          <Card className="p-4 border-l-4 border-blue-500">
            <h3 className="font-medium text-gray-900 mb-2">
              Upload Your First Memory
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Start building your digital legacy with photos, videos, or written memories.
            </p>
            <Link href="/memories/new">
              <Button variant="ghost" size="sm">
                Create Memory
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage; 