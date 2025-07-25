import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Gift, Heart, ArrowRight, Loader2 } from "lucide-react";
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

export default function AIGiftIdeas() {
  const [formData, setFormData] = useState({
    relationship: "",
    age: "",
    interests: "",
    occasion: "",
    budget: "",
    additionalInfo: ""
  });

  const generateRecommendations = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/ai/gift-recommendations", data);
      return await response.json();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateRecommendations.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 text-pink-500 mr-2" />
                Tell us about them
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="relationship">What's your relationship?</Label>
                  <Select onValueChange={(value) => handleInputChange("relationship", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="partner">Partner/Spouse</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="colleague">Colleague</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="age">Age range</Label>
                  <Select onValueChange={(value) => handleInputChange("age", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-12">0-12 years</SelectItem>
                      <SelectItem value="13-17">13-17 years</SelectItem>
                      <SelectItem value="18-25">18-25 years</SelectItem>
                      <SelectItem value="26-35">26-35 years</SelectItem>
                      <SelectItem value="36-50">36-50 years</SelectItem>
                      <SelectItem value="51-65">51-65 years</SelectItem>
                      <SelectItem value="65+">65+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="occasion">What's the occasion?</Label>
                  <Select onValueChange={(value) => handleInputChange("occasion", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select occasion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="anniversary">Anniversary</SelectItem>
                      <SelectItem value="christmas">Christmas</SelectItem>
                      <SelectItem value="valentines">Valentine's Day</SelectItem>
                      <SelectItem value="graduation">Graduation</SelectItem>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="housewarming">Housewarming</SelectItem>
                      <SelectItem value="just-because">Just Because</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="budget">Budget range</Label>
                  <Select onValueChange={(value) => handleInputChange("budget", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-25">Under $25</SelectItem>
                      <SelectItem value="25-50">$25 - $50</SelectItem>
                      <SelectItem value="50-100">$50 - $100</SelectItem>
                      <SelectItem value="100-250">$100 - $250</SelectItem>
                      <SelectItem value="250-500">$250 - $500</SelectItem>
                      <SelectItem value="500+">$500+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="interests">Their interests & hobbies</Label>
                  <Textarea
                    id="interests"
                    placeholder="e.g., cooking, gaming, fitness, reading, travel..."
                    value={formData.interests}
                    onChange={(e) => handleInputChange("interests", e.target.value)}
                    className="h-20"
                  />
                </div>

                <div>
                  <Label htmlFor="additionalInfo">Anything else we should know?</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Any specific preferences, things they already have, or ideas you've considered..."
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                    className="h-20"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                  disabled={generateRecommendations.isPending}
                >
                  {generateRecommendations.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Ideas...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Get AI Recommendations
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {generateRecommendations.isSuccess && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gift className="w-5 h-5 text-green-500 mr-2" />
                    Perfect Gift Ideas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(generateRecommendations.data as GiftRecommendation[])?.map((gift) => (
                      <div key={gift.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex space-x-4">
                          <img 
                            src={gift.imageUrl} 
                            alt={gift.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{gift.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{gift.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-green-600">{gift.price}</span>
                              <Button
                                size="sm"
                                onClick={() => window.open(gift.affiliateUrl, '_blank')}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                View Deal
                                <ArrowRight className="w-4 h-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {generateRecommendations.isError && (
              <Card className="shadow-lg border-red-200">
                <CardContent className="pt-6">
                  <div className="text-center text-red-600">
                    <p>Sorry, we couldn't generate recommendations right now. Please try again.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {!generateRecommendations.data && !generateRecommendations.isError && (
              <Card className="shadow-lg border-gray-200">
                <CardContent className="pt-6">
                  <div className="text-center text-gray-500">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Fill out the form to get personalized gift recommendations</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}