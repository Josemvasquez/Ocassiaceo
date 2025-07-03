import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Gift, Bell, Calendar } from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface DateCardProps {
  date: {
    id: number;
    title: string;
    type: string;
    date: string;
    notes?: string;
    contact?: {
      name: string;
      photoUrl?: string;
    };
  };
}

export default function DateCard({ date }: DateCardProps) {
  const dateObj = new Date(date.date);
  const daysUntil = differenceInDays(dateObj, new Date());
  const formattedDate = format(dateObj, "MMMM d, yyyy");

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
    <Card className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
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
        </div>

        <div className="flex space-x-2">
          <Button 
            className={`flex-1 ${styles.button} transition-colors`}
            size="sm"
          >
            <Gift className="h-4 w-4 mr-2" />
            {date.type.toLowerCase() === 'anniversary' ? 'Book Dinner' : 
             date.type.toLowerCase() === 'holiday' ? 'Plan Visit' : 
             'Gift Ideas'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="px-3 hover:bg-gray-50"
          >
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
