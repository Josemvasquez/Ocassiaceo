import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Calendar, Gift, Bell, Sparkles, Zap, Target, ArrowRight, CheckCircle, Shield, Users, Star, Play } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export default function Landing() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Ocassia</h1>
            </div>
            
            <Button
              onClick={() => window.location.href = '/api/login'}
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Never miss another special moment
            </span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-8 leading-none uppercase">
            Never forget a<br />
            <span className="text-cyan-200">special occasion</span><br />
            and gift <span className="text-cyan-200">effortlessly</span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Smart reminders, AI-curated gift recommendations, and seamless wishlist management—all in one beautiful app.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              <Zap className="w-6 h-6 mr-3" />
              Start Free Today
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-sm"
            >
              Watch Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">10,000+</div>
              <div className="text-white/80">Happy Families</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-white/80">Uptime</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-white/80">Free Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-black mb-6 uppercase">
              <div className="text-gray-900">Everything you need</div>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">To never miss a moment</div>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From intelligent reminders to curated gift suggestions, we've built the complete toolkit for meaningful relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl p-8 text-center h-full">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Bell className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Smart Reminders</h4>
                <p className="text-white/90">Never forget birthdays, anniversaries, or special occasions again.</p>
              </div>
            </div>
            
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-center h-full">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">AI Gift Curation</h4>
                <p className="text-white/90">Get personalized gift recommendations that actually matter.</p>
              </div>
            </div>
            
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-center h-full">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Wishlist Magic</h4>
                <p className="text-white/90">Collaborative wishlists that make gift-giving effortless.</p>
              </div>
            </div>
            
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 text-center h-full">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Location-Based</h4>
                <p className="text-white/90">Find perfect restaurants and experiences nearby automatically.</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Zap className="w-6 h-6 mr-3" />
              Experience the Magic
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-black text-white mb-6 uppercase">
              Loved by families everywhere
            </h3>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Join thousands who've transformed their relationships with effortless gift-giving and unforgettable moments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
              <CardContent className="p-8">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/90 mb-6 text-lg">
                  "This app completely changed how our family handles special occasions. No more forgotten birthdays or awkward gift exchanges!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">SM</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Sarah Martinez</p>
                    <p className="text-white/60 text-sm">Mom of 3, Florida</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
              <CardContent className="p-8">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/90 mb-6 text-lg">
                  "The AI recommendations are spot-on! I found the perfect anniversary gift in minutes instead of hours of browsing."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">DJ</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">David Johnson</p>
                    <p className="text-white/60 text-sm">Marketing Director, NYC</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
              <CardContent className="p-8">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/90 mb-6 text-lg">
                  "Finally, an app that makes gift-giving fun instead of stressful. The collaborative wishlists are a game-changer!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">EK</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Emily Kim</p>
                    <p className="text-white/60 text-sm">Teacher, California</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-300/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h3 className="text-4xl sm:text-5xl font-black text-white mb-8 leading-tight uppercase">
            Ready to never miss<br />
            <span className="text-cyan-200">another special moment?</span>
          </h3>
          
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of families who've transformed their relationships with Ocassia. 
            Start creating unforgettable moments today—completely free.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-16 py-8 text-2xl font-black rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              <Heart className="w-8 h-8 mr-4" />
              Start for Free
            </Button>
            <Button
              onClick={() => setShowDemo(true)}
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-12 py-8 text-xl font-bold rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Play className="w-6 h-6 mr-3" />
              Try Demo
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Setup in 2 minutes</span>
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
                  <Heart className="h-6 w-6 text-white" />
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
                <span className="hover:text-cyan-400 transition-colors cursor-pointer">Privacy Policy</span>
                <span className="hover:text-cyan-400 transition-colors cursor-pointer">Terms of Service</span>
                <span className="hover:text-cyan-400 transition-colors cursor-pointer">Contact</span>
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
