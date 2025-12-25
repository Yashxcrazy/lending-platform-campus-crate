import { Header } from "@/components/Header";
import { Shield, Eye, MessageSquare, Camera, MapPin, AlertTriangle, CheckCircle, Users } from "lucide-react";

const safetyTips = [
  {
    icon: Shield,
    title: "Verify Before You Lend",
    color: "cyan",
    tips: [
      "Only lend to verified CampusCrate users",
      "Check borrower's ratings and reviews before accepting requests",
      "Ask questions through anonymous chat to gauge reliability",
      "Set clear terms about usage and return conditions",
    ],
  },
  {
    icon: Eye,
    title: "Inspect Items Carefully",
    color: "purple",
    tips: [
      "Document item condition with photos before handover",
      "Note any existing damages or wear in the listing",
      "Inspect items thoroughly when receiving them back",
      "Keep photo evidence of handover and return",
    ],
  },
  {
    icon: MessageSquare,
    title: "Use Platform Communication",
    color: "blue",
    tips: [
      "Keep all conversations in CampusCrate's anonymous chat",
      "Don't share personal contact details until comfortable",
      "Document agreements and special conditions in chat",
      "Report any suspicious or inappropriate messages",
    ],
  },
  {
    icon: MapPin,
    title: "Safe Meeting Locations",
    color: "green",
    tips: [
      "Meet in well-lit, public campus areas",
      "Choose locations with security cameras if possible",
      "Arrange meetings during daytime hours",
      "Bring a friend if you feel uncomfortable",
    ],
  },
  {
    icon: Camera,
    title: "Document Everything",
    color: "orange",
    tips: [
      "Take photos of items before and after lending",
      "Screenshot important conversations",
      "Keep records of payment confirmations",
      "Document any damages or issues immediately",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Red Flags to Watch",
    color: "red",
    tips: [
      "Users with no reviews or very low ratings",
      "Requests to communicate outside the platform",
      "Pressure to skip security deposits",
      "Unwillingness to meet in public places",
    ],
  },
  {
    icon: CheckCircle,
    title: "Security Deposits",
    color: "teal",
    tips: [
      "Always require security deposits for valuable items",
      "Set deposits that reflect the item's replacement cost",
      "Clearly state refund conditions upfront",
      "Return deposits promptly for items returned in good condition",
    ],
  },
  {
    icon: Users,
    title: "Build Your Reputation",
    color: "pink",
    tips: [
      "Complete your profile with accurate information",
      "Respond to messages promptly and professionally",
      "Honor your commitments and return items on time",
      "Leave honest reviews to help the community",
    ],
  },
];

const colorMap: Record<string, { bg: string; border: string; icon: string }> = {
  cyan: { bg: "bg-cyan-400/10", border: "border-cyan-400/30", icon: "text-cyan-400" },
  purple: { bg: "bg-purple-400/10", border: "border-purple-400/30", icon: "text-purple-400" },
  blue: { bg: "bg-blue-400/10", border: "border-blue-400/30", icon: "text-blue-400" },
  green: { bg: "bg-green-400/10", border: "border-green-400/30", icon: "text-green-400" },
  orange: { bg: "bg-orange-400/10", border: "border-orange-400/30", icon: "text-orange-400" },
  red: { bg: "bg-red-400/10", border: "border-red-400/30", icon: "text-red-400" },
  teal: { bg: "bg-teal-400/10", border: "border-teal-400/30", icon: "text-teal-400" },
  pink: { bg: "bg-pink-400/10", border: "border-pink-400/30", icon: "text-pink-400" },
};

export default function SafetyTips() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-center max-w-6xl py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="marvel-title mb-4">Safety Tips</h1>
          <p className="marvel-subtitle max-w-2xl mx-auto">
            Your safety is our priority. Follow these guidelines for a secure lending experience.
          </p>
        </div>

        <div className="glass-card p-8 mb-12 border border-yellow-400/30 bg-yellow-400/5">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Safety First Philosophy</h3>
              <p className="text-gray-300 leading-relaxed">
                CampusCrate is built on trust, but it's important to stay vigilant. While we verify all 
                users through college emails and maintain a rating system, you should always take 
                personal precautions. Never feel pressured to complete a transaction if something 
                doesn't feel right.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {safetyTips.map((section, index) => {
            const colors = colorMap[section.color];
            const Icon = section.icon;

            return (
              <div
                key={index}
                className={`glass-card p-6 border ${colors.border} ${colors.bg}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2 text-gray-300 text-sm">
                      <span className={`${colors.icon} mt-1`}>•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="glass-card p-8 mt-12 border border-red-400/30 bg-red-400/5">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            Report Issues Immediately
          </h3>
          <p className="text-gray-300 mb-4">
            If you encounter fraud, harassment, or safety concerns, report them immediately. We take all 
            reports seriously and will take appropriate action to protect the community.
          </p>
          <button className="btn-glow-red">
            Report an Issue
          </button>
        </div>
      </div>
    </div>
  );
}
