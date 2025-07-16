import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MapPin, Users, Gift, Send, Share } from 'lucide-react';
import { format } from 'date-fns';

interface DigitalEventCreatorProps {
  onEventCreated?: (event: any) => void;
}

export function DigitalEventCreator({ onEventCreated }: DigitalEventCreatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [eventData, setEventData] = useState({
    title: '',
    eventType: '',
    description: '',
    venueName: '',
    venueAddress: '',
    eventDate: undefined as Date | undefined,
    rsvpDeadline: undefined as Date | undefined,
    guestLimit: '',
    customMessage: '',
    createSharedWishlist: false,
    invitationTemplate: 'elegant'
  });

  const eventTypes = [
    { value: 'dinner', label: 'Dinner Party', icon: '🍽️' },
    { value: 'birthday', label: 'Birthday Celebration', icon: '🎂' },
    { value: 'anniversary', label: 'Anniversary', icon: '💝' },
    { value: 'celebration', label: 'General Celebration', icon: '🎉' },
    { value: 'custom', label: 'Custom Event', icon: '✨' }
  ];

  const invitationTemplates = [
    { id: 'elegant', name: 'Elegant', preview: 'Classic black & gold design' },
    { id: 'modern', name: 'Modern', preview: 'Clean minimalist layout' },
    { id: 'festive', name: 'Festive', preview: 'Colorful celebration theme' },
    { id: 'luxury', name: 'Luxury', preview: 'Premium gold accents' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Create Your Event</h2>
        <p className="text-white/70">Let's start with the basics</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-white font-semibold">Event Title</Label>
          <Input
            placeholder="e.g., Dinner at Eddie V's"
            value={eventData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        <div>
          <Label className="text-white font-semibold">Event Type</Label>
          <Select value={eventData.eventType} onValueChange={(value) => handleInputChange('eventType', value)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white font-semibold">Description (Optional)</Label>
          <Textarea
            placeholder="Add details about your event..."
            value={eventData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Event Details</h2>
        <p className="text-white/70">Where and when is your event?</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-white font-semibold">Venue Name</Label>
          <Input
            placeholder="e.g., Eddie V's Prime Seafood"
            value={eventData.venueName}
            onChange={(e) => handleInputChange('venueName', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        <div>
          <Label className="text-white font-semibold">Venue Address</Label>
          <Input
            placeholder="Full address for your guests"
            value={eventData.venueAddress}
            onChange={(e) => handleInputChange('venueAddress', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white font-semibold">Event Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {eventData.eventDate ? format(eventData.eventDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={eventData.eventDate}
                  onSelect={(date) => handleInputChange('eventDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="text-white font-semibold">RSVP Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {eventData.rsvpDeadline ? format(eventData.rsvpDeadline, "PPP") : "RSVP by"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={eventData.rsvpDeadline}
                  onSelect={(date) => handleInputChange('rsvpDeadline', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label className="text-white font-semibold">Guest Limit (Optional)</Label>
          <Input
            type="number"
            placeholder="Maximum number of guests"
            value={eventData.guestLimit}
            onChange={(e) => handleInputChange('guestLimit', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Customize Invitations</h2>
        <p className="text-white/70">Choose your invitation style and message</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-white font-semibold mb-3 block">Invitation Template</Label>
          <div className="grid grid-cols-2 gap-3">
            {invitationTemplates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all ${
                  eventData.invitationTemplate === template.id
                    ? 'ring-2 ring-blue-400 bg-white/20'
                    : 'bg-white/10 hover:bg-white/15'
                }`}
                onClick={() => handleInputChange('invitationTemplate', template.id)}
              >
                <CardContent className="p-4 text-center">
                  <h4 className="text-white font-semibold">{template.name}</h4>
                  <p className="text-white/70 text-sm mt-1">{template.preview}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-white font-semibold">Custom Message</Label>
          <Textarea
            placeholder="Add a personal message to your invitations..."
            value={eventData.customMessage}
            onChange={(e) => handleInputChange('customMessage', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            rows={4}
          />
        </div>

        <div className="bg-white/10 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="sharedWishlist"
              checked={eventData.createSharedWishlist}
              onChange={(e) => handleInputChange('createSharedWishlist', e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="sharedWishlist" className="text-white font-semibold flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Create Shared Wishlist for Group Gifts
            </Label>
          </div>
          <p className="text-white/70 text-sm mt-2 ml-7">
            Allow guests to contribute to group gifts for the guest of honor
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Event Summary</h2>
        <p className="text-white/70">Review your event details before creating</p>
      </div>

      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span className="text-2xl">
              {eventTypes.find(t => t.value === eventData.eventType)?.icon}
            </span>
            {eventData.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-white/80">
            <MapPin className="w-4 h-4" />
            <div>
              <p className="font-semibold">{eventData.venueName}</p>
              <p className="text-sm text-white/60">{eventData.venueAddress}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white/80">
            <CalendarIcon className="w-4 h-4" />
            <div>
              <p className="font-semibold">
                {eventData.eventDate ? format(eventData.eventDate, "EEEE, MMMM do, yyyy") : 'Date not set'}
              </p>
              <p className="text-sm text-white/60">
                RSVP by {eventData.rsvpDeadline ? format(eventData.rsvpDeadline, "MMM do") : 'Not set'}
              </p>
            </div>
          </div>

          {eventData.guestLimit && (
            <div className="flex items-center gap-3 text-white/80">
              <Users className="w-4 h-4" />
              <p>Maximum {eventData.guestLimit} guests</p>
            </div>
          )}

          {eventData.createSharedWishlist && (
            <div className="flex items-center gap-3 text-white/80">
              <Gift className="w-4 h-4" />
              <p>Shared wishlist for group gifts</p>
            </div>
          )}

          <div className="pt-4 border-t border-white/20">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">
              {invitationTemplates.find(t => t.id === eventData.invitationTemplate)?.name} Template
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateEvent = () => {
    // Here you would make API call to create the event
    console.log('Creating event:', eventData);
    onEventCreated?.(eventData);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return eventData.title && eventData.eventType;
      case 2:
        return eventData.venueName && eventData.eventDate && eventData.rsvpDeadline;
      case 3:
        return eventData.invitationTemplate;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step <= currentStep
                    ? 'bg-white text-blue-600'
                    : 'bg-white/20 text-white/60'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
          <CardContent className="p-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Back
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-white text-blue-600 hover:bg-white/90"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleCreateEvent}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600"
            >
              <Send className="w-4 h-4 mr-2" />
              Create Event & Send Invitations
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}