import React from 'react';
import { AppIcon } from './AppIcon';
import { 
  Phone,
  MessageCircle, 
  Camera, 
  Music, 
  Settings, 
  Mail, 
  Calendar,
  MapPin,
  Clock,
  Calculator,
  FileText,
  Image,
 Globe,
 Users,
 Video,
 Zap,
 Gamepad2,
 ShoppingBag,
 Headphones,
 Palette
} from 'lucide-react';
import { CalculatorApp } from './apps/CalculatorApp';

interface AppGridProps {
  onOpenApp: (appComponent: React.ComponentType<{ onClose: () => void }>) => void;
}

export const AppGrid: React.FC<AppGridProps> = ({ onOpenApp }) => {
  const apps = [
   { icon: Phone, label: 'Phone', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
   { icon: MessageCircle, label: 'Messages', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
   { icon: Camera, label: 'Camera', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
   { icon: Mail, label: 'MailBox', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    
   { icon: Calculator, label: 'Calculator', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', component: CalculatorApp },
   { icon: Calendar, label: 'TimeSync', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
   { icon: Clock, label: 'Clock', gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)' },
   { icon: Settings, label: 'Settings', gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' }
  ];

  return (
    <div className="px-6 py-4 flex-1">
      <div className="grid grid-cols-4 gap-6">
        {apps.map((app, index) => (
          <AppIcon
            key={index}
            icon={app.icon}
            label={app.label}
           gradient={app.gradient}
            onClick={() => app.component ? onOpenApp(app.component) : console.log(`Opened ${app.label}`)}
          />
        ))}
      </div>
    </div>
  );
};