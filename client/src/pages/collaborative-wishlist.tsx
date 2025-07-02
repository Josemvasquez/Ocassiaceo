import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import MobileNav from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Users, Share2, Heart } from "lucide-react";

export default function CollaborativeWishlist() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

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

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-gray">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-gray">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
            <Users className="w-6 h-6 text-teal" />
            Collaborative Wishlists
          </h1>
          <Button className="bg-teal hover:bg-teal/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Group Wishlist
          </Button>
        </div>

        <Tabs defaultValue="collaborative" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="collaborative">My Group Wishlists</TabsTrigger>
            <TabsTrigger value="shared">Shared with Me</TabsTrigger>
          </TabsList>

          <TabsContent value="collaborative" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-charcoal">Group Wishlists</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search wishlists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 border-sage/20 focus:border-teal"
                />
              </div>
            </div>

            {collaborativeLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collaborativeWishlists?.map((wishlist: any) => (
                  <Card key={wishlist.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{wishlist.name}</CardTitle>
                        <Badge variant="secondary" className="bg-teal/10 text-teal">
                          <Users className="w-3 h-3 mr-1" />
                          {wishlist.memberCount || 0}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sage text-sm mb-4">{wishlist.description || "No description"}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-sage">
                          {wishlist.itemCount || 0} items
                        </span>
                        <Button variant="outline" size="sm" className="border-teal text-teal hover:bg-teal hover:text-white">
                          View Wishlist
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {(!collaborativeWishlists || collaborativeWishlists.length === 0) && !collaborativeLoading && (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 text-sage/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-charcoal mb-2">No group wishlists yet</h3>
                  <p className="text-sage mb-4">
                    Create collaborative wishlists to plan gifts together with friends and family
                  </p>
                  <Button className="bg-teal hover:bg-teal/90 text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Create Your First Group Wishlist
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="shared" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-charcoal">Items Shared with Me</h2>
              <Badge variant="outline" className="border-coral text-coral">
                {sharedWishlistItems?.length || 0} items
              </Badge>
            </div>

            {sharedLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sharedWishlistItems?.map((sharedItem: any) => (
                  <Card key={sharedItem.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{sharedItem.wishlistItem?.name || "Shared Item"}</CardTitle>
                        <Badge variant="secondary" className="bg-coral/10 text-coral">
                          <Share2 className="w-3 h-3 mr-1" />
                          Shared
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sage text-sm mb-2">{sharedItem.wishlistItem?.description || "No description"}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-sage">
                          Shared by {sharedItem.owner?.firstName || "Unknown"} {sharedItem.owner?.lastName || ""}
                        </span>
                        {sharedItem.wishlistItem?.price && (
                          <span className="font-semibold text-charcoal">
                            ${sharedItem.wishlistItem.price}
                          </span>
                        )}
                      </div>
                      {sharedItem.canEdit && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          Can Edit
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {(!sharedWishlistItems || sharedWishlistItems.length === 0) && !sharedLoading && (
              <Card>
                <CardContent className="text-center py-12">
                  <Share2 className="w-16 h-16 text-sage/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-charcoal mb-2">No shared items</h3>
                  <p className="text-sage mb-4">
                    When friends share wishlist items with you, they'll appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <MobileNav />
    </div>
  );
}