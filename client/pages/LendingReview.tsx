import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft } from "lucide-react";
import { useCreateReview, useBooking } from "@/hooks/useAPI";
import { useToast } from "@/hooks/use-toast";

export default function LendingReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [toUserId, setToUserId] = useState("");
  
  const createReview = useCreateReview();
  const { data: booking, isLoading } = useBooking(id || "");

  // Determine who to review (the other party in the transaction)
  useEffect(() => {
    if (booking) {
      // If current user is the borrower, review the lender; otherwise review the borrower
      const currentUserId = localStorage.getItem('userId');
      if (booking.borrower?._id === currentUserId || booking.borrower === currentUserId) {
        setToUserId(booking.lender?._id || booking.lender);
      } else {
        setToUserId(booking.borrower?._id || booking.borrower);
      }
    }
  }, [booking]);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    if (!id || !toUserId) {
      toast({
        title: "Error",
        description: "Missing required information",
        variant: "destructive",
      });
      return;
    }

    try {
      await createReview.mutateAsync({
        bookingId: id,
        toUserId,
        rating,
        comment,
      });
      
      toast({
        title: "Success",
        description: "Review submitted successfully!",
      });
      
      navigate("/my-rentals");
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to submit review",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-center max-w-2xl py-12 px-4">
          <div className="text-white text-center">Loading...</div>
        </div>
      </div>
    );
  }

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

            {/* Submit Button */}
            <Button
              onClick={handleSubmitReview}
              disabled={createReview.isPending || rating === 0}
              className="w-full btn-glow-cyan text-lg py-6"
            >
              {createReview.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>

        {/* Safety Info */}
        <div className="mt-8 glass-card bg-yellow-400/10 border border-yellow-400/30 p-4 rounded-lg text-sm text-gray-300">
          <p className="font-semibold text-yellow-300 mb-2">
            ⚠️ Review Guidelines:
          </p>
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
