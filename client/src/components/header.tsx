import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Bell } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Header() {
  const { user } = useAuth();
  const [location] = useLocation();

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/contacts", label: "Contacts" },
    { path: "/friends", label: "Friends" },
    { path: "/wishlist", label: "Wishlist" },
    { path: "/collaborative", label: "Collaborative" },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-coral via-purple to-teal rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-coral to-purple bg-clip-text text-transparent">
                RemindMe
              </h1>
              <p className="text-xs text-secondary -mt-1">Stay connected with love</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1 bg-warm-gray/50 rounded-full p-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${
                    location === item.path
                      ? "bg-white text-coral shadow-md scale-105"
                      : "text-secondary hover:text-coral hover:bg-white/50"
                  }`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative p-3 rounded-full hover:bg-soft-coral/30 transition-colors">
              <Bell className="h-5 w-5 text-secondary" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-coral to-warm-orange text-white text-xs rounded-full flex items-center justify-center font-semibold animate-pulse">
                3
              </span>
            </Button>
            
            <div className="flex items-center space-x-3 bg-warm-gray/30 rounded-full pl-3 pr-1 py-1">
              <span className="text-sm font-medium text-secondary hidden sm:block">
                {user?.firstName || 'Welcome'}
              </span>
              <Avatar className="h-9 w-9 ring-2 ring-coral/20">
                <AvatarImage src={user?.profileImageUrl || undefined} alt="Profile" />
                <AvatarFallback className="bg-gradient-to-br from-coral to-purple text-white font-semibold">
                  {getInitials(user?.firstName || undefined, user?.lastName || undefined)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
