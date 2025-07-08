import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

import MobileNav from "@/components/mobile-nav";
import DateCard from "@/components/date-card";
import ContactCard from "@/components/contact-card";
import WishlistItem from "@/components/wishlist-item";
import AddDateDialog from "@/components/add-date-dialog";
import AddContactDialog from "@/components/add-contact-dialog";
import ContactsImport from "@/components/contacts-import";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Gift, Calendar, Users, Heart, Bell, UserPlus, Smartphone } from "lucide-react";
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
    queryKey: ["/api/dates/upcoming", { limit: 3 }],
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

        {/* App Store Download Footer */}
        <section className="mt-16 mb-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Get the Ocassia app</h3>
          <p className="text-white/80 mb-6">Never miss another special occasion</p>
          
          <div className="flex justify-center items-center space-x-4">
            {/* App Store Button */}
            <a
              href="#"
              className="inline-block transform hover:scale-105 transition-transform duration-200"
              onClick={(e) => e.preventDefault()}
            >
              <div className="bg-black rounded-lg px-4 py-2 flex items-center space-x-3 min-w-[140px]">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-300">Download on the</div>
                  <div className="text-sm font-semibold text-white">App Store</div>
                </div>
              </div>
            </a>

            {/* Google Play Button */}
            <a
              href="#"
              className="inline-block transform hover:scale-105 transition-transform duration-200"
              onClick={(e) => e.preventDefault()}
            >
              <div className="bg-black rounded-lg px-4 py-2 flex items-center space-x-3 min-w-[140px]">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-300">GET IT ON</div>
                  <div className="text-sm font-semibold text-white">Google Play</div>
                </div>
              </div>
            </a>
          </div>
          
          <p className="text-white/60 text-sm mt-4">Coming soon to mobile devices</p>
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
