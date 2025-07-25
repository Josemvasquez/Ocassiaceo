import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Calendar, Gift, Bell, Sparkles, Zap, Target, ArrowRight, CheckCircle, Shield, Users, Star, Play } from "lucide-react";
import { SiAmazon, SiTarget, SiExpedia } from "react-icons/si";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "wouter";
import { useState } from "react";
import { OcassiaLogo } from "@/components/ui/ocassia-logo";

// Custom Gift with Heart Icon Component - Clean gift box with bow and heart inside
const GiftHeartIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Gift box outline */}
    <rect x="5" y="8" width="14" height="12" rx="1" 
          stroke="currentColor" strokeWidth="2" fill="none"/>
    
    {/* Decorative bow - left loop */}
    <path d="M8 8 C6 6 4 6 6 4 C8 6 10 6 8 8" 
          stroke="currentColor" strokeWidth="2" fill="none"/>
    
    {/* Decorative bow - right loop */}
    <path d="M16 8 C18 6 20 6 18 4 C16 6 14 6 16 8" 
          stroke="currentColor" strokeWidth="2" fill="none"/>
    
    {/* Bow center knot */}
    <circle cx="12" cy="6" r="1.5" 
            stroke="currentColor" strokeWidth="2" fill="none"/>
    
    {/* Heart inside the box */}
    <path d="M12 16 C10.5 14.5 8.5 12.5 8.5 11 C8.5 10 9.2 9.5 10 9.5 C10.5 9.5 11 9.7 11.2 10 C11.4 9.7 11.9 9.5 12.4 9.5 C13.2 9.5 13.9 10 13.9 11 C13.9 12.5 11.9 14.5 12 16Z" 
          fill="currentColor" opacity="0.9"/>
    
    {/* Small decorative ribbon lines */}
    <line x1="12" y1="8" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
    <line x1="5" y1="14" x2="19" y2="14" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
  </svg>
);

