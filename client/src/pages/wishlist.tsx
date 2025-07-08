import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

import Header from "@/components/header";
import MobileNav from "@/components/mobile-nav";
import WishlistItem from "@/components/wishlist-item";
import SimpleGiftFinder from "@/components/ai-gift-finder-simple";
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

export default function Wishlist() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // AI Gift Finder states
  const [showAIFinder, setShowAIFinder] = useState(false);
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
      const [amazonResults, bestBuyResults, targetResults] = await Promise.allSettled([
        apiRequest(`/api/recommendations/gifts?query=${encodeURIComponent(searchQuery)}`),
        apiRequest(`/api/recommendations/bestbuy?category=${encodeURIComponent(searchQuery)}`),
        apiRequest(`/api/recommendations/target?category=${encodeURIComponent(searchQuery)}`)
      ]);

      const allResults: any[] = [];
      
      if (amazonResults.status === 'fulfilled') {
        allResults.push(...amazonResults.value.map((item: any) => ({ ...item, source: 'Amazon' })));
      }
      if (bestBuyResults.status === 'fulfilled') {
        allResults.push(...bestBuyResults.value.map((item: any) => ({ ...item, source: 'Best Buy' })));
      }
      if (targetResults.status === 'fulfilled') {
        allResults.push(...targetResults.value.map((item: any) => ({ ...item, source: 'Target' })));
      }

      setSearchResults(allResults);
      setShowSearchResults(true);
    } catch (error) {
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
  const { data: sharedWishlistItems, isLoading: sharedLoading } = useQuery({
    queryKey: ["/api/sharing/wishlist-items"],
    enabled: isAuthenticated,
  });

  // Add wishlist item mutation
  const addItemMutation = useMutation({
    mutationFn: async (item: any) => {
      return await apiRequest("POST", "/api/wishlist", item);
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
        priority: "medium"
      });
      toast({
        title: "Success",
        description: "Item added to your wishlist!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive",
      });
    },
  });

  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an item name",
        variant: "destructive",
      });
      return;
    }
    addItemMutation.mutate(newItem);
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-gray">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral"></div>
      </div>
    );
  }

  const filteredItems = wishlistItems?.filter((item: any) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;
    
    return matchesSearch && matchesCategory && matchesPriority;
  }) || [];

  const categories = Array.from(new Set(wishlistItems?.map((item: any) => item.category).filter(Boolean))) || [];
  const totalValue = wishlistItems?.reduce((sum: number, item: any) => sum + (parseFloat(item.price) || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Search Section */}
        <div className="mb-8">
          <Card className="bg-white/20 backdrop-blur-sm border-white/30">
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Search className="h-6 w-6 text-white" />
                  <h2 className="text-xl font-semibold text-white">Search Products</h2>
                </div>
                <p className="text-white/90 text-sm mb-4">
                  Search across Amazon, Best Buy, and Target to find products for your wishlist
                </p>
                <div className="flex space-x-3">
                  <Input
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                    placeholder="Search for products..."
                    className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/60"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        searchProducts(productSearchTerm);
                      }
                    }}
                  />
                  <Button 
                    onClick={() => searchProducts(productSearchTerm)}
                    disabled={isSearchingProducts || !productSearchTerm.trim()}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    {isSearchingProducts ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
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
                              <h3 className="text-white font-medium text-sm line-clamp-2">
                                {item.name || item.title}
                              </h3>
                              <div className="flex items-center justify-between mt-2">
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
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Add Wishlist Item</DialogTitle>
                  <DialogDescription>
                    Use our AI Gift Finder for personalized recommendations or manually add an item.
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="ai-finder" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ai-finder" className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      AI Gift Finder
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Manual Entry
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ai-finder" className="mt-6">
                    <SimpleGiftFinder 
                      onAddToWishlist={addItemFromSearchResult}
                    />
                  </TabsContent>
                  
                  <TabsContent value="manual" className="mt-6">
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div>
                    <Label htmlFor="name">Item Name *</Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="e.g., Wireless Headphones"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      placeholder="Optional details about the item..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        placeholder="e.g., Electronics"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="url">Product URL</Label>
                    <Input
                      id="url"
                      value={newItem.url}
                      onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newItem.priority} onValueChange={(value) => setNewItem({ ...newItem, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddItem}
                      disabled={addItemMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    >
                      {addItemMutation.isPending ? "Adding..." : "Add Item"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddDialog(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Feature Highlights */}
          <div className="flex justify-center items-center space-x-8 text-white/70 text-sm mb-8">
            <div className="flex items-center">
              <Gift className="h-5 w-5 mr-2" />
              Easy to share
            </div>
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              AI recommendations
            </div>
            <div className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Privacy controlled
            </div>
          </div>
          
          {/* Stats Cards - Only show if user has items */}
          {wishlistItems && wishlistItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                <CardContent className="p-6 text-center">
                  <Gift className="h-8 w-8 text-white mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{wishlistItems?.length || 0}</p>
                  <p className="text-white/80 text-sm">Wishlist Items</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-white mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">${totalValue.toFixed(2)}</p>
                  <p className="text-white/80 text-sm">Total Value</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                <CardContent className="p-6 text-center">
                  <Share2 className="h-8 w-8 text-white mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{sharedWishlistItems?.length || 0}</p>
                  <p className="text-white/80 text-sm">Shared Items</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Secondary Actions - Only show if user has items */}
        {wishlistItems && wishlistItems.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border border-white/20 px-8 py-3 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Add Wishlist Item</DialogTitle>
                  <DialogDescription>
                    Use our AI Gift Finder for personalized recommendations or manually add an item.
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="ai-finder" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ai-finder" className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      AI Gift Finder
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Manual Entry
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ai-finder" className="mt-6">
                    <SimpleGiftFinder 
                      onAddToWishlist={addItemFromSearchResult}
                    />
                  </TabsContent>
                  
                  <TabsContent value="manual" className="mt-6">
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div>
                    <Label htmlFor="name">Item Name *</Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="e.g., Wireless Headphones"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      placeholder="Optional details about the item..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        placeholder="e.g., Electronics"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="url">Product URL</Label>
                    <Input
                      id="url"
                      value={newItem.url}
                      onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newItem.priority} onValueChange={(value) => setNewItem({ ...newItem, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddItem}
                      disabled={addItemMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    >
                      {addItemMutation.isPending ? "Adding..." : "Add Item"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddDialog(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg rounded-2xl backdrop-blur-sm bg-transparent hover:text-white"
            >
              <Share2 className="h-5 w-5 mr-2 text-white" />
              <span className="text-white">Share Wishlist</span>
            </Button>
          </div>
        )}

        {/* Inspiration Section - Only show if no items */}
        {(!wishlistItems || wishlistItems.length === 0) && (
          <div className="mb-12 text-center">
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
              <CardContent className="p-8">
                <ShoppingBag className="h-12 w-12 text-white/60 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-2">Need inspiration?</h4>
                <p className="text-white/70 mb-6">Browse our AI-curated recommendations for gift ideas</p>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => window.location.href = "/recommendations"}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Browse Gift Ideas
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        {wishlistItems && wishlistItems.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    placeholder="Search your wishlist..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full sm:w-40 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Wishlist Content */}
        {wishlistLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 animate-pulse">
                <CardContent className="p-6">
                  <div className="w-full h-40 bg-white/20 rounded-lg mb-4"></div>
                  <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-white/20 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-white/20 rounded w-1/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item: any) => (
              <Card key={item.id} className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-0">
                  <WishlistItem item={item} expanded />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : wishlistItems && wishlistItems.length > 0 ? (
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardContent className="p-12 text-center">
              <Filter className="h-16 w-16 text-white/60 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-4">No items match your filters</h3>
              <p className="text-white/80 mb-6">Try adjusting your search or filter criteria to find what you're looking for</p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setPriorityFilter("all");
                }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </main>

      {/* Floating Action Button */}
      <Button
        onClick={() => setShowAddDialog(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 z-40"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <MobileNav />
    </div>
  );
}
