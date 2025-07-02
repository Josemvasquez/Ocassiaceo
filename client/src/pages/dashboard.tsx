import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/header";
import MobileNav from "@/components/mobile-nav";
import DateCard from "@/components/date-card";
import RecommendationCard from "@/components/recommendation-card";
import ContactCard from "@/components/contact-card";
import WishlistItem from "@/components/wishlist-item";
import AddDateDialog from "@/components/add-date-dialog";
import AddContactDialog from "@/components/add-contact-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Gift, Calendar, Users, Heart, Bell, Utensils, Plane, UserPlus } from "lucide-react";
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
  const [showAddDate, setShowAddDate] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);

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

  // Fetch recommendations
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

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-gray">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral"></div>
      </div>
    );
  }

  const upcomingCount = upcomingDates?.length || 0;
  const firstName = user?.firstName || "there";

  return (
    <div className="min-h-screen bg-warm-white">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="mb-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-primary mb-2">
              Good {getTimeOfDay()}, {firstName}
            </h2>
            <p className="text-lg text-secondary">
              {upcomingCount > 0 
                ? `${upcomingCount} special moments coming up`
                : "All caught up for today"
              }
            </p>
          </div>
          
          <div className="flex justify-center gap-3 mb-8">
            <Button
              onClick={() => setShowAddDate(true)}
              className="bg-soft-blue hover:bg-soft-blue/90 text-white px-6 py-2.5 font-medium rounded-2xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Date
            </Button>
            <Button
              onClick={() => setShowAddContact(true)}
              variant="outline"
              className="border-soft-blue text-soft-blue hover:bg-very-soft-blue px-6 py-2.5 font-medium rounded-2xl"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </section>

        {/* Upcoming Dates Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-3xl font-bold text-navy mb-2">Upcoming Special Dates</h3>
              <p className="text-secondary">Important moments you won't want to miss</p>
            </div>
            <Button variant="ghost" className="text-coral hover:text-coral/80 font-medium">
              View All →
            </Button>
          </div>

          {datesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No upcoming dates</h4>
                <p className="text-gray-600 mb-4">Add your first special date to get started!</p>
                <Button onClick={() => setShowAddDate(true)} className="bg-coral hover:bg-coral/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Date
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Recommendations Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">AI Curated Recommendations</h3>
            <div className="flex space-x-2">
              <Button size="sm" className="bg-coral text-white">Gifts</Button>
              <Button size="sm" variant="outline">Restaurants</Button>
              <Button size="sm" variant="outline">Travel</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {giftRecommendations?.slice(0, 2).map((gift: any) => (
              <RecommendationCard key={gift.id} item={gift} type="gift" />
            ))}
            {restaurantRecommendations?.slice(0, 1).map((restaurant: any) => (
              <RecommendationCard key={restaurant.id} item={restaurant} type="restaurant" />
            ))}
            {travelRecommendations?.slice(0, 1).map((travel: any) => (
              <RecommendationCard key={travel.id} item={travel} type="travel" />
            ))}
          </div>
        </section>

        {/* Contacts and Wishlist Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Contacts Management */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Your Circle</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddContact(true)}
                  className="text-coral hover:text-coral/80"
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
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">My Wishlist</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-coral hover:text-coral/80"
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

        {/* Quick Actions Section */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button
              variant="outline"
              onClick={() => setShowAddDate(true)}
              className="p-6 h-auto flex-col border-2 hover:border-coral hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-coral bg-opacity-10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-coral group-hover:text-white transition-all">
                <Calendar className="h-6 w-6 text-coral group-hover:text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Add Special Date</h4>
              <p className="text-sm text-gray-600 text-center">Quickly add birthdays, anniversaries, and special occasions</p>
            </Button>

            <Button
              variant="outline"
              className="p-6 h-auto flex-col border-2 hover:border-teal hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-teal bg-opacity-10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal group-hover:text-white transition-all">
                <Gift className="h-6 w-6 text-teal group-hover:text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Get AI Suggestions</h4>
              <p className="text-sm text-gray-600 text-center">Personalized gift and experience recommendations</p>
            </Button>

            <Button
              variant="outline"
              className="p-6 h-auto flex-col border-2 hover:border-warm-yellow hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-warm-yellow bg-opacity-20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-warm-yellow group-hover:text-gray-800 transition-all">
                <UserPlus className="h-6 w-6 text-yellow-600 group-hover:text-gray-800" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Invite Friends</h4>
              <p className="text-sm text-gray-600 text-center">Share the love and invite friends to join RemindMe</p>
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
    </div>
  );
}
