import React, { useState, useEffect } from 'react';
import { Battery, Wifi, Signal } from 'lucide-react';

interface StatusBarProps {
  className?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ className = '' }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className={`flex justify-between items-center px-6 py-2 text-white ${className}`}>
      <div className="text-sm font-medium">
        {formatTime(currentTime)}
      </div>
      
      <div className="flex items-center space-x-1">
        <Signal size={16} className="text-white" />
        <Wifi size={16} className="text-white" />
        <div className="flex items-center space-x-1">
          <span className="text-xs">100%</span>
          <Battery size={16} className="text-white" />
        </div>
      </div>
    </div>
  );
};