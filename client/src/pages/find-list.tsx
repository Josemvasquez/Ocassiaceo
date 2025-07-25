import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Gift, ArrowLeft, Users, Heart, Calendar, MapPin } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface PublicWishlist {
  id: string;
  title: string;
  description: string;
  ownerName: string;
  occasion: string;
  itemCount: number;
  isPublic: boolean;
  createdAt: string;
  items: {
    id: string;
    title: string;
    price: string;
    imageUrl: string;
    isClaimed: boolean;
  }[];
}

export default function FindList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("all");

  // Mock data for public wishlists - in production this would come from API
  const mockWishlists: PublicWishlist[] = [
    {
      id: "1",
      title: "Sarah's Birthday Wishlist",
      description: "Celebrating my 25th birthday! Love books, coffee, and cozy things.",
      ownerName: "Sarah Johnson",
      occasion: "Birthday",
      itemCount: 8,
      isPublic: true,
      createdAt: "2024-01-15",
      items: [
        {
          id: "1",
          title: "Kindle Paperwhite",
          price: "$139.99",
          imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop",
          isClaimed: false
        },
        {
          id: "2",
          title: "Coffee Subscription",
          price: "$29.99/month",
          imageUrl: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&h=300&fit=crop",
          isClaimed: true
        }
      ]
    },
    {
      id: "2",
      title: "Baby Shower for Emma",
      description: "Welcome little Emma! Looking for baby essentials and cute outfits.",
      ownerName: "Lisa Chen",
      occasion: "Baby Shower",
      itemCount: 12,
      isPublic: true,
      createdAt: "2024-01-20",
      items: [
        {
          id: "3",
          title: "Baby Carrier",
          price: "$89.99",
          imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=300&fit=crop",
          isClaimed: false
        }
      ]
    },
    {
      id: "3",
      title: "Wedding Registry - Mike & Alex",
      description: "Celebrating our special day! Home essentials and experiences welcome.",
      ownerName: "Mike & Alex Thompson",
      occasion: "Wedding",
      itemCount: 15,
      isPublic: true,
      createdAt: "2024-01-10",
      items: [
        {
          id: "4",
          title: "Stand Mixer",
          price: "$299.99",
          imageUrl: "https://images.unsplash.com/photo-1586142319999-78736e417f21?w=300&h=300&fit=crop",
          isClaimed: false
        }
      ]
    }
  ];

  const occasions = ["all", "Birthday", "Wedding", "Baby Shower", "Anniversary", "Holiday"];

  const filteredWishlists = mockWishlists.filter(wishlist => {
    const matchesSearch = wishlist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wishlist.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wishlist.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOccasion = selectedOccasion === "all" || wishlist.occasion === selectedOccasion;
    return matchesSearch && matchesOccasion;
  });

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
                  <Search className="w-4 h-4 mr-2" />
                  AI gift ideas
                </span>
              </Link>
              <Link href="/find-list">
                <span className="text-base font-bold text-white hover:text-gray-300 cursor-pointer transition-colors duration-200">
                  Find a list
                </span>
              </Link>
              <Link href="/popular-gifts">
                <span className="text-base font-bold text-slate-300 hover:text-white cursor-pointer transition-colors duration-200">
                  Popular Gifts
                </span>
              </Link>
              <Link href="/gift-guides">
                <span className="text-base font-bold text-slate-300 hover:text-white cursor-pointer transition-colors duration-200">
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
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full p-4">
              <Search className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find a Wishlist
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover public wishlists from friends and family. Find the perfect gift from their curated lists for birthdays, weddings, baby showers, and special occasions.
          </p>
        </div>

        {/* Search and Filter Section */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Search Wishlists</CardTitle>
            <CardDescription>
              Find wishlists by name, occasion, or owner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, owner, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {occasions.map(occasion => (
                    <option key={occasion} value={occasion}>
                      {occasion === "all" ? "All Occasions" : occasion}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {filteredWishlists.length} Wishlist{filteredWishlists.length !== 1 ? 's' : ''} Found
          </h2>
          <p className="text-gray-600">
            Browse public wishlists and find the perfect gift ideas
          </p>
        </div>

        {/* Wishlists Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredWishlists.map((wishlist) => (
            <Card key={wishlist.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {wishlist.occasion}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {wishlist.itemCount} items
                  </span>
                </div>
                <CardTitle className="text-lg">{wishlist.title}</CardTitle>
                <CardDescription className="text-sm">
                  <div className="flex items-center gap-1 mb-1">
                    <Users className="h-3 w-3" />
                    {wishlist.ownerName}
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <Calendar className="h-3 w-3" />
                    Created {new Date(wishlist.createdAt).toLocaleDateString()}
                  </div>
                  {wishlist.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Preview Items */}
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">Featured Items:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {wishlist.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="relative">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        {item.isClaimed && (
                          <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1">
                            <Heart className="h-3 w-3" />
                          </div>
                        )}
                        <div className="mt-1">
                          <p className="text-xs font-medium truncate">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  View Full Wishlist
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredWishlists.length === 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No wishlists found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or browse all occasions
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedOccasion("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}