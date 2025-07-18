import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export function Logo({ variant = 'full', size = 'md', className = '', onClick }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16'
  };

  const GiftBoxIcon = ({ className: iconClassName = '' }: { className?: string }) => (
    <svg
      viewBox="0 0 40 40"
      className={iconClassName}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gift box base */}
      <path
        d="M8 15h24v20a2 2 0 01-2 2H10a2 2 0 01-2-2V15z"
        fill="url(#giftGradient1)"
        stroke="url(#giftStroke)"
        strokeWidth="1"
      />
      
      {/* Gift box lid */}
      <path
        d="M6 10h28a2 2 0 012 2v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3a2 2 0 012-2z"
        fill="url(#giftGradient2)"
        stroke="url(#giftStroke)"
        strokeWidth="1"
      />
      
      {/* Ribbon vertical */}
      <rect
        x="18"
        y="6"
        width="4"
        height="31"
        fill="url(#ribbonGradient)"
        rx="1"
      />
      
      {/* Ribbon horizontal */}
      <rect
        x="4"
        y="18"
        width="32"
        height="4"
        fill="url(#ribbonGradient)"
        rx="1"
      />
      
      {/* Bow */}
      <circle cx="20" cy="8" r="4" fill="url(#bowGradient)" />
      <circle cx="20" cy="8" r="2" fill="url(#bowCenter)" />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="giftGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
        <linearGradient id="giftGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="bowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="bowCenter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="giftStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>
    </svg>
  );

  const OcassiaText = ({ className: textClassName = '' }: { className?: string }) => (
    <svg
      viewBox="0 0 160 40"
      className={textClassName}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      
      {/* Ocassia text - modern, clean font */}
      <text
        x="0"
        y="28"
        fontSize="24"
        fontWeight="700"
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, sans-serif"
        fill="url(#textGradient)"
        letterSpacing="-0.5px"
      >
        Ocassia
      </text>
    </svg>
  );

  const renderLogo = () => {
    const baseClasses = `${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer' : ''}`;
    
    switch (variant) {
      case 'icon':
        return <GiftBoxIcon className={baseClasses} />;
      case 'text':
        return <OcassiaText className={baseClasses} />;
      default:
        return (
          <div className={`flex items-center gap-2 ${onClick ? 'cursor-pointer' : ''}`}>
            <GiftBoxIcon className={sizeClasses[size]} />
            <OcassiaText className={sizeClasses[size]} />
          </div>
        );
    }
  };

  return (
    <div onClick={onClick} className={onClick ? 'inline-block' : ''}>
      {renderLogo()}
    </div>
  );
}

// Alternative logo component using your original image
interface ImageLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export function ImageLogo({ size = 'md', className = '', onClick }: ImageLogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8', 
    lg: 'h-12',
    xl: 'h-16'
  };

  return (
    <img
      src="/attached_assets/image_1752806203023.png"
      alt="Ocassia Logo"
      className={`${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    />
  );
}