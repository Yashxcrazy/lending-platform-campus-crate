import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot } from "lucide-react";

interface Message {
  text: string;
  isUser: boolean;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { api } = useAPI();

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const userMessage = { text: input, isUser: true };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const res = await api.post('/ai/chat', { message: input });
        const aiMessage = { text: res.data.reply, isUser: false };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        const errorMessage = { text: "Sorry, I'm having trouble connecting. Please try again.", isUser: false };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <div className="flex-1 flex flex-col container-center max-w-3xl py-8">
        <div className="flex-1 overflow-y-auto mb-4 p-4 glass-card">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <Bot className="w-16 h-16 mb-4" />
              <h2 className="text-2xl font-semibold text-white">Euphorium</h2>
              <p>Ask me anything about buying, selling, or renting items!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${msg.isUser ? "justify-end" : ""}`}
                >
                  {!msg.isUser && (
                    <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg max-w-md ${
                      msg.isUser
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          )}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="px-4 py-2 rounded-lg max-w-md bg-gray-700 text-gray-200">
                Thinking...
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Euphorium..."
            className="flex-1 py-6 glass-card border-cyan-400/30 bg-white/5 text-white placeholder:text-gray-400"
          />
          <Button onClick={handleSend} className="btn-glow-cyan p-4">
            <Send className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
