import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, RotateCcw, Image, Video, Zap } from 'lucide-react';
import { AppProps } from '../../types/App';

export const CameraApp: React.FC<AppProps> = ({ onClose }) => {
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('off');
  const [photos, setPhotos] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  // FiveM API calls
  const takePhoto = async () => {
    try {
      const response = await fetch('http://localhost:30120/phone/camera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'player',
          action: 'take_photo',
          flash: flash
        })
      });
      const data = await response.json();
      
      if (data.success) {
        // Add photo to gallery
        setPhotos(prev => [data.photoUrl, ...prev]);
        
        // Show capture animation
        const flashDiv = document.createElement('div');
        flashDiv.className = 'fixed inset-0 bg-white z-50 opacity-80';
        document.body.appendChild(flashDiv);
        setTimeout(() => document.body.removeChild(flashDiv), 100);
      }
    } catch (error) {
      console.error('Failed to take photo:', error);
      // Demo: Add placeholder photo
      const demoPhoto = `https://picsum.photos/400/600?random=${Date.now()}`;
      setPhotos(prev => [demoPhoto, ...prev]);
    }
  };

  const startVideoRecording = async () => {
    try {
      await fetch('http://localhost:30120/phone/camera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'player',
          action: 'start_recording'
        })
      });
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(true); // Demo mode
    }
  };

  const stopVideoRecording = async () => {
    try {
      await fetch('http://localhost:30120/phone/camera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'player',
          action: 'stop_recording'
        })
      });
      setIsRecording(false);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setIsRecording(false); // Demo mode
    }
  };

  const switchCamera = async () => {
    try {
      await fetch('http://localhost:30120/phone/camera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'player',
          action: 'switch_camera'
        })
      });
    } catch (error) {
      console.error('Failed to switch camera:', error);
    }
  };

  const handleCapture = () => {
    if (mode === 'photo') {
      takePhoto();
    } else {
      if (isRecording) {
        stopVideoRecording();
      } else {
        startVideoRecording();
      }
    }
  };

  const cycleFlash = () => {
    const modes: Array<'off' | 'on' | 'auto'> = ['off', 'on', 'auto'];
    const currentIndex = modes.indexOf(flash);
    setFlash(modes[(currentIndex + 1) % modes.length]);
  };

  return (
    <div className="absolute inset-0 bg-black z-50 flex flex-col text-white">
      {/* Camera Viewfinder */}
      <div className="flex-1 relative bg-gray-900">
        {/* Demo camera feed */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-30">📷</div>
        </div>

        {/* Top Controls */}
        <div className="absolute top-12 left-0 right-0 flex justify-between items-center p-4">
          <button onClick={onClose}>
            <ArrowLeft size={24} />
          </button>
          <div className="flex space-x-4">
            <button onClick={cycleFlash} className="p-2">
              <Zap size={20} className={flash === 'on' ? 'text-yellow-400' : 'text-white'} />
              <span className="text-xs block">{flash.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute top-20 right-4 flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-sm">REC</span>
          </div>
        )}

        {/* Focus Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-6 bg-black">
        {/* Mode Selector */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-800 rounded-full p-1">
            <button
              onClick={() => setMode('photo')}
              className={`px-4 py-2 rounded-full text-sm ${
                mode === 'photo' ? 'bg-white text-black' : 'text-white'
              }`}
            >
              PHOTO
            </button>
            <button
              onClick={() => setMode('video')}
              className={`px-4 py-2 rounded-full text-sm ${
                mode === 'video' ? 'bg-white text-black' : 'text-white'
              }`}
            >
              VIDEO
            </button>
          </div>
        </div>

        {/* Capture Controls */}
        <div className="flex justify-between items-center">
          {/* Gallery Preview */}
          <button className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
            {photos.length > 0 ? (
              <img src={photos[0]} alt="Last photo" className="w-full h-full object-cover" />
            ) : (
              <Image size={20} className="text-gray-400" />
            )}
          </button>

          {/* Capture Button */}
          <button
            onClick={handleCapture}
            className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center ${
              isRecording ? 'bg-red-600' : 'bg-transparent'
            }`}
          >
            {mode === 'photo' ? (
              <div className="w-16 h-16 bg-white rounded-full" />
            ) : (
              <div className={`w-6 h-6 ${isRecording ? 'bg-white rounded-sm' : 'bg-red-600 rounded-full'}`} />
            )}
          </button>

          {/* Switch Camera */}
          <button onClick={switchCamera} className="p-3">
            <RotateCcw size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};