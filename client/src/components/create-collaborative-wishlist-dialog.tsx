import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, X, UserPlus } from "lucide-react";

interface CreateCollaborativeWishlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateCollaborativeWishlistDialog({ open, onOpenChange }: CreateCollaborativeWishlistDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Fetch friends list
  const { data: friends } = useQuery({
    queryKey: ["/api/friends"],
    enabled: open,
  });

  // Create collaborative wishlist mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!name.trim()) {
        throw new Error("Please enter a wishlist name");
      }

      const wishlistData = {
        name: name.trim(),
        description: description.trim() || undefined,
        isPublic,
      };

      // Create the wishlist
      const wishlist = await apiRequest("/api/collaborative-wishlists", "POST", wishlistData);

      // Add selected members
      for (const memberId of selectedMembers) {
        await apiRequest(`/api/collaborative-wishlists/${wishlist.id}/members`, "POST", {
          userId: memberId,
          role: "member",
        });
      }

      return wishlist;
    },
    onSuccess: () => {
      toast({
        title: "Wishlist Created",
        description: "Your collaborative wishlist has been created successfully.",
      });
      
      // Invalidate collaborative wishlists query
      queryClient.invalidateQueries({ queryKey: ["/api/collaborative-wishlists"] });
      
      onOpenChange(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create wishlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setName("");
    setDescription("");
    setIsPublic(false);
    setSelectedMembers([]);
  };

  const addMember = (friendId: string) => {
    if (!selectedMembers.includes(friendId)) {
      setSelectedMembers([...selectedMembers, friendId]);
    }
  };

  const removeMember = (friendId: string) => {
    setSelectedMembers(selectedMembers.filter(id => id !== friendId));
  };

  const getSelectedFriend = (friendId: string) => {
    return (friends as any[])?.find(friend => friend.id === friendId);
  };

  const handleCreate = () => {
    createMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Create Collaborative Wishlist
          </DialogTitle>
          <DialogDescription>
            Create a shared wishlist that friends and family can contribute to and view together.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wishlist-name">Wishlist Name *</Label>
            <Input
              id="wishlist-name"
              placeholder="e.g., Birthday Gifts, Wedding Registry, Holiday Wishes"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wishlist-description">Description (Optional)</Label>
            <Textarea
              id="wishlist-description"
              placeholder="Add details about this wishlist..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="public-wishlist" className="text-sm font-medium">
                Make Public
              </Label>
              <p className="text-xs text-gray-600">
                Anyone with the link can view this wishlist
              </p>
            </div>
            <Switch
              id="public-wishlist"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          <div className="space-y-3">
            <Label>Invite Friends</Label>
            
            {selectedMembers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((memberId) => {
                  const friend = getSelectedFriend(memberId);
                  return (
                    <Badge key={memberId} variant="secondary" className="flex items-center gap-1">
                      {friend?.firstName && friend?.lastName 
                        ? `${friend.firstName} ${friend.lastName}`
                        : friend?.email
                      }
                      <button
                        onClick={() => removeMember(memberId)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}

            <Select onValueChange={addMember}>
              <SelectTrigger>
                <SelectValue placeholder="Select friends to invite" />
              </SelectTrigger>
              <SelectContent>
                {(friends as any[])?.length > 0 ? (
                  (friends as any[])
                    .filter(friend => !selectedMembers.includes(friend.id))
                    .map((friend) => (
                      <SelectItem key={friend.id} value={friend.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">
                              {friend.firstName?.[0] || friend.email?.[0]?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <span>
                            {friend.firstName && friend.lastName 
                              ? `${friend.firstName} ${friend.lastName}`
                              : friend.email
                            }
                          </span>
                        </div>
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem value="no-friends" disabled>
                    No friends available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            {(friends as any[])?.length === 0 && (
              <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                <UserPlus className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">No friends to invite yet</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/friends">Add Friends</a>
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={!name.trim() || createMutation.isPending}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {createMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Create Wishlist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}