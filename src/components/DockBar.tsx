import React from 'react';
import { AppIcon } from './AppIcon';
import { Phone, MessageCircle, Camera, Mail } from 'lucide-react';
import { PhoneApp } from './apps/PhoneApp';
import { MessagesApp } from './apps/MessagesApp';
import { CameraApp } from './apps/CameraApp';
import { MailApp } from './apps/MailApp';

interface DockBarProps {
  onOpenApp: (appComponent: React.ComponentType<{ onClose: () => void }>) => void;
}

export const DockBar: React.FC<DockBarProps> = ({ onOpenApp }) => {
  const dockApps = [
   { icon: Phone, label: 'Phone', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', component: PhoneApp },
   { icon: MessageCircle, label: 'Messages', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', component: MessagesApp },
   { icon: Camera, label: 'Camera', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', component: CameraApp },
   { icon: Mail, label: 'Mail', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', component: MailApp }
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
              onClick={() => app.component ? onOpenApp(app.component) : console.log(`Opened ${app.label} from dock`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};