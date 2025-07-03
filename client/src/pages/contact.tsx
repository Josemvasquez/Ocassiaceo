import { Link } from "wouter";
import { ArrowLeft, Mail, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-600">We'd love to hear from you. Get in touch with our team.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-blue-600" />
                  Email Support
                </CardTitle>
                <CardDescription>
                  Send us an email and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-900">ocassiaapp@gmail.com</p>
                  <p className="text-sm text-gray-600">
                    For general inquiries, support, and feedback
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Response Time
                </CardTitle>
                <CardDescription>
                  Our typical response times for different types of inquiries.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">General Support</span>
                    <span className="font-medium text-gray-900">24-48 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Technical Issues</span>
                    <span className="font-medium text-gray-900">12-24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Privacy Concerns</span>
                    <span className="font-medium text-gray-900">24 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Compose your message and we'll respond via email.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Categories
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">• General Support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">• Technical Issues</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">• Privacy Policy Inquiry</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">• Terms of Service Inquiry</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">• Feature Request</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">• Bug Report</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={() => window.location.href = 'mailto:ocassiaapp@gmail.com?subject=Support Request'}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Compose Email
                    </Button>
                  </div>

                  <div className="text-sm text-gray-500 text-center">
                    Or email us directly at{" "}
                    <a 
                      href="mailto:ocassiaapp@gmail.com" 
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      ocassiaapp@gmail.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I delete my account?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  You can delete your account from the settings page or by contacting us at ocassiaapp@gmail.com 
                  with "Account Deletion Request" in the subject line.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is my data secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, we use industry-standard security measures to protect your data. 
                  Read our Privacy Policy for more details about how we handle your information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I report a bug?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Email us at ocassiaapp@gmail.com with "Bug Report" in the subject line. 
                  Please include steps to reproduce the issue and your device information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I suggest new features?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Absolutely! We love hearing from our users. Send your feature requests to 
                  ocassiaapp@gmail.com with "Feature Request" in the subject line.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}