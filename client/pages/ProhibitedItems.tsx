import { Header } from "@/components/Header";
import { XCircle, AlertTriangle } from "lucide-react";

const prohibitedCategories = [
  {
    title: "Weapons & Dangerous Items",
    color: "red",
    items: [
      "Firearms, ammunition, or weapon accessories",
      "Knives, swords, or other bladed weapons",
      "Explosives, fireworks, or incendiary devices",
      "Tasers, stun guns, or pepper spray",
      "Any item designed to cause harm",
    ],
  },
  {
    title: "Illegal Substances & Drugs",
    color: "red",
    items: [
      "Illegal drugs or controlled substances",
      "Drug paraphernalia",
      "Prescription medications",
      "Tobacco products and vaping devices",
      "Alcohol or alcoholic beverages",
    ],
  },
  {
    title: "Stolen or Counterfeit Goods",
    color: "red",
    items: [
      "Stolen property",
      "Counterfeit or replica items",
      "Pirated software, media, or content",
      "Items without proof of ownership",
      "Unauthorized copies of copyrighted material",
    ],
  },
  {
    title: "Hazardous Materials",
    color: "orange",
    items: [
      "Chemicals or toxic substances",
      "Radioactive materials",
      "Biohazards or medical waste",
      "Flammable liquids or gases",
      "Asbestos or lead-containing items",
    ],
  },
  {
    title: "Personal & Intimate Items",
    color: "orange",
    items: [
      "Underwear or intimate apparel",
      "Personal hygiene items (used)",
      "Medical devices for personal use",
      "Items with bodily fluids",
      "Mattresses or pillows (used)",
    ],
  },
  {
    title: "Animals & Living Things",
    color: "yellow",
    items: [
      "Pets or animals",
      "Plants requiring special care",
      "Live organisms",
      "Animal parts or products from endangered species",
    ],
  },
  {
    title: "Sensitive Electronics",
    color: "yellow",
    items: [
      "Items containing personal data without factory reset",
      "Government or military equipment",
      "Surveillance equipment without proper authorization",
      "Hacking tools or equipment",
    ],
  },
  {
    title: "Items Requiring Special Licenses",
    color: "orange",
    items: [
      "Vehicles (cars, motorcycles, etc.)",
      "Professional medical equipment",
      "Items requiring special permits",
      "Real estate or property",
      "Financial instruments or securities",
    ],
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  red: { bg: "bg-red-400/10", border: "border-red-400/30", text: "text-red-400" },
  orange: { bg: "bg-orange-400/10", border: "border-orange-400/30", text: "text-orange-400" },
  yellow: { bg: "bg-yellow-400/10", border: "border-yellow-400/30", text: "text-yellow-400" },
};

export default function ProhibitedItems() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-center max-w-6xl py-16 px-4">
        <div className="text-center mb-12">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="marvel-title mb-4">Prohibited Items</h1>
          <p className="marvel-subtitle max-w-2xl mx-auto">
            For everyone's safety, the following items are strictly prohibited on CampusCrate
          </p>
        </div>

        <div className="glass-card p-8 mb-12 border border-red-400/30 bg-red-400/5">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Zero Tolerance Policy</h3>
              <p className="text-gray-300 mb-3">
                Listing prohibited items will result in immediate account suspension and potential legal action. 
                We take community safety seriously and actively monitor all listings.
              </p>
              <p className="text-gray-300">
                If you see a prohibited item listed, please report it immediately using our Report Issue feature.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {prohibitedCategories.map((category, index) => {
            const colors = colorMap[category.color];
            return (
              <div
                key={index}
                className={`glass-card p-6 border ${colors.border} ${colors.bg}`}
              >
                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${colors.text}`}>
                  <XCircle className="w-6 h-6" />
                  {category.title}
                </h3>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-gray-300 text-sm">
                      <span className={`${colors.text} mt-1`}>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="glass-card p-8 mt-12 border border-cyan-400/30">
          <h3 className="text-xl font-bold text-white mb-4">What You CAN Lend</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div>
              <h4 className="font-semibold text-cyan-400 mb-2">✓ Electronics</h4>
              <ul className="space-y-1">
                <li>• Laptops & tablets</li>
                <li>• Headphones & speakers</li>
                <li>• Cameras & accessories</li>
                <li>• Gaming consoles</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-cyan-400 mb-2">✓ Academic Items</h4>
              <ul className="space-y-1">
                <li>• Textbooks</li>
                <li>• Scientific calculators</li>
                <li>• Lab equipment</li>
                <li>• Study materials</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-cyan-400 mb-2">✓ Sports & Recreation</h4>
              <ul className="space-y-1">
                <li>• Sports equipment</li>
                <li>• Musical instruments</li>
                <li>• Camping gear</li>
                <li>• Board games</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-cyan-400 mb-2">✓ Tools & Appliances</h4>
              <ul className="space-y-1">
                <li>• Power tools</li>
                <li>• Kitchen appliances</li>
                <li>• Furniture (new/clean)</li>
                <li>• Office supplies</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-cyan-400 mb-2">✓ Fashion & Accessories</h4>
              <ul className="space-y-1">
                <li>• Formal wear (clean)</li>
                <li>• Bags & backpacks</li>
                <li>• Watches & jewelry</li>
                <li>• Shoes (cleaned)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-cyan-400 mb-2">✓ Other</h4>
              <ul className="space-y-1">
                <li>• Decorative items</li>
                <li>• Party supplies</li>
                <li>• Event equipment</li>
                <li>• Art supplies</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Not sure if an item is allowed? Contact us before listing.
          </p>
          <a href="/contact" className="btn-glow-cyan">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
