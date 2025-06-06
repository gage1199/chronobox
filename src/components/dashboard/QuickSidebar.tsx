import { useState } from 'react';

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface QuickSidebarProps {
  user: User | undefined;
  onQuickRecord: () => void;
}

const mockDrafts = [
  {
    id: '1',
    title: 'Birthday Message for Mom',
    type: 'video',
    date: '2 hours ago'
  },
  {
    id: '2',
    title: 'Thank You Note',
    type: 'story',
    date: '1 day ago'
  },
  {
    id: '3',
    title: 'Anniversary Thoughts',
    type: 'audio',
    date: '3 days ago'
  }
];

const typeIcons = {
  video: '🎥',
  story: '📝',
  audio: '🎵',
  photo: '📷'
};

export default function QuickSidebar({ user, onQuickRecord }: QuickSidebarProps) {
  const [showTip, setShowTip] = useState(true);
  const [completionPercentage] = useState(85);
  const [storageUsed] = useState(6.5);
  const [storageTotal] = useState(10);

  const storagePercentage = (storageUsed / storageTotal) * 100;

  const tips = [
    "Try recording a video memory to capture more vivid moments!",
    "Use tags to organize your memories for easy searching later.",
    "Schedule a message for a special anniversary or birthday.",
    "Share memories with family to create collaborative collections.",
    "Set up your digital will to secure your legacy planning."
  ];

  const [currentTip] = useState(tips[0]);

  return (
    <aside className="w-80 bg-white/60 backdrop-blur-sm border-l border-slate-200/50 shadow-lg overflow-y-auto">
      <div className="p-6 space-y-6">
        
        {/* Profile Completion */}
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border border-slate-200/50 shadow-sm">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Profile Setup</h3>
            
            {/* Progress Ring */}
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-200"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionPercentage / 100)}`}
                  className="text-amber-500 transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-slate-800">{completionPercentage}%</span>
              </div>
            </div>
            
            <p className="text-sm text-slate-600">
              Complete your trusted contacts to finish setup
            </p>
            
            <button className="mt-3 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200">
              Complete Setup
            </button>
          </div>
        </div>

        {/* Storage Usage */}
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border border-slate-200/50 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Storage</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Used</span>
              <span className="font-semibold text-slate-800">{storageUsed} GB of {storageTotal} GB</span>
            </div>
            
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  storagePercentage > 80 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                  storagePercentage > 60 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                  'bg-gradient-to-r from-green-400 to-green-500'
                }`}
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{storageTotal - storageUsed} GB available</span>
              <button className="text-amber-600 hover:text-amber-700 font-medium">
                Upgrade
              </button>
            </div>
          </div>
        </div>

        {/* Recent Drafts */}
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border border-slate-200/50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Recent Drafts</h3>
            <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {mockDrafts.map(draft => (
              <div 
                key={draft.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/80 transition-colors cursor-pointer border border-transparent hover:border-amber-200/50"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                  <span className="text-sm">{typeIcons[draft.type as keyof typeof typeIcons]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-slate-800 truncate">
                    {draft.title}
                  </h4>
                  <p className="text-xs text-slate-500">{draft.date}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={onQuickRecord}
            className="w-full mt-4 px-4 py-2 border border-amber-300 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-50 transition-colors"
          >
            + New Draft
          </button>
        </div>

        {/* Tip Card */}
        {showTip && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">💡</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-800 mb-1">Tip</h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {currentTip}
                </p>
              </div>
              <button
                onClick={() => setShowTip(false)}
                className="flex-shrink-0 p-1 text-blue-400 hover:text-blue-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border border-slate-200/50 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
          
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-white/80 transition-colors border border-transparent hover:border-amber-200/50">
              <span className="text-lg">🎯</span>
              <div>
                <p className="text-sm font-medium text-slate-800">Set Legacy Goals</p>
                <p className="text-xs text-slate-500">Plan your digital inheritance</p>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-white/80 transition-colors border border-transparent hover:border-amber-200/50">
              <span className="text-lg">👥</span>
              <div>
                <p className="text-sm font-medium text-slate-800">Invite Family</p>
                <p className="text-xs text-slate-500">Share memories together</p>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-white/80 transition-colors border border-transparent hover:border-amber-200/50">
              <span className="text-lg">🔒</span>
              <div>
                <p className="text-sm font-medium text-slate-800">Privacy Settings</p>
                <p className="text-xs text-slate-500">Control who sees what</p>
              </div>
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
} 