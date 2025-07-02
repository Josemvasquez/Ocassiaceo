import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Calendar, Gift, Users, Shield, CheckCircle, Star } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-semibold text-blue-900">RemindMe</h1>
            </div>
            
            <Button
              onClick={() => window.location.href = '/api/login'}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 font-medium rounded-lg"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-blue-900 mb-6 leading-tight">
            Gift with confidence
          </h2>
          <p className="text-xl text-blue-700 mb-4 font-medium">
            For birthdays, holidays & year-round giving.
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            A free, private gift registry trusted by families worldwide. Set it up once, use it year after year.
          </p>
          <Button
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-lg"
          >
            Make a Wish List
          </Button>
        </div>
      </section>

      {/* Family Group Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-blue-900 mb-6">
              Bring your family together with shared wish lists
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Give and receive gifts with every member of your family anytime, on any device.
            </p>
            <Button
              onClick={() => window.location.href = '/api/login'}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 font-semibold rounded-lg"
            >
              Start a Group
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Avoid duplicates</h4>
              <p className="text-gray-600">See claimed gifts to avoid returns.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Get gifts right</h4>
              <p className="text-gray-600">Spend money on gifts that are wanted.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Simplify your life</h4>
              <p className="text-gray-600">All of your family's lists in one spot.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Keep the surprise</h4>
              <p className="text-gray-600">Purchases are hidden from the list maker.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-blue-900 mb-6">For everyone in the family</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Unlike traditional gift registries, everyone in your group can create and view each other's wish lists anytime. 
              Add family members to organize wish lists for everyone under one account.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-gray-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Gift className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Add any item in seconds</h4>
                <p className="text-gray-600">Magically auto-fill item details from any website. Add from Amazon, local stores, or anywhere online.</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Share lists or keep private</h4>
                <p className="text-gray-600">Invite friends and family to share and shop your list or keep it private. You choose who sees what.</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Universal gift registry</h4>
                <p className="text-gray-600">Perfect for birthdays, holidays, baby showers, weddings, and any special occasion year-round.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "I have 16 people to buy gifts for. Before RemindMe I used to get burnt out buying gifts, now I do almost all of my holiday gift buying online well before the holidays. Holiday burnout is a thing of the past."
                </p>
                <p className="text-gray-500 text-sm">–Sarah M., Dec 2024</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Love this app! It's made our gift buying so simple and streamlined, and no more unwanted gifts which is also good for the planet! Less waste!"
                </p>
                <p className="text-gray-500 text-sm">–Jennifer K., Nov 2024</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust and Member Count Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-blue-900 mb-6">
            The end of gift anxiety
          </h3>
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">What's gift anxiety?</h4>
            <ul className="text-gray-600 space-y-2 max-w-2xl mx-auto">
              <li>• Worrying you didn't pick the right gift</li>
              <li>• Faking delight when opening an unwanted gift</li>
              <li>• Dreading the hassle of gift returns</li>
            </ul>
          </div>
          <p className="text-lg text-blue-700 mb-8 font-medium">There's a better way. Try RemindMe today.</p>
          <Button
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-lg"
          >
            Sign Up (Free)
          </Button>
        </div>
      </section>

      {/* Member Growth Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-blue-900 mb-6">
            Join thousands of happy families
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            The proof is in the results. Families worldwide choose RemindMe to make gift-giving stress-free.
          </p>
          <Button
            onClick={() => window.location.href = '/api/login'}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 font-semibold rounded-lg"
          >
            Join Free Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-semibold text-blue-900">RemindMe</span>
              </div>
              <p className="text-gray-600 text-sm">Making gift-giving stress-free for families worldwide.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Wish Lists</li>
                <li>Gift Recommendations</li>
                <li>Date Reminders</li>
                <li>Family Groups</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Occasions</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Birthdays</li>
                <li>Holidays</li>
                <li>Weddings</li>
                <li>Baby Showers</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>About</li>
                <li>Privacy Policy</li>
                <li>Terms of Use</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 mt-8">
            <div className="flex items-center justify-center">
              <span className="text-gray-500 text-sm">© 2025 RemindMe. Established 2025. Made with ❤️</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
