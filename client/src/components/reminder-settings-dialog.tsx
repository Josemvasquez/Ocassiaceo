import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Calendar, Mail, Phone } from "lucide-react";

interface ReminderSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: {
    id: number;
    title: string;
    date: string;
    reminderDays: number;
  };
}

export default function ReminderSettingsDialog({
  open,
  onOpenChange,
  date,
}: ReminderSettingsDialogProps) {
  const [reminderDays, setReminderDays] = useState(date.reminderDays?.toString() || "7");
  const [reminderType, setReminderType] = useState("browser");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateReminderMutation = useMutation({
    mutationFn: async (data: { reminderDays: number }) => {
      return await apiRequest(`/api/dates/${date.id}`, "PATCH", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dates/upcoming"] });
      toast({
        title: "Reminder Updated!",
        description: `You'll be reminded ${reminderDays} days before ${date.title}`,
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update reminder settings",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateReminderMutation.mutate({
      reminderDays: parseInt(reminderDays),
    });

    // Request browser notification permission
    if (reminderType === "browser" && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          toast({
            title: "Browser Notifications Enabled",
            description: "You'll receive browser notifications for this event",
          });
        }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-500" />
            Reminder Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">{date.title}</h3>
            <p className="text-sm text-gray-600">
              {new Date(date.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="reminder-days" className="text-sm font-medium">
                Remind me before the event
              </Label>
              <Select value={reminderDays} onValueChange={setReminderDays}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select reminder time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day before</SelectItem>
                  <SelectItem value="3">3 days before</SelectItem>
                  <SelectItem value="7">1 week before</SelectItem>
                  <SelectItem value="14">2 weeks before</SelectItem>
                  <SelectItem value="30">1 month before</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reminder-type" className="text-sm font-medium">
                How would you like to be reminded?
              </Label>
              <Select value={reminderType} onValueChange={setReminderType}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select reminder type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="browser">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Browser Notifications
                    </div>
                  </SelectItem>
                  <SelectItem value="dashboard">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Dashboard Alerts
                    </div>
                  </SelectItem>
                  <SelectItem value="email" disabled>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email (Coming Soon)
                    </div>
                  </SelectItem>
                  <SelectItem value="sms" disabled>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      SMS (Coming Soon)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateReminderMutation.isPending}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
            >
              {updateReminderMutation.isPending ? "Saving..." : "Save Reminder"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}