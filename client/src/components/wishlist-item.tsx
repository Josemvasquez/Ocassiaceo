import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, ExternalLink, ShoppingCart } from "lucide-react";
import { format } from "date-fns";
import ShareDialog from "@/components/share-dialog";
import { useState } from "react";

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
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const price = item.price ? parseFloat(item.price) : 0;
  const createdDate = format(new Date(item.createdAt), "MMM d, yyyy");

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
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
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow p-4">
      <div className="flex items-start space-x-4">
        <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-50">
              <ShoppingCart className="h-8 w-8 text-blue-300" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 mb-1 truncate">{item.name}</h4>
          {item.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {price > 0 && (
                <span className="text-lg font-bold text-blue-600">${price.toFixed(2)}</span>
              )}
              {item.priority && (
                <Badge className={`text-xs border ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              {item.url && (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ExternalLink className="h-4 w-4 text-blue-500" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => setShareDialogOpen(true)}
              >
                <Share2 className="h-4 w-4 text-blue-500 hover:text-blue-600" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
              </Button>
            </div>
          </div>
          
          {item.purchased && (
            <div className="mt-2">
              <Badge className="bg-green-50 text-green-700 border-green-200">
                ✓ Purchased
              </Badge>
            </div>
          )}
        </div>
      </div>

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        itemId={item.id}
        itemName={item.name}
        itemType="wishlist"
      />
    </div>
  );
}
