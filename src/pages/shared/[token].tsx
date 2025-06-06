import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';

interface Memory {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  createdAt: string;
  owner: {
    name: string;
    email: string;
  };
}

interface ShareLink {
  token: string;
  expiresAt: string;
  createdAt: string;
}

export default function SharedMemory() {
  const router = useRouter();
  const { token } = router.query;
  const [memory, setMemory] = useState<Memory | null>(null);
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token && typeof token === 'string') {
      fetchSharedMemory(token);
    }
  }, [token]);

  const fetchSharedMemory = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shared/${token}`);
      
      if (response.status === 404) {
        setError('This shared link was not found.');
        return;
      }
      
      if (response.status === 410) {
        setError('This shared link has expired.');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to load shared memory');
      }

      const data = await response.json();
      setMemory(data.memory);
      setShareLink(data.shareLink);
    } catch (err) {
      console.error('Error fetching shared memory:', err);
      setError('Failed to load this memory. Please try again.');
    } finally {
      setLoading(false);
    }
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading shared memory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Access Denied</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200"
          >
            Go to Chronobox
          </a>
        </div>
      </div>
    );
  }

  if (!memory || !shareLink) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{memory.title} - Shared Memory | Chronobox</title>
        <meta name="description" content={memory.description} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center overflow-hidden">
                  <Image
                    src="/chronobox-logo.png"
                    alt="Chronobox Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                    Chronobox
                  </h1>
                  <p className="text-xs text-slate-500">Shared Memory</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-500">
                  Expires: {formatDate(shareLink.expiresAt)}
                </span>
                <a
                  href="/"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 text-sm"
                >
                  Create Your Own
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
            
            {/* Memory Header */}
            <div className="p-8 border-b border-slate-200">
              <div className="flex items-start space-x-4">
                <div className={`
                  w-16 h-16 bg-gradient-to-br ${getTypeColor(memory.category)} 
                  rounded-xl flex items-center justify-center flex-shrink-0
                `}>
                  <span className="text-3xl">{getTypeIcon(memory.category)}</span>
                </div>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">
                    {memory.title}
                  </h1>
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span>Shared by {memory.owner.name || memory.owner.email}</span>
                    <span>•</span>
                    <span>{formatDate(memory.createdAt)}</span>
                    <span>•</span>
                    <span className="capitalize">{memory.category}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Memory Content */}
            <div className="p-8">
              {memory.category === 'story' ? (
                <div className="prose prose-slate max-w-none">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                    {memory.description || memory.content}
                  </div>
                </div>
              ) : memory.category === 'video' ? (
                <div className="space-y-6">
                  {memory.description && (
                    <p className="text-slate-700 leading-relaxed">{memory.description}</p>
                  )}
                  <div className="bg-slate-100 rounded-xl overflow-hidden">
                    <video
                      controls
                      className="w-full h-auto"
                      poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjFGNUY5Ii8+CjxwYXRoIGQ9Ik00MDAgMjI1TDM2MCAyMDVWMjQ1TDQwMCAyMjVaIiBmaWxsPSIjNjM3Mzg1Ii8+Cjx0ZXh0IHg9IjQwMCIgeT0iMjcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjM3Mzg1IiBmb250LWZhbWlseT0ic3lzdGVtLXVpIiBmb250LXNpemU9IjE0Ij5WaWRlbzwvdGV4dD4KPHN2Zz4="
                    >
                      <source src={memory.content} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              ) : memory.category === 'audio' ? (
                <div className="space-y-6">
                  {memory.description && (
                    <p className="text-slate-700 leading-relaxed">{memory.description}</p>
                  )}
                  <div className="bg-slate-100 rounded-xl p-6">
                    <audio controls className="w-full">
                      <source src={memory.content} />
                      Your browser does not support the audio tag.
                    </audio>
                  </div>
                </div>
              ) : memory.category === 'photo' ? (
                <div className="space-y-6">
                  {memory.description && (
                    <p className="text-slate-700 leading-relaxed">{memory.description}</p>
                  )}
                  <div className="bg-slate-100 rounded-xl overflow-hidden">
                    <img
                      src={memory.content}
                      alt={memory.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  This memory was shared with you via Chronobox
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-slate-500">
                    Link expires {formatDate(shareLink.expiresAt)}
                  </span>
                  <a
                    href="/"
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Learn more about Chronobox →
                  </a>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
} 