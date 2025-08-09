import React, { useState } from 'react';
import { StatusBar } from './StatusBar';
import { AppGrid } from './AppGrid';
import { DockBar } from './DockBar';
import { HomeIndicator } from './HomeIndicator';

export const MobilePhone: React.FC = () => {
  const [currentApp, setCurrentApp] = useState<React.ComponentType<{ onClose: () => void }> | null>(null);

  const openApp = (appComponent: React.ComponentType<{ onClose: () => void }>) => {
    setCurrentApp(appComponent);
  };

  const closeApp = () => {
    setCurrentApp(null);
  };

  return (
    <div className="relative">
      {/* Phone Frame - Premium Design */}
      <div className="w-[375px] h-[812px] bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-[3rem] p-1 shadow-2xl mx-auto relative">
        {/* Phone Frame Border */}
        <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-gray-600 via-gray-700 to-gray-900 p-[1px]">
          <div className="w-full h-full rounded-[3rem] bg-gradient-to-b from-gray-800 via-gray-900 to-black" />
        </div>
        
        {/* Camera Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-7 bg-black rounded-b-2xl z-20 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-1.5 bg-gray-800 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
          </div>
        </div>
        
        {/* Side Buttons */}
        <div className="absolute left-0 top-32 w-1 h-12 bg-gray-700 rounded-r-sm"></div>
        <div className="absolute left-0 top-48 w-1 h-8 bg-gray-700 rounded-r-sm"></div>
        <div className="absolute left-0 top-60 w-1 h-8 bg-gray-700 rounded-r-sm"></div>
        <div className="absolute right-0 top-40 w-1 h-16 bg-gray-700 rounded-l-sm"></div>
        
        {/* Screen */}
        <div className="absolute inset-2 rounded-[2.5rem] overflow-hidden bg-black z-10">
          {currentApp ? (
            React.createElement(currentApp, { onClose: closeApp })
          ) : (
            <>
              {/* Dynamic Background */}
              <div 
                className="absolute inset-0 opacity-80"
                style={{
                  background: `
                    radial-gradient(ellipse at 30% 20%, rgba(120, 119, 198, 0.8) 0%, transparent 50%),
                    radial-gradient(ellipse at 70% 80%, rgba(255, 119, 198, 0.6) 0%, transparent 50%),
                    radial-gradient(ellipse at 20% 70%, rgba(119, 198, 255, 0.7) 0%, transparent 50%),
                    linear-gradient(135deg, 
                      #667eea 0%, 
                      #764ba2 25%, 
                      #f093fb 50%, 
                      #f5576c 75%, 
                      #4facfe 100%
                    )
                  `
                }}
              />
              
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/20" />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Status Bar */}
                <StatusBar className="pt-3" />
                
                {/* Main Content */}
                <AppGrid onOpenApp={openApp} />
                
                {/* Dock */}
                <DockBar onOpenApp={openApp} />
                
                {/* Home Indicator */}
                <HomeIndicator />
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Enhanced Reflection Effect */}
      <div className="w-[375px] h-24 mx-auto mt-1 bg-gradient-to-b from-gray-900/30 via-gray-800/20 to-transparent rounded-b-[3rem] blur-xl transform scale-95 opacity-60" />
      <div className="w-[320px] h-16 mx-auto -mt-20 bg-gradient-to-b from-gray-700/20 to-transparent rounded-b-[2rem] blur-lg transform scale-90 opacity-40" />
    </div>
  );
};