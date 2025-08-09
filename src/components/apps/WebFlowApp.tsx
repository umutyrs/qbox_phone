import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Share, Bookmark, MoreHorizontal } from 'lucide-react';
import { AppProps } from '../../types/App';

export const WebFlowApp: React.FC<AppProps> = ({ onClose }) => {
  const [url, setUrl] = useState('https://techflow.dev');
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-4 pt-12">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onClose}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-semibold">WebFlow</h1>
          <div className="flex space-x-3">
            <button onClick={handleRefresh}>
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button><Share size={20} /></button>
            <button><MoreHorizontal size={20} /></button>
          </div>
        </div>
        
        {/* URL Bar */}
        <div className="bg-white/20 rounded-full px-4 py-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-transparent text-white placeholder-white/70 outline-none"
            placeholder="Search or enter website URL"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {/* Simulated Website */}
        <div className="bg-white">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 text-white p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">TechFlow</h1>
            <p className="text-lg opacity-90 mb-6">The Future of Technology</p>
            <button className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold">
              Get Started
            </button>
          </div>
          
          {/* Content Sections */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Latest Articles</h2>
            
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-white font-bold">
                    {i}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {i === 1 ? 'Mobile Development Trends' : 
                       i === 2 ? 'React Best Practices' : 
                       'Future of Web Design'}
                    </h3>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  {i === 1 ? 'Exploring the latest trends in mobile app development and what developers should focus on...' :
                   i === 2 ? 'Learn the best practices for building scalable React applications with modern tools...' :
                   'Discover the emerging trends that will shape the future of web design and user experience...'}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">5 min read</span>
                  <button className="text-blue-500 text-sm font-medium">Read More</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex justify-around">
          <button className="text-gray-600">🏠</button>
          <button className="text-gray-600">📚</button>
          <button className="text-gray-600"><Bookmark size={20} /></button>
          <button className="text-gray-600">⚙️</button>
        </div>
      </div>
    </div>
  );
};