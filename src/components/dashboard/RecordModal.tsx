import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface RecordModalProps {
  onClose: () => void;
  onMemoryCreated?: () => void;
}

type RecordType = 'video' | 'audio' | 'photo' | 'story';

export default function RecordModal({ onClose, onMemoryCreated }: RecordModalProps) {
  const [selectedType, setSelectedType] = useState<RecordType>('story');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [privacyOption, setPrivacyOption] = useState<'private' | 'family' | 'scheduled'>('private');
  const [releaseDate, setReleaseDate] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [sharedUsers, setSharedUsers] = useState<string[]>([]);

  const recordTypes = [
    {
      type: 'story' as RecordType,
      name: 'Written Story',
      icon: '📝',
      description: 'Write your thoughts and memories',
      color: 'from-green-500 to-green-600'
    },
    {
      type: 'video' as RecordType,
      name: 'Video Message',
      icon: '🎥',
      description: 'Upload a video message',
      color: 'from-purple-500 to-purple-600'
    },
    {
      type: 'audio' as RecordType,
      name: 'Voice Recording',
      icon: '🎵',
      description: 'Upload an audio recording',
      color: 'from-pink-500 to-pink-600'
    },
    {
      type: 'photo' as RecordType,
      name: 'Photo Memory',
      icon: '📷',
      description: 'Upload photos with captions',
      color: 'from-blue-500 to-blue-600'
    }
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'video/*': ['.mp4', '.webm', '.mov', '.avi'],
      'audio/*': ['.mp3', '.wav', '.m4a', '.aac'],
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    }
  });

  const uploadFile = async (file: File): Promise<string> => {
    try {
      // Get upload URL from API
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size,
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, key } = await uploadResponse.json();

      // Upload file to S3
      const uploadToS3 = new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            // Return the S3 URL (without query params)
            const s3Url = uploadUrl.split('?')[0];
            resolve(s3Url);
          } else {
            reject(new Error('Upload failed'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

      return await uploadToS3;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your memory');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      let contentUrl = '';
      
      // Upload file if one is selected
      if (selectedFile && selectedType !== 'story') {
        contentUrl = await uploadFile(selectedFile);
      }

      // Create memory via API
      const memoryData = {
        title: title.trim(),
        description: description.trim(),
        type: selectedType,
        content: contentUrl,
        releaseAt: releaseDate ? new Date(releaseDate).toISOString() : undefined,
        scheduledFor: scheduledDate ? new Date(scheduledDate).toISOString() : undefined,
        isPublic: privacyOption === 'family',
        sharedWithIds: sharedUsers,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };

      const response = await fetch('/api/memories/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memoryData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create memory');
      }

      // Success! Close modal and refresh data
      onMemoryCreated?.();
      onClose();
      
      // Reset form
      setTitle('');
      setDescription('');
      setTags('');
      setSelectedFile(null);
      setSelectedType('story');

    } catch (error) {
      console.error('Error creating memory:', error);
      alert(error instanceof Error ? error.message : 'Failed to create memory');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Create New Memory</h2>
              <p className="text-slate-300 mt-1">Capture and preserve your precious moments</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              disabled={isUploading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          
          {/* Memory Type Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Choose Memory Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recordTypes.map((type) => (
                <button
                  key={type.type}
                  onClick={() => setSelectedType(type.type)}
                  disabled={isUploading}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 text-center
                    ${selectedType === type.type
                      ? 'border-amber-500 bg-amber-50 shadow-lg'
                      : 'border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
                    }
                    ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className={`
                    w-12 h-12 bg-gradient-to-br ${type.color} 
                    rounded-xl flex items-center justify-center mx-auto mb-3
                  `}>
                    <span className="text-2xl">{type.icon}</span>
                  </div>
                  <h4 className="font-semibold text-slate-800 text-sm mb-1">{type.name}</h4>
                  <p className="text-xs text-slate-600">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Side - Content Input */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                {selectedType === 'story' ? 'Write Your Story' :
                 selectedType === 'video' ? 'Upload Video' :
                 selectedType === 'audio' ? 'Upload Audio' :
                 'Upload Photos'}
              </h3>

              {selectedType === 'story' && (
                <div className="space-y-4">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Share your thoughts, memories, or message..."
                    className="w-full h-64 p-4 border border-slate-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                    disabled={isUploading}
                  />
                  <div className="text-sm text-slate-500">
                    {description.length} characters
                  </div>
                </div>
              )}

              {selectedType !== 'story' && (
                <div
                  {...getRootProps()}
                  className={`
                    bg-slate-100 rounded-xl p-8 text-center border-2 border-dashed cursor-pointer transition-all
                    ${isDragActive ? 'border-amber-500 bg-amber-50' : 'border-slate-300 hover:border-amber-400'}
                    ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <input {...getInputProps()} disabled={isUploading} />
                  
                  {selectedFile ? (
                    <div className="space-y-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-4xl">✓</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{selectedFile.name}</p>
                        <p className="text-sm text-slate-600">{formatFileSize(selectedFile.size)}</p>
                      </div>
                      {!isUploading && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                          }}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove file
                        </button>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="w-24 h-24 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">
                          {selectedType === 'video' ? '🎥' : 
                           selectedType === 'audio' ? '🎵' : '📷'}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-4">
                        {isDragActive 
                          ? 'Drop the file here...'
                          : `Drag and drop your ${selectedType} here, or click to select`
                        }
                      </p>
                      <p className="text-sm text-slate-500">
                        {selectedType === 'video' && 'Supports MP4, WebM, MOV, AVI (max 500MB)'}
                        {selectedType === 'audio' && 'Supports MP3, WAV, M4A, AAC (max 50MB)'}
                        {selectedType === 'photo' && 'Supports JPEG, PNG, GIF, WebP (max 50MB)'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      {selectedType === 'story' ? 'Creating memory...' : 'Uploading...'}
                    </span>
                    <span className="text-sm text-slate-500">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Memory Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your memory a meaningful title..."
                  className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                  disabled={isUploading}
                />
              </div>

              {selectedType !== 'story' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add context or additional thoughts..."
                    rows={4}
                    className="w-full p-3 border border-slate-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                    disabled={isUploading}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="family, celebration, milestone (comma separated)"
                  className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                  disabled={isUploading}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Use tags to organize and find your memories easily
                </p>
              </div>

              {/* Release Scheduling */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-800 mb-3">📅 Release Schedule</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Release Date (optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={releaseDate}
                      onChange={(e) => setReleaseDate(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                      disabled={isUploading}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Memory will be hidden until this date
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy & Sharing Settings */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-800 mb-3">🔒 Privacy & Sharing</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="privacy" 
                      value="private"
                      checked={privacyOption === 'private'}
                      onChange={() => setPrivacyOption('private')}
                      className="text-amber-600"
                      disabled={isUploading}
                    />
                    <span className="text-sm text-slate-700">Private (only you)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="privacy" 
                      value="family"
                      checked={privacyOption === 'family'}
                      onChange={() => setPrivacyOption('family')}
                      className="text-amber-600"
                      disabled={isUploading}
                    />
                    <span className="text-sm text-slate-700">Share with family/connections</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="privacy" 
                      value="scheduled"
                      checked={privacyOption === 'scheduled'}
                      onChange={() => setPrivacyOption('scheduled')}
                      className="text-amber-600"
                      disabled={isUploading}
                    />
                    <span className="text-sm text-slate-700">Schedule for future delivery</span>
                  </label>
                  
                  {/* Future Delivery Options */}
                  {privacyOption === 'scheduled' && (
                    <div className="ml-6 mt-3 p-3 bg-white rounded-lg border border-slate-200">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Delivery Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                        disabled={isUploading}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Memory will be delivered to recipients at this time
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Encryption Status */}
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-600">🔐</span>
                  <div>
                    <h4 className="font-semibold text-emerald-800 text-sm">Encrypted Storage</h4>
                    <p className="text-xs text-emerald-700">
                      All uploads are encrypted at rest using AWS KMS
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <div className="flex space-x-3">
            <button 
              className="px-6 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUploading}
            >
              Save as Draft
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || isUploading || (selectedType !== 'story' && !selectedFile)}
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isUploading ? 'Creating...' : 'Create Memory'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 