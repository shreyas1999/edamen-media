import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { api, auth } from "@/lib/api";
import { toast } from "sonner";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    if (auth.isAuthed()) nav("/admin");
  }, [nav]);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await api.post("/auth/login", { email, password });
      auth.saveToken(r.data.token);
      toast.success("Welcome back.");
      nav("/admin");
    } catch (err) {
      toast.error("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div data-testid="admin-login-page" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 hero-grad opacity-60 pointer-events-none" />
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="relative w-full max-w-md mx-auto px-6">
        <Link to="/" className="block mb-10 text-center">
          <span className="display text-[#F5F5F5] tracking-tightest text-lg">
            EDAMEN <span className="text-[#A1A1AA]">MEDIA</span>
          </span>
        </Link>
        <div className="surface p-8 md:p-10">
          <div className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">Admin</div>
          <h1 className="display text-[#F5F5F5] text-3xl tracking-tightest mt-3">Sign in.</h1>

          <form onSubmit={onSubmit} className="mt-8 space-y-6" data-testid="admin-login-form">
            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.28em] text-[#A1A1AA]">Email</span>
              <input
                data-testid="admin-login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-3 w-full bg-transparent border-b border-white/10 focus:border-white/40 text-[#F5F5F5] text-base py-2 outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.28em] text-[#A1A1AA]">Password</span>
              <input
                data-testid="admin-login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-3 w-full bg-transparent border-b border-white/10 focus:border-white/40 text-[#F5F5F5] text-base py-2 outline-none"
              />
            </label>
            <button data-testid="admin-login-submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : <>Sign In <ArrowUpRight size={16} /></>}
            </button>
          </form>
        </div>
        <div className="mt-6 text-center">
          <Link to="/" className="text-[#A1A1AA] text-sm hover:text-white">← Back to site</Link>
        </div>
      </div>
    </div>
  );
}
