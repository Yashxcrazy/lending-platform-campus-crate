import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft } from "lucide-react";

export default function LendingReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Call API to submit review
      // await submitReview.mutateAsync({
      //   bookingId: id,
      //   rating,
      //   comment,
      // });
      alert("Review submitted successfully!");
      navigate("/my-rentals");
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-center max-w-2xl py-12 px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/my-rentals")}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Rentals
        </button>

        <div className="glass-card border border-cyan-400/30 p-8 rounded-lg">
          <h1 className="text-3xl font-bold text-white mb-2">Leave a Review</h1>
          <p className="text-gray-400 mb-8">
            Share your experience to help other students make informed decisions
          </p>

          <div className="space-y-8">
            {/* Rating Section */}
            <div>
              <label className="block text-lg font-semibold text-white mb-4">
                How would you rate this experience?
              </label>
              <div className="flex gap-4 text-5xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-12 h-12 ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Categories (Optional) */}
            {rating > 0 && (
              <div>
                <label className="block text-lg font-semibold text-white mb-4">
                  Rate specific aspects
                </label>
                <div className="space-y-4">
                  {[
                    { id: "communication", label: "Communication" },
                    { id: "condition", label: "Item Condition" },
                    { id: "punctuality", label: "Punctuality" },
                  ].map((category) => (
                    <div key={category.id} className="flex justify-between items-center">
                      <span className="text-white">{category.label}</span>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-5 h-5 fill-gray-600 text-gray-600 cursor-pointer hover:fill-yellow-400 hover:text-yellow-400 transition-colors"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comment Section */}
            <div>
              <label className="block text-lg font-semibold text-white mb-4">
                Share your thoughts (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What was your experience like? Any tips for the lender or borrower?"
                className="w-full glass-card border border-cyan-400/30 bg-white/5 text-white placeholder:text-gray-400 p-4 rounded-lg resize-none"
                rows={6}
              />
              <p className="text-xs text-gray-400 mt-2">
                {comment.length} / 500 characters
              </p>
            </div>

            {/* Recommendations */}
            <div className="glass-card bg-cyan-400/10 border border-cyan-400/30 p-6 rounded-lg">
              <h3 className="font-semibold text-white mb-3">Would you recommend this {rating >= 4 ? "lender" : "user"} to others?</h3>
              <div className="flex gap-4">
                <Button className="flex-1 btn-glow-cyan">Yes, Definitely!</Button>
                <Button variant="outline" className="flex-1">
                  Not Sure
                </Button>
                <Button variant="outline" className="flex-1 text-red-400">
                  No
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmitting || rating === 0}
              className="w-full btn-glow-cyan py-6 text-lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>

        {/* Safety Info */}
        <div className="mt-8 glass-card bg-yellow-400/10 border border-yellow-400/30 p-4 rounded-lg text-sm text-gray-300">
          <p className="font-semibold text-yellow-300 mb-2">⚠️ Review Guidelines:</p>
          <ul className="space-y-1 text-xs">
            <li>• Be honest and constructive</li>
            <li>• No personal attacks or harassment</li>
            <li>• Share specific experiences</li>
            <li>• Reviews help improve the community</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
