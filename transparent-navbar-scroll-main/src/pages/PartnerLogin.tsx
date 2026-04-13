import { ArrowRight, Leaf, Loader2, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiUrl } from "@/lib/apiBase";

const SESSION_KEY = "greenEarthPartnerSession";
const PARTNER_LOGIN_API = apiUrl("/api/green_earth/partner-applications/partner-auth/login");

const PartnerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [statusHint, setStatusHint] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromLink = params.get("email");
    if (emailFromLink) {
      setForm((prev) => ({ ...prev, email: emailFromLink }));
    }
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setStatusHint("");

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(PARTNER_LOGIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim(), password: form.password.trim() }),
      });
      const result = await response.json();

      if (!response.ok || !result?.data) {
        throw new Error(result?.message || result?.messenge || "Login failed");
      }

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          email: result.data.email,
          partnerName: result.data.name || result.data.email,
          loginAt: new Date().toISOString(),
          userId: result.data.userId,
          applicationId: result.data.applicationId,
        }),
      );

      navigate("/partner-portal");
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : "Unable to login";
      setError(message);
      const normalized = message.toLowerCase();
      if (normalized.includes("not approved")) {
        setStatusHint("Your request is still pending admin approval. Please wait for approval email, then sign in again.");
      } else if (normalized.includes("invalid email or password")) {
        setStatusHint("Check your email/password from approval email. If needed, request a new temporary password from admin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-28 md:pt-36 pb-20 px-6">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[420px] h-[420px] bg-gp-green/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[360px] h-[360px] bg-accent/20 rounded-full blur-[100px]" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-gp-green/30 text-gp-green text-xs font-bold uppercase tracking-wider mb-8">
            <Leaf className="w-3 h-3" />
            Partner Access
          </div>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-foreground mb-6 animate-slide-in leading-[1.05] uppercase">
            Partner Login
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-semibold">
            Sign in only after admin approval email. Your login credentials are sent after partnership request review.
          </p>
        </div>

        <div className="max-w-4xl mx-auto border border-border p-8 md:p-12 bg-card">
          <div className="mb-6 border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wider font-bold text-gp-green mb-2">Before you sign in</p>
            <p className="text-sm text-muted-foreground font-semibold">
              1) Submit partnership request on the partner page.
              <br />
              2) Wait for admin approval email.
              <br />
              3) Use the provided email and temporary password here.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-3 py-4 bg-background border border-border outline-none focus:ring-2 focus:ring-gp-green/20 focus:border-gp-green transition"
                  placeholder="partner@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-3 py-4 bg-background border border-border outline-none focus:ring-2 focus:ring-gp-green/20 focus:border-gp-green transition"
                  placeholder="Enter password"
                />
              </div>
            </div>

            {error ? <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 font-semibold">{error}</p> : null}
            {statusHint ? (
              <div className="border border-border bg-background px-4 py-3">
                <p className="text-xs uppercase tracking-wider font-bold text-gp-green mb-1">Application status</p>
                <p className="text-sm text-muted-foreground font-semibold">{statusHint}</p>
                <a href="/partners#partner-form" className="inline-flex items-center gap-2 mt-2 text-gp-green font-bold text-xs uppercase">
                  Back to partnership request <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gp-green text-primary-foreground font-bold hover:brightness-110 transition disabled:opacity-60 flex items-center justify-center gap-2 uppercase"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="flex justify-center pt-2">
              <a href="/partners#partner-form" className="inline-flex items-center gap-2 text-gp-green font-bold text-sm uppercase">
                Need account? Send request <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PartnerLogin;