export default function Landing() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <OcassiaLogo 
              variant="full" 
              size="lg" 
              className="text-white"
            />
            
            <Button
              onClick={() => window.location.href = '/api/login'}
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Log In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Never forget a special occasion and gift <em>effortlessly</em>
          </h1>
          
          <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Ocassia helps you remember important dates, find perfect gifts, and manage relationships with your loved ones—all in one beautiful app.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all"
            >
              Get Started Free
            </Button>
            <Button
              onClick={() => setShowDemo(true)}
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-medium rounded-xl backdrop-blur-sm bg-white/10"
            >
              Watch Demo
              <Play className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="flex justify-center items-center gap-8 text-sm text-white/70">
            <span>✓ Free forever</span>
            <span>✓ No credit card required</span>
            <span>✓ Setup in 2 minutes</span>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and never miss another special moment with your loved ones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="mb-4">
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Add your contacts</h3>
              <p className="text-gray-600">
                Import contacts from your phone or add them manually with their special dates and preferences.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bell className="h-8 w-8 text-white" />
              </div>
              <div className="mb-4">
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get smart reminders</h3>
              <p className="text-gray-600">
                Receive timely notifications for upcoming birthdays, anniversaries, and special occasions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <div className="mb-4">
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Find perfect gifts</h3>
              <p className="text-gray-600">
                Get AI-powered gift recommendations and manage collaborative wishlists with friends and family.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for meaningful relationships
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From intelligent reminders to curated gift suggestions, we've built the complete toolkit for staying connected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Never forget important dates</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Smart reminders for birthdays, anniversaries, and special occasions. Set custom notification schedules and never miss another important moment.
              </p>
              
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">AI-powered gift recommendations</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Get personalized gift suggestions from Amazon, Target, Best Buy, and more. Our AI learns preferences to recommend gifts that actually matter.
              </p>
              
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Collaborative wishlists</h3>
              </div>
              <p className="text-gray-600">
                Create and share wishlists with friends and family. Coordinate group gifts and avoid duplicate purchases with our smart collaboration tools.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl p-8 text-white">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">100%</div>
                  <div className="text-white/80 text-sm">Free to use</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">10k+</div>
                  <div className="text-white/80 text-sm">Happy users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">5</div>
                  <div className="text-white/80 text-sm">Affiliate partners</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">24/7</div>
                  <div className="text-white/80 text-sm">Smart reminders</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by families everywhere
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join thousands who've transformed their relationships with effortless gift-giving and unforgettable moments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "This app completely changed how our family handles special occasions. No more forgotten birthdays!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-medium text-sm">SM</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Sarah M.</p>
                    <p className="text-gray-500 text-sm">Mom of 3</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "The AI recommendations are spot-on! Found the perfect anniversary gift in minutes."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-medium text-sm">DJ</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">David J.</p>
                    <p className="text-gray-500 text-sm">Marketing Director</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Makes gift-giving fun instead of stressful. The collaborative wishlists are amazing!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-medium text-sm">EK</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Emily K.</p>
                    <p className="text-gray-500 text-sm">Teacher</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            Ready to never miss another special moment?
          </h2>
          
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of families who've transformed their relationships with Ocassia. 
            Start creating unforgettable moments today—completely free.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all"
            >
              Get Started Free
            </Button>
            <Button
              onClick={() => setShowDemo(true)}
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-medium rounded-xl backdrop-blur-sm bg-white/10"
            >
              Watch Demo
              <Play className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-white/80">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Start for Free</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Setup in 2 minutes</span>
            </div>
          </div>
          
          {/* Trusted Partners Section */}
          <div className="mt-20 mb-8">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-white mb-4">Trusted Partners</h3>
              <p className="text-white/80 text-lg">Connecting you to the best gift and experience providers</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center justify-items-center">
              {/* Amazon */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-center h-20 w-24 hover:bg-white/20 transition-all duration-300">
                <SiAmazon className="w-12 h-8 text-white" />
              </div>
              
              {/* Best Buy */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-center h-20 w-24 hover:bg-white/20 transition-all duration-300">
                <div className="text-white font-bold text-sm text-center">Best Buy</div>
              </div>
              
              {/* Target */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-center h-20 w-24 hover:bg-white/20 transition-all duration-300">
                <SiTarget className="w-12 h-8 text-white" />
              </div>
              
              {/* Walmart */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-center h-20 w-24 hover:bg-white/20 transition-all duration-300">
                <div className="text-white font-bold text-sm text-center">Walmart</div>
              </div>
              
              {/* OpenTable */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-center h-20 w-24 hover:bg-white/20 transition-all duration-300">
                <div className="text-white font-bold text-sm">OpenTable</div>
              </div>
              
              {/* Expedia */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-center h-20 w-24 hover:bg-white/20 transition-all duration-300">
                <SiExpedia className="w-12 h-8 text-white" />
              </div>
              
              {/* Flowers.com */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-center h-20 w-24 hover:bg-white/20 transition-all duration-300">
                <div className="text-white font-bold text-xs text-center">Flowers.com</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <GiftHeartIcon className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Ocassia</span>
              </div>
              <p className="text-gray-300 text-lg mb-6 max-w-md">
                Never forget a special occasion and gift effortlessly. Join thousands of families creating unforgettable moments.
              </p>
              <div className="flex space-x-4">
                <Button
                  onClick={() => window.location.href = '/api/login'}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 font-semibold rounded-xl"
                >
                  Get Started Free
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Features</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-cyan-400 transition-colors cursor-pointer">Smart Reminders</li>
                <li className="hover:text-cyan-400 transition-colors cursor-pointer">AI Gift Curation</li>
                <li className="hover:text-cyan-400 transition-colors cursor-pointer">Wishlist Magic</li>
                <li className="hover:text-cyan-400 transition-colors cursor-pointer">Location Services</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Occasions</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-cyan-400 transition-colors cursor-pointer">Birthdays</li>
                <li className="hover:text-cyan-400 transition-colors cursor-pointer">Anniversaries</li>
                <li className="hover:text-cyan-400 transition-colors cursor-pointer">Holidays</li>
                <li className="hover:text-cyan-400 transition-colors cursor-pointer">Special Events</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-6 mb-4 md:mb-0">
                <span className="text-gray-400 text-sm">© 2025 Ocassia. All rights reserved.</span>
              </div>
              <div className="flex space-x-6 text-sm text-gray-400">
                <Link href="/privacy-policy">
                  <span className="hover:text-cyan-400 transition-colors cursor-pointer">Privacy Policy</span>
                </Link>
                <Link href="/terms-of-service">
                  <span className="hover:text-cyan-400 transition-colors cursor-pointer">Terms of Service</span>
                </Link>
                <Link href="/contact">
                  <span className="hover:text-cyan-400 transition-colors cursor-pointer">Contact</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Dialog */}
      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-6">
              Try Ocassia Demo
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Demo Dashboard Preview */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">
                Dashboard Preview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-3">
                    <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-medium">Upcoming Events</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mom's Birthday</span>
                      <span className="text-xs bg-blue-100 px-2 py-1 rounded">In 5 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Anniversary</span>
                      <span className="text-xs bg-green-100 px-2 py-1 rounded">In 12 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Dad's Birthday</span>
                      <span className="text-xs bg-yellow-100 px-2 py-1 rounded">In 20 days</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-3">
                    <Gift className="w-5 h-5 text-green-500 mr-2" />
                    <span className="font-medium">Gift Ideas</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Wireless Headphones</span>
                      <span className="text-xs text-green-600">$79.99</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Italian Restaurant</span>
                      <span className="text-xs text-blue-600">Nearby</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weekend Getaway</span>
                      <span className="text-xs text-purple-600">$299</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-cyan-50 rounded-lg">
                <Bell className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                <h4 className="font-medium text-cyan-800">Smart Reminders</h4>
                <p className="text-sm text-cyan-600 mt-1">Never miss important dates</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-blue-800">AI Recommendations</h4>
                <p className="text-sm text-blue-600 mt-1">Personalized gift suggestions</p>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <h4 className="font-medium text-indigo-800">Social Features</h4>
                <p className="text-sm text-indigo-600 mt-1">Share wishlists with friends</p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center pt-6 border-t">
              <p className="text-gray-600 mb-4">
                Ready to start creating unforgettable moments?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => {
                    setShowDemo(false);
                    window.location.href = '/api/login';
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Start for Free
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDemo(false)}
                  className="px-8 py-3"
                >
                  Close Demo
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
