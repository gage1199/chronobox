import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'audio' | 'photo' | 'story';
  date: string;
  content?: string;
  thumbnail?: string;
}

interface TimelineYear {
  year: number;
  items: TimelineItem[];
}

export default function TimelineViewer() {
  const { data: session } = useSession();
  const [timelineData, setTimelineData] = useState<TimelineYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    if (session) {
      loadTimelineData();
    }
  }, [session]);

  const loadTimelineData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/timeline');
      
      if (response.ok) {
        const data = await response.json();
        const groupedByYear = groupMemoriesByYear(data.timeline);
        setTimelineData(groupedByYear);
      }
    } catch (error) {
      console.error('Failed to load timeline data:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupMemoriesByYear = (memories: TimelineItem[]): TimelineYear[] => {
    const grouped = memories.reduce((acc, memory) => {
      const year = new Date(memory.date).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(memory);
      return acc;
    }, {} as Record<number, TimelineItem[]>);

    return Object.entries(grouped)
      .map(([year, items]) => ({
        year: parseInt(year),
        items: items.sort((a: TimelineItem, b: TimelineItem) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      }))
      .sort((a, b) => b.year - a.year);
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      video: '🎥',
      audio: '🎵',
      photo: '📷',
      story: '📝'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      video: 'from-purple-500 to-purple-600',
      audio: 'from-pink-500 to-pink-600',
      photo: 'from-blue-500 to-blue-600',
      story: 'from-green-500 to-green-600'
    };
    return colors[type as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Timeline Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Your Life Timeline</h1>
        <p className="text-xl text-slate-600">A chronological journey through your memories</p>
      </div>

      {/* Year Navigation */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <button
          onClick={() => setSelectedYear(null)}
          className={`
            px-4 py-2 rounded-full font-medium transition-all duration-200
            ${selectedYear === null
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
              : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-300'
            }
          `}
        >
          All Years
        </button>
        {timelineData.map(({ year }) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`
              px-4 py-2 rounded-full font-medium transition-all duration-200
              ${selectedYear === year
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-300'
              }
            `}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Timeline Content */}
      <div className="relative">
        {/* Central Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 rounded-full"></div>

        {timelineData
          .filter(yearData => selectedYear === null || yearData.year === selectedYear)
          .map(({ year, items }, yearIndex) => (
            <div key={year} className="mb-16">
              {/* Year Header */}
              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-3 rounded-full shadow-xl">
                  <h2 className="text-2xl font-bold">{year}</h2>
                </div>
              </div>

              {/* Timeline Items */}
              <div className="space-y-8">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`
                      relative flex items-center
                      ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}
                    `}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-amber-500 rounded-full z-10"></div>

                    {/* Content Card */}
                    <div
                      className={`
                        w-5/12 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-200/50
                        hover:shadow-xl hover:border-amber-300/50 transition-all duration-300
                        ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'}
                      `}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Type Icon */}
                        <div className={`
                          w-12 h-12 bg-gradient-to-br ${getTypeColor(item.type)} 
                          rounded-xl flex items-center justify-center flex-shrink-0
                        `}>
                          <span className="text-2xl">{getTypeIcon(item.type)}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-slate-800 truncate">
                              {item.title}
                            </h3>
                            <span className="text-sm text-slate-500 font-medium">
                              {formatDate(item.date)}
                            </span>
                          </div>

                          <p className="text-slate-600 text-sm mb-3 line-clamp-3">
                            {item.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className={`
                              px-3 py-1 rounded-full text-xs font-medium capitalize
                              bg-gradient-to-r ${getTypeColor(item.type)} text-white
                            `}>
                              {item.type}
                            </span>

                            <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                              View Details →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Empty State */}
      {timelineData.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📚</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No memories yet</h3>
          <p className="text-slate-600 mb-6">
            Start creating memories to see your timeline come to life
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200">
            Create Your First Memory
          </button>
        </div>
      )}
    </div>
  );
} 