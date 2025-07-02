import { Link, useLocation } from "wouter";
import { Home, Users, Compass, Heart, User, Bell } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/contacts", icon: Users, label: "Contacts" },
    { path: "/recommendations", icon: Compass, label: "Discover" },
    { path: "/wishlist", icon: Heart, label: "Wishlist" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-30">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <a className={`p-3 flex flex-col items-center ${isActive ? 'text-coral' : 'text-gray-600'}`}>
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.path === "/profile" && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral text-white text-xs rounded-full flex items-center justify-center">
                      3
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
