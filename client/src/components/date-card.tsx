import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Gift, Bell, Calendar, CheckCircle2, ShoppingBag } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import ReminderSettingsDialog from "./reminder-settings-dialog";

interface DateCardProps {
  date: {
    id: number;
    title: string;
    type: string;
    date: string;
    notes?: string;
    shopped?: boolean;
    reminderDays?: number;
    contact?: {
      name: string;
      photoUrl?: string;
    };
  };
}

export default function DateCard({ date }: DateCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const dateObj = new Date(date.date);
  const daysUntil = differenceInDays(dateObj, new Date());
  const formattedDate = format(dateObj, "MMMM d, yyyy");

  const shoppedMutation = useMutation({
    mutationFn: async (shopped: boolean) => {
      await apiRequest("PATCH", `/api/dates/${date.id}/shopped`, { shopped });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dates/upcoming"] });
      toast({
        title: "Updated",
        description: date.shopped ? "Marked as not shopped" : "Marked as shopped for this date!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update shopping status",
        variant: "destructive",
      });
    },
  });

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'birthday':
        return 'coral';
      case 'anniversary':
        return 'teal';
      case 'holiday':
        return 'warm-yellow';
      default:
        return 'coral';
    }
  };

  const getTypeStyles = (type: string) => {
    const color = getTypeColor(type);
    return {
      background: `bg-${color} bg-opacity-10`,
      text: color === 'warm-yellow' ? 'text-yellow-600' : `text-${color}`,
      button: color === 'warm-yellow' ? 'bg-warm-yellow text-gray-800 hover:bg-yellow-400' : 
              color === 'teal' ? 'bg-teal text-white hover:bg-cyan-600' : 
              'bg-coral text-white hover:bg-red-600'
    };
  };

  const styles = getTypeStyles(date.type);
  const contactName = date.contact?.name || date.title;
  const initials = contactName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 relative">
      <CardContent className="p-6">
        {/* Notification Bell - Top Left Corner */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 left-3 p-2 rounded-full hover:bg-white/20 transition-colors"
          onClick={() => setShowReminderDialog(true)}
        >
          <Bell className="h-4 w-4 text-blue-300 hover:text-blue-200" />
        </Button>

        <div className="flex items-center space-x-4 mb-4 mt-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src={date.contact?.photoUrl} alt={contactName} />
            <AvatarFallback className="bg-gray-200 text-gray-600">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-white">{contactName}</h4>
            <p className="text-sm text-white/80 capitalize">{date.type}</p>
          </div>
        </div>
        
        <div className={`${styles.background} rounded-xl p-4 mb-4`}>
          <div className={`text-2xl font-bold ${styles.text}`}>
            {daysUntil === 0 ? 'Today!' : 
             daysUntil === 1 ? 'Tomorrow' : 
             daysUntil > 0 ? `${daysUntil} days` : 
             `${Math.abs(daysUntil)} days ago`}
          </div>
          <div className="text-sm text-gray-600">{formattedDate}</div>
          
          {/* Shopping Status */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={date.shopped || false}
                onCheckedChange={(checked) => {
                  shoppedMutation.mutate(!!checked);
                }}
                disabled={shoppedMutation.isPending}
                className="border-white/60 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
              <span className="text-sm text-white/90">Already shopped</span>
            </div>
            {date.shopped && (
              <div className="flex items-center space-x-1 text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-medium">Done</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
            size="sm"
            onClick={() => setLocation("/recommendations")}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Buy Another Gift
          </Button>
          <Button 
            className={`flex-1 ${styles.button} transition-colors`}
            size="sm"
            onClick={() => {
              if (date.type.toLowerCase() === 'anniversary') {
                setLocation("/recommendations");
              } else {
                setLocation("/recommendations");
              }
            }}
          >
            <Gift className="h-4 w-4 mr-2" />
            {date.type.toLowerCase() === 'anniversary' ? 'Book Dinner' : 
             date.type.toLowerCase() === 'holiday' ? 'Plan Visit' : 
             'Gift Ideas'}
          </Button>
        </div>
      </CardContent>
      
      <ReminderSettingsDialog
        open={showReminderDialog}
        onOpenChange={setShowReminderDialog}
        date={{
          id: date.id,
          title: date.title,
          date: date.date,
          reminderDays: date.reminderDays || 7
        }}
      />
    </Card>
  );
}
