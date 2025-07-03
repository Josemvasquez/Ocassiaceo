import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

import MobileNav from "@/components/mobile-nav";
import ContactCard from "@/components/contact-card";
import AddContactDialog from "@/components/add-contact-dialog";
import ContactsImport from "@/components/contacts-import";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users, Smartphone } from "lucide-react";

export default function Contacts() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [showAddContact, setShowAddContact] = useState(false);
  const [showImportContacts, setShowImportContacts] = useState(false);
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

  // Fetch contacts
  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ["/api/contacts"],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const filteredContacts = contacts?.filter((contact: any) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.relationship?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600">

      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Your Circle</h1>
            <p className="text-white/90 mt-1">Manage your contacts and their special dates</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowImportContacts(true)}
              className="bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 border border-white/20"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Import Contacts
            </Button>
            <Button
              onClick={() => setShowAddContact(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 border border-white/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Contacts Grid */}
        {contactsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse bg-white/10 backdrop-blur-sm border border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-white/20 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-white/20 rounded w-full mb-2"></div>
                  <div className="h-3 bg-white/20 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredContacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact: any) => (
              <Card key={contact.id} className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-6">
                  <ContactCard contact={contact} expanded />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : contacts && contacts.length > 0 ? (
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-white/70 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No contacts found</h3>
              <p className="text-white/80">Try adjusting your search terms</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No contacts yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start building your circle by adding friends and family members. 
                Keep track of their special dates and preferences.
              </p>
              <Button
                onClick={() => setShowAddContact(true)}
                className="bg-coral hover:bg-coral/90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Contact
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Floating Action Button */}
      <Button
        onClick={() => setShowAddContact(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-coral text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 z-40"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <MobileNav />
      
      <AddContactDialog open={showAddContact} onOpenChange={setShowAddContact} />
      <ContactsImport open={showImportContacts} onOpenChange={setShowImportContacts} />
    </div>
  );
}
