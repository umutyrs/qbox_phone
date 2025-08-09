import React from 'react';
import { AppIcon } from './AppIcon';
import { Phone, MessageCircle, Camera, Mail } from 'lucide-react';

interface DockBarProps {
  onOpenApp: (appComponent: React.ComponentType<{ onClose: () => void }>) => void;
}

export const DockBar: React.FC<DockBarProps> = ({ onOpenApp }) => {
  const dockApps = [
   { icon: Phone, label: 'Phone', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
   { icon: MessageCircle, label: 'Messages', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
   { icon: Camera, label: 'Camera', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
   { icon: Mail, label: 'Mail', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
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