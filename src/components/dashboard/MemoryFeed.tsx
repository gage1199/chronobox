import { useState, useEffect, useMemo } from 'react';
import MemoryCard from './MemoryCard';

interface Memory {
  id: string;
  title: string;
  description: string;
  type: 'photo' | 'video' | 'story' | 'audio';
  date: string;
  thumbnail?: string;
  tags: string[];
  isThisDay?: boolean;
}

interface MemoryFeedProps {
  memories: Memory[];
  viewMode: 'grid' | 'list';
  searchQuery: string;
  selectedFilters: {
    photos: boolean;
    videos: boolean;
    stories: boolean;
    audio: boolean;
  };
  onMemoryAction: (action: string, memory: Memory) => void;
}

// Mock data for demonstration
const mockMemories: Memory[] = [
  {
    id: '1',
    title: 'Family Reunion 2023',
    description: 'Amazing gathering with everyone after 5 years apart',
    type: 'photo',
    date: '2023-07-15',
    thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=300&h=200&fit=crop',
    tags: ['family', 'reunion', 'celebration'],
    isThisDay: true
  },
  {
    id: '2',
    title: 'Wedding Day Reflections',
    description: 'A heartfelt message for our 25th anniversary',
    type: 'video',
    date: '2023-09-22',
    thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&h=200&fit=crop',
    tags: ['love', 'marriage', 'milestone']
  },
  {
    id: '3',
    title: 'Letter to Future Self',
    description: 'Thoughts and dreams for the person I will become in 10 years',
    type: 'story',
    date: '2023-11-08',
    tags: ['personal', 'growth', 'future']
  },
  {
    id: '4',
    title: 'Grandpa\'s War Stories',
    description: 'Audio recording of grandpa sharing his military experiences',
    type: 'audio',
    date: '2023-05-20',
    tags: ['history', 'family', 'stories']
  }
];

const mockTags = ['family', 'love', 'celebration', 'milestone', 'personal', 'growth', 'history', 'stories', 'reunion', 'future'];

export default function MemoryFeed({
  memories,
  viewMode,
  searchQuery,
  selectedFilters,
  onMemoryAction
}: MemoryFeedProps) {
  const [displayMemories, setDisplayMemories] = useState<Memory[]>([]);
  const [thisDayMemories, setThisDayMemories] = useState<Memory[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Use mock data if no real memories provided
  const allMemories = memories.length > 0 ? memories : mockMemories;

  // Filter memories based on search, filters, and tags
  const filteredMemories = useMemo(() => {
    let filtered = allMemories.filter(memory => {
      // Search filter
      if (searchQuery && !memory.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !memory.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Type filter
      const typeMap: {[key: string]: keyof typeof selectedFilters} = {
        'photo': 'photos',
        'video': 'videos', 
        'story': 'stories',
        'audio': 'audio'
      };
      
      if (!selectedFilters[typeMap[memory.type]]) {
        return false;
      }

      // Tag filter
      if (selectedTags.length > 0 && !selectedTags.some(tag => memory.tags.includes(tag))) {
        return false;
      }

      return true;
    });

    return filtered;
  }, [allMemories, searchQuery, selectedFilters, selectedTags]);

  useEffect(() => {
    // Separate this day memories
    const thisDay = filteredMemories.filter(memory => memory.isThisDay);
    const regular = filteredMemories.filter(memory => !memory.isThisDay);
    
    setThisDayMemories(thisDay);
    setDisplayMemories(regular);
  }, [filteredMemories]);

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  return (
    <div className="px-8 py-6 space-y-8">
      {/* On This Day Section */}
      {thisDayMemories.length > 0 && (
        <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200/50">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">On This Day</h2>
              <p className="text-slate-600">Memories from years past</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {thisDayMemories.map(memory => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                viewMode="grid"
                onAction={onMemoryAction}
                isThisDay={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* Tag Cloud */}
      <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Filter by Tags</h3>
          {selectedTags.length > 0 && (
            <button
              onClick={clearAllTags}
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {mockTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${selectedTags.includes(tag)
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-800'
                }
              `}
            >
              #{tag}
            </button>
          ))}
        </div>

        {selectedTags.length > 0 && (
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800">
              <span className="font-medium">Active filters:</span> {selectedTags.join(', ')}
            </p>
          </div>
        )}
      </section>

      {/* Main Memory Grid/List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Your Memories</h2>
            <p className="text-slate-600">
              {displayMemories.length} {displayMemories.length === 1 ? 'memory' : 'memories'} found
            </p>
          </div>
        </div>

        {displayMemories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No memories found</h3>
            <p className="text-slate-600 mb-6">
              {searchQuery || selectedTags.length > 0 
                ? 'Try adjusting your search or filters'
                : 'Start creating your first memory to see it here'
              }
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200">
              Create Memory
            </button>
          </div>
        ) : (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }
          `}>
            {displayMemories.map(memory => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                viewMode={viewMode}
                onAction={onMemoryAction}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
} 