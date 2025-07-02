import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Calendar, Gift, Users, Bell, Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-gray via-white to-soft-coral/10">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-coral via-purple to-teal rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-coral to-purple bg-clip-text text-transparent">
                  RemindMe
                </h1>
                <p className="text-xs text-secondary -mt-1">Stay connected with love</p>
              </div>
            </div>
            
            <Button
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-coral to-purple hover:from-coral/90 hover:to-purple/90 text-white px-8 py-3 font-semibold shadow-xl transition-all duration-300 hover:scale-105"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-12 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-coral via-purple to-teal rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <Heart className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8">
              Never Miss a{" "}
              <span className="bg-gradient-to-r from-coral via-purple to-teal bg-clip-text text-transparent">
                Special Moment
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform how you celebrate relationships with smart reminders, thoughtful gift suggestions, 
              and collaborative planning that brings people together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.href = '/api/login'}
                size="lg"
                className="bg-gradient-to-r from-coral to-purple hover:from-coral/90 hover:to-purple/90 text-white px-12 py-6 text-xl font-semibold shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Get Started Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-coral text-coral hover:bg-soft-coral/20 px-12 py-6 text-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Celebrate</h3>
            <p className="text-lg text-gray-600">Simple tools to help you stay connected with the people you care about</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-gray-200 hover:border-coral transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-coral bg-opacity-10 rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-coral" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Smart Reminders</h4>
                <p className="text-gray-600">Never forget birthdays, anniversaries, or special occasions with intelligent reminders.</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-teal transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-teal bg-opacity-10 rounded-xl flex items-center justify-center mb-4">
                  <Gift className="h-6 w-6 text-teal" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">AI Gift Suggestions</h4>
                <p className="text-gray-600">Get personalized gift recommendations based on your loved ones' preferences and interests.</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-warm-yellow transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-warm-yellow bg-opacity-20 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Contact Management</h4>
                <p className="text-gray-600">Organize your circle of friends and family with photos, preferences, and important dates.</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-coral transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-coral bg-opacity-10 rounded-xl flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-coral" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Restaurant Bookings</h4>
                <p className="text-gray-600">Find and book the perfect restaurant for your celebrations with integrated recommendations.</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-teal transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-teal bg-opacity-10 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-teal" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Travel Planning</h4>
                <p className="text-gray-600">Discover amazing getaways and travel experiences perfect for special occasions.</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-warm-yellow transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-warm-yellow bg-opacity-20 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-yellow-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Personal Wishlist</h4>
                <p className="text-gray-600">Create and share your own wishlist to help others find the perfect gifts for you.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-coral to-teal">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Make Every Moment Special?
          </h3>
          <p className="text-xl text-white opacity-90 mb-8">
            Join thousands of users who never miss an important date
          </p>
          <Button
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="bg-white text-coral hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
          >
            Start Celebrating Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-coral to-teal rounded-lg flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <span className="text-gray-600">© 2024 RemindMe. Made with love for celebrating life's moments.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
