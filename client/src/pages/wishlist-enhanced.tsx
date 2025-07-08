import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

import Header from "@/components/header";
import MobileNav from "@/components/mobile-nav";
import WishlistItem from "@/components/wishlist-item";
import VisualGiftFinder from "@/components/visual-gift-finder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Heart, Filter, Users, Share2, Crown, Gift, Star, DollarSign, Eye, Sparkles, ShoppingBag, ExternalLink, Loader2, MapPin } from "lucide-react";

export default function WishlistEnhanced() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Product search states
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    url: "",
    category: "",
    priority: "medium",
    ranking: 3, // 1-5 star ranking
    quantity: 1,
    whereToBuy: "",
    imageUrl: ""
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Product search function
  const searchProducts = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsSearchingProducts(true);
    setSearchResults([]);
    
    try {
      // Map search query to appropriate category for each service
      const categoryMap: { [key: string]: string } = {
        'electronics': 'electronics',
        'phone': 'electronics',
        'laptop': 'electronics',
        'headphones': 'electronics',
        'camera': 'electronics',
        'clothing': 'clothing',
        'shirt': 'clothing',
        'dress': 'clothing',
        'shoes': 'clothing',
        'book': 'books',
        'novel': 'books',
        'home': 'home',
        'kitchen': 'home',
        'furniture': 'home',
        'toy': 'toys',
        'game': 'toys',
        'beauty': 'beauty',
        'makeup': 'beauty',
        'skincare': 'beauty'
      };

      // Find best category match or use the search term as category
      const searchLower = searchQuery.toLowerCase();
      const category = Object.keys(categoryMap).find(key => 
        searchLower.includes(key)
      ) ? categoryMap[Object.keys(categoryMap).find(key => searchLower.includes(key))!] : searchQuery;

      // Use the unified search endpoint for better error handling
      const response = await apiRequest('GET', `/api/search/products?query=${encodeURIComponent(searchQuery)}`);
      const searchResults = await response.json();
      const allResults = searchResults || [];

      setSearchResults(allResults);
      setShowSearchResults(true);
      
      if (allResults.length === 0) {
        toast({
          title: "No Results",
          description: "No products found for your search. Try a different term.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearchingProducts(false);
    }
  };

  const addItemFromSearchResult = (item: any) => {
    setNewItem({
      name: item.name || item.title,
      description: item.description || "",
      price: item.price || "",
      url: item.affiliateUrl || item.affiliateLink || item.url || "",
      category: item.category || "",
      priority: "medium",
      ranking: 3,
      quantity: 1,
      whereToBuy: item.source || "",
      imageUrl: item.image || ""
    });
    setShowAddDialog(true);
    setShowSearchResults(false);
  };

  // Fetch personal wishlist items
  const { data: wishlistItems, isLoading: wishlistLoading } = useQuery({
    queryKey: ["/api/wishlist"],
    enabled: isAuthenticated,
  });

  // Fetch collaborative wishlists
  const { data: collaborativeWishlists, isLoading: collaborativeLoading } = useQuery({
    queryKey: ["/api/collaborative-wishlists"],
    enabled: isAuthenticated,
  });

  // Fetch shared wishlist items
  const { data: sharedItems, isLoading: sharedLoading } = useQuery({
    queryKey: ["/api/shared-wishlist-items"],
    enabled: isAuthenticated,
  });

  const addItemMutation = useMutation({
    mutationFn: async (item: any) => {
      return apiRequest("/api/wishlist", {
        method: "POST",
        body: JSON.stringify(item),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      setShowAddDialog(false);
      setNewItem({
        name: "",
        description: "",
        price: "",
        url: "",
        category: "",
        priority: "medium",
        ranking: 3,
        quantity: 1,
        whereToBuy: "",
        imageUrl: ""
      });
      toast({
        title: "Success",
        description: "Item added to your wishlist!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to wishlist.",
        variant: "destructive",
      });
    },
  });

  const handleAddItem = () => {
    if (!newItem.name) return;
    addItemMutation.mutate(newItem);
  };

  // Filter items based on search and filters
  const filteredItems = wishlistItems?.filter((item: any) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesPriority;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Gift Finder Section */}
        <div className="mb-8">
          <Card className="bg-white/20 backdrop-blur-sm border-white/30">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="h-6 w-6 text-white" />
                <h2 className="text-xl font-semibold text-white">AI Gift Finder</h2>
              </div>
              <p className="text-white/90 text-sm mb-6">
                Tell us who you're shopping for and we'll find perfect gifts from top retailers
              </p>
              
              <VisualGiftFinder onAddToWishlist={addItemFromSearchResult} />
            </CardContent>
          </Card>
        </div>

        {/* Search Results */}
        {showSearchResults && (
          <div className="mb-8">
            <Card className="bg-white/20 backdrop-blur-sm border-white/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Search Results</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowSearchResults(false)}
                    className="text-white hover:bg-white/10"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {searchResults.length === 0 ? (
                  <p className="text-white/70">No products found. Try a different search term.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.slice(0, 12).map((item, index) => (
                      <Card key={index} className="bg-white/10 border-white/20 hover:bg-white/20 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex flex-col space-y-3">
                            {item.image && (
                              <img 
                                src={item.image} 
                                alt={item.name || item.title}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            )}
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-white font-medium text-sm line-clamp-2 flex-1">
                                  {item.name || item.title}
                                </h3>
                                {item.aiEnhanced && item.relevanceScore && (
                                  <div className="ml-2 flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-green-300 font-medium">
                                      {item.relevanceScore}%
                                    </span>
                                  </div>
                                )}
                              </div>
                              {item.matchReason && (
                                <p className="text-xs text-blue-300 mb-2 italic">
                                  ✨ AI: {item.matchReason}
                                </p>
                              )}
                              <div className="flex items-center justify-between">
                                <span className="text-green-300 font-semibold">
                                  {item.price}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {item.source}
                                </Badge>
                              </div>
                            </div>
                            <Button 
                              size="sm"
                              onClick={() => addItemFromSearchResult(item)}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add to Wishlist
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mb-6 backdrop-blur-sm">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Start Your Wishlist</h1>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Create your personal wishlist and share it with friends and family. 
            Let them know exactly what would make you happy for birthdays, holidays, and special occasions.
          </p>
          
          {/* Primary Action Button */}
          <div className="mb-12">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border border-white/20 px-12 py-4 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Plus className="h-6 w-6 mr-3" />
                  Add Your First Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Wishlist Item</DialogTitle>
                  <DialogDescription>
                    Add something you'd love to receive as a gift with detailed preferences.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Web Link Section */}
                  {newItem.url && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Label htmlFor="url" className="text-sm font-medium">Web Link</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          id="url"
                          value={newItem.url}
                          onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                          placeholder="Paste link & fetch to auto-fill item image & more!"
                          className="flex-1"
                        />
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4" />
                          Fetch
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Basic Info */}
                  <div>
                    <Label htmlFor="name">Gift Name *</Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="Add your item name here..."
                      className="mt-1"
                    />
                  </div>

                  {/* Priority Ranking */}
                  <div>
                    <Label className="text-sm font-medium">Ranking (tap more stars to rank higher)</Label>
                    <div className="flex items-center space-x-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewItem({ ...newItem, ranking: star })}
                          className="transition-colors"
                        >
                          <Star 
                            className={`h-8 w-8 ${
                              star <= newItem.ranking 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price and Quantity */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        placeholder="$0.00"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">How many?</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setNewItem({ ...newItem, quantity: Math.max(1, newItem.quantity - 1) })}
                          className="px-3"
                        >
                          -
                        </Button>
                        <Input
                          id="quantity"
                          type="number"
                          value={newItem.quantity}
                          onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                          className="text-center flex-1"
                          min="1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setNewItem({ ...newItem, quantity: newItem.quantity + 1 })}
                          className="px-3"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Where to Buy */}
                  <div>
                    <Label htmlFor="whereToBuy">Where to buy</Label>
                    <Input
                      id="whereToBuy"
                      value={newItem.whereToBuy}
                      onChange={(e) => setNewItem({ ...newItem, whereToBuy: e.target.value })}
                      placeholder="Store or website name"
                      className="mt-1"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      placeholder="Add details like size, color, model, etc..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  {/* Category and Priority */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="books">Books</SelectItem>
                          <SelectItem value="home">Home & Garden</SelectItem>
                          <SelectItem value="sports">Sports & Outdoors</SelectItem>
                          <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                          <SelectItem value="toys">Toys & Games</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newItem.priority} onValueChange={(value) => setNewItem({ ...newItem, priority: value })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Image Upload Placeholder */}
                  <div>
                    <Label className="text-sm font-medium">Add Image</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                          <Gift className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Add an image</p>
                        <Button type="button" variant="outline" size="sm">
                          Choose File
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowAddDialog(false);
                        setNewItem({
                          name: "",
                          description: "",
                          price: "",
                          url: "",
                          category: "",
                          priority: "medium",
                          ranking: 3,
                          quantity: 1,
                          whereToBuy: "",
                          imageUrl: ""
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddItem}
                      disabled={!newItem.name || addItemMutation.isPending}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                    >
                      {addItemMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Wishlist Tabs */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/20 border-white/30">
            <TabsTrigger value="personal" className="data-[state=active]:bg-white/30 text-white">
              My Wishlist
            </TabsTrigger>
            <TabsTrigger value="collaborative" className="data-[state=active]:bg-white/30 text-white">
              Group Lists
            </TabsTrigger>
            <TabsTrigger value="shared" className="data-[state=active]:bg-white/30 text-white">
              Shared with Me
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            {/* Search and Filters */}
            <Card className="bg-white/20 backdrop-blur-sm border-white/30">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input
                      placeholder="Search your wishlist..."
                      className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-white/60"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                      <SelectItem value="sports">Sports & Outdoors</SelectItem>
                      <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                      <SelectItem value="toys">Toys & Games</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Personal Wishlist Items */}
            {wishlistLoading ? (
              <Card className="bg-white/20 backdrop-blur-sm border-white/30">
                <CardContent className="p-8 text-center">
                  <div className="text-white">Loading your wishlist...</div>
                </CardContent>
              </Card>
            ) : filteredItems.length === 0 ? (
              <Card className="bg-white/20 backdrop-blur-sm border-white/30">
                <CardContent className="p-8 text-center">
                  <Gift className="h-16 w-16 text-white/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Your wishlist is empty</h3>
                  <p className="text-white/70 mb-6">Add items you'd love to receive as gifts!</p>
                  <Button 
                    onClick={() => setShowAddDialog(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Item
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item: any) => (
                  <WishlistItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="collaborative" className="space-y-6">
            {/* Placeholder for collaborative wishlists */}
            <Card className="bg-white/20 backdrop-blur-sm border-white/30">
              <CardContent className="p-8 text-center">
                <Users className="h-16 w-16 text-white/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No group wishlists yet</h3>
                <p className="text-white/70">Create collaborative wishlists with friends and family!</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shared" className="space-y-6">
            {/* Placeholder for shared items */}
            <Card className="bg-white/20 backdrop-blur-sm border-white/30">
              <CardContent className="p-8 text-center">
                <Share2 className="h-16 w-16 text-white/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No shared items</h3>
                <p className="text-white/70">Items shared with you by friends will appear here!</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <MobileNav />
    </div>
  );
}