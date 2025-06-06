import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  ArrowLeft, 
  FileText, 
  Video, 
  Music, 
  Camera,
  Calendar,
  Tag,
  Lock,
  Share2
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const NewMemoryPage: React.FC = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    releaseDate: '',
    privacy: 'private'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const memoryTypes = [
    {
      id: 'story',
      name: 'Written Story',
      icon: FileText,
      description: 'Share your thoughts and experiences in writing'
    },
    {
      id: 'video',
      name: 'Video Message',
      icon: Video,
      description: 'Record a personal video message'
    },
    {
      id: 'audio',
      name: 'Voice Recording',
      icon: Music,
      description: 'Capture your voice and stories'
    },
    {
      id: 'photo',
      name: 'Photo Memory',
      icon: Camera,
      description: 'Preserve photos with your story'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedType) {
      newErrors.type = 'Please select a memory type';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Memory title is required';
    }

    if (selectedType === 'story' && !formData.content.trim()) {
      newErrors.content = 'Please write your story';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    // TODO: Replace with actual API call
    console.log('Creating memory:', {
      type: selectedType,
      ...formData
    });
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push('/memories');
    }, 2000);
  };

  const characterCount = formData.content.length;
  const maxCharacters = 5000;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/memories">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Library
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Memory</h1>
          <p className="text-gray-600 mt-2">
            Preserve your thoughts, experiences, and stories for future generations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Choose Memory Type */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Step 1: Choose Memory Type
            </h2>
            {errors.type && (
              <p className="text-red-600 text-sm mb-4" role="alert">
                {errors.type}
              </p>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {memoryTypes.map(type => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`
                      p-4 rounded-lg border-2 transition-all text-left
                      focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
                      ${isSelected
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                    aria-pressed={isSelected}
                  >
                    <Icon className={`w-8 h-8 mb-3 ${
                      isSelected ? 'text-amber-600' : 'text-gray-400'
                    }`} />
                    <h3 className={`font-medium mb-2 ${
                      isSelected ? 'text-amber-900' : 'text-gray-900'
                    }`}>
                      {type.name}
                    </h3>
                    <p className={`text-sm ${
                      isSelected ? 'text-amber-700' : 'text-gray-600'
                    }`}>
                      {type.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Step 2: Memory Details */}
          {selectedType && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Content */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Step 2: Memory Content
                  </h2>
                  
                  {selectedType === 'story' ? (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                          Your Story <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="content"
                          name="content"
                          rows={12}
                          value={formData.content}
                          onChange={handleInputChange}
                          placeholder="Share your thoughts, experiences, and memories..."
                          className={`
                            w-full px-4 py-3 border rounded-lg transition-colors resize-none
                            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                            ${errors.content
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 hover:border-gray-400'
                            }
                          `}
                          aria-invalid={!!errors.content}
                          aria-describedby={errors.content ? "content-error" : "content-help"}
                        />
                        {errors.content && (
                          <p id="content-error" className="text-sm text-red-600 mt-1" role="alert">
                            {errors.content}
                          </p>
                        )}
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span id="content-help">Share your thoughts and experiences</span>
                          <span className={characterCount > maxCharacters ? 'text-red-600' : ''}>
                            {characterCount.toLocaleString()} / {maxCharacters.toLocaleString()} characters
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        {selectedType === 'video' && <Video className="w-8 h-8 text-gray-400" />}
                        {selectedType === 'audio' && <Music className="w-8 h-8 text-gray-400" />}
                        {selectedType === 'photo' && <Camera className="w-8 h-8 text-gray-400" />}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Upload {selectedType === 'video' ? 'Video' : selectedType === 'audio' ? 'Audio' : 'Photo'}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        File upload functionality coming soon
                      </p>
                      <input
                        type="file"
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                        placeholder="Upload (coming soon)"
                      />
                    </div>
                  )}
                </Card>
              </div>

              {/* Right Column - Metadata */}
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Memory Details
                  </h3>
                  
                  <div className="space-y-4">
                    <Input
                      label="Memory Title"
                      name="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      error={errors.title}
                      placeholder="Give your memory a meaningful title..."
                    />

                    <Input
                      label="Tags"
                      name="tags"
                      type="text"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="family, celebration, milestone (comma separated)"
                      helpText="Use tags to organize and find your memories later"
                    />

                    <Input
                      label="Release Date (Optional)"
                      name="releaseDate"
                      type="datetime-local"
                      value={formData.releaseDate}
                      onChange={handleInputChange}
                      helpText="Memory will be hidden until this date"
                    />
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Privacy & Sharing
                  </h3>
                  
                  <fieldset>
                    <legend className="sr-only">Privacy settings</legend>
                    <div className="space-y-3">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="privacy"
                          value="private"
                          checked={formData.privacy === 'private'}
                          onChange={handleRadioChange}
                          className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <Lock className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900">Private (only me)</span>
                          </div>
                          <p className="text-sm text-gray-600">Only you can access this memory</p>
                        </div>
                      </label>
                      
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="privacy"
                          value="shared"
                          checked={formData.privacy === 'shared'}
                          onChange={handleRadioChange}
                          className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <Share2 className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900">Shared with Trusted Contacts</span>
                          </div>
                          <p className="text-sm text-gray-600">Share with your trusted contacts</p>
                        </div>
                      </label>
                    </div>
                  </fieldset>
                </Card>

                {/* Save Button */}
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading || !formData.title.trim()}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Saving Memory...' : 'Save Memory'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
};

export default NewMemoryPage; 