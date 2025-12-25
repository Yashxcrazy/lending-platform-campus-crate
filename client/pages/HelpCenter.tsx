import { Header } from "@/components/Header";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I sign up for CampusCrate?",
        a: "Sign up using your college email address (ending in @nitrr.ac.in). Verify your email, complete your profile, and you're ready to start lending or borrowing!",
      },
      {
        q: "Is CampusCrate free to use?",
        a: "Yes! Creating an account and browsing items is completely free. Borrowers pay the daily rate set by lenders, and CampusCrate doesn't charge any platform fees.",
      },
      {
        q: "Do I need to verify my account?",
        a: "Yes, account verification is required to borrow items, lend items, or use the chat feature. This ensures safety for all community members.",
      },
    ],
  },
  {
    category: "Lending Items",
    questions: [
      {
        q: "How do I list an item?",
        a: "Go to 'My Listings' and click 'Add New Item'. Fill in details like title, description, daily rate, security deposit, and upload photos. Set your availability and publish!",
      },
      {
        q: "How do I set my pricing?",
        a: "You set a daily rate for your item. Consider the item's value, condition, and market rates. You also set a security deposit to protect against damages.",
      },
      {
        q: "Can I reject lending requests?",
        a: "Yes, you have full control. Review each request and accept or reject based on the borrower's profile, ratings, and your availability.",
      },
    ],
  },
  {
    category: "Borrowing Items",
    questions: [
      {
        q: "How do I borrow an item?",
        a: "Browse items, click on one you like, select your rental dates, and submit a request. The lender will review and respond to your request.",
      },
      {
        q: "What if the item is damaged?",
        a: "Report damages immediately. The security deposit covers minor damages. For major issues, contact support and document everything with photos.",
      },
      {
        q: "How do returns work?",
        a: "Return the item on the agreed date. Meet at a safe campus location, let the lender inspect it, and mark the rental as complete in the app.",
      },
    ],
  },
  {
    category: "Safety & Trust",
    questions: [
      {
        q: "Is my personal information safe?",
        a: "Yes! Your contact details remain private until you choose to share them. Our anonymous chat feature lets you communicate safely.",
      },
      {
        q: "What if someone doesn't return my item?",
        a: "Contact the borrower through chat first. If unresolved, report the issue to support. You can also leave a review to warn other lenders.",
      },
      {
        q: "How do ratings work?",
        a: "After each completed rental, both parties can leave ratings and reviews. Build your reputation by being reliable, communicative, and respectful.",
      },
    ],
  },
];

export default function HelpCenter() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-center max-w-4xl py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="page-title mb-4">Help Center</h1>
          <p className="page-subtitle max-w-2xl mx-auto mb-8">
            Find answers to common questions about CampusCrate
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 glass-card border-cyan-400/30 bg-white/5 text-white"
            />
          </div>
        </div>

        <div className="space-y-8">
          {filteredFaqs.map((category, catIndex) => (
            <div key={catIndex}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-cyan-400">•</span>
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.questions.map((faq, qIndex) => {
                  const questionId = `${catIndex}-${qIndex}`;
                  const isOpen = openQuestion === questionId;

                  return (
                    <div
                      key={qIndex}
                      className="glass-card p-5 border border-cyan-400/20 hover:border-cyan-400/40 transition-all"
                    >
                      <button
                        onClick={() => setOpenQuestion(isOpen ? null : questionId)}
                        className="w-full flex items-center justify-between text-left"
                      >
                        <span className="font-semibold text-white pr-4">{faq.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-cyan-400 flex-shrink-0 transition-transform ${
                            isOpen ? "transform rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="mt-3 pt-3 border-t border-cyan-400/20 text-gray-300 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No results found for "{searchQuery}"</p>
            <p className="text-sm text-gray-500">Try different keywords or browse all categories above</p>
          </div>
        )}

        <div className="glass-card p-8 mt-12 border border-purple-400/30 text-center">
          <h3 className="text-xl font-bold text-white mb-3">Still need help?</h3>
          <p className="text-gray-300 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Link to="/contact">
            <button className="btn-glow-cyan">
              Contact Support
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
