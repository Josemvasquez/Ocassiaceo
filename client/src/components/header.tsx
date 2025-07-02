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
    { path: "/recommendations", label: "Recommendations" },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-soft-blue rounded-2xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-primary">RemindMe</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    location === item.path
                      ? "bg-very-soft-blue text-soft-blue"
                      : "text-secondary hover:text-soft-blue hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
              <Bell className="h-5 w-5 text-secondary" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-soft-blue text-white text-xs rounded-full flex items-center justify-center font-medium">
                3
              </span>
            </Button>
            
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profileImageUrl || undefined} alt="Profile" />
              <AvatarFallback className="bg-soft-blue text-white text-sm font-medium">
                {getInitials(user?.firstName || undefined, user?.lastName || undefined)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
