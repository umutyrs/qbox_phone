import React from 'react';
import { MobilePhone } from './components/MobilePhone';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-8">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">QBox Mobile</h1>
          <p className="text-gray-400 text-lg">Premium Mobile Interface</p>
        </div>
        
        <MobilePhone />
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Tap any app icon to interact • Realistic iOS-style interface</p>
        </div>
      </div>
    </div>
  );
}

export default App;