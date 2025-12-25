import { Header } from "@/components/Header";
import { Mail, Linkedin, Github } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-center max-w-4xl py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="page-title mb-4">About CampusCrate</h1>
          <p className="page-subtitle max-w-2xl mx-auto">
            Empowering students to share resources and build a sustainable campus community
          </p>
        </div>

        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            CampusCrate is a peer-to-peer lending platform designed specifically for college students. 
            We believe in creating a sustainable ecosystem where students can share resources, 
            save money, and build meaningful connections within their campus community.
          </p>
          <p className="text-gray-300 leading-relaxed">
            From textbooks and electronics to sports equipment and musical instruments, 
            our platform makes it easy to borrow what you need and lend what you don't use. 
            Together, we're reducing waste, saving money, and fostering a culture of collaboration.
          </p>
        </div>

        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">How It Started</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            CampusCrate was born from a simple observation: students often need items temporarily 
            but can't justify buying them. Meanwhile, many items sit unused in dorm rooms and hostels.
          </p>
          <p className="text-gray-300 leading-relaxed">
            By creating a trusted platform for students to share resources, we're making campus life 
            more affordable and sustainable for everyone.
          </p>
        </div>

        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">🔒 Safe & Secure</h3>
              <p className="text-gray-300 text-sm">
                Verified college email accounts only. Your safety is our priority.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">💬 Anonymous Chat</h3>
              <p className="text-gray-300 text-sm">
                Communicate safely without sharing personal details until you're ready.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">⭐ Reviews & Ratings</h3>
              <p className="text-gray-300 text-sm">
                Build your reputation and make informed decisions based on peer reviews.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">📱 Easy to Use</h3>
              <p className="text-gray-300 text-sm">
                Simple, intuitive interface designed for busy students.
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 border border-cyan-400/30">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Created By</h2>
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4">
              Y
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Yash Zankyani</h3>
            <p className="text-cyan-400 mb-2">Computer Science & Engineering</p>
            <p className="text-gray-400 mb-6">NIT Raipur (2024-2028)</p>
            
            <div className="flex justify-center gap-4">
              <a 
                href="mailto:yashzank@gmail.com" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg glass-card border-cyan-400/30 hover:border-cyan-400 transition-all text-white"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>Built with ❤️ for the student community</p>
        </div>
      </div>
    </div>
  );
}
