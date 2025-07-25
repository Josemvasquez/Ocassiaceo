import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Calendar, Gift, Bell, Sparkles, Users, Star, Play, CheckCircle, ArrowRight, Clock, MessageCircle, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "wouter";
import { useState } from "react";
import { OcassiaLogo } from "@/components/ui/ocassia-logo";

export default function Landing() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <OcassiaLogo 
                variant="full" 
                size="lg" 
                className="text-white"
              />
            </div>
            
            {/* Centered Navigation */}
            <nav className="hidden lg:flex items-center justify-center gap-8 flex-1">
              <button 
                onClick={() => document.getElementById('ai-recommendations')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white hover:text-blue-300 text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                AI gift ideas
              </button>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Find a list
              </button>
              <button 
                onClick={() => document.getElementById('perfect-for-occasions')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Popular Gifts
              </button>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Gift guides
              </button>
              <button 
                onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white hover:text-blue-300 text-sm font-medium transition-colors"
              >
                FAQ
              </button>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => window.location.href = '/api/login'}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-slate-700 hover:text-white px-5 py-2 text-sm border border-slate-500 rounded-md transition-colors"
              >
                Login
              </Button>
              <Button
                onClick={() => window.location.href = '/api/login'}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm rounded-md transition-colors"
              >
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Never Forget<br />
            <span className="text-blue-600">a Special Occasion</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Ocassia is the easiest way to remember important dates, find perfect gifts, and strengthen relationships for birthdays, anniversaries, and more!
          </p>

          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            Gifting <span className="font-bold text-blue-600">✨AI</span> Smart!
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Create your list
            </Button>
            <Button
              onClick={() => window.location.href = '/api/login'}
              variant="outline"
              size="lg"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-medium rounded-lg"
            >
              Find a friend's list
            </Button>
          </div>

          {/* Carousel/Demo Section - Simplified */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">My Circle</h3>
                    <p className="text-sm text-gray-500">Manage contacts and relationships</p>
                  </div>
                </div>
                <Button size="sm" className="bg-blue-600 text-white">Add Contact</Button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Mom's Birthday</p>
                    <p className="text-sm text-gray-500">Coming up in 3 days</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View Wishlist</Button>
                    <Button size="sm" className="bg-green-600 text-white">Gift Ideas</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Anniversary</p>
                    <p className="text-sm text-gray-500">Next week</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Restaurant Ideas</Button>
                    <Button size="sm" className="bg-blue-600 text-white">Book Now</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Occasions Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Perfect for any occasion
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-all border-0 shadow-sm">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Birthday</h3>
              <p className="text-gray-600 mb-4">Create reminders for birthday celebrations and find the perfect gifts.</p>
              <Button variant="outline" size="sm" className="text-pink-600 border-pink-600 hover:bg-pink-50">
                Create birthday list
              </Button>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all border-0 shadow-sm">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Anniversary</h3>
              <p className="text-gray-600 mb-4">Never forget your special dates and find romantic gift ideas.</p>
              <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                Plan anniversary
              </Button>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all border-0 shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Holidays</h3>
              <p className="text-gray-600 mb-4">Organize holiday gift exchanges and family celebrations.</p>
              <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                Holiday planning
              </Button>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all border-0 shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Special Events</h3>
              <p className="text-gray-600 mb-4">Track graduations, weddings, and other milestone moments.</p>
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                Track events
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-full bg-gray-100 rounded-2xl p-8 min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-32 mx-auto"></div>
                      <div className="h-3 bg-gray-200 rounded w-24 mx-auto"></div>
                      <div className="h-8 bg-blue-600 rounded w-28 mx-auto"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Add your important people</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Import contacts from your phone or add manually</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Set important dates like birthdays and anniversaries</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Add their preferences and interests</span>
                </div>
              </div>
              <Button className="mt-4 bg-blue-600 text-white" onClick={() => window.location.href = '/api/login'}>
                Get started
              </Button>
            </div>

            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-full bg-gray-100 rounded-2xl p-8 min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-36 mx-auto"></div>
                      <div className="h-12 bg-green-100 rounded w-full mx-auto p-2">
                        <div className="h-2 bg-green-300 rounded w-3/4 mb-1"></div>
                        <div className="h-2 bg-green-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get AI-powered recommendations</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Personalized gift suggestions from top retailers</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Restaurant recommendations for special dinners</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Experience suggestions based on their interests</span>
                </div>
              </div>
              <Button className="mt-4 bg-blue-600 text-white" onClick={() => window.location.href = '/api/login'}>
                Get started
              </Button>
            </div>

            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-full bg-gray-100 rounded-2xl p-8 min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Bell className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <div className="bg-purple-100 rounded-lg p-3 w-full">
                        <div className="h-2 bg-purple-300 rounded w-3/4 mb-2"></div>
                        <div className="h-2 bg-purple-300 rounded w-1/2"></div>
                      </div>
                      <div className="h-8 bg-purple-600 rounded w-32 mx-auto"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Never miss a special moment</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Smart reminders for upcoming occasions</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Share wishlists with friends and family</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Coordinate group gifts and celebrations</span>
                </div>
              </div>
              <Button className="mt-4 bg-blue-600 text-white" onClick={() => window.location.href = '/api/login'}>
                Get started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Brands Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Find gifts from your favorite brands
            </h2>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-gray-600">Amazon</div>
            <div className="text-2xl font-bold text-gray-600">Target</div>
            <div className="text-2xl font-bold text-gray-600">Best Buy</div>
            <div className="text-2xl font-bold text-gray-600">OpenTable</div>
            <div className="text-2xl font-bold text-gray-600">Expedia</div>
            <div className="text-2xl font-bold text-gray-600">Flowers.com</div>
          </div>
        </div>
      </section>

      {/* AI Feature Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Get gift ideas from our AI, the #1 gift recommendation engine
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">For Mom's Birthday</h3>
                <p className="text-sm text-gray-600">Spa gift set, jewelry, or cooking class experience</p>
              </div>
            </Card>

            <Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Anniversary Ideas</h3>
                <p className="text-sm text-gray-600">Romantic dinner, weekend getaway, or custom jewelry</p>
              </div>
            </Card>

            <Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-purple-50 to-violet-50">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Holiday Gifts</h3>
                <p className="text-sm text-gray-600">Tech gadgets, cozy blankets, or gourmet food baskets</p>
              </div>
            </Card>

            <Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-orange-50 to-amber-50">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">For Best Friend</h3>
                <p className="text-sm text-gray-600">Concert tickets, skincare set, or trendy accessories</p>
              </div>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4"
              onClick={() => window.location.href = '/api/login'}
            >
              Find the perfect gift
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Hear why people love Ocassia
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 shadow-sm border-0 bg-white">
              <div className="mb-4">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700">
                  "Ocassia made Christmas planning a breeze! Easy setup, and loved how my family could see my wishlist. No more duplicate gifts. It's our new holiday tradition."
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-medium text-sm">AS</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Amy S</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-sm border-0 bg-white">
              <div className="mb-4">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700">
                  "We used Ocassia for our family gift exchange. It handled all the logistics and made our holiday celebration super easy and fun. It's now my go-to recommendation."
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-medium text-sm">BH</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Bob H</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-sm border-0 bg-white">
              <div className="mb-4">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700">
                  "Ocassia is my gifting hub. From creating wish lists to finding gift ideas, it's all there. The AI recommendations are spot-on. Love it!"
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-medium text-sm">KD</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Kylie D</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Your all-in-one relationship management platform
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Wishlists</h3>
              <p className="text-gray-600">Create and share wishlists for birthdays, holidays and special occasions</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Management</h3>
              <p className="text-gray-600">Keep track of important people and their preferences in one place</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Gift Ideas</h3>
              <p className="text-gray-600">Get inspired with our AI-powered gift generator and curated recommendations</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Reminders</h3>
              <p className="text-gray-600">Never forget birthdays, anniversaries, or special moments again</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Relationship management made easy</h3>
              <p className="text-lg text-gray-600 mb-6">
                Ocassia is the easiest way to strengthen relationships with friends and family for birthdays, holidays, and more! 
                With Ocassia you can create wishlists, get gift recommendations, and track special occasions.
              </p>
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4"
                onClick={() => window.location.href = '/api/login'}
              >
                Get started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Dialog */}
      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>See Ocassia in Action</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
              <div className="text-center">
                <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Demo video coming soon</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}