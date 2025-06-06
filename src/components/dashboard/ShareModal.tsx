import { useState } from 'react';

interface Memory {
  id: string;
  title: string;
  description: string;
  type: 'photo' | 'video' | 'story' | 'audio';
  date: string;
  thumbnail?: string;
  tags: string[];
}

interface ShareModalProps {
  memory: Memory;
  onClose: () => void;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  relationship: string;
  avatar?: string;
}

const mockContacts: Contact[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@email.com', relationship: 'Daughter' },
  { id: '2', name: 'Michael Johnson', email: 'mike@email.com', relationship: 'Son' },
  { id: '3', name: 'Emma Wilson', email: 'emma@email.com', relationship: 'Sister' },
  { id: '4', name: 'David Smith', email: 'david@email.com', relationship: 'Friend' },
  { id: '5', name: 'Lisa Brown', email: 'lisa@email.com', relationship: 'Cousin' }
];

export default function ShareModal({ memory, onClose }: ShareModalProps) {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [shareType, setShareType] = useState<'immediate' | 'scheduled' | 'conditional' | 'link'>('immediate');
  const [scheduleDate, setScheduleDate] = useState('');
  const [message, setMessage] = useState('');
  const [linkExpiration, setLinkExpiration] = useState('24');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [permissions, setPermissions] = useState({
    canView: true,
    canComment: false,
    canShare: false,
    canDownload: false
  });

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.relationship.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactToggle = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const generateShareLink = async () => {
    setIsGeneratingLink(true);
    try {
      const response = await fetch('/api/memories/share-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: memory.id,
          expiresInHours: parseInt(linkExpiration)
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedLink(data.shareLink.url);
      } else {
        throw new Error('Failed to generate share link');
      }
    } catch (error) {
      console.error('Error generating share link:', error);
      alert('Failed to generate share link. Please try again.');
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleShare = () => {
    if (shareType === 'link') {
      // Link sharing is handled separately
      return;
    }

    const shareData = {
      memoryId: memory.id,
      contacts: selectedContacts,
      shareType,
      scheduleDate: shareType === 'scheduled' ? scheduleDate : null,
      message,
      permissions
    };
    
    console.log('Sharing memory:', shareData);
    // TODO: Implement actual sharing logic
    onClose();
  };

  const typeIcons = {
    photo: '📷',
    video: '🎥',
    story: '📝',
    audio: '🎵'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Share Memory</h2>
              <p className="text-slate-300 mt-1">Share "{memory.title}" with your loved ones</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          
          {/* Memory Preview */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mb-8 border border-amber-200/50">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">{typeIcons[memory.type]}</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-800 mb-1">{memory.title}</h3>
                <p className="text-slate-600 text-sm mb-2 line-clamp-2">{memory.description}</p>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-500">
                    {new Date(memory.date).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-1">
                    {memory.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Side - Recipients */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Select Recipients</h3>
              
              {/* Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search contacts..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Contact List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredContacts.map(contact => (
                  <label
                    key={contact.id}
                    className={`
                      flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                      ${selectedContacts.includes(contact.id)
                        ? 'bg-amber-50 border border-amber-200'
                        : 'hover:bg-slate-50 border border-transparent'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => handleContactToggle(contact.id)}
                      className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-slate-700">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{contact.name}</p>
                      <p className="text-sm text-slate-500">{contact.relationship} • {contact.email}</p>
                    </div>
                  </label>
                ))}
              </div>

              {selectedContacts.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <span className="font-medium">{selectedContacts.length} recipient(s) selected</span>
                  </p>
                </div>
              )}
            </div>

            {/* Right Side - Share Options */}
            <div className="space-y-6">
              
              {/* Share Type */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Delivery Options</h3>
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="shareType"
                      value="immediate"
                      checked={shareType === 'immediate'}
                      onChange={(e) => setShareType(e.target.value as any)}
                      className="mt-1 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <p className="font-medium text-slate-800">Share Now</p>
                      <p className="text-sm text-slate-600">Recipients will receive access immediately</p>
                    </div>
                  </label>
                  
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="shareType"
                      value="scheduled"
                      checked={shareType === 'scheduled'}
                      onChange={(e) => setShareType(e.target.value as any)}
                      className="mt-1 text-amber-600 focus:ring-amber-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">Schedule Delivery</p>
                      <p className="text-sm text-slate-600 mb-2">Choose when recipients receive this memory</p>
                      {shareType === 'scheduled' && (
                        <input
                          type="datetime-local"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                      )}
                    </div>
                  </label>
                  
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="shareType"
                      value="conditional"
                      checked={shareType === 'conditional'}
                      onChange={(e) => setShareType(e.target.value as any)}
                      className="mt-1 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <p className="font-medium text-slate-800">Conditional Release</p>
                      <p className="text-sm text-slate-600">Release based on specific conditions or events</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Recipient Permissions</h4>
                <div className="space-y-2">
                  {Object.entries(permissions).map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setPermissions(prev => ({
                          ...prev,
                          [key]: e.target.checked
                        }))}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm text-slate-700 capitalize">
                        {key.replace('can', 'Can ').replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Personal Message */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal note to accompany this memory..."
                  rows={4}
                  className="w-full p-3 border border-slate-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <div className="flex space-x-3">
            <button className="px-6 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
              Save as Draft
            </button>
            <button
              onClick={handleShare}
              disabled={selectedContacts.length === 0}
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {shareType === 'immediate' ? 'Share Now' : 
               shareType === 'scheduled' ? 'Schedule Share' : 
               'Set Conditional Share'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 