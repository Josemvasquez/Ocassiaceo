import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Gift, Heart, ArrowRight, Loader2, Send, User, Bot } from "lucide-react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface GiftRecommendation {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  affiliateUrl: string;
  rating: number;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
  recommendations?: GiftRecommendation[];
}

export default function AIGiftIdeas() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: "Hi! I'm Ocassia, your AI gift assistant. I'd love to help you find the perfect gift! Tell me about the person you're shopping for - who are they to you and what's the occasion?",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = useMutation({
    mutationFn: async (userMessage: string) => {
      const response = await apiRequest("POST", "/api/ai/chat-recommendations", {
        message: userMessage,
        conversationHistory: messages.map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.message }))
      });
      return await response.json();
    },
    onSuccess: (data) => {
      const botResponse: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        message: data.message,
        timestamp: new Date(),
        recommendations: data.recommendations
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    },
    onError: () => {
      const errorResponse: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        message: "I'm sorry, I'm having trouble processing your request right now. Could you try asking again?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
      setIsTyping(false);
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsTyping(true);
    sendMessage.mutate(currentMessage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <Gift className="h-5 w-5 text-slate-800" />
                </div>
                <span className="text-white text-xl font-bold">Ocassia</span>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/ai-gift-ideas">
                <span className="text-base font-bold text-white cursor-pointer transition-colors duration-200 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI gift ideas
                </span>
              </Link>
              <span className="text-base font-bold text-slate-300 hover:text-white cursor-pointer transition-colors duration-200">
                Find a list
              </span>
              <span className="text-base font-bold text-slate-300 hover:text-white cursor-pointer transition-colors duration-200">
                Popular Gifts
              </span>
              <span className="text-base font-bold text-slate-300 hover:text-white cursor-pointer transition-colors duration-200">
                Gift guides
              </span>
              <span className="text-base font-bold text-slate-300 hover:text-white cursor-pointer transition-colors duration-200">
                FAQ
              </span>
            </nav>

            <div className="flex items-center space-x-3">
              <Button
                onClick={() => window.location.href = '/api/login'}
                variant="outline"
                className="border-slate-600 text-white bg-transparent hover:bg-slate-700 px-4 py-2 rounded-md"
              >
                Login
              </Button>
              <Button
                onClick={() => window.location.href = '/api/login'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Ask Ocassia</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get personalized gift recommendations powered by AI. Tell us about the person you're shopping for, and we'll find the perfect gifts.
          </p>
        </div>

        {/* Chat Interface */}
        <Card className="max-w-4xl mx-auto shadow-lg h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center">
              <Sparkles className="w-6 h-6 text-blue-600 mr-3" />
              Chat with Ocassia
              <span className="ml-auto text-sm font-normal text-gray-500">AI Gift Assistant</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-blue-600 ml-3' : 'bg-gray-200 mr-3'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.message}</p>
                      </div>
                      
                      {/* Gift Recommendations */}
                      {message.recommendations && message.recommendations.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <p className="text-sm font-medium text-gray-700">Here are some perfect gift ideas:</p>
                          {message.recommendations.map((gift) => (
                            <div key={gift.id} className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex space-x-3">
                                <img 
                                  src={gift.imageUrl} 
                                  alt={gift.title}
                                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">{gift.title}</h4>
                                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{gift.description}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-green-600 text-sm">{gift.price}</span>
                                    <Button
                                      size="sm"
                                      onClick={() => window.open(gift.affiliateUrl, '_blank')}
                                      className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1 h-7"
                                    >
                                      View
                                      <ArrowRight className="w-3 h-3 ml-1" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Tell me about the person you're shopping for..."
                  className="flex-1"
                  disabled={sendMessage.isPending}
                />
                <Button 
                  type="submit" 
                  disabled={sendMessage.isPending || !currentMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {sendMessage.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}