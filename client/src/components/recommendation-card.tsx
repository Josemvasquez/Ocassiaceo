import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Star, Calendar, Plane, MapPin } from "lucide-react";

interface RecommendationCardProps {
  item: any;
  type: 'gift' | 'restaurant' | 'travel';
}

export default function RecommendationCard({ item, type }: RecommendationCardProps) {
  console.log(`Rendering ${type} card:`, { itemName: item?.name || item?.title, type });
  
  const handleAffiliateClick = () => {
    // Open affiliate link in new tab with tracking
    const url = item.affiliateUrl || item.openTableUrl || item.expediaUrl;
    if (url) {
      // Track affiliate click for analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'affiliate_click', {
          event_category: 'engagement',
          event_label: `${type}_${item.id}`,
          affiliate_partner: getAffiliatePartner(url),
          value: parseFloat(item.price?.replace(/[^0-9.]/g, '') || '0')
        });
      }
      
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const getAffiliatePartner = (url: string) => {
    if (url.includes('amazon.com')) return 'amazon';
    if (url.includes('opentable.com')) return 'opentable';
    if (url.includes('expedia.com')) return 'expedia';
    return 'unknown';
  };

  const getButtonConfig = () => {
    switch (type) {
      case 'gift':
        return {
          text: item.isPrime ? 'Buy with Prime' : 'Buy Now',
          icon: ExternalLink,
          className: 'bg-soft-blue text-white hover:bg-soft-blue/90'
        };
      case 'restaurant':
        return {
          text: 'Reserve Table',
          icon: Calendar,
          className: 'bg-soft-blue text-white hover:bg-soft-blue/90'
        };
      case 'travel':
        return {
          text: 'Book Now',
          icon: Plane,
          className: 'bg-soft-blue text-white hover:bg-soft-blue/90'
        };
      default:
        return {
          text: 'View',
          icon: ExternalLink,
          className: 'bg-soft-blue text-white hover:bg-soft-blue/90'
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
              <div className="flex items-center gap-2">
                {item.isPrime && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                    Prime
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-very-soft-blue text-soft-blue text-xs">
                  Amazon
                </Badge>
              </div>
              <span className="text-sm font-semibold text-soft-blue">
                {item.price}
              </span>
            </>
          )}
          {type === 'restaurant' && (
            <>
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-xs text-secondary">
                    {item.rating} ({item.reviewCount || item.reviews})
                  </span>
                </div>
                <Badge variant="secondary" className="bg-very-soft-blue text-soft-blue text-xs">
                  OpenTable
                </Badge>
              </div>
              {item.availability && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  {item.availability}
                </Badge>
              )}
            </>
          )}
          {type === 'travel' && (
            <>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-very-soft-blue text-soft-blue text-xs">
                  Expedia
                </Badge>
                {item.type && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                    {item.type}
                  </Badge>
                )}
              </div>
              <span className="text-sm font-semibold text-soft-blue">
                {typeof item.price === 'string' ? item.price : `$${item.price}`}
                {item.type === 'hotel' && '/night'}
              </span>
            </>
          )}
        </div>
        
        <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
        
        {/* Location information for restaurants */}
        {type === 'restaurant' && (item.distance || item.address) && (
          <div className="mb-3 pb-3 border-b border-gray-100">
            <div className="space-y-1">
              {item.distance && (
                <div className="flex items-center gap-1 text-xs text-secondary">
                  <MapPin className="h-3 w-3" />
                  <span>{item.distance} away</span>
                </div>
              )}
              {item.address && (
                <div className="text-xs text-secondary">
                  {item.address}
                </div>
              )}
            </div>
          </div>
        )}

        <Button 
          className={`w-full ${buttonConfig.className} transition-colors rounded-xl font-medium`}
          size="sm"
          onClick={handleAffiliateClick}
        >
          <ButtonIcon className="h-4 w-4 mr-2" />
          {buttonConfig.text}
        </Button>
      </div>
    </div>
  );
}
