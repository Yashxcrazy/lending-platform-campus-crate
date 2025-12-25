import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, HelpCircle, Shield } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Construct mailto link with form data
    const mailtoLink = `mailto:yashzank@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-center max-w-6xl py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="marvel-title mb-4">Get in Touch</h1>
          <p className="marvel-subtitle max-w-2xl mx-auto">
            Have questions, feedback, or need help? We're here to assist you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info Cards */}
          <div className="glass-card p-6 border border-cyan-400/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-cyan-400/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Email Us</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Send us an email and we'll respond within 24-48 hours.
                </p>
                <a
                  href="mailto:yashzank@gmail.com"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  yashzank@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border border-purple-400/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-400/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Quick Response</h3>
                <p className="text-gray-400 text-sm mb-3">
                  For urgent matters, reach out via email for fastest response.
                </p>
                <p className="text-purple-400">Available: Mon-Sat, 9 AM - 6 PM</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border border-blue-400/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-400/20 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Help Center</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Check our FAQ section for common questions and answers.
                </p>
                <a href="/how-it-works" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Visit Help Center →
                </a>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border border-red-400/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-400/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Report Issue</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Found a bug or security issue? Let us know immediately.
                </p>
                <p className="text-red-400">Priority: High</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-card p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Name
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
                className="glass-card border-cyan-400/30 bg-white/5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@nitrr.ac.in"
                required
                className="glass-card border-cyan-400/30 bg-white/5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <Input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="What is this regarding?"
                required
                className="glass-card border-cyan-400/30 bg-white/5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us how we can help you..."
                required
                rows={6}
                className="glass-card border-cyan-400/30 bg-white/5"
              />
            </div>

            <Button type="submit" className="w-full btn-glow-cyan">
              <Mail className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            We typically respond within 24-48 hours during business days.
          </p>
        </div>
      </div>
    </div>
  );
}
