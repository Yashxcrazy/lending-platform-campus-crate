import { Header } from "@/components/Header";
import { FileText } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-center max-w-4xl py-16 px-4">
        <div className="text-center mb-12">
          <FileText className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h1 className="page-title mb-4">Terms of Service</h1>
          <p className="text-gray-400">Last updated: December 26, 2024</p>
        </div>

        <div className="glass-card p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                By accessing and using CampusCrate, you accept and agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our platform.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Eligibility</h2>
            <div className="text-gray-300 space-y-3">
              <p>To use CampusCrate, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be a current student at NIT Raipur</li>
                <li>Possess a valid college email address</li>
                <li>Be at least 18 years old or have parental consent</li>
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
            <div className="text-gray-300 space-y-3">
              <p>As a user of CampusCrate, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate information about items you list</li>
                <li>Treat borrowed items with care and return them on time</li>
                <li>Communicate respectfully with other users</li>
                <li>Honor agreements made through the platform</li>
                <li>Report any issues or violations promptly</li>
                <li>Not use the platform for illegal activities</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Listing Items</h2>
            <div className="text-gray-300 space-y-3">
              <p>When listing items for lending, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Own the item or have permission to lend it</li>
                <li>Accurately describe the item's condition</li>
                <li>Set fair and reasonable pricing</li>
                <li>Not list prohibited items (see Prohibited Items page)</li>
                <li>Include clear photos of the item</li>
                <li>Update availability status promptly</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Borrowing Items</h2>
            <div className="text-gray-300 space-y-3">
              <p>As a borrower, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use items only for their intended purpose</li>
                <li>Return items on time and in the same condition</li>
                <li>Pay security deposits as required</li>
                <li>Report damages immediately</li>
                <li>Cover costs for damages beyond normal wear and tear</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Payments and Fees</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                CampusCrate currently does not charge platform fees. Payments are arranged directly between 
                lenders and borrowers. Future fee structures will be communicated with advance notice.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Lenders set their own daily rates</li>
                <li>Security deposits protect against damages</li>
                <li>Late fees may apply for overdue returns</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Disputes</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                Users are encouraged to resolve disputes amicably. CampusCrate may assist in mediation but 
                is not liable for disputes between users. Serious violations may result in account suspension.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Liability Disclaimer</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                CampusCrate is a platform connecting students. We are not responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Quality, safety, or legality of items listed</li>
                <li>Actions or conduct of users</li>
                <li>Damages or losses during lending transactions</li>
                <li>Accuracy of user-provided information</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Account Termination</h2>
            <div className="text-gray-300 space-y-3">
              <p>We reserve the right to suspend or terminate accounts that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate these terms</li>
                <li>Engage in fraudulent activity</li>
                <li>Harass or threaten other users</li>
                <li>Repeatedly fail to honor commitments</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Intellectual Property</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                All content on CampusCrate, including logos, design, and code, is protected by copyright. 
                Users retain rights to their own content but grant us a license to display it on the platform.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Changes to Terms</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                We may modify these terms at any time. Continued use of the platform after changes constitutes 
                acceptance of the new terms. Significant changes will be communicated via email.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                For questions about these Terms of Service, contact us at:
              </p>
              <p className="text-cyan-400">yashzank@gmail.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
