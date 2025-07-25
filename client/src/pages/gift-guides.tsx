import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowLeft, Gift, Heart, Users, Calendar, DollarSign, Sparkles, ArrowRight, Clock } from "lucide-react";
import { Link } from "wouter";

interface GiftGuide {
  id: string;
  title: string;
  description: string;
  category: string;
  occasion: string;
  budget: string;
  imageUrl: string;
  itemCount: number;
  readTime: string;
  tags: string[];
  featured: boolean;
  author: string;
  publishedDate: string;
  previewItems: {
    title: string;
    price: string;
    imageUrl: string;
  }[];
}

export default function GiftGuides() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock gift guides data - in production this would come from a content management system
  const giftGuides: GiftGuide[] = [
    {
      id: "1",
      title: "Ultimate Holiday Gift Guide 2024",
      description: "25 perfect gifts for everyone on your list, from cozy home essentials to tech gadgets they'll actually use.",
      category: "Holiday",
      occasion: "Christmas",
      budget: "$25-$200",
      imageUrl: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&h=300&fit=crop",
      itemCount: 25,
      readTime: "8 min read",
      tags: ["family", "budget-friendly", "trending"],
      featured: true,
      author: "Sarah Miller",
      publishedDate: "2024-11-15",
      previewItems: [
        {
          title: "Cozy Weighted Blanket",
          price: "$89",
          imageUrl: "https://images.unsplash.com/photo-1586227740560-8cf2732c1531?w=200&h=200&fit=crop"
        },
        {
          title: "Smart Coffee Mug",
          price: "$129",
          imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop"
        },
        {
          title: "Artisan Candle Set",
          price: "$45",
          imageUrl: "https://images.unsplash.com/photo-1602874801006-e95d8b7e7adb?w=200&h=200&fit=crop"
        }
      ]
    },
    {
      id: "2",
      title: "New Mom Gift Guide",
      description: "Thoughtful gifts to pamper and support new mothers during this special time.",
      category: "Recipient",
      occasion: "Baby Shower",
      budget: "$20-$150",
      imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=300&fit=crop",
      itemCount: 15,
      readTime: "6 min read",
      tags: ["self-care", "practical", "emotional support"],
      featured: true,
      author: "Emma Chen",
      publishedDate: "2024-11-10",
      previewItems: [
        {
          title: "Luxury Bath Set",
          price: "$75",
          imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop"
        },
        {
          title: "Meal Delivery Service",
          price: "$120",
          imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop"
        },
        {
          title: "Memory Book",
          price: "$35",
          imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop"
        }
      ]
    },
    {
      id: "3",
      title: "Budget-Friendly Wedding Gifts Under $50",
      description: "Beautiful, meaningful gifts that won't break the bank but will be treasured by the happy couple.",
      category: "Budget",
      occasion: "Wedding",
      budget: "Under $50",
      imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&h=300&fit=crop",
      itemCount: 20,
      readTime: "5 min read",
      tags: ["affordable", "meaningful", "practical"],
      featured: false,
      author: "Michael Rodriguez",
      publishedDate: "2024-11-08",
      previewItems: [
        {
          title: "Personalized Cutting Board",
          price: "$42",
          imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop"
        },
        {
          title: "Wine Aerator Set",
          price: "$35",
          imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=200&fit=crop"
        },
        {
          title: "Recipe Box with Cards",
          price: "$28",
          imageUrl: "https://images.unsplash.com/photo-1556909114-4f6e8cdf1b64?w=200&h=200&fit=crop"
        }
      ]
    },
    {
      id: "4",
      title: "Tech Gifts for Remote Workers",
      description: "Upgrade their home office with these productivity-boosting tech essentials.",
      category: "Tech",
      occasion: "Work & Career",
      budget: "$50-$300",
      imageUrl: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500&h=300&fit=crop",
      itemCount: 12,
      readTime: "7 min read",
      tags: ["productivity", "work-from-home", "tech"],
      featured: false,
      author: "David Kim",
      publishedDate: "2024-11-05",
      previewItems: [
        {
          title: "Wireless Charging Stand",
          price: "$79",
          imageUrl: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=200&h=200&fit=crop"
        },
        {
          title: "Blue Light Glasses",
          price: "$89",
          imageUrl: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=200&h=200&fit=crop"
        },
        {
          title: "Ergonomic Mouse Pad",
          price: "$45",
          imageUrl: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=200&h=200&fit=crop"
        }
      ]
    },
    {
      id: "5",
      title: "Luxury Gifts That Feel Expensive",
      description: "Splurge-worthy gifts that deliver premium quality and unforgettable experiences.",
      category: "Luxury",
      occasion: "Anniversary",
      budget: "$200+",
      imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=300&fit=crop",
      itemCount: 10,
      readTime: "10 min read",
      tags: ["premium", "luxury", "experiences"],
      featured: true,
      author: "Isabella Thompson",
      publishedDate: "2024-11-01",
      previewItems: [
        {
          title: "Silk Pajama Set",
          price: "$299",
          imageUrl: "https://images.unsplash.com/photo-1586401100295-7a8096fd231e?w=200&h=200&fit=crop"
        },
        {
          title: "Premium Skincare Set",
          price: "$245",
          imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop"
        },
        {
          title: "Leather Weekend Bag",
          price: "$450",
          imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop"
        }
      ]
    },
    {
      id: "6",
      title: "DIY & Craft Lover's Gift Guide",
      description: "Creative gifts for the makers, crafters, and DIY enthusiasts in your life.",
      category: "Hobbies",
      occasion: "Birthday",
      budget: "$15-$100",
      imageUrl: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=500&h=300&fit=crop",
      itemCount: 18,
      readTime: "6 min read",
      tags: ["creative", "hands-on", "personalized"],
      featured: false,
      author: "Rachel Green",
      publishedDate: "2024-10-28",
      previewItems: [
        {
          title: "Premium Paint Set",
          price: "$65",
          imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop"
        },
        {
          title: "Embroidery Starter Kit",
          price: "$38",
          imageUrl: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=200&h=200&fit=crop"
        },
        {
          title: "Wooden Tool Organizer",
          price: "$55",
          imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop"
        }
      ]
    }
  ];

  const categories = [
    "all",
    "Holiday",
    "Recipient", 
    "Budget",
    "Tech",
    "Luxury",
    "Hobbies"
  ];

  const filteredGuides = selectedCategory === "all" 
    ? giftGuides 
    : giftGuides.filter(guide => guide.category === selectedCategory);

  const featuredGuides = giftGuides.filter(guide => guide.featured);

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
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI gift ideas
                </span>
              </Link>
              <Link href="/find-list">
                <span className="text-base font-bold text-slate-300 hover:text-white cursor-pointer transition-colors duration-200">
                  Find a list
                </span>
              </Link>
              <Link href="/popular-gifts">
                <span className="text-base font-bold text-slate-300 hover:text-white cursor-pointer transition-colors duration-200">
                  Popular Gifts
                </span>
              </Link>
              <Link href="/gift-guides">
                <span className="text-base font-bold text-white hover:text-gray-300 cursor-pointer transition-colors duration-200">
                  Gift guides
                </span>
              </Link>
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
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-4">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gift Guides
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Expert-curated gift collections for every occasion, recipient, and budget. Find the perfect gift with our comprehensive guides written by gift-giving specialists.
          </p>
        </div>

        {/* Featured Guides */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Guides</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredGuides.map((guide) => (
              <Card key={guide.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img 
                      src={guide.imageUrl} 
                      alt={guide.title}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500 text-white">
                        ⭐ Featured
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{guide.category}</Badge>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {guide.readTime}
                    </span>
                  </div>
                  
                  <CardTitle className="text-xl mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {guide.title}
                  </CardTitle>
                  
                  <CardDescription className="text-sm mb-4 line-clamp-3">
                    {guide.description}
                  </CardDescription>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700">{guide.itemCount} items</span>
                    <span className="text-sm font-medium text-green-600">{guide.budget}</span>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                    Read Guide
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Browse by Category</CardTitle>
            <CardDescription>
              Find gift guides tailored to specific occasions, recipients, or interests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" : ""}
                >
                  {category === "all" ? "All Guides" : category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Guides */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {filteredGuides.length} Gift Guide{filteredGuides.length !== 1 ? 's' : ''}
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
          </h2>
          <p className="text-gray-600">
            Expert recommendations and curated collections
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGuides.map((guide) => (
            <Card key={guide.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="p-0">
                <div className="relative">
                  <img 
                    src={guide.imageUrl} 
                    alt={guide.title}
                    className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  {guide.featured && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500 text-white">
                        ⭐ Featured
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{guide.category}</Badge>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {guide.readTime}
                  </span>
                </div>
                
                <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {guide.title}
                </CardTitle>
                
                <CardDescription className="text-sm mb-4 line-clamp-2">
                  {guide.description}
                </CardDescription>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">{guide.itemCount} items</span>
                  <span className="text-sm font-medium text-green-600">{guide.budget}</span>
                </div>

                {/* Preview Items */}
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">Preview Items:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {guide.previewItems.map((item, index) => (
                      <div key={index} className="text-center">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-16 object-cover rounded mb-1"
                        />
                        <p className="text-xs font-medium truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                  <span>By {guide.author}</span>
                  <span>{new Date(guide.publishedDate).toLocaleDateString()}</span>
                </div>

                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                  Read Full Guide
                  <ArrowRight className="h-4 w-4 ml-2" />
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
                Still Need Help Choosing?
              </h3>
              <p className="text-gray-600 mb-6">
                Let our AI assistant create personalized recommendations based on your specific needs and preferences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Link href="/ai-gift-ideas">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Get AI Recommendations
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/popular-gifts">
                    <Heart className="h-5 w-5 mr-2" />
                    Browse Popular Gifts
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}