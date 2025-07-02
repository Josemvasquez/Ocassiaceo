import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ContactCardProps {
  contact: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    relationship?: string;
    preferences?: string;
    photoUrl?: string;
  };
  expanded?: boolean;
}

export default function ContactCard({ contact, expanded = false }: ContactCardProps) {
  const initials = contact.name.split(' ').map(n => n[0]).join('').toUpperCase();

  if (expanded) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={contact.photoUrl} alt={contact.name} />
            <AvatarFallback className="bg-coral text-white text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg">{contact.name}</h4>
            {contact.relationship && (
              <Badge variant="secondary" className="mt-1">
                {contact.relationship}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          {contact.email && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Email:</span> {contact.email}
            </p>
          )}
          {contact.phone && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Phone:</span> {contact.phone}
            </p>
          )}
          {contact.preferences && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Interests:</span> {contact.preferences}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
      <Avatar className="h-12 w-12">
        <AvatarImage src={contact.photoUrl} alt={contact.name} />
        <AvatarFallback className="bg-coral text-white">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{contact.name}</h4>
        <p className="text-sm text-gray-600">
          {contact.relationship ? `${contact.relationship} • ` : ''}
          {contact.preferences || 'No preferences set'}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-coral">Birthday</p>
        <p className="text-xs text-gray-500">June 14</p>
      </div>
    </div>
  );
}
