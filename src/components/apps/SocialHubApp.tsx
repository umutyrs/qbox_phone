import React, { useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share, MoreHorizontal, Search, Plus } from 'lucide-react';
import { AppProps } from '../../types/App';

export const SocialHubApp: React.FC<AppProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'discover'>('feed');

  const posts = [
    {
      id: 1,
      user: 'Alex Chen',
      avatar: '👨‍💻',
      time: '2h',
      content: 'Just finished building an amazing mobile app! The future is mobile-first 🚀',
      likes: 42,
      comments: 8,
      image: null
    },
    {
      id: 2,
      user: 'Sarah Kim',
      avatar: '👩‍🎨',
      time: '4h',
      content: 'Beautiful sunset from my studio window. Nature is the best designer ✨',
      likes: 128,
      comments: 23,
      image: '🌅'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      avatar: '👨‍🍳',
      time: '6h',
      content: 'Trying out a new recipe today. Cooking is like coding - both need patience and creativity!',
      likes: 67,
      comments: 15,
      image: '🍝'
    }
  ];

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 pt-12">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => onClose?.()} className="p-2">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">SocialHub</h1>
          <button className="p-2">
            <Search size={24} />
          </button>
        </div>

        <div className="flex space-x-6">
          <button
            className={`pb-2 ${activeTab === 'feed' ? 'border-b-2 border-white' : ''}`}
            onClick={() => setActiveTab('feed')}
          >
            Feed
          </button>
          <button
            className={`pb-2 ${activeTab === 'discover' ? 'border-b-2 border-white' : ''}`}
            onClick={() => setActiveTab('discover')}
          >
            Discover
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {posts.map(post => (
          <div key={post.id} className="bg-white mb-2 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white">
                  {post.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{post.user}</h3>
                  <p className="text-sm text-gray-500">{post.time} ago</p>
                </div>
              </div>
              <button>
                <MoreHorizontal size={20} className="text-gray-400" />
              </button>
            </div>

            <p className="text-gray-800 mb-3">{post.content}</p>

            {post.image && (
              <div className="mb-3 h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-6xl">
                {post.image}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-gray-600">
                  <Heart size={20} />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600">
                  <MessageCircle size={20} />
                  <span>{post.comments}</span>
                </button>
              </div>
              <button className="text-gray-600">
                <Share size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button className="absolute bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg flex items-center justify-center">
        <Plus size={24} className="text-white" />
      </button>
    </div>
  );
};
