import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMessages, useSendMessage } from "@/hooks/useAPI";
import { ArrowLeft, Send } from "lucide-react";

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: messagesData, isLoading } = useMessages(id!);
  const sendMessage = useSendMessage();

  const messages = messagesData?.data || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    const text = messageText;
    setMessageText("");

    try {
      await sendMessage.mutateAsync({
        bookingId: id!,
        content: text,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessageText(text);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 container-center max-w-2xl px-4 py-8 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/my-rentals")}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-cyan-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Anonymous Chat</h1>
            <p className="text-sm text-gray-400">
              Both parties remain anonymous. Share details via secure messaging.
            </p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 glass-card border border-cyan-400/20 rounded-lg p-6 mb-6 overflow-y-auto space-y-4 min-h-96 max-h-96">
          {isLoading && (
            <div className="text-center py-8 text-gray-400">
              Loading messages...
            </div>
          )}

          {messages.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-gray-400">
                No messages yet. Start the conversation!
              </p>
            </div>
          )}

          {messages.map((msg: any, idx: number) => (
            <div
              key={msg.id || idx}
              className={`flex ${
                msg.isOwnMessage ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.isOwnMessage
                    ? "bg-cyan-400/20 text-cyan-100"
                    : "bg-white/10 text-gray-200"
                }`}
              >
                <p>{msg.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

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
            placeholder="Type your message... (Keep both parties safe)"
            className="flex-1 glass-card border-cyan-400/30 bg-white/5"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="btn-glow-cyan px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Safety Tips */}
        <div className="mt-6 glass-card bg-yellow-400/10 border border-yellow-400/30 p-4 rounded-lg text-sm text-gray-300">
          <p className="font-semibold text-yellow-300 mb-2">🔒 Safety Tips:</p>
          <ul className="space-y-1 text-xs">
            <li>• Both parties remain anonymous</li>
            <li>• Share contact only after agreeing terms</li>
            <li>• Avoid sharing personal information</li>
            <li>• Report inappropriate behavior</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
