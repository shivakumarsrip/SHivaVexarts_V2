import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LogIn, Shield, ArrowLeft, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/admin");
    },
    onError: (e) => setError(e.message),
  });

  const isPending = loginMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F59E0B] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F59E0B] rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="flex justify-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#71717A] hover:text-[#F59E0B] transition-colors font-body text-[14px] group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Return to Gallery
          </button>
        </div>

        <Card className="bg-[#18181B] border-[#27272A] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-2 border-t-[#F59E0B]/50 rounded-3xl overflow-hidden">
          <CardHeader className="text-center pt-10 pb-6">
            <div className="w-16 h-16 bg-[#F59E0B]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#F59E0B]/20">
              <Shield size={32} className="text-[#F59E0B]" />
            </div>
            <div className="space-y-1">
              <span className="text-[#F59E0B] font-body text-[11px] font-bold tracking-[0.3em] uppercase block mb-2">
                Restricted Access
              </span>
              <CardTitle className="font-display text-[32px] text-white">
                Admin Terminal
              </CardTitle>
              <CardDescription className="text-[#71717A] font-body text-[14px] max-w-[280px] mx-auto mt-2">
                Authorize your identity to access the Command Center
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-[#A1A1AA] text-[12px] font-bold uppercase tracking-wider ml-1">
                  Email Identity
                </Label>
                <div className="relative group">
                  <Input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@shivavexarts.com"
                    required
                    className="h-14 bg-[#09090B] border-[#27272A] text-white placeholder:text-[#3F3F46] focus:border-[#F59E0B]/50 focus:ring-[#F59E0B]/10 rounded-2xl pl-4 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-[#A1A1AA] text-[12px] font-bold uppercase tracking-wider ml-1">
                  Access Key
                </Label>
                <div className="relative group">
                  <Input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-14 bg-[#09090B] border-[#27272A] text-white placeholder:text-[#3F3F46] focus:border-[#F59E0B]/50 focus:ring-[#F59E0B]/10 rounded-2xl pl-4 transition-all"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#3F3F46] group-focus-within:text-[#F59E0B]/50 transition-colors">
                    <Lock size={18} />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-xl px-4 py-3 flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mt-1.5 shrink-0" />
                  <p className="text-[#DC2626] font-body text-[13px] leading-relaxed">
                    {error}
                  </p>
                </div>
              )}

              <Button
                id="login-submit"
                type="submit"
                disabled={isPending}
                className="w-full h-14 bg-[#F59E0B] hover:bg-[#D97706] text-[#09090B] font-body font-bold text-[16px] rounded-2xl mt-4 shadow-[0_10px_20px_rgba(245,158,11,0.2)] transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {isPending ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <LogIn size={20} strokeWidth={2.5} />
                    Authorize Access
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[#52525B] font-body text-[12px] uppercase tracking-widest leading-relaxed">
                Secured by Shiva Vexarts <br />
                Industrial Authentication Protocol v2.0
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
