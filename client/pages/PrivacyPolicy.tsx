import { Header } from "@/components/Header";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-center max-w-4xl py-16 px-4">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h1 className="page-title mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: December 26, 2024</p>
        </div>

        <div className="glass-card p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <div className="text-gray-300 space-y-3">
              <p>We collect information you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and college email address</li>
                <li>Profile information (campus, phone number, student ID)</li>
                <li>Items you list for lending</li>
                <li>Messages and communications within the platform</li>
                <li>Reviews and ratings</li>
                <li>Transaction history</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <div className="text-gray-300 space-y-3">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Protect against fraudulent or illegal activity</li>
                <li>Verify user identity through college email verification</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
            <div className="text-gray-300 space-y-3">
              <p>We do not sell your personal information. We may share your information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>With other users:</strong> Your profile, ratings, and listings are visible to other verified users</li>
                <li><strong>For legal purposes:</strong> If required by law or to protect rights and safety</li>
                <li><strong>With your consent:</strong> When you choose to share information with third parties</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                We implement appropriate technical and organizational measures to protect your personal information. 
                However, no method of transmission over the Internet is 100% secure.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encrypted data transmission</li>
                <li>Secure password storage</li>
                <li>Regular security audits</li>
                <li>Limited access to personal information</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Anonymous Chat</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                Our anonymous chat feature protects your privacy by not sharing contact information until you 
                choose to do so. Messages are stored securely and only visible to transaction participants.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
            <div className="text-gray-300 space-y-3">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and associated data</li>
                <li>Export your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Cookies and Tracking</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                We use cookies and similar technologies to improve user experience, analyze usage patterns, 
                and maintain security. You can control cookie preferences through your browser settings.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                CampusCrate is intended for college students. We do not knowingly collect information from 
                individuals under 18 years of age.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Changes to This Policy</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                We may update this privacy policy from time to time. We will notify users of significant changes 
                via email or platform notification.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-cyan-400">yashzank@gmail.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
