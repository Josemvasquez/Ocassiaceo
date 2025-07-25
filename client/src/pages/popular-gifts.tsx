import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, ArrowLeft, Gift, Heart, Users, Zap, ExternalLink, Filter } from "lucide-react";
import { Link } from "wouter";

interface PopularGift {
  id: string;
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  imageUrl: string;
  category: string;
  rating: number;
  reviewCount: number;
  isHot: boolean;
  isBestseller: boolean;
  affiliateUrl: string;
  tags: string[];
}

export default function PopularGifts() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock popular gifts data - in production this would come from API with real affiliate links
  const popularGifts: PopularGift[] = [
    {
      id: "1",
      title: "Apple AirPods Pro (2nd Generation)",
      description: "Active Noise Cancellation, Transparency Mode, Personalized Spatial Audio",
      price: "$249.00",
      originalPrice: "$279.00",
      imageUrl: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop",
      category: "Electronics",
      rating: 4.8,
      reviewCount: 28492,
      isHot: true,
      isBestseller: true,
      affiliateUrl: "https://amazon.com/airpods-pro",
      tags: ["wireless", "noise-cancelling", "apple"]
    },
    {
      id: "2",
      title: "Ninja Foodi Personal Blender",
      description: "Perfect for smoothies, protein shakes, and frozen drinks",
      price: "$79.99",
      originalPrice: "$99.99",
      imageUrl: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop",
      category: "Kitchen",
      rating: 4.6,
      reviewCount: 15230,
      isHot: false,
      isBestseller: true,
      affiliateUrl: "https://amazon.com/ninja-blender",
      tags: ["kitchen", "healthy", "smoothies"]
    },
    {
      id: "3",
      title: "Cozy Earth Bamboo Sheet Set",
      description: "Ultra-soft, temperature-regulating bamboo viscose bedding",
      price: "$199.00",
      imageUrl: "https://images.unsplash.com/photo-1586227740560-8cf2732c1531?w=400&h=400&fit=crop",
      category: "Home & Living",
      rating: 4.7,
      reviewCount: 8945,
      isHot: true,
      isBestseller: false,
      affiliateUrl: "https://cozyearth.com/sheets",
      tags: ["bamboo", "eco-friendly", "comfort"]
    },
    {
      id: "4",
      title: "YETI Rambler 20oz Tumbler",
      description: "Double-wall vacuum insulation keeps drinks hot or cold",
      price: "$35.00",
      imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop",
      category: "Outdoor",
      rating: 4.9,
      reviewCount: 22156,
      isHot: false,
      isBestseller: true,
      affiliateUrl: "https://yeti.com/rambler",
      tags: ["insulated", "durable", "outdoor"]
    },
    {
      id: "5",
      title: "Kindle Paperwhite (11th Generation)",
      description: "6.8'' display, adjustable warm light, waterproof",
      price: "$139.99",
      originalPrice: "$149.99",
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
      category: "Books & Reading",
      rating: 4.5,
      reviewCount: 45230,
      isHot: true,
      isBestseller: true,
      affiliateUrl: "https://amazon.com/kindle-paperwhite",
      tags: ["e-reader", "waterproof", "books"]
    },
    {
      id: "6",
      title: "Lululemon Everywhere Belt Bag",
      description: "Compact, hands-free storage for daily essentials",
      price: "$38.00",
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      category: "Fashion",
      rating: 4.4,
      reviewCount: 12890,
      isHot: true,
      isBestseller: false,
      affiliateUrl: "https://lululemon.com/belt-bag",
      tags: ["athletic", "hands-free", "stylish"]
    },
    {
      id: "7",
      title: "Stanley Adventure Quencher Tumbler",
      description: "40oz stainless steel tumbler with handle and straw",
      price: "$44.95",
      imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
      category: "Outdoor",
      rating: 4.6,
      reviewCount: 18750,
      isHot: true,
      isBestseller: true,
      affiliateUrl: "https://stanley1913.com/quencher",
      tags: ["insulated", "large", "handle"]
    },
    {
      id: "8",
      title: "Anthropologie Capri Blue Candle",
      description: "Volcano scent - tropical fruits and sugared citrus",
      price: "$36.00",
      imageUrl: "https://images.unsplash.com/photo-1602874801006-e95d8b7e7adb?w=400&h=400&fit=crop",
      category: "Home & Living",
      rating: 4.8,
      reviewCount: 9560,
      isHot: false,
      isBestseller: true,
      affiliateUrl: "https://anthropologie.com/capri-blue",
      tags: ["candle", "scented", "luxury"]
    }
  ];

  const categories = [
    "all",
    "Electronics", 
    "Kitchen", 
    "Home & Living", 
    "Fashion", 
    "Books & Reading", 
    "Outdoor"
  ];

  const filteredGifts = selectedCategory === "all" 
    ? popularGifts 
    : popularGifts.filter(gift => gift.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header matching landing page */}
      <header className="bg-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <Gift className="h-5 w-5 text-slate-800" />
                </div>
                <span className="text-white text-xl font-bold">Ocassia</span>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/ai-gift-ideas">
                <span className="text-base font-bold text-slate-300 hover:text-white cursor-pointer transition-colors duration-200 flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  AI gift ideas
                </span>
              </Link>
              <Link href="/find-list">
                <span className="text-base font-bold text-slate-300 hover:text-white cursor-pointer transition-colors duration-200">
                  Find a list
                </span>
              </Link>
              <Link href="/popular-gifts">
                <span className="text-base font-bold text-white hover:text-gray-300 cursor-pointer transition-colors duration-200">
                  Popular Gifts
                </span>
              </Link>
              <span className="text-base font-bold text-slate-300 hover:text-white cursor-pointer transition-colors duration-200">
                Gift guides
              </span>
              <span className="text-base font-bold text-slate-300 hover:text-white cursor-pointer transition-colors duration-200">
                FAQ
              </span>
            </nav>

            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" className="text-slate-800 bg-white hover:bg-gray-100 border-2 border-white font-semibold">
                <a href="/api/login">Login</a>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                <a href="/api/login">Sign up</a>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        {/* Go Back Button */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-900 p-0">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-4">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Popular Gifts
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover trending gifts that everyone loves. From bestsellers to hot new items, find the perfect gift that's guaranteed to delight.
          </p>
        </div>

        {/* Category Filter */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter by Category
            </CardTitle>
            <CardDescription>
              Browse popular gifts by category to find exactly what you're looking for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" : ""}
                >
                  {category === "all" ? "All Categories" : category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {filteredGifts.length} Popular Gift{filteredGifts.length !== 1 ? 's' : ''}
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
          </h2>
          <p className="text-gray-600">
            Trending items with thousands of happy customers
          </p>
        </div>

        {/* Gifts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredGifts.map((gift) => (
            <Card key={gift.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="p-0">
                <div className="relative">
                  <img 
                    src={gift.imageUrl} 
                    alt={gift.title}
                    className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {gift.isHot && (
                      <Badge className="bg-red-500 text-white">
                        🔥 Hot
                      </Badge>
                    )}
                    {gift.isBestseller && (
                      <Badge className="bg-orange-500 text-white">
                        #1 Bestseller
                      </Badge>
                    )}
                  </div>
                  {gift.originalPrice && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="destructive" className="bg-green-500">
                        Save ${(parseFloat(gift.originalPrice.replace('$', '')) - parseFloat(gift.price.replace('$', ''))).toFixed(2)}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {gift.category}
                  </Badge>
                </div>
                
                <CardTitle className="text-lg mb-2 line-clamp-2">
                  {gift.title}
                </CardTitle>
                
                <CardDescription className="text-sm mb-3 line-clamp-2">
                  {gift.description}
                </CardDescription>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(gift.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{gift.rating}</span>
                  <span className="text-sm text-gray-500">({gift.reviewCount.toLocaleString()})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-gray-900">{gift.price}</span>
                  {gift.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">{gift.originalPrice}</span>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {gift.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  onClick={() => window.open(gift.affiliateUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Product
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Need More Personalized Suggestions?
              </h3>
              <p className="text-gray-600 mb-6">
                Let our AI assistant help you find the perfect gift based on the recipient's interests, age, and occasion.
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="/ai-gift-ideas">
                  <Zap className="h-5 w-5 mr-2" />
                  Get AI Gift Recommendations
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}