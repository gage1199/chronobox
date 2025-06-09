import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Users, Plus, Calendar, Share2, UserPlus } from 'lucide-react';
import Button from '../components/ui/Button';

// Family Timeline page - where users can invite family members and view shared memories
// This creates a centralized hub for family legacy management

const FamilyPage: React.FC = () => {
  return (
    <DashboardLayout pageTitle="Family Timeline">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600">
            Invite family members and see shared memories. Create a collaborative space where 
            your family can contribute to the legacy and share precious moments together.
          </p>
        </div>

        {/* Family Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">4</p>
                <p className="text-sm text-gray-600">Family Members</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Share2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">15</p>
                <p className="text-sm text-gray-600">Shared Memories</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-gray-600">Upcoming Events</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <UserPlus className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-sm text-gray-600">Pending Invites</p>
              </div>
            </div>
          </div>
        </div>

        {/* Family Members */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Family Members</h3>
            <Button size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Mock family members */}
            {[
              { name: 'Sarah Wilson', role: 'Daughter', status: 'Active', avatar: 'S' },
              { name: 'Michael Wilson', role: 'Son', status: 'Active', avatar: 'M' },
              { name: 'Emma Johnson', role: 'Sister', status: 'Pending', avatar: 'E' },
              { name: 'David Wilson', role: 'Brother', status: 'Active', avatar: 'D' }
            ].map((member, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{member.avatar}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  member.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shared Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Shared Timeline</h3>
            <Button variant="secondary" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Memory
            </Button>
          </div>

          {/* Timeline items */}
          <div className="space-y-6">
            {[
              {
                date: '2024-01-15',
                title: 'Family Reunion 2024',
                author: 'Sarah Wilson',
                type: 'Photos',
                description: 'Shared photos from our amazing family reunion last weekend.'
              },
              {
                date: '2024-01-10',
                title: 'Grandpa\'s Stories',
                author: 'You',
                type: 'Video',
                description: 'Recorded some of grandpa\'s favorite childhood stories.'
              },
              {
                date: '2024-01-05',
                title: 'Holiday Traditions',
                author: 'Michael Wilson',
                type: 'Written',
                description: 'Documented our family holiday traditions for future generations.'
              }
            ].map((item, index) => (
              <div key={index} className="flex space-x-4 pb-6 border-b border-gray-100 last:border-b-0">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>By {item.author}</span>
                    <span>•</span>
                    <span>{item.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invitation Placeholder */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">👨‍👩‍👧‍👦 Invite Your Family</h3>
          <p className="text-blue-700 mb-4">
            Your family legacy is stronger when everyone contributes. Invite family members to:
          </p>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• Share their own memories and photos</p>
            <p>• Add context to family stories and events</p>
            <p>• Collaborate on preserving family history</p>
            <p>• Access shared memories and collections</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FamilyPage; 