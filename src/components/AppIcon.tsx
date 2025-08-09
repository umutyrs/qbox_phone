import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface AppIconProps {
  icon: LucideIcon;
  label: string;
  color: string;
 gradient?: string;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const AppIcon: React.FC<AppIconProps> = ({ 
  icon: Icon, 
  label, 
  color, 
 gradient,
  onClick,
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20'
  };

  const iconSizes = {
    small: 24,
    medium: 32,
    large: 40
  };

  return (
    <div 
      className="flex flex-col items-center space-y-2 cursor-pointer group"
      onClick={onClick}
    >
      <div 
       className={`${sizeClasses[size]} rounded-2xl shadow-lg flex items-center justify-center transform transition-all duration-200 group-hover:scale-110 group-active:scale-95 relative overflow-hidden`}
       style={{ 
         background: gradient || color,
         boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
       }}
      >
       {/* Subtle inner glow */}
       <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
        <Icon 
          size={iconSizes[size]} 
         className="text-white drop-shadow-lg relative z-10" 
        />
      </div>
      <span className="text-white text-xs font-medium text-center leading-tight max-w-16 truncate">
        {label}
      </span>
    </div>
  );
};