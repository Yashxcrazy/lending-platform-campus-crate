import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useListing, useCurrentUser } from "@/hooks/useAPI";
import { ArrowLeft, Send, MessageSquare } from "lucide-react";
import { BASE_URL, getAuthToken } from "@/lib/api";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  createdAt: string;
  isOwnMessage: boolean;
}

export default function ItemContact() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: listing } = useListing(id!);
  const { data: currentUser } = useCurrentUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (id) {
      fetchMessages();
      // Poll for new messages every 3 seconds
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [id]);

  const fetchMessages = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/items/${id}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    const text = messageText;
    setMessageText("");
    setLoading(true);

    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/items/${id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: text }),
      });

      if (response.ok) {
        await fetchMessages();
      } else {
        setMessageText(text);
        alert("Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessageText(text);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 container-center max-w-4xl px-4 py-8 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(`/listing/${id}`)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-cyan-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-cyan-400" />
              Message about: {listing?.title || "Item"}
            </h1>
            <p className="text-sm text-gray-400">
              Chat with the owner to ask questions before requesting
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="glass-card border border-cyan-400/30 bg-cyan-400/10 p-4 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-semibold text-cyan-300 mb-1">Pre-Rental Questions</p>
              <p>
                Ask the owner about availability, condition, usage instructions, or any other questions 
                before submitting a rental request. Both parties remain respectful and professional.
              </p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 glass-card border border-cyan-400/20 rounded-lg p-6 mb-6 overflow-y-auto space-y-4 min-h-96 max-h-[500px]">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-gray-400">
                No messages yet. Start the conversation!
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Ask about availability, condition, or usage details
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    msg.isOwnMessage
                      ? "bg-cyan-400/20 text-cyan-100"
                      : "bg-white/10 text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-300">
                      {msg.senderName || "User"}
                    </span>
                  </div>
                  <p>{msg.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-3">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask about availability, condition, or other details..."
            disabled={loading}
            className="flex-1 glass-card border-cyan-400/30 bg-white/5"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || loading}
            className="btn-glow-cyan px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <Button
            onClick={() => navigate(`/listing/${id}`)}
            variant="outline"
            className="flex-1"
          >
            Back to Item
          </Button>
          <Button
            onClick={() => navigate(`/listing/${id}`)}
            className="flex-1 btn-glow-cyan"
          >
            Send Rental Request
          </Button>
        </div>

        {/* Safety Tips */}
        <div className="mt-6 glass-card bg-yellow-400/10 border border-yellow-400/30 p-4 rounded-lg text-sm text-gray-300">
          <p className="font-semibold text-yellow-300 mb-2">💡 Communication Tips:</p>
          <ul className="space-y-1 text-xs">
            <li>• Be clear and specific with your questions</li>
            <li>• Ask about availability dates before requesting</li>
            <li>• Inquire about item condition and usage instructions</li>
            <li>• Keep conversations professional and respectful</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
