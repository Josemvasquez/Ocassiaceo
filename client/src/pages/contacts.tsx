import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

import MobileNav from "@/components/mobile-nav";
import ContactCard from "@/components/contact-card";
import AddContactDialog from "@/components/add-contact-dialog";
import ContactsImport from "@/components/contacts-import";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Users, Smartphone, Check, X, Mail, UserMinus, UserPlus } from "lucide-react";

export default function Contacts() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddContact, setShowAddContact] = useState(false);
  const [showImportContacts, setShowImportContacts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [activeTab, setActiveTab] = useState("contacts");

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

  // Fetch friends
  const { data: friends, isLoading: friendsLoading } = useQuery({
    queryKey: ["/api/friends"],
    enabled: isAuthenticated,
  });

  // Fetch friend requests
  const { data: friendRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ["/api/friends/requests"],
    enabled: isAuthenticated,
  });

  // Fetch sent requests
  const { data: sentRequests, isLoading: sentLoading } = useQuery({
    queryKey: ["/api/friends/requests/sent"],
    enabled: isAuthenticated,
  });

  // Send friend request mutation
  const sendRequestMutation = useMutation({
    mutationFn: async (email: string) => {
      await apiRequest("POST", "/api/friends/request", { receiverEmail: email });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Friend request sent successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/friends/requests/sent"] });
      setSearchEmail("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send friend request",
        variant: "destructive",
      });
    },
  });

  // Accept friend request mutation
  const acceptRequestMutation = useMutation({
    mutationFn: async (requestId: number) => {
      await apiRequest("POST", "/api/friends/accept", { requestId });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Friend request accepted!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/friends"] });
      queryClient.invalidateQueries({ queryKey: ["/api/friends/requests"] });
    },
  });

  // Decline friend request mutation
  const declineRequestMutation = useMutation({
    mutationFn: async (requestId: number) => {
      await apiRequest("POST", "/api/friends/decline", { requestId });
    },
    onSuccess: () => {
      toast({
        title: "Request declined",
        description: "Friend request has been declined",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/friends/requests"] });
    },
  });

  // Cancel sent request mutation
  const cancelRequestMutation = useMutation({
    mutationFn: async (requestId: number) => {
      await apiRequest("DELETE", `/api/friends/request/${requestId}`);
    },
    onSuccess: () => {
      toast({
        title: "Request cancelled",
        description: "Friend request has been cancelled",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/friends/requests/sent"] });
    },
  });

  // Remove friend mutation
  const removeFriendMutation = useMutation({
    mutationFn: async (friendshipId: number) => {
      await apiRequest("DELETE", `/api/friends/${friendshipId}`);
    },
    onSuccess: () => {
      toast({
        title: "Friend removed",
        description: "Friend has been removed from your list",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/friends"] });
    },
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const filteredContacts = (contacts as any[] || []).filter((contact: any) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.relationship?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName || lastName) {
      return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    }
    if (email) {
      const emailName = email.split('@')[0];
      const parts = emailName.split(/[._-]/);
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return emailName.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchEmail.trim()) {
      sendRequestMutation.mutate(searchEmail.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">My Circle</h1>
            <p className="text-white/90 mt-1">Manage your contacts, friends, and connections</p>
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

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm border border-white/20">
            <TabsTrigger value="contacts" className="data-[state=active]:bg-white/20 text-white">
              <Users className="h-4 w-4 mr-2" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="friends" className="data-[state=active]:bg-white/20 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Friends
            </TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-white/20 text-white">
              <Mail className="h-4 w-4 mr-2" />
              Requests
              {(friendRequests as any[] || []).length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-xs">
                  {(friendRequests as any[] || []).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="find" className="data-[state=active]:bg-white/20 text-white">
              <Search className="h-4 w-4 mr-2" />
              Find Friends
            </TabsTrigger>
          </TabsList>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="mt-8">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

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
            ) : (contacts as any[] || []).length > 0 ? (
              <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                <CardContent className="p-8 text-center">
                  <Search className="h-12 w-12 text-white/70 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No contacts found</h3>
                  <p className="text-white/80">Try adjusting your search terms</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 text-white/70 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-white mb-4">No contacts yet</h3>
                  <p className="text-white/80 mb-6 max-w-md mx-auto">
                    Start building your circle by adding friends and family members. 
                    Keep track of their special dates and preferences.
                  </p>
                  <Button
                    onClick={() => setShowAddContact(true)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Contact
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends" className="mt-8">
            {friendsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse bg-white/10 backdrop-blur-sm border border-white/20">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-white/20 rounded w-1/2"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (friends as any[] || []).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(friends as any[]).map((friend: any) => (
                  <Card key={friend.id} className="bg-white/10 backdrop-blur-sm border border-white/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={friend.profileImageUrl} />
                            <AvatarFallback className="bg-blue-500 text-white">
                              {getInitials(friend.firstName, friend.lastName, friend.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-white font-semibold">
                              {friend.firstName && friend.lastName 
                                ? `${friend.firstName} ${friend.lastName}`
                                : friend.email?.split('@')[0] || 'Friend'
                              }
                            </h3>
                            <p className="text-white/70 text-sm">{friend.email}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFriendMutation.mutate(friend.friendshipId)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                <CardContent className="p-12 text-center">
                  <UserPlus className="h-16 w-16 text-white/70 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-white mb-4">No friends yet</h3>
                  <p className="text-white/80 mb-6 max-w-md mx-auto">
                    Connect with friends to share wishlists and special dates together.
                  </p>
                  <Button
                    onClick={() => setActiveTab("find")}
                    className="bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Find Friends
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Find Friends Tab */}
          <TabsContent value="find" className="mt-8">
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Find Friends by Email</h3>
                <form onSubmit={handleSendRequest} className="space-y-4">
                  <div className="flex space-x-4">
                    <Input
                      type="email"
                      placeholder="Enter email address..."
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                    <Button
                      type="submit"
                      disabled={sendRequestMutation.isPending || !searchEmail.trim()}
                      className="bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600"
                    >
                      {sendRequestMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Send Request
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-white/70 text-sm">
                    Enter the email address of someone you'd like to connect with on Ocassia.
                  </p>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Friend Requests Tab */}
          <TabsContent value="requests" className="mt-8">
            <div className="space-y-6">
              {/* Incoming Requests */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Friend Requests</h3>
                {(friendRequests as any[] || []).length > 0 ? (
                  <div className="space-y-4">
                    {(friendRequests as any[]).map((request: any) => (
                      <Card key={request.id} className="bg-white/10 backdrop-blur-sm border border-white/20">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={request.sender?.profileImageUrl} />
                                <AvatarFallback className="bg-blue-500 text-white">
                                  {getInitials(request.sender?.firstName, request.sender?.lastName, request.sender?.email)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="text-white font-semibold">
                                  {request.sender?.firstName && request.sender?.lastName 
                                    ? `${request.sender.firstName} ${request.sender.lastName}`
                                    : request.sender?.email?.split('@')[0] || 'Unknown User'
                                  }
                                </h4>
                                <p className="text-white/70 text-sm">{request.sender?.email}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => acceptRequestMutation.mutate(request.id)}
                                className="bg-green-500 hover:bg-green-600 text-white"
                                disabled={acceptRequestMutation.isPending}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => declineRequestMutation.mutate(request.id)}
                                className="border-red-500 text-red-400 hover:bg-red-500/20"
                                disabled={declineRequestMutation.isPending}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                    <CardContent className="p-8 text-center">
                      <Mail className="h-12 w-12 text-white/70 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-white mb-2">No pending requests</h4>
                      <p className="text-white/80">You don't have any friend requests at the moment.</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sent Requests */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Sent Requests</h3>
                {(sentRequests as any[] || []).length > 0 ? (
                  <div className="space-y-4">
                    {(sentRequests as any[]).map((request: any) => (
                      <Card key={request.id} className="bg-white/10 backdrop-blur-sm border border-white/20">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={request.receiver?.profileImageUrl} />
                                <AvatarFallback className="bg-blue-500 text-white">
                                  {getInitials(request.receiver?.firstName, request.receiver?.lastName, request.receiver?.email)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="text-white font-semibold">
                                  {request.receiver?.firstName && request.receiver?.lastName 
                                    ? `${request.receiver.firstName} ${request.receiver.lastName}`
                                    : request.receiver?.email?.split('@')[0] || 'Unknown User'
                                  }
                                </h4>
                                <p className="text-white/70 text-sm">{request.receiver?.email}</p>
                                <Badge variant="secondary" className="mt-1 bg-yellow-500/20 text-yellow-300 text-xs">
                                  Pending
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelRequestMutation.mutate(request.id)}
                              className="border-red-500 text-red-400 hover:bg-red-500/20"
                              disabled={cancelRequestMutation.isPending}
                            >
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                    <CardContent className="p-8 text-center">
                      <UserPlus className="h-12 w-12 text-white/70 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-white mb-2">No sent requests</h4>
                      <p className="text-white/80">You haven't sent any friend requests yet.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <AddContactDialog 
          open={showAddContact} 
          onOpenChange={setShowAddContact} 
        />

        <ContactsImport
          open={showImportContacts}
          onOpenChange={setShowImportContacts}
        />
      </main>
      
      <MobileNav />
    </div>
  );
}