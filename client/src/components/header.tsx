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
    {/* Gift box outline */}
    <rect x="6" y="10" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    
    {/* Gift box lid */}
    <rect x="6" y="8" width="12" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    
    {/* Gift ribbon vertical */}
    <line x1="12" y1="8" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5"/>
    
    {/* Gift ribbon horizontal */}
    <line x1="6" y1="11.5" x2="18" y2="11.5" stroke="currentColor" strokeWidth="1.5"/>
    
    {/* Bow on top */}
    <path d="M10 8 C10 6 8 6 8 8 C8 6 10 6 10 8" stroke="currentColor" strokeWidth="1.2" fill="none"/>
    <path d="M14 8 C14 6 16 6 16 8 C16 6 14 6 14 8" stroke="currentColor" strokeWidth="1.2" fill="none"/>
    <circle cx="12" cy="7" r="0.5" fill="currentColor"/>
    
    {/* Floating hearts */}
    <g opacity="0.8">
      {/* Heart 1 - top right */}
      <path d="M18 6 C17.5 5.5 17 5.5 17 6 C17 5.5 16.5 5.5 16 6 C16 6.5 17 7.5 17 8 C17 7.5 18 6.5 18 6Z" fill="currentColor"/>
      
      {/* Heart 2 - top left */}
      <path d="M8 5 C7.5 4.5 7 4.5 7 5 C7 4.5 6.5 4.5 6 5 C6 5.5 7 6.5 7 7 C7 6.5 8 5.5 8 5Z" fill="currentColor"/>
      
      {/* Heart 3 - right side */}
      <path d="M20 12 C19.5 11.5 19 11.5 19 12 C19 11.5 18.5 11.5 18 12 C18 12.5 19 13.5 19 14 C19 13.5 20 12.5 20 12Z" fill="currentColor"/>
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
