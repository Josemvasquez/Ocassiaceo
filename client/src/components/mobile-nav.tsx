import { Link, useLocation } from "wouter";
import { Home, Users, Compass, Heart, User, Users2, Gift } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/contacts", icon: Users, label: "Contacts" },
    { path: "/recommendations", icon: Gift, label: "Shop" },
    { path: "/wishlist", icon: Heart, label: "Wishlist" },
    { path: "/friends", icon: Compass, label: "Friends" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 z-30">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <a className={`p-3 flex flex-col items-center transition-all duration-200 ${
                isActive 
                  ? 'text-soft-blue' 
                  : 'text-secondary hover:text-soft-blue'
              }`}>
                <div className={`relative rounded-2xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-very-soft-blue p-2' 
                    : 'p-2'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-xs mt-1 font-medium transition-colors ${
                  isActive ? 'text-soft-blue' : 'text-secondary'
                }`}>
                  {item.label}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
