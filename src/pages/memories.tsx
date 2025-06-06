import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Grid, 
  List, 
  Search, 
  Filter, 
  Plus, 
  Video, 
  FileText, 
  Music, 
  Camera,
  Calendar,
  Tag
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

// Mock memory data - TODO: Replace with API calls
const mockMemories = [
  {
    id: '1',
    type: 'video',
    title: 'Wedding Day Reflections',
    description: 'Capturing the most beautiful day of our lives...',
    date: '2023-09-21',
    tags: ['love', 'marriage', 'celebration'],
    thumbnail: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Video',
    duration: '5:42'
  },
  {
    id: '2',
    type: 'story',
    title: 'Letter to Future Self',
    description: 'Thoughts and dreams for who I hope to become...',
    date: '2023-11-07',
    tags: ['personal', 'growth', 'reflection'],
    thumbnail: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Story',
    wordCount: 1250
  },
  {
    id: '3',
    type: 'audio',
    title: 'Grandpa\'s War Stories',
    description: 'Stories from World War II that shaped our family...',
    date: '2023-05-19',
    tags: ['history', 'family', 'heritage'],
    thumbnail: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Audio',
    duration: '12:15'
  }
];

const MemoriesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = ['family', 'love', 'celebration', 'personal', 'growth', 'reflection', 'history', 'heritage', 'marriage'];

  const filteredMemories = mockMemories.filter(memory => {
    const matchesSearch = memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => memory.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'story': return FileText;
      case 'audio': return Music;
      case 'photo': return Camera;
      default: return FileText;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'story': return 'bg-blue-100 text-blue-800';
      case 'audio': return 'bg-green-100 text-green-800';
      case 'photo': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout pageTitle="My Library">
      {/* Action Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-gray-600">
            Your personal memory collection ({filteredMemories.length} {filteredMemories.length === 1 ? 'memory' : 'memories'})
          </p>
          
          <div className="flex items-center space-x-2">
            {/* View Toggle */}
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Filter Button */}
            <Button variant="secondary" size="sm" disabled>
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>

            {/* Upload Button */}
            <Link href="/memories/new">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Filter Tags */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Filter by Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`
                  px-3 py-1 rounded-full text-sm font-medium transition-colors
                  focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
                  ${selectedTags.includes(tag)
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
                aria-pressed={selectedTags.includes(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Memory Grid/List */}
      {filteredMemories.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery || selectedTags.length > 0 ? 'No memories found' : 'No memories yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedTags.length > 0 
              ? 'Try adjusting your search or filters'
              : 'Start building your digital legacy by creating your first memory'
            }
          </p>
          {!searchQuery && selectedTags.length === 0 && (
            <Link href="/memories/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Memory
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredMemories.map(memory => {
            const TypeIcon = getTypeIcon(memory.type);
            
            return (
              <Card 
                key={memory.id} 
                className={`
                  hover:shadow-lg transition-shadow cursor-pointer
                  ${viewMode === 'list' ? 'p-4' : 'overflow-hidden'}
                `}
                clickable
                onClick={() => console.log('Navigate to memory:', memory.id)}
              >
                {viewMode === 'grid' ? (
                  <>
                    {/* Thumbnail */}
                    <div className="aspect-video bg-gray-200 relative">
                      <img 
                        src={memory.thumbnail} 
                        alt={memory.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <span className={`
                          px-2 py-1 text-xs font-medium rounded-full capitalize
                          ${getTypeBadgeColor(memory.type)}
                        `}>
                          {memory.type}
                        </span>
                      </div>
                      {(memory.duration || memory.wordCount) && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {memory.duration || `${memory.wordCount} words`}
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                        {memory.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {memory.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(memory.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Tag className="w-3 h-3" />
                          <span>{memory.tags.length}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {memory.tags.slice(0, 2).map(tag => (
                          <span 
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {memory.tags.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{memory.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TypeIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {memory.title}
                        </h3>
                        <span className={`
                          px-2 py-1 text-xs font-medium rounded-full capitalize flex-shrink-0
                          ${getTypeBadgeColor(memory.type)}
                        `}>
                          {memory.type}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate mb-2">
                        {memory.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(memory.date).toLocaleDateString()}
                          </div>
                          {(memory.duration || memory.wordCount) && (
                            <span>
                              {memory.duration || `${memory.wordCount} words`}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex space-x-1">
                          {memory.tags.slice(0, 3).map(tag => (
                            <span 
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MemoriesPage; 