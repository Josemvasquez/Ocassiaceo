import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, Bell, LogOut, User, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";

// Custom Gift with Heart Icon Component - Larger gift box with overlapping heart
const GiftHeartIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <filter id="neonGlowHeader" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Large Gift box base */}
    <rect x="5" y="8" width="14" height="12" rx="1" 
          stroke="currentColor" strokeWidth="2.5" fill="none" 
          filter="url(#neonGlowHeader)" opacity="0.9"/>
    
    {/* Gift box lid */}
    <rect x="4.5" y="6" width="15" height="3" rx="1" 
          stroke="currentColor" strokeWidth="2.5" fill="none" 
          filter="url(#neonGlowHeader)" opacity="0.9"/>
    
    {/* Ribbon vertical */}
    <line x1="12" y1="6" x2="12" y2="20" 
          stroke="currentColor" strokeWidth="2.5" 
          filter="url(#neonGlowHeader)" opacity="0.8"/>
    
    {/* Ribbon horizontal */}
    <line x1="4.5" y1="12" x2="19.5" y2="12" 
          stroke="currentColor" strokeWidth="2.5" 
          filter="url(#neonGlowHeader)" opacity="0.8"/>
    
    {/* Large overlapping heart in center */}
    <g filter="url(#neonGlowHeader)">
      <path d="M12 17 C10 15 7 12 7 9.5 C7 7.5 8.5 6 10.5 6 C11.3 6 12 6.3 12 7 C12 6.3 12.7 6 13.5 6 C15.5 6 17 7.5 17 9.5 C17 12 14 15 12 17Z" 
            fill="#ff1493" opacity="0.95" stroke="#ff69b4" strokeWidth="1"/>
    </g>
  </svg>
);

export default function Header() {
  const { user } = useAuth();
  const [location] = useLocation();
  
  // Type assertion for user data since it comes from API
  const userData = user as any;

  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    // Try first and last name first
    if (firstName || lastName) {
      return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    }
    
    // Fallback to email initials if no name
    if (email) {
      const emailName = email.split('@')[0];
      const parts = emailName.split(/[._-]/);
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return emailName.slice(0, 2).toUpperCase();
    }
    
    return 'U';
  };

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/contacts", label: "Contacts" },
    { path: "/friends", label: "Friends" },
    { path: "/wishlist", label: "Wishlist" },
    { path: "/collaborative", label: "Collaborative" },
    { path: "/recommendations", label: "Recommendations" },
  ];

  return (
    <header className="bg-white border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                {/* Updated to use neon-style gift icon with floating hearts */}
                <GiftHeartIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-semibold text-blue-900">Ocassia</h1>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                    location === item.path
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                3
              </span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userData?.profileImageUrl || undefined} alt="Profile" />
                    <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
                      {getInitials(userData?.firstName || undefined, userData?.lastName || undefined, userData?.email || undefined)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userData?.firstName && userData?.lastName 
                        ? `${userData.firstName} ${userData.lastName}`
                        : userData?.email?.split('@')[0] || 'User'
                      }
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userData?.email || ''}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => window.location.href = '/api/logout'}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
