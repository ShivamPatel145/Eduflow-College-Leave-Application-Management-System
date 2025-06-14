import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import EduFlowLogo from "@/components/EduFlowLogo";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        toast.success(`Welcome back! Logged in as ${role}`);
        navigate(`/${role}-dashboard`);
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (selectedRole: UserRole) => {
    const demoEmails = {
      student: "john.doe@college.edu",
      faculty: "sarah.wilson@college.edu",
      hod: "robert.johnson@college.edu",
      principal: "james.miller@college.edu",
    };
    
    setIsLoading(true);
    try {
      const success = await login(demoEmails[selectedRole], "password", selectedRole);
      if (success) {
        toast.success(`Welcome! Logged in as demo ${selectedRole}`);
        navigate(`/${selectedRole}-dashboard`);
      } else {
        toast.error("Demo login failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Demo login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4 md:p-8 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute inset-0 z-0 opacity-20"
      >
        <svg width="100%" height="100%" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.circle 
            animate={{ 
              cx: ["-100", "-50", "-100"],
              cy: ["200", "250", "200"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            r="300" 
            fill="var(--primary)" 
            fillOpacity="0.1" 
          />
          <motion.circle 
            animate={{ 
              cx: ["1500", "1550", "1500"],
              cy: ["600", "550", "600"],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            r="400" 
            fill="var(--primary)" 
            fillOpacity="0.05" 
          />
          <motion.rect 
            animate={{ 
              x: ["200", "250", "200"],
              y: ["-50", "-30", "-50"],
              rotate: [15, 20, 15]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            width="600" 
            height="300" 
            rx="50" 
            fill="var(--secondary)" 
            fillOpacity="0.03" 
          />
        </svg>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <EduFlowLogo />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl font-bold tracking-tight text-foreground"
          >
            Welcome Back
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-muted-foreground mt-2 text-base"
          >
            Sign in to your EduFlow account
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-4"
          >
            <Link to="/" className="text-sm text-primary hover:underline flex items-center justify-center group">
              <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" /> Back to Home
            </Link>
          </motion.div>
        </div>
        
        <Card className="border shadow-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardHeader>
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>Access your personalized dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
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
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-1.5 rounded-none hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              
              <Button type="submit" className="w-full group" disabled={isLoading}>
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Signing in...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signin"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      Sign in
                      <ArrowLeft className="ml-2 h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <Button 
            variant="link" 
            onClick={() => navigate('/register')}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Don't have an account? Register
          </Button>
          
          <div className="mt-6 pt-4 border-t border-dashed">
            <p className="text-sm font-medium mb-4 text-muted-foreground">Quick access for demo</p>
            <div className="grid grid-cols-2 gap-3">
              {["student", "faculty", "hod", "principal"].map((role) => (
                <Button 
                  key={role}
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDemoLogin(role as UserRole)}
                  disabled={isLoading}
                  className="border-primary/20 hover:bg-primary/5 transition-colors"
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)} Demo
                </Button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
