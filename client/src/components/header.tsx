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

// Custom Gift with Heart Icon Component - Clean gift box with bow and heart inside
const GiftHeartIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Gift box outline */}
    <rect x="5" y="8" width="14" height="12" rx="1" 
          stroke="currentColor" strokeWidth="2" fill="none"/>
    
    {/* Decorative bow - left loop */}
    <path d="M8 8 C6 6 4 6 6 4 C8 6 10 6 8 8" 
          stroke="currentColor" strokeWidth="2" fill="none"/>
    
    {/* Decorative bow - right loop */}
    <path d="M16 8 C18 6 20 6 18 4 C16 6 14 6 16 8" 
          stroke="currentColor" strokeWidth="2" fill="none"/>
    
    {/* Bow center knot */}
    <circle cx="12" cy="6" r="1.5" 
            stroke="currentColor" strokeWidth="2" fill="none"/>
    
    {/* Heart inside the box */}
    <path d="M12 16 C10.5 14.5 8.5 12.5 8.5 11 C8.5 10 9.2 9.5 10 9.5 C10.5 9.5 11 9.7 11.2 10 C11.4 9.7 11.9 9.5 12.4 9.5 C13.2 9.5 13.9 10 13.9 11 C13.9 12.5 11.9 14.5 12 16Z" 
          fill="currentColor" opacity="0.9"/>
    
    {/* Small decorative ribbon lines */}
    <line x1="12" y1="8" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
    <line x1="5" y1="14" x2="19" y2="14" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
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
