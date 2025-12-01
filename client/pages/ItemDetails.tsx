import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useListing, useMessages, useSendMessage, useCreateBooking } from "@/hooks/useAPI";
import {
  Star,
  MapPin,
  Calendar,
  Heart,
  Share2,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageInput, setMessageInput] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [liked, setLiked] = useState(false);

  const { data: listing, isLoading } = useListing(id!);
  const { data: messagesData } = useMessages(id!);
  const sendMessageMutation = useSendMessage();
  const createBookingMutation = useCreateBooking();

  const messages = messagesData?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-cyan-400 text-lg">Loading...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-center py-20 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Item not found
          </h1>
          <Button onClick={() => navigate("/listings")}>Back to Listings</Button>
        </div>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    await sendMessageMutation.mutateAsync({
      bookingId: id!,
      content: messageInput,
    });
    setMessageInput("");
  };

  const handleCreateBooking = async () => {
    if (!startDate || !endDate) return;
    await createBookingMutation.mutateAsync({
      listingId: id!,
      borrowerId: "", // Current user ID from auth
      startDate,
      endDate,
      totalPrice: 0, // Calculate based on dates and rates
      status: "pending",
    });
    setShowBookingForm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-center max-w-6xl py-8 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="md:col-span-2">
            <div className="glass-card overflow-hidden mb-6">
              <div className="relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 w-full aspect-video flex items-center justify-center">
                {listing.images?.[0] ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-6xl">📦</div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setLiked(!liked)}
                    className="glass-card p-3 rounded-full hover:bg-white/10 transition-all"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        liked
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                  <button className="glass-card p-3 rounded-full hover:bg-white/10 transition-all">
                    <Share2 className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {listing.images && listing.images.length > 1 && (
                <div className="flex gap-2 p-4">
                  {listing.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="w-20 h-20 rounded-lg glass-card overflow-hidden cursor-pointer hover:border-cyan-400/50 transition-all"
                    >
                      <img
                        src={img}
                        alt={`${listing.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="glass-card p-6 mb-6">
              <h1 className="text-3xl font-bold text-white mb-4">
                {listing.title}
              </h1>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-cyan-400 mb-2">
                    LOCATION
                  </h3>
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="w-5 h-5" />
                    <span>{listing.location}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-cyan-400 mb-2">
                    CONDITION
                  </h3>
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="capitalize">{listing.condition}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-sm font-semibold text-cyan-400 mb-3">
                  DESCRIPTION
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {listing.description}
                </p>
              </div>
            </div>

            {/* Chat Section */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                💬 Chat with Lender (Anonymous)
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                All identities are kept anonymous until both parties confirm the
                booking. Your real name and contact info will only be shared once
                you agree to proceed.
              </p>

              <div className="space-y-4">
                {/* Messages */}
                {messages.length === 0 ? (
                  <div className="bg-white/5 rounded-lg p-8 text-center">
                    <Clock className="w-8 h-8 text-cyan-400/50 mx-auto mb-2" />
                    <p className="text-gray-400">
                      No messages yet. Be the first to reach out!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                    {messages.map((msg: any) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.senderId === "current-user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`glass-card px-4 py-2 rounded-lg max-w-xs ${
                            msg.senderId === "current-user"
                              ? "neon-border-cyan bg-cyan-400/10"
                              : "bg-white/5"
                          }`}
                        >
                          <p className="text-white break-words">{msg.content}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            User #{msg.senderAnonymousId}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Message Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Send anonymous message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    className="glass-card border-cyan-400/30"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={sendMessageMutation.isPending}
                    className="btn-glow-cyan"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-4">Rental Rates</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Daily</span>
                  <span className="text-cyan-300 font-bold">
                    ₹{listing.dailyRate}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Weekly</span>
                  <span className="text-cyan-300 font-bold">
                    ₹{listing.weeklyRate}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Monthly</span>
                  <span className="text-cyan-300 font-bold">
                    ₹{listing.monthlyRate}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowBookingForm(!showBookingForm)}
                className="w-full btn-glow-red"
              >
                Request to Rent
              </button>
            </div>

            {/* Booking Form */}
            {showBookingForm && (
              <div className="glass-card p-6 space-y-4 animate-in fade-in">
                <h3 className="font-semibold text-white">Select Dates</h3>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full glass-card px-3 py-2 border-cyan-400/30 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full glass-card px-3 py-2 border-cyan-400/30 text-white"
                  />
                </div>
                <Button
                  onClick={handleCreateBooking}
                  disabled={createBookingMutation.isPending}
                  className="w-full btn-glow-cyan"
                >
                  Confirm Request
                </Button>
              </div>
            )}

            {/* Lender Info */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-4">Lender Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                    L
                  </div>
                  <div>
                    <div className="font-semibold text-white">Lender #1234</div>
                    <div className="text-sm text-gray-400">
                      Member since 2023
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-white">4.8</span>
                  <span className="text-gray-400">(47 reviews)</span>
                </div>
              </div>
            </div>

            {/* Safety Info */}
            <div className="glass-card p-4 border-cyan-400/30">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    How it works
                  </h4>
                  <p className="text-sm text-gray-400">
                    Chat anonymously first. Once you request the item, both parties
                    can decide to share contact details. Meeting location and
                    condition check happen in person.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
