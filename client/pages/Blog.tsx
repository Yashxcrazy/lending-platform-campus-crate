import { Header } from "@/components/Header";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "5 Tips for Safe Campus Lending",
    excerpt: "Learn how to protect yourself and your items when lending or borrowing on campus.",
    author: "CampusCrate Team",
    date: "December 15, 2024",
    category: "Safety",
    image: "🔒",
  },
  {
    id: 2,
    title: "Building Your Reputation Score",
    excerpt: "Understand how reviews and ratings work to become a trusted member of our community.",
    author: "CampusCrate Team",
    date: "December 10, 2024",
    category: "Tips",
    image: "⭐",
  },
  {
    id: 3,
    title: "Sustainable Campus Living",
    excerpt: "How sharing economy platforms are reducing waste and building stronger communities.",
    author: "CampusCrate Team",
    date: "December 5, 2024",
    category: "Community",
    image: "🌱",
  },
  {
    id: 4,
    title: "Top 10 Most Borrowed Items",
    excerpt: "Discover what students are borrowing most frequently and why.",
    author: "CampusCrate Team",
    date: "November 28, 2024",
    category: "Insights",
    image: "📊",
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-center max-w-6xl py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="page-title mb-4">Campus Crate Blog</h1>
          <p className="page-subtitle max-w-2xl mx-auto">
            Tips, insights, and stories from the student lending community
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="glass-card p-6 hover:border-cyan-400/50 transition-all group">
              <div className="text-6xl mb-4">{post.image}</div>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-semibold">
                  {post.category}
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                {post.title}
              </h2>
              
              <p className="text-gray-300 mb-4 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-semibold">
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">More articles coming soon!</p>
          <Link to="/contact">
            <button className="btn-glow-cyan">
              Subscribe to Updates
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
