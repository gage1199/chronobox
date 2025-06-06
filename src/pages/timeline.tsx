import React, { useState } from 'react';
import { Calendar, ChevronDown, Filter, Eye } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// Mock timeline data - TODO: Replace with API calls
const mockTimelineData = [
  {
    year: 2023,
    memories: [
      {
        id: '1',
        title: 'Wedding Day Reflections',
        date: '2023-09-21',
        type: 'video',
        thumbnail: 'https://via.placeholder.com/150x100/f59e0b/ffffff?text=Video'
      },
      {
        id: '2',
        title: 'Letter to Future Self',
        date: '2023-11-07',
        type: 'story',
        thumbnail: 'https://via.placeholder.com/150x100/3b82f6/ffffff?text=Story'
      },
      {
        id: '3',
        title: 'Grandpa\'s War Stories',
        date: '2023-05-19',
        type: 'audio',
        thumbnail: 'https://via.placeholder.com/150x100/10b981/ffffff?text=Audio'
      }
    ]
  },
  {
    year: 2022,
    memories: [
      {
        id: '4',
        title: 'Family Vacation Memories',
        date: '2022-07-15',
        type: 'photo',
        thumbnail: 'https://via.placeholder.com/150x100/8b5cf6/ffffff?text=Photo'
      }
    ]
  }
];

const TimelinePage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showYearFilter, setShowYearFilter] = useState(false);

  const allYears = mockTimelineData.map(item => item.year).sort((a, b) => b - a);
  const filteredData = selectedYear 
    ? mockTimelineData.filter(item => item.year === selectedYear)
    : mockTimelineData;

  const totalMemories = mockTimelineData.reduce((total, yearData) => total + yearData.memories.length, 0);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'story': return 'bg-blue-100 text-blue-800';
      case 'audio': return 'bg-green-100 text-green-800';
      case 'photo': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (totalMemories === 0) {
    return (
      <DashboardLayout pageTitle="Your Life Timeline">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No memories yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start creating memories to see your timeline come to life
          </p>
          <Button onClick={() => window.location.href = '/memories/new'}>
            Create Your First Memory
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Your Life Timeline">
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          A chronological journey through your memories ({totalMemories} memories across {allYears.length} years)
        </p>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative">
            <Button
              variant="secondary"
              onClick={() => setShowYearFilter(!showYearFilter)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>{selectedYear ? selectedYear : 'All Years'}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
            
            {showYearFilter && (
              <>
                <div 
                  className="fixed inset-0 z-30"
                  onClick={() => setShowYearFilter(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setSelectedYear(null);
                        setShowYearFilter(false);
                      }}
                      className={`
                        w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors
                        ${!selectedYear ? 'bg-amber-50 text-amber-700' : 'text-gray-700'}
                      `}
                    >
                      All Years
                    </button>
                    {allYears.map(year => (
                      <button
                        key={year}
                        onClick={() => {
                          setSelectedYear(year);
                          setShowYearFilter(false);
                        }}
                        className={`
                          w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors
                          ${selectedYear === year ? 'bg-amber-50 text-amber-700' : 'text-gray-700'}
                        `}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {selectedYear && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedYear(null)}
            >
              Clear Filter
            </Button>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {filteredData.map(yearData => (
          <div key={yearData.year} className="relative">
            {/* Year Header */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {String(yearData.year).slice(-2)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{yearData.year}</h2>
                <p className="text-gray-600">
                  {yearData.memories.length} {yearData.memories.length === 1 ? 'memory' : 'memories'}
                </p>
              </div>
            </div>

            {/* Memories Grid */}
            <div className="ml-6 pl-6 border-l-2 border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
                {yearData.memories.map(memory => (
                  <Card 
                    key={memory.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    clickable
                    onClick={() => console.log('Navigate to memory:', memory.id)}
                  >
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
                          ${getTypeColor(memory.type)}
                        `}>
                          {memory.type}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                        {memory.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(memory.date).toLocaleDateString()}</span>
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && selectedYear && (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No memories found for {selectedYear}
          </h3>
          <p className="text-gray-600 mb-4">
            Try selecting a different year or create new memories
          </p>
          <Button onClick={() => setSelectedYear(null)}>
            View All Years
          </Button>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default TimelinePage; 