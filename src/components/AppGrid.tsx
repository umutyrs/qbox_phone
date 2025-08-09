import React from 'react';
import { AppIcon } from './AppIcon';
import { 
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

export const AppGrid: React.FC = () => {
  const apps = [
   { icon: Users, label: 'SocialHub', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
   { icon: Globe, label: 'WebFlow', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
   { icon: MessageCircle, label: 'ChatWave', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
   { icon: Mail, label: 'MailBox', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    
   { icon: Music, label: 'SoundWave', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
   { icon: Calendar, label: 'TimeSync', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
   { icon: MapPin, label: 'NaviGo', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
   { icon: Camera, label: 'SnapLens', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    
   { icon: Clock, label: 'ChronoX', gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)' },
   { icon: Calculator, label: 'MathPro', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
   { icon: Settings, label: 'ControlHub', gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
   { icon: FileText, label: 'NotePad', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
    
   { icon: Image, label: 'Gallery', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
   { icon: Video, label: 'StreamFlix', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
   { icon: Gamepad2, label: 'GameZone', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
   { icon: ShoppingBag, label: 'ShopEase', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
  ];

  return (
    <div className="px-6 py-4 flex-1">
      <div className="grid grid-cols-4 gap-6">
        {apps.map((app, index) => (
          <AppIcon
            key={index}
            icon={app.icon}
            label={app.label}
           color={app.color}
           gradient={app.gradient}
            onClick={() => console.log(`Opened ${app.label}`)}
          />
        ))}
      </div>
    </div>
  );
};