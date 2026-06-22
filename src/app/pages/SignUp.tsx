import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Brain, Mail, Lock, User, Building, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authApi } from "../lib/api";
import { saveAuth } from "../lib/auth-store";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    password: "",
    industry: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const update = (k: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.name.trim().length < 2) { setError("Enter your full name."); return; }
    if (!formData.email.includes("@")) { setError("Enter a valid email."); return; }
    if (formData.companyName.trim().length < 2) { setError("Enter your company name."); return; }
    if (formData.password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setIsLoading(true);
    try {
      const data = await authApi.register({
        name: formData.name,
        email: formData.email,
        companyName: formData.companyName,
        password: formData.password,
        industry: formData.industry || undefined,
      });
      saveAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
        company: { ...data.company, locale: "en" },
        expiresAt: data.expiresAt,
      });
      toast.success("Account created!", { description: `Welcome, ${data.user.name}. Let's set up your AI team.` });
      navigate("/onboarding");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setError(msg);
      toast.error("Registration failed", { description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const industries = [
    "E-commerce", "SaaS", "Marketing Agency", "Consulting",
    "Real Estate", "Healthcare", "Finance", "Education", "Other",
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Link to="/">
          <Button variant="ghost" className="mb-8 text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card className="bg-[#111117]/80 backdrop-blur-xl border-white/10 p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl shadow-blue-500/50">
              <Brain className="w-8 h-8" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-gray-400">Start your AI transformation journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={update("name")}
                  placeholder="Your full name"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={update("email")}
                  placeholder="your@company.com"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="company" className="text-white">Company Name</Label>
              <div className="relative mt-1">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="company"
                  type="text"
                  value={formData.companyName}
                  onChange={update("companyName")}
                  placeholder="Your company"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="industry" className="text-white">Industry</Label>
              <select
                id="industry"
                value={formData.industry}
                onChange={update("industry")}
                className="mt-1 w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm focus:border-blue-500/50 focus:outline-none"
              >
                <option value="">Select industry (optional)</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind} className="bg-[#111117]">{ind}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={update("password")}
                  placeholder="At least 8 characters"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <Button
              disabled={isLoading}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 h-12"
            >
              {isLoading ? "Creating workspace..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
