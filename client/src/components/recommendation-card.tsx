import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Star, Calendar, Plane } from "lucide-react";

interface RecommendationCardProps {
  item: any;
  type: 'gift' | 'restaurant' | 'travel';
}

export default function RecommendationCard({ item, type }: RecommendationCardProps) {
  const getButtonConfig = () => {
    switch (type) {
      case 'gift':
        return {
          text: 'View Deal',
          icon: ExternalLink,
          className: 'bg-coral text-white hover:bg-red-600'
        };
      case 'restaurant':
        return {
          text: 'Book Table',
          icon: Calendar,
          className: 'bg-warm-yellow text-gray-800 hover:bg-yellow-400'
        };
      case 'travel':
        return {
          text: 'View Packages',
          icon: Plane,
          className: 'bg-purple-600 text-white hover:bg-purple-700'
        };
      default:
        return {
          text: 'View',
          icon: ExternalLink,
          className: 'bg-coral text-white hover:bg-red-600'
        };
    }
  };

  const buttonConfig = getButtonConfig();
  const ButtonIcon = buttonConfig.icon;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          {type === 'gift' && (
            <>
              <Badge variant="secondary" className="bg-coral bg-opacity-10 text-coral">
                For {item.recipient || 'Someone Special'}
              </Badge>
              <span className="text-sm font-semibold text-gray-900">
                ${item.price}
              </span>
            </>
          )}
          {type === 'restaurant' && (
            <>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-warm-yellow fill-current" />
                <span className="text-xs text-gray-600">
                  {item.rating} ({item.reviews} reviews)
                </span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Available
              </Badge>
            </>
          )}
          {type === 'travel' && (
            <>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {item.type}
              </Badge>
              <span className="text-sm font-semibold text-gray-900">
                ${item.price}/night
              </span>
            </>
          )}
        </div>
        
        <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
        
        <Button 
          className={`w-full ${buttonConfig.className} transition-colors`}
          size="sm"
        >
          <ButtonIcon className="h-4 w-4 mr-2" />
          {buttonConfig.text}
        </Button>
      </div>
    </div>
  );
}
