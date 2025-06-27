import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import {
  UserIcon,
  BellIcon,
  ShieldIcon,
  PaletteIcon,
  SaveIcon,
  RefreshCcwIcon,
  EyeIcon,
  AccessibilityIcon,
  LockIcon
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { pageFade, cardMotion, buttonMotion } from "@/lib/motion";

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    applicationUpdates: true,
    systemNotifications: false,
    twoFA: false,
  });
  const { isDark, setIsDark } = useTheme();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSwitch = (key: keyof typeof settings) => (value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleFontSize = (size: string) => {
    setSettings((prev) => ({ ...prev, fontSize: size }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully!");
    }, 900);
  };

  const handleReset = () => {
    setSettings({
      emailNotifications: true,
      applicationUpdates: true,
      systemNotifications: false,
      twoFA: false,
    });
    setPassword("");
    setPasswordConfirm("");
    toast("Settings reset to defaults");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Password changed successfully!");
    setPassword("");
    setPasswordConfirm("");
  };

  return (
    <motion.div className="space-y-8 bg-gray-50 dark:bg-zinc-900 min-h-screen pb-12" {...pageFade}>
      {/* Header */}
      <motion.div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-6 flex items-center justify-between" {...cardMotion}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your account preferences and settings</p>
        </div>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
          onClick={() => user && navigate(`/${user.role}-dashboard/profile`)}
        >
          <UserIcon className="h-5 w-5" />
          Profile
        </Button>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Notification Settings */}
        <motion.div {...cardMotion}>
          <Card className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <BellIcon className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription className="dark:text-gray-400">Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 dark:text-gray-100">Email Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates via email</p>
                </div>
                <Switch checked={settings.emailNotifications} onCheckedChange={handleSwitch("emailNotifications")} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 dark:text-gray-100">Application Updates</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about application status</p>
                </div>
                <Switch checked={settings.applicationUpdates} onCheckedChange={handleSwitch("applicationUpdates")} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 dark:text-gray-100">System Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive system announcements</p>
                </div>
                <Switch checked={settings.systemNotifications} onCheckedChange={handleSwitch("systemNotifications")} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Appearance Settings (merged with Accessibility) */}
        <motion.div {...cardMotion}>
          <Card className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <PaletteIcon className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription className="dark:text-gray-400">Customize your interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 dark:text-gray-100">Dark Mode</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Switch to dark theme</p>
                </div>
                <Switch checked={isDark} onCheckedChange={setIsDark} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Account Security */}
        <motion.div {...cardMotion}>
          <Card className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <ShieldIcon className="h-5 w-5" />
                Account Security
              </CardTitle>
              <CardDescription className="dark:text-gray-400">Change your password and enable 2FA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="password" className="text-gray-900 dark:text-gray-100">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="mt-1 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <Label htmlFor="passwordConfirm" className="text-gray-900 dark:text-gray-100">Confirm Password</Label>
                  <Input
                    id="passwordConfirm"
                    type="password"
                    value={passwordConfirm}
                    onChange={e => setPasswordConfirm(e.target.value)}
                    className="mt-1 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"
                    autoComplete="new-password"
                  />
                </div>
                <Button type="submit" className="w-full mt-2" disabled={!password || !passwordConfirm}>
                  <LockIcon className="h-4 w-4 mr-1" /> Change Password
                </Button>
              </form>
              <div className="flex items-center justify-between mt-4">
                <Label className="text-gray-900 dark:text-gray-100">Two-Factor Authentication</Label>
                <Switch checked={settings.twoFA} onCheckedChange={handleSwitch("twoFA")} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      {/* Save/Reset Buttons */}
      <div className="flex gap-4 justify-end mt-8">
        <motion.div {...buttonMotion}>
          <Button variant="outline" onClick={handleReset} disabled={saving} className="flex items-center gap-2">
            <RefreshCcwIcon className="h-4 w-4" /> Reset to Defaults
          </Button>
        </motion.div>
        <motion.div {...buttonMotion}>
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            <SaveIcon className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Settings; 