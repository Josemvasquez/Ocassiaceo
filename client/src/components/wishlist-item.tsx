import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2 } from "lucide-react";
import { format } from "date-fns";

interface WishlistItemProps {
  item: {
    id: number;
    name: string;
    description?: string;
    price?: string;
    url?: string;
    imageUrl?: string;
    category?: string;
    priority?: string;
    purchased?: boolean;
    createdAt: string;
  };
  expanded?: boolean;
}

export default function WishlistItem({ item, expanded = false }: WishlistItemProps) {
  const price = item.price ? parseFloat(item.price) : 0;
  const createdDate = format(new Date(item.createdAt), "MMM d, yyyy");

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (expanded) {
    return (
      <div className="p-6">
        {item.imageUrl && (
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-lg mb-1">{item.name}</h4>
            {item.description && (
              <p className="text-gray-600 mb-2">{item.description}</p>
            )}
            <p className="text-sm text-gray-500">Added {createdDate}</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {price > 0 && (
              <span className="text-lg font-semibold text-coral">
                ${price.toFixed(2)}
              </span>
            )}
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 text-coral" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {item.category && (
            <Badge variant="secondary">
              {item.category}
            </Badge>
          )}
          {item.priority && (
            <Badge className={getPriorityColor(item.priority)}>
              {item.priority} priority
            </Badge>
          )}
          {item.purchased && (
            <Badge className="bg-green-100 text-green-800">
              Purchased
            </Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 p-3 border border-gray-200 rounded-xl hover:border-coral hover:shadow-sm transition-all">
      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <Heart className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{item.name}</h4>
        <p className="text-sm text-gray-600">Added {createdDate}</p>
        {price > 0 && (
          <p className="text-sm font-medium text-coral">${price.toFixed(2)}</p>
        )}
      </div>
      <div className="flex flex-col space-y-1">
        <Button variant="ghost" size="sm">
          <Heart className="h-4 w-4 text-coral" />
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
