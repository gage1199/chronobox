import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Plus, Camera, FileText, Mic } from 'lucide-react';
import Button from '../components/ui/Button';

// Create New Memory page - consolidated creation interface for all types of memories
// This replaces scattered create buttons throughout the app

const CreatePage: React.FC = () => {
  return (
    <DashboardLayout pageTitle="Create New Memory">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600">
            Create and preserve your memories for future generations. Choose from videos, photos, 
            written messages, or audio recordings to build your personal legacy.
          </p>
        </div>

        {/* Creation Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          
          {/* Video Memory */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Video Message</h3>
              <p className="text-gray-600 mb-4">
                Record a personal video message to share your thoughts, stories, and wisdom.
              </p>
              <Button className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            </div>
          </div>

          {/* Written Memory */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Written Letter</h3>
              <p className="text-gray-600 mb-4">
                Write a heartfelt letter, share life lessons, or document important memories.
              </p>
              <Button variant="secondary" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Start Writing
              </Button>
            </div>
          </div>

          {/* Audio Memory */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Voice Recording</h3>
              <p className="text-gray-600 mb-4">
                Record your voice telling stories, singing songs, or sharing personal messages.
              </p>
              <Button variant="secondary" className="w-full">
                <Mic className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            </div>
          </div>

          {/* Photo Collection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Photo Collection</h3>
              <p className="text-gray-600 mb-4">
                Upload and organize photos with captions to tell your story visually.
              </p>
              <Button variant="secondary" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-800 mb-3">💡 Creation Tips</h3>
          <div className="space-y-2 text-sm text-amber-700">
            <p>• Consider your audience - who will receive this memory?</p>
            <p>• You can schedule memories to be delivered at future dates</p>
            <p>• Add privacy settings and access controls to your memories</p>
            <p>• Organize memories into collections for easier management</p>
          </div>
        </div>

        {/* Recent Drafts Placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Drafts</h3>
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500">No drafts yet. Start creating your first memory!</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreatePage; 