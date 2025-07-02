import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Smartphone, Users, CheckCircle, AlertCircle } from "lucide-react";

interface Contact {
  name: string;
  phone?: string;
  email?: string;
}

interface ContactsImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContactsImport({ open, onOpenChange }: ContactsImportProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: async (contactsToImport: Contact[]) => {
      const results = [];
      for (const contact of contactsToImport) {
        const result = await apiRequest("/api/contacts", "POST", {
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          relationship: "Friend", // Default relationship
        });
        results.push(result);
      }
      return results;
    },
    onSuccess: (data) => {
      toast({
        title: "Contacts imported",
        description: `Successfully imported ${data.length} contacts`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      onOpenChange(false);
      setContacts([]);
      setSelectedContacts(new Set());
    },
    onError: (error) => {
      toast({
        title: "Import failed",
        description: "Failed to import contacts. Please try again.",
        variant: "destructive",
      });
    },
  });

  const requestContactsAccess = async () => {
    if (!('contacts' in navigator)) {
      toast({
        title: "Not supported",
        description: "Your browser doesn't support contacts access",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Request permission and access contacts
      const contactsManager = (navigator as any).contacts;
      const props = ['name', 'tel', 'email'];
      const opts = { multiple: true };
      
      const contactList = await contactsManager.select(props, opts);
      
      // Process contacts
      const processedContacts: Contact[] = contactList.map((contact: any) => {
        const name = contact.name?.[0] || 'Unknown';
        const phone = contact.tel?.[0] || undefined;
        const email = contact.email?.[0] || undefined;
        
        return { name, phone, email };
      }).filter((contact: Contact) => 
        contact.name !== 'Unknown' && (contact.phone || contact.email)
      );

      setContacts(processedContacts);
      setHasAccess(true);
      
      toast({
        title: "Contacts loaded",
        description: `Found ${processedContacts.length} contacts`,
      });
    } catch (error) {
      console.error('Contacts access error:', error);
      toast({
        title: "Access denied",
        description: "Unable to access contacts. Please allow permission and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleContact = (index: number) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedContacts(newSelected);
  };

  const selectAll = () => {
    if (selectedContacts.size === contacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(contacts.map((_, index) => index)));
    }
  };

  const handleImport = () => {
    const contactsToImport = Array.from(selectedContacts).map(index => contacts[index]);
    if (contactsToImport.length === 0) {
      toast({
        title: "No contacts selected",
        description: "Please select contacts to import",
        variant: "destructive",
      });
      return;
    }
    importMutation.mutate(contactsToImport);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-soft-blue" />
            Import Phone Contacts
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {!hasAccess ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-very-soft-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-soft-blue" />
              </div>
              <h3 className="text-lg font-medium text-primary mb-2">
                Access Your Contacts
              </h3>
              <p className="text-secondary mb-6 max-w-md mx-auto">
                Import contacts from your phone to quickly add friends and family to RemindMe.
              </p>
              <Button
                onClick={requestContactsAccess}
                disabled={isLoading}
                className="bg-soft-blue hover:bg-soft-blue/90 text-white px-6 py-2.5 font-medium rounded-2xl"
              >
                {isLoading ? "Accessing Contacts..." : "Access Contacts"}
              </Button>
              
              <div className="mt-6 p-4 bg-very-soft-blue rounded-2xl text-sm text-secondary">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                Your browser will ask for permission to access your contacts
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {contacts.length} contacts found
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAll}
                  className="text-xs"
                >
                  {selectedContacts.size === contacts.length ? "Deselect All" : "Select All"}
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                {contacts.map((contact, index) => (
                  <Card key={index} className="cursor-pointer hover:bg-very-soft-blue/50 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedContacts.has(index)}
                          onCheckedChange={() => toggleContact(index)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-primary truncate">
                            {contact.name}
                          </div>
                          <div className="text-sm text-secondary">
                            {contact.phone && <div>{contact.phone}</div>}
                            {contact.email && <div>{contact.email}</div>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={selectedContacts.size === 0 || importMutation.isPending}
                  className="flex-1 bg-soft-blue hover:bg-soft-blue/90 text-white font-medium rounded-2xl"
                >
                  {importMutation.isPending ? "Importing..." : `Import ${selectedContacts.size} Contacts`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}