import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

import MobileNav from "@/components/mobile-nav";
import DateCard from "@/components/date-card";
import RecommendationCard from "@/components/recommendation-card";
import ContactCard from "@/components/contact-card";
import WishlistItem from "@/components/wishlist-item";
import AddDateDialog from "@/components/add-date-dialog";
import AddContactDialog from "@/components/add-contact-dialog";
import ContactsImport from "@/components/contacts-import";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Gift, Calendar, Users, Heart, Bell, Utensils, Plane, UserPlus, Smartphone } from "lucide-react";
import { useState } from "react";

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
};

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [showAddDate, setShowAddDate] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showImportContacts, setShowImportContacts] = useState(false);

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

  // Fetch upcoming dates
  const { data: upcomingDates, isLoading: datesLoading } = useQuery({
    queryKey: ["/api/dates/upcoming?limit=3"],
    enabled: isAuthenticated,
  });

  // Fetch contacts
  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ["/api/contacts"],
    enabled: isAuthenticated,
  });

  // Fetch wishlist items
  const { data: wishlistItems, isLoading: wishlistLoading } = useQuery({
    queryKey: ["/api/wishlist"],
    enabled: isAuthenticated,
  });

  // Fetch recommendations from all 6 affiliate partners
  const { data: giftRecommendations } = useQuery({
    queryKey: ["/api/recommendations/gifts"],
    enabled: isAuthenticated,
  });

  const { data: restaurantRecommendations } = useQuery({
    queryKey: ["/api/recommendations/restaurants"],
    enabled: isAuthenticated,
  });

  const { data: travelRecommendations } = useQuery({
    queryKey: ["/api/recommendations/travel"],
    enabled: isAuthenticated,
  });

  const { data: flowersRecommendations } = useQuery({
    queryKey: ["/api/recommendations/flowers"],
    enabled: isAuthenticated,
  });

  const { data: bestBuyRecommendations } = useQuery({
    queryKey: ["/api/recommendations/bestbuy"],
    enabled: isAuthenticated,
  });

  const { data: targetRecommendations } = useQuery({
    queryKey: ["/api/recommendations/target"],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const upcomingCount = upcomingDates?.length || 0;
  const firstName = user?.firstName || "there";

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600">
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="mb-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Good {getTimeOfDay()}, {firstName}
            </h2>
            <p className="text-xl text-white/90 font-light">
              {upcomingCount > 0 
                ? `${upcomingCount} special moments coming up`
                : "All caught up for today"
              }
            </p>
          </div>
          
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            <Button
              onClick={() => setShowAddDate(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 border border-white/20 px-8 py-3 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Date
            </Button>
            <Button
              onClick={() => setShowAddContact(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 border border-white/20 px-8 py-3 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Add Contact
            </Button>
            <Button
              onClick={() => setShowImportContacts(true)}
              className="bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 border border-white/20 px-8 py-3 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <Smartphone className="h-5 w-5 mr-2" />
              Import
            </Button>
          </div>
        </section>

        {/* Upcoming Dates Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Upcoming Special Dates</h3>
            <p className="text-white/90 text-lg">Important moments you won't want to miss</p>
          </div>

          {datesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse bg-white/10 backdrop-blur-sm border border-white/20">
                  <CardContent className="p-6">
                    <div className="h-20 bg-white/20 rounded mb-4"></div>
                    <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-white/20 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcomingDates && upcomingDates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingDates.map((date: any) => (
                <DateCard key={date.id} date={date} />
              ))}
            </div>
          ) : (
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-white/70 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">No upcoming dates</h4>
                <p className="text-white/80 mb-4">Add your first special date to get started!</p>
                <Button onClick={() => setShowAddDate(true)} className="bg-white text-blue-600 hover:bg-gray-100 font-bold">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Date
                </Button>
              </CardContent>
            </Card>
          )}
        </section>



        {/* Contacts and Wishlist Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Contacts Management */}
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Your Circle</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddContact(true)}
                  className="text-white hover:text-white/80 hover:bg-white/10"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Person
                </Button>
              </div>

              <div className="space-y-4">
                {contactsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-4 p-3 animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : contacts && contacts.length > 0 ? (
                  <>
                    {contacts.slice(0, 4).map((contact: any) => (
                      <ContactCard key={contact.id} contact={contact} />
                    ))}
                    {contacts.length > 4 && (
                      <Button
                        variant="outline"
                        className="w-full border-dashed hover:border-coral hover:text-coral"
                      >
                        View All Contacts ({contacts.length} total)
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No contacts yet</p>
                    <Button
                      onClick={() => setShowAddContact(true)}
                      className="bg-coral hover:bg-coral/90 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Contact
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Wishlist Section */}
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">My Wishlist</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-white/80 hover:bg-white/10"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {wishlistLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-4 p-3 animate-pulse">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : wishlistItems && wishlistItems.length > 0 ? (
                  <>
                    {wishlistItems.slice(0, 3).map((item: any) => (
                      <WishlistItem key={item.id} item={item} />
                    ))}
                    {wishlistItems.length > 3 && (
                      <Button
                        variant="outline"
                        className="w-full border-dashed hover:border-coral hover:text-coral"
                      >
                        View Full Wishlist ({wishlistItems.length} items)
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Your wishlist is empty</p>
                    <Button className="bg-coral hover:bg-coral/90 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Item
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations Preview Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">AI-Curated Recommendations</h3>
            <p className="text-white/90 text-lg">Perfect gifts and experiences for your loved ones</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Amazon Recommendation */}
            {giftRecommendations && giftRecommendations[0] && (
              <RecommendationCard
                item={giftRecommendations[0]}
                type="gift"
              />
            )}

            {/* OpenTable Recommendation */}
            {restaurantRecommendations && restaurantRecommendations[0] && (
              <RecommendationCard
                item={restaurantRecommendations[0]}
                type="restaurant"
              />
            )}

            {/* Expedia Recommendation */}
            {travelRecommendations && travelRecommendations[0] && (
              <RecommendationCard
                item={travelRecommendations[0]}
                type="travel"
              />
            )}

            {/* Flowers.com Recommendation */}
            {flowersRecommendations && flowersRecommendations[0] && (
              <RecommendationCard
                item={flowersRecommendations[0]}
                type="flowers"
              />
            )}

            {/* Best Buy Recommendation */}
            {bestBuyRecommendations && bestBuyRecommendations[0] && (
              <RecommendationCard
                item={bestBuyRecommendations[0]}
                type="bestbuy"
              />
            )}

            {/* Target Recommendation */}
            {targetRecommendations && targetRecommendations[0] && (
              <RecommendationCard
                item={targetRecommendations[0]}
                type="target"
              />
            )}
          </div>

          <div className="text-center">
            <Button
              onClick={() => setLocation("/recommendations")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border border-white/20 px-8 py-3 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <Gift className="h-5 w-5 mr-2" />
              View All Recommendations
            </Button>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button
              variant="outline"
              onClick={() => setShowAddDate(true)}
              className="p-6 h-auto flex-col border-2 border-white/20 hover:border-blue-300 hover:shadow-xl transition-all group bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-all">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">Add Special Date</h4>
              <p className="text-sm text-white/90 text-center">Quickly add birthdays, anniversaries, and special occasions</p>
            </Button>

            <Button
              variant="outline"
              onClick={() => setLocation("/recommendations")}
              className="p-6 h-auto flex-col border-2 border-white/20 hover:border-blue-300 hover:shadow-xl transition-all group bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-all">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">Get AI Suggestions</h4>
              <p className="text-sm text-white/90 text-center">Personalized gift and experience recommendations</p>
            </Button>

            <Button
              variant="outline"
              onClick={() => setLocation("/friends")}
              className="p-6 h-auto flex-col border-2 border-white/20 hover:border-blue-300 hover:shadow-xl transition-all group bg-gradient-to-br from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-all">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">Invite Friends</h4>
              <p className="text-sm text-white/90 text-center">Share the love and invite friends to join Ocassia</p>
            </Button>
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <Button
        onClick={() => setShowAddDate(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-coral text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 z-40"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <MobileNav />
      
      <AddDateDialog open={showAddDate} onOpenChange={setShowAddDate} />
      <AddContactDialog open={showAddContact} onOpenChange={setShowAddContact} />
      <ContactsImport open={showImportContacts} onOpenChange={setShowImportContacts} />
    </div>
  );
}
