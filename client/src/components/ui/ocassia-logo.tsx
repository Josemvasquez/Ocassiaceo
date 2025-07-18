import React from 'react';

interface OcassiaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  onClick?: () => void;
}

export function OcassiaLogo({ size = 'md', variant = 'full', className = '', onClick }: OcassiaLogoProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-16'
  };

  // Original logo image from user
  const LogoImage = () => (
    <img
      src="/attached_assets/image_1752806203023.png"
      alt="Ocassia Logo"
      className={`${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    />
  );

  // Recreated SVG version of the geometric gift box logo
  const GiftBoxIcon = ({ className: iconClassName = '' }: { className?: string }) => (
    <svg
      viewBox="0 0 40 40"
      className={iconClassName}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle for contrast */}
      <circle cx="20" cy="20" r="19" fill="rgba(30, 64, 175, 0.1)" stroke="rgba(30, 64, 175, 0.2)" strokeWidth="1"/>
      
      {/* Gift box base - main container */}
      <path
        d="M12 16h16v16a1 1 0 01-1 1H13a1 1 0 01-1-1V16z"
        fill="url(#giftBase)"
        stroke="url(#giftStroke)"
        strokeWidth="0.8"
      />
      
      {/* Gift box lid */}
      <path
        d="M10 12h20a1 1 0 011 1v3H9v-3a1 1 0 011-1z"
        fill="url(#giftLid)"
        stroke="url(#giftStroke)"
        strokeWidth="0.8"
      />
      
      {/* Ribbon vertical */}
      <rect
        x="19"
        y="10"
        width="2"
        height="23"
        fill="url(#ribbon)"
        rx="0.5"
      />
      
      {/* Ribbon horizontal */}
      <rect
        x="9"
        y="19"
        width="22"
        height="2"
        fill="url(#ribbon)"
        rx="0.5"
      />
      
      {/* Bow decoration */}
      <ellipse cx="20" cy="12" rx="3" ry="2" fill="url(#bow)" />
      <ellipse cx="20" cy="12" rx="1.5" ry="1" fill="url(#bowHighlight)" />
      
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="giftBase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
        <linearGradient id="giftLid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient id="ribbon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="bow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="bowHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
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

  // Text component with gradient
  const OcassiaText = ({ className: textClassName = '' }: { className?: string }) => (
    <div className={`${textClassName} font-bold`}>
      <span 
        className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
        style={{ 
          fontSize: size === 'sm' ? '16px' : 
                   size === 'md' ? '20px' : 
                   size === 'lg' ? '24px' : '32px',
          letterSpacing: '-0.5px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        }}
      >
        Ocassia
      </span>
    </div>
  );

  const renderLogo = () => {
    const baseClasses = `${onClick ? 'cursor-pointer transition-all duration-200 hover:scale-105' : ''}`;
    
    if (variant === 'icon') {
      return <GiftBoxIcon className={`${sizeClasses[size]} ${baseClasses} ${className}`} />;
    }
    
    if (variant === 'text') {
      return <OcassiaText className={`${baseClasses} ${className}`} />;
    }
    
    // Full logo
    return (
      <div className={`flex items-center gap-3 ${baseClasses} ${className}`} onClick={onClick}>
        <GiftBoxIcon className={sizeClasses[size]} />
        <OcassiaText />
      </div>
    );
  };

  return renderLogo();
}

// Export both versions for flexibility
export { OcassiaLogo as default };

// Fallback to original image if needed
export function OcassiaLogoImage({ size = 'md', className = '', onClick }: Omit<OcassiaLogoProps, 'variant'>) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10', 
    lg: 'h-12',
    xl: 'h-16'
  };

  return (
    <img
      src="/attached_assets/image_1752806203023.png"
      alt="Ocassia Logo"
      className={`${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer transition-all duration-200 hover:scale-105' : ''}`}
      onClick={onClick}
    />
  );
}