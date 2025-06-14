import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, GraduationCap, Mail, Lock, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [step, setStep] = useState<"email" | "otp" | "new-password">("email");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, this would send an OTP to the user's email
      // For demo purposes, we'll just move to the OTP step
      if (step === "otp") {
        // If resending OTP, clear the current OTP
        setOtp("");
        toast.success("New verification code has been sent to your email");
      } else {
        toast.success("Verification code sent to your email");
        setStep("otp");
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, this would verify the OTP
      // For demo purposes, we'll just move to the new password step
      if (otp.length !== 6) {
        toast.error("Please enter a valid 6-digit OTP");
        return;
      }
      setStep("new-password");
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      if (newPassword.length < 8) {
        toast.error("Password must be at least 8 characters long");
        return;
      }

      // In a real app, this would update the password
      // For demo purposes, we'll just show a success message
      toast.success("Password updated successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: "email", title: "Enter Email", icon: Mail },
    { id: "otp", title: "Verify Code", icon: KeyRound },
    { id: "new-password", title: "New Password", icon: Lock },
  ];

  const renderStep = () => {
    switch (step) {
      case "email":
        return (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={role} 
                onValueChange={(value) => setRole(value as UserRole)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="hod">HOD</SelectItem>
                  <SelectItem value="principal">Principal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="flex justify-between pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Button>
              <Button type="submit" className="w-1/2" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Code"}
              </Button>
            </div>
          </form>
        );

      case "otp":
        return (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Verification Code</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  containerClassName="gap-2"
                >
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={() => handleEmailSubmit(new Event('submit') as any)}
                  className="text-primary hover:underline"
                >
                  Resend code
                </button>
              </p>
            </div>

            <div className="flex justify-between pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep("email")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button type="submit" className="w-1/2" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </div>
          </form>
        );

      case "new-password":
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="flex justify-between pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep("otp")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button type="submit" className="w-1/2" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-md space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <GraduationCap className="h-6 w-6 text-primary" />
            </motion.div>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
            >
              EduFlow
            </motion.span>
          </div>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold tracking-tight"
          >
            Reset your password
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-muted-foreground mt-2"
          >
            {step === "email" && "Enter your email to receive a verification code"}
            {step === "otp" && "Enter the 6-digit code sent to your email"}
            {step === "new-password" && "Create a new password for your account"}
          </motion.p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2",
                    step === s.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/20 text-muted-foreground",
                    index < steps.findIndex((step) => step.id === s.id)
                      ? "border-primary bg-primary text-primary-foreground"
                      : ""
                  )}
                >
                  <s.icon className="h-4 w-4" />
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-12 h-0.5",
                      index < steps.findIndex((step) => step.id === s.id)
                        ? "bg-primary"
                        : "bg-muted-foreground/20"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">
              {step === "email" && "Forgot Password"}
              {step === "otp" && "Enter Verification Code"}
              {step === "new-password" && "Set New Password"}
            </CardTitle>
            <CardDescription>
              {step === "email" && "We'll send you a code to reset your password"}
              {step === "otp" && "Enter the code sent to your email"}
              {step === "new-password" && "Create a strong password for your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword; 