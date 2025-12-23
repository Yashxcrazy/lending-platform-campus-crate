import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, HandshakeIcon as Handshake, ShieldCheck, Star, Upload, CalendarDays } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-center max-w-5xl py-12 px-4 space-y-10">
        <section className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-white">How CampusCrate Works</h1>
          <p className="text-gray-400">Borrow and lend items safely with fellow students.</p>
        </section>

        {/* Steps */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-2 text-white font-semibold"><Search className="w-5 h-5 text-cyan-400"/>Browse</div>
            <p className="text-gray-400">Find items by category, price, and location.</p>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-2 text-white font-semibold"><CalendarDays className="w-5 h-5 text-cyan-400"/>Request</div>
            <p className="text-gray-400">Choose dates and send a rental request.</p>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-2 text-white font-semibold"><Handshake className="w-5 h-5 text-cyan-400"/>Handover</div>
            <p className="text-gray-400">Meet on campus for item pickup and return.</p>
          </div>
        </section>

        {/* Lend flow */}
        <section className="glass-card p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">Lend Your Items</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 text-white font-semibold mb-1"><Upload className="w-5 h-5 text-cyan-400"/>List</div>
              <p className="text-gray-400">Add photos, set rates and deposit.</p>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 text-white font-semibold mb-1"><ShieldCheck className="w-5 h-5 text-cyan-400"/>Approve</div>
              <p className="text-gray-400">Review requests and accept or reject.</p>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 text-white font-semibold mb-1"><Star className="w-5 h-5 text-cyan-400"/>Review</div>
              <p className="text-gray-400">Rate your experience after completion.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-3">
          <Link to="/listings">
            <Button className="btn-glow-cyan">Start Browsing</Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
