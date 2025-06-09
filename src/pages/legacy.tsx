import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';

// Personal Legacy page - where users can view and manage their personal videos and messages
// This replaces the scattered legacy content from the dashboard

const LegacyPage: React.FC = () => {
  return (
    <DashboardLayout pageTitle="Personal Legacy">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600">
            Your personal videos and messages left for you. Create, organize, and schedule content 
            that tells your story and preserves your memories for future generations.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <span className="text-2xl">📹</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Video Messages</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">💌</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-sm text-gray-600">Written Letters</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-gray-600">Scheduled</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-600">Collections</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="max-w-md mx-auto">
            <span className="text-6xl mb-4 block">📖</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Your Legacy Collection
            </h3>
            <p className="text-gray-600 mb-6">
              This is where you'll manage all your personal legacy content. Videos, messages, 
              letters, and memories that tell your unique story.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Organize memories by life events</p>
              <p>• Schedule messages for future delivery</p>
              <p>• Create collections for different recipients</p>
              <p>• Set privacy levels and access permissions</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LegacyPage; 