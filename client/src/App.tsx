import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Contacts from "@/pages/contacts";
import WishlistEnhanced from "@/pages/wishlist-enhanced";
import CollaborativeWishlist from "@/pages/collaborative-wishlist";
import Recommendations from "@/pages/recommendations";
import Friends from "@/pages/friends";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import Contact from "@/pages/contact";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-gray">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Header />}
      <Switch>
        {!isAuthenticated ? (
          <>
            <Route path="/" component={Landing} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/terms-of-service" component={TermsOfService} />
            <Route path="/contact" component={Contact} />
          </>
        ) : (
          <>
            <Route path="/" component={Dashboard} />
            <Route path="/contacts" component={Contacts} />
            <Route path="/friends" component={Friends} />
            <Route path="/wishlist" component={WishlistEnhanced} />
            <Route path="/collaborative" component={CollaborativeWishlist} />
            <Route path="/recommendations" component={Recommendations} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/terms-of-service" component={TermsOfService} />
            <Route path="/contact" component={Contact} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
