import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Heart, Shuffle, Repeat } from 'lucide-react';
import { AppProps } from '../../types/App';

export const SoundWaveApp: React.FC<AppProps> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(180); // 3 minutes

  const currentSong = {
    title: 'Digital Dreams',
    artist: 'Neon Waves',
    album: 'Synthwave Collection',
    cover: '🎵'
  };

  const playlist = [
    { title: 'Digital Dreams', artist: 'Neon Waves', duration: '3:00' },
    { title: 'Midnight Drive', artist: 'Retro Future', duration: '4:15' },
    { title: 'Electric Pulse', artist: 'Cyber Sound', duration: '3:45' },
    { title: 'Neon Lights', artist: 'Synthwave Pro', duration: '5:20' }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev < duration ? prev + 1 : 0);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-800 to-red-900 z-50 flex flex-col text-white">
      {/* Header */}
      <div className="p-4 pt-12">
        <div className="flex items-center justify-between">
          <button onClick={onClose}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-semibold">SoundWave</h1>
          <button>
            <Heart size={24} />
          </button>
        </div>
      </div>

      {/* Album Art */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="w-64 h-64 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-3xl shadow-2xl flex items-center justify-center text-8xl mb-8 transform rotate-1">
          {currentSong.cover}
        </div>

        {/* Song Info */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">{currentSong.title}</h2>
          <p className="text-lg text-white/80 mb-1">{currentSong.artist}</p>
          <p className="text-sm text-white/60">{currentSong.album}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-6">
          <div className="flex justify-between text-sm text-white/60 mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1">
            <div 
              className="bg-white rounded-full h-1 transition-all duration-1000"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-8 mb-8">
          <button className="text-white/60">
            <Shuffle size={24} />
          </button>
          <button className="text-white">
            <SkipBack size={32} />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-purple-900"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button className="text-white">
            <SkipForward size={32} />
          </button>
          <button className="text-white/60">
            <Repeat size={24} />
          </button>
        </div>
      </div>

      {/* Playlist */}
      <div className="bg-black/20 backdrop-blur-sm rounded-t-3xl p-6 max-h-64 overflow-y-auto">
        <h3 className="font-semibold mb-4">Up Next</h3>
        {playlist.map((song, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">{song.title}</p>
              <p className="text-sm text-white/60">{song.artist}</p>
            </div>
            <span className="text-sm text-white/60">{song.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
};