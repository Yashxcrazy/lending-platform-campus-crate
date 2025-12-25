import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Shield, Flag, Bug } from "lucide-react";
import { useState } from "react";

export default function ReportIssue() {
  const [formData, setFormData] = useState({
    type: "",
    subject: "",
    description: "",
    reportedUser: "",
    reportedItem: "",
    urgency: "medium",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Construct mailto with report details
    const mailtoLink = `mailto:yashzank@gmail.com?subject=Issue Report: ${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Issue Type: ${formData.type}\nUrgency: ${formData.urgency}\n${formData.reportedUser ? `Reported User: ${formData.reportedUser}\n` : ''}${formData.reportedItem ? `Reported Item: ${formData.reportedItem}\n` : ''}\n\nDescription:\n${formData.description}`
    )}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-center max-w-4xl py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="marvel-title mb-4">Report an Issue</h1>
          <p className="marvel-subtitle max-w-2xl mx-auto">
            Help us maintain a safe and trustworthy community. All reports are reviewed promptly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 border border-red-400/30 text-center">
            <Flag className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h3 className="font-bold text-white mb-2">User Behavior</h3>
            <p className="text-gray-400 text-sm">Report harassment, fraud, or policy violations</p>
          </div>
          <div className="glass-card p-6 border border-orange-400/30 text-center">
            <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <h3 className="font-bold text-white mb-2">Safety Concerns</h3>
            <p className="text-gray-400 text-sm">Report safety issues or suspicious activity</p>
          </div>
          <div className="glass-card p-6 border border-blue-400/30 text-center">
            <Bug className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="font-bold text-white mb-2">Technical Issues</h3>
            <p className="text-gray-400 text-sm">Report bugs or platform problems</p>
          </div>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Issue Type *
              </label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="glass-card border-cyan-400/30 bg-white/5">
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user-harassment">Harassment or Abusive Behavior</SelectItem>
                  <SelectItem value="user-fraud">Fraud or Scam</SelectItem>
                  <SelectItem value="user-policy">Policy Violation</SelectItem>
                  <SelectItem value="item-prohibited">Prohibited Item Listed</SelectItem>
                  <SelectItem value="item-fake">Fake or Misleading Listing</SelectItem>
                  <SelectItem value="safety-threat">Safety Threat</SelectItem>
                  <SelectItem value="payment-issue">Payment Issue</SelectItem>
                  <SelectItem value="technical-bug">Technical Bug</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Urgency Level
                </label>
                <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
                  <SelectTrigger className="glass-card border-cyan-400/30 bg-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - General inquiry</SelectItem>
                    <SelectItem value="medium">Medium - Needs attention</SelectItem>
                    <SelectItem value="high">High - Urgent issue</SelectItem>
                    <SelectItem value="critical">Critical - Safety concern</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reported User (if applicable)
                </label>
                <Input
                  type="text"
                  value={formData.reportedUser}
                  onChange={(e) => setFormData({ ...formData, reportedUser: e.target.value })}
                  placeholder="Username or email"
                  className="glass-card border-cyan-400/30 bg-white/5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reported Item (if applicable)
              </label>
              <Input
                type="text"
                value={formData.reportedItem}
                onChange={(e) => setFormData({ ...formData, reportedItem: e.target.value })}
                placeholder="Item title or ID"
                className="glass-card border-cyan-400/30 bg-white/5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject *
              </label>
              <Input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief summary of the issue"
                required
                className="glass-card border-cyan-400/30 bg-white/5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Detailed Description *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Please provide as much detail as possible. Include dates, times, screenshots, and any other relevant information."
                required
                rows={8}
                className="glass-card border-cyan-400/30 bg-white/5"
              />
            </div>

            <div className="glass-card p-4 border border-yellow-400/30 bg-yellow-400/5">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300">
                  <p className="font-semibold text-white mb-1">Your Privacy</p>
                  <p>
                    All reports are confidential. The reported party will not be notified of who filed the report. 
                    We take all reports seriously and investigate thoroughly.
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full btn-glow-red" disabled={!formData.type || !formData.subject || !formData.description}>
              <Flag className="w-4 h-4 mr-2" />
              Submit Report
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            For urgent safety concerns, please also contact campus security immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
