import React from 'react';
import { AppIcon } from './AppIcon';
import { Phone, MessageCircle, Globe, Music } from 'lucide-react';

export const DockBar: React.FC = () => {
  const dockApps = [
   { icon: Phone, label: 'CallLink', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
   { icon: MessageCircle, label: 'ChatWave', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
   { icon: Globe, label: 'WebFlow', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
   { icon: Music, label: 'SoundWave', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }
  ];

  return (
    <div className="px-6 pb-8 pt-4">
      <div className="bg-white/20 backdrop-blur-md rounded-3xl px-4 py-3">
        <div className="flex justify-around items-center">
          {dockApps.map((app, index) => (
            <AppIcon
              key={index}
              icon={app.icon}
              label=""
             gradient={app.gradient}
              size="medium"
              onClick={() => console.log(`Opened ${app.label} from dock`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};