import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { usePreferences, useUpdatePreferences, useChangePassword, useDeleteAccount } from "@/hooks/useAPI";
import { clearAuthToken } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Lock, Bell, Shield, Save, Trash2 } from "lucide-react";

export default function AccountSettings() {
  const navigate = useNavigate();
  const { data: prefData } = usePreferences();
  const updatePreferences = useUpdatePreferences();
  const changePassword = useChangePassword();
  const deleteAccount = useDeleteAccount();

  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [notifications, setNotifications] = useState({ email: true, sms: false });
  const [privacy, setPrivacy] = useState({ showEmail: true, showPhone: false });
  const [deletePassword, setDeletePassword] = useState("");

  // Initialize toggles from server preferences when available
  useEffect(() => {
    if (prefData) {
      setNotifications({
        email: !!prefData.notificationPreferences?.email,
        sms: !!prefData.notificationPreferences?.sms,
      });
      setPrivacy({
        showEmail: !!prefData.privacyPreferences?.showEmail,
        showPhone: !!prefData.privacyPreferences?.showPhone,
      });
    }
  }, [prefData]);

  const handlePasswordChange = async () => {
    if (!passwords.next || passwords.next !== passwords.confirm) {
      alert("New passwords do not match");
      return;
    }
    await changePassword.mutateAsync({ currentPassword: passwords.current, newPassword: passwords.next });
    alert("Password updated successfully");
    setPasswords({ current: "", next: "", confirm: "" });
  };

  const handleSavePreferences = async () => {
    await updatePreferences.mutateAsync({
      notificationPreferences: notifications,
      privacyPreferences: privacy,
    });
    alert("Settings saved");
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      alert("Please enter your password to confirm deletion.");
      return;
    }
    if (!confirm("This will permanently delete your account and data. Continue?")) return;
    try {
      const result: any = await deleteAccount.mutateAsync(deletePassword);
      if (result?.success === false) {
        alert(result.error || "Failed to delete account");
        return;
      }
      clearAuthToken();
      localStorage.removeItem("user");
      alert("Account deleted");
      navigate("/", { replace: true });
      window.location.href = "/";
    } catch (err: any) {
      alert(err?.message || "Failed to delete account");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-center max-w-3xl py-10 px-4 space-y-8">
        <div className="glass-card p-6">
          <h1 className="text-2xl font-bold text-white mb-4">Account Settings</h1>

          <div className="space-y-8">
            {/* Change Password */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">Change Password</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  type="password"
                  placeholder="Current password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className="glass-card"
                />
                <Input
                  type="password"
                  placeholder="New password"
                  value={passwords.next}
                  onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                  className="glass-card"
                />
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="glass-card"
                />
              </div>
              <div className="mt-4">
                <Button onClick={handlePasswordChange} className="btn-glow-cyan">
                  Update Password
                </Button>
              </div>
            </section>

            {/* Notifications */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">Notifications</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white">Email notifications</span>
                  <Switch checked={notifications.email} onCheckedChange={(v) => setNotifications({ ...notifications, email: v })} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">SMS notifications</span>
                  <Switch checked={notifications.sms} onCheckedChange={(v) => setNotifications({ ...notifications, sms: v })} />
                </div>
              </div>
            </section>

            {/* Privacy */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">Privacy</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white">Show email on profile</span>
                  <Switch checked={privacy.showEmail} onCheckedChange={(v) => setPrivacy({ ...privacy, showEmail: v })} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Show phone on profile</span>
                  <Switch checked={privacy.showPhone} onCheckedChange={(v) => setPrivacy({ ...privacy, showPhone: v })} />
                </div>
              </div>
            </section>

            <div className="pt-2 flex gap-3">
              <Button onClick={handleSavePreferences} className="btn-glow-cyan flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Settings
              </Button>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-red-500/30">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-semibold text-white">Delete Account</h2>
          </div>
          <p className="text-sm text-gray-400 mb-4">This permanently deletes your account and related data.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              type="password"
              placeholder="Enter password to confirm"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="glass-card border-red-400/40"
            />
            <Button
              onClick={handleDeleteAccount}
              className="btn-glow-red flex items-center gap-2"
              disabled={deleteAccount.isPending}
            >
              <Trash2 className="w-4 h-4" />
              {deleteAccount.isPending ? "Deleting..." : "Delete Account"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
