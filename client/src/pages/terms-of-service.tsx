import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last updated: January 3, 2025</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing and using Ocassia ("the Service"), you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              Ocassia is a personal relationship management platform that helps users remember special dates, 
              manage relationships, and discover gift recommendations. Our services include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Date and occasion reminders</li>
              <li>Contact and relationship management</li>
              <li>Wishlist creation and sharing</li>
              <li>AI-powered gift recommendations</li>
              <li>Collaborative features with friends and family</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts and Responsibilities</h2>
            <p className="text-gray-700 mb-4">
              To use certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Take responsibility for all activities that occur under your account</li>
              <li>Use the Service in compliance with applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
            <p className="text-gray-700 mb-4">You agree not to use the Service to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Upload, post, or transmit any harmful, illegal, or inappropriate content</li>
              <li>Violate any applicable local, state, national, or international law</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Interfere with or disrupt the Service or servers connected to the Service</li>
              <li>Attempt to gain unauthorized access to any portion of the Service</li>
              <li>Use the Service for commercial purposes without our written consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacy and Data Protection</h2>
            <p className="text-gray-700">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your 
              use of the Service, to understand our practices regarding the collection and use of your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property Rights</h2>
            <p className="text-gray-700 mb-4">
              The Service and its original content, features, and functionality are and will remain the 
              exclusive property of Ocassia and its licensors. The Service is protected by copyright, 
              trademark, and other laws.
            </p>
            <p className="text-gray-700">
              You retain rights to any content you submit, post, or display on or through the Service, 
              but you grant us a license to use, modify, and display such content as necessary to provide the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Third-Party Services</h2>
            <p className="text-gray-700">
              Our Service may contain links to third-party websites or services (such as Amazon, OpenTable, 
              or Expedia) that are not owned or controlled by Ocassia. We have no control over and assume 
              no responsibility for the content, privacy policies, or practices of any third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-gray-700">
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Ocassia disclaims all warranties, 
              whether express or implied, including but not limited to implied warranties of merchantability, 
              fitness for a particular purpose, and non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700">
              In no event shall Ocassia be liable for any indirect, incidental, special, consequential, 
              or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
              or other intangible losses, resulting from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
            <p className="text-gray-700">
              We may terminate or suspend your account and bar access to the Service immediately, without 
              prior notice or liability, under our sole discretion, for any reason whatsoever, including 
              but not limited to a breach of the Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, 
              we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
            <p className="text-gray-700">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> ocassiaapp@gmail.com
              </p>
              <p className="text-gray-700">
                <strong>Subject:</strong> Terms of Service Inquiry
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}