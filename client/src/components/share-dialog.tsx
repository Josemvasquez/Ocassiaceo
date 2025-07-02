import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Check } from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: number;
  itemName: string;
  itemType: "wishlist" | "date";
}

export default function ShareDialog({ open, onOpenChange, itemId, itemName, itemType }: ShareDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFriendId, setSelectedFriendId] = useState("");
  const [canEdit, setCanEdit] = useState(false);

  // Fetch friends list
  const { data: friends } = useQuery({
    queryKey: ["/api/friends"],
    enabled: open,
  });

  // Share mutation
  const shareMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFriendId) {
        throw new Error("Please select a friend to share with");
      }

      const endpoint = itemType === "wishlist" 
        ? `/api/sharing/wishlist-items/${itemId}` 
        : `/api/sharing/special-dates/${itemId}`;

      return await apiRequest(endpoint, "POST", {
        sharedWithId: selectedFriendId,
        canEdit,
      });
    },
    onSuccess: () => {
      toast({
        title: "Item Shared Successfully",
        description: `${itemName} has been shared with your friend.`,
      });
      
      // Invalidate shared items queries
      queryClient.invalidateQueries({ queryKey: ["/api/sharing/wishlist-items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sharing/special-dates"] });
      
      onOpenChange(false);
      setSelectedFriendId("");
      setCanEdit(false);
    },
    onError: (error: any) => {
      toast({
        title: "Sharing Failed",
        description: error.message || "Failed to share item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleShare = () => {
    shareMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Share with Friends
          </DialogTitle>
          <DialogDescription>
            Share "{itemName}" with a friend so they can view or collaborate on it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="friend-select">Select Friend</Label>
            <Select value={selectedFriendId} onValueChange={setSelectedFriendId}>
              <SelectTrigger id="friend-select">
                <SelectValue placeholder="Choose a friend to share with" />
              </SelectTrigger>
              <SelectContent>
                {friends?.length > 0 ? (
                  friends.map((friend: any) => (
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
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="edit-permission" className="text-sm font-medium">
                Allow Editing
              </Label>
              <p className="text-xs text-gray-600">
                Let your friend make changes to this item
              </p>
            </div>
            <Switch
              id="edit-permission"
              checked={canEdit}
              onCheckedChange={setCanEdit}
            />
          </div>

          {friends?.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
              <UserPlus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">No friends to share with yet</p>
              <Button variant="outline" size="sm" asChild>
                <a href="/friends">Add Friends</a>
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleShare} 
            disabled={!selectedFriendId || shareMutation.isPending || friends?.length === 0}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {shareMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            Share Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}