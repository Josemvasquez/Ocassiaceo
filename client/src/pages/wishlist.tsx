import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

import Header from "@/components/header";
import MobileNav from "@/components/mobile-nav";
import WishlistItem from "@/components/wishlist-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Heart, Filter, Users, Share2, Crown, Gift, Star, DollarSign, Eye, Sparkles, ShoppingBag } from "lucide-react";

export default function Wishlist() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    url: "",
    category: "",
    priority: "medium"
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mb-6 backdrop-blur-sm">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">My Wishlist</h1>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Create and share your perfect wishlist. Let friends and family know exactly what would make you happy.
          </p>
          
          {/* Stats Cards */}
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
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border border-white/20 px-8 py-3 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <Plus className="h-5 w-5 mr-2" />
                Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Wishlist Item</DialogTitle>
                <DialogDescription>
                  Add something you'd love to receive as a gift.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
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
        ) : (
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardContent className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-full mb-8">
                <Heart className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Start Your Wishlist</h3>
              <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
                Create your personal wishlist and share it with friends and family. 
                Let them know exactly what would make you happy for birthdays, holidays, and special occasions.
              </p>
              <div className="space-y-4">
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 px-8 py-3 text-lg rounded-2xl shadow-xl"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Item
                </Button>
                <div className="flex justify-center items-center space-x-6 text-white/60 text-sm">
                  <div className="flex items-center">
                    <Gift className="h-4 w-4 mr-2" />
                    Easy to share
                  </div>
                  <div className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI recommendations
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Privacy controlled
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendation Footer */}
        {(!wishlistItems || wishlistItems.length === 0) && (
          <div className="mt-16 text-center">
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
