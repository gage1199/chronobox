import { useState } from 'react';
import Image from 'next/image';

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

interface MemoryCardProps {
  memory: Memory;
  viewMode: 'grid' | 'list';
  onAction: (action: string, memory: Memory) => void;
  isThisDay?: boolean;
}

const typeIcons = {
  photo: '📷',
  video: '🎥',
  story: '📝',
  audio: '🎵'
};

const typeColors = {
  photo: 'from-blue-500 to-blue-600',
  video: 'from-purple-500 to-purple-600',
  story: 'from-green-500 to-green-600',
  audio: 'from-pink-500 to-pink-600'
};

export default function MemoryCard({ 
  memory, 
  viewMode, 
  onAction, 
  isThisDay = false 
}: MemoryCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (viewMode === 'list') {
    return (
      <div className={`
        bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200/50
        hover:shadow-lg hover:border-amber-300/50 transition-all duration-200
        ${isThisDay ? 'ring-2 ring-amber-200 bg-amber-50/50' : ''}
      `}>
        <div className="flex items-start space-x-4">
          {/* Media Preview */}
          <div className="flex-shrink-0">
            {memory.thumbnail && !imageError ? (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                <Image
                  src={memory.thumbnail}
                  alt={memory.title}
                  fill
                  className="object-cover"
                  onError={handleImageError}
                />
                <div className="absolute top-2 left-2">
                  <span className="text-lg">{typeIcons[memory.type]}</span>
                </div>
              </div>
            ) : (
              <div className={`
                w-20 h-20 bg-gradient-to-br ${typeColors[memory.type]} 
                rounded-lg flex items-center justify-center
              `}>
                <span className="text-3xl">{typeIcons[memory.type]}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-800 mb-1 truncate">
                  {memory.title}
                </h3>
                <p className="text-slate-600 text-sm mb-2 line-clamp-2">
                  {memory.description}
                </p>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-500">
                    {formatDate(memory.date)}
                  </span>
                  <div className="flex space-x-1">
                    {memory.tags.slice(0, 3).map(tag => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                    {memory.tags.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                        +{memory.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onAction('share', memory)}
                  className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  title="Share"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
                <button
                  onClick={() => onAction('edit', memory)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onAction('more', memory)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  title="More options"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div 
      className={`
        group bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/50
        hover:shadow-xl hover:border-amber-300/50 transition-all duration-300 ease-out
        transform hover:-translate-y-1 cursor-pointer
        ${isThisDay ? 'ring-2 ring-amber-200 bg-amber-50/50' : ''}
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Media Section */}
      <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-xl overflow-hidden">
        {memory.thumbnail && !imageError ? (
          <>
            <Image
              src={memory.thumbnail}
              alt={memory.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </>
        ) : (
          <div className={`
            w-full h-full bg-gradient-to-br ${typeColors[memory.type]} 
            flex items-center justify-center
          `}>
            <span className="text-6xl">{typeIcons[memory.type]}</span>
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
            <span>{typeIcons[memory.type]}</span>
            <span className="capitalize">{memory.type}</span>
          </div>
        </div>

        {/* This Day Badge */}
        {isThisDay && (
          <div className="absolute top-3 right-3">
            <div className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              This Day
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={`
          absolute top-3 right-3 flex space-x-2 transition-all duration-200
          ${showActions && !isThisDay ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
        `}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction('share', memory);
            }}
            className="p-2 bg-white/90 text-slate-700 hover:text-amber-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            title="Share"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction('more', memory);
            }}
            className="p-2 bg-white/90 text-slate-700 hover:text-slate-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            title="More options"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 mb-2 line-clamp-1 group-hover:text-amber-700 transition-colors">
          {memory.title}
        </h3>
        <p className="text-slate-600 text-sm mb-3 line-clamp-2">
          {memory.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            {formatDate(memory.date)}
          </span>
          <div className="flex space-x-1">
            {memory.tags.slice(0, 2).map(tag => (
              <span 
                key={tag}
                className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {memory.tags.length > 2 && (
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                +{memory.tags.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 