import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Sparkles, Gift, Heart, Users, Zap, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { ChatWidget } from "@/components/chat-widget";

export default function AIGiftIdeas() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Landing page style header */}
      <header className="bg-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <Gift className="h-5 w-5 text-slate-800" />
                </div>
                <span className="text-white text-xl font-bold">Ocassia</span>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-4">
              <Link href="/ai-gift-ideas">
                <span className="text-sm font-semibold text-white hover:text-gray-300 cursor-pointer transition-colors duration-200 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI gift ideas
                </span>
              </Link>
              <Link href="/find-list">
                <span className="text-sm font-semibold text-slate-300 hover:text-white cursor-pointer transition-colors duration-200">
                  Find a list
                </span>
              </Link>
              <Link href="/popular-gifts">
                <span className="text-sm font-semibold text-slate-300 hover:text-white cursor-pointer transition-colors duration-200">
                  Popular Gifts
                </span>
              </Link>
              <Link href="/gift-guides">
                <span className="text-sm font-semibold text-slate-300 hover:text-white cursor-pointer transition-colors duration-200">
                  Gift guides
                </span>
              </Link>
              <span className="text-sm font-semibold text-slate-300 hover:text-white cursor-pointer transition-colors duration-200">
                FAQ
              </span>
            </nav>

            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" className="text-slate-800 bg-white hover:bg-gray-100 border-2 border-white font-semibold">
                <a href="/api/login">Login</a>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                <a href="/api/login">Sign up</a>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        {/* Go Back Button */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-900 p-0">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full p-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Gift Ideas
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Get personalized gift recommendations powered by AI. Tell me about the person you're shopping for and I'll help you find the perfect gift!
          </p>
          
          <Button
            onClick={toggleChat}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-lg shadow-lg"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Start Chatting with Ocassia
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-full p-3 w-fit mx-auto mb-3">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Personalized Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Get gift ideas tailored to their interests, personality, and your relationship with them.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-3 w-fit mx-auto mb-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Smart Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Have natural conversations about budget, occasion, and preferences to narrow down perfect options.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-full p-3 w-fit mx-auto mb-3">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Category Guidance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Discover gift categories and specific ideas you might not have considered before.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">How It Works</CardTitle>
            <CardDescription>
              Getting personalized gift recommendations is simple
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-fit mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">1. Tell Me About Them</h3>
                <p className="text-gray-600">Share details about the person - their interests, age, your relationship, and the occasion.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-cyan-100 rounded-full p-4 w-fit mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="font-semibold mb-2">2. Chat Naturally</h3>
                <p className="text-gray-600">Have a conversation where I ask follow-up questions to understand their preferences better.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-fit mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">3. Get Recommendations</h3>
                <p className="text-gray-600">Receive personalized gift category suggestions and specific ideas tailored just for them.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Widget */}
      <ChatWidget isOpen={isChatOpen} onToggle={toggleChat} />
    </div>
  );
}