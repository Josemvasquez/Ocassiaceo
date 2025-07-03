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

// Custom Gift with Heart Icon Component - Neon Style
const GiftHeartIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <filter id="neonGlowHeader" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Gift box base - neon blue outline with glow */}
    <rect x="7" y="10" width="10" height="9" rx="0.5" 
          stroke="currentColor" strokeWidth="2" fill="none" 
          filter="url(#neonGlowHeader)" opacity="0.9"/>
    
    {/* Gift box lid - separate piece */}
    <rect x="6.5" y="8.5" width="11" height="2.5" rx="0.5" 
          stroke="currentColor" strokeWidth="2" fill="none" 
          filter="url(#neonGlowHeader)" opacity="0.9"/>
    
    {/* Ribbon vertical - glowing line */}
    <line x1="12" y1="8.5" x2="12" y2="19" 
          stroke="currentColor" strokeWidth="2" 
          filter="url(#neonGlowHeader)" opacity="0.8"/>
    
    {/* Ribbon horizontal - glowing line */}
    <line x1="6.5" y1="11.5" x2="17.5" y2="11.5" 
          stroke="currentColor" strokeWidth="2" 
          filter="url(#neonGlowHeader)" opacity="0.8"/>
    
    {/* Floating hearts with neon glow - pink/magenta color */}
    <g filter="url(#neonGlowHeader)">
      {/* Heart 1 - top right */}
      <path d="M17.5 5.5 C17.5 4.5 16.5 4 15.5 4.5 C15.5 4 14.5 4.5 14.5 5.5 C14.5 6.5 16 8 16 8 C16 8 17.5 6.5 17.5 5.5Z" 
            fill="#ff1493" opacity="0.9"/>
      
      {/* Heart 2 - top left */}
      <path d="M9 4 C9 3 8 2.5 7 3 C7 2.5 6 3 6 4 C6 5 7.5 6.5 7.5 6.5 C7.5 6.5 9 5 9 4Z" 
            fill="#ff1493" opacity="0.8"/>
      
      {/* Heart 3 - center right */}
      <path d="M20 9 C20 8 19 7.5 18 8 C18 7.5 17 8 17 9 C17 10 18.5 11.5 18.5 11.5 C18.5 11.5 20 10 20 9Z" 
            fill="#ff1493" opacity="0.7"/>
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
