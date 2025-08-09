import React from 'react';
import { AppIcon } from './AppIcon';
import { Phone, MessageCircle, Globe, Music } from 'lucide-react';
import { ChatWaveApp } from './apps/ChatWaveApp';
import { WebFlowApp } from './apps/WebFlowApp';
import { SoundWaveApp } from './apps/SoundWaveApp';

interface DockBarProps {
  onOpenApp: (appComponent: React.ComponentType<{ onClose: () => void }>) => void;
}

export const DockBar: React.FC<DockBarProps> = ({ onOpenApp }) => {
  const dockApps = [
   { icon: Phone, label: 'CallLink', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
   { icon: MessageCircle, label: 'ChatWave', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', component: ChatWaveApp },
   { icon: Globe, label: 'WebFlow', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', component: WebFlowApp },
   { icon: Music, label: 'SoundWave', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', component: SoundWaveApp }
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
              onClick={() => app.component ? onOpenApp(app.component) : console.log(`Opened ${app.label} from dock`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};