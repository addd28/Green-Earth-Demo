import { useState } from "react";
import { ArrowRight, BadgeCheck, Building2, Cpu, Handshake, Leaf, LogOut, Mail, Phone, Send, Sparkles, Users } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

const SESSION_KEY = "greenEarthPartnerSession";

const PartnerPortal = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const session = localStorage.getItem(SESSION_KEY);
  const parsed = session ? JSON.parse(session) : null;

  if (!parsed) {
    return <Navigate to="/partner-login" replace />;
  }

  const partnerName = parsed?.partnerName || "Partner";
  const partnerEmail = parsed?.email || "partner@company.com";

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    navigate("/partner-login");
  };

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[420px] h-[420px] bg-gp-green/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[360px] h-[360px] bg-accent/20 rounded-full blur-[100px]" />

      <main className="relative container mx-auto px-6 pt-24 pb-14 space-y-6">
        <section className="bg-card border border-border p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-gp-green/20 bg-gp-green/5 text-gp-green text-[11px] font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-4 h-4" />
                Green Earth Partner Portal
              </div>
              <p className="text-sm text-muted-foreground font-semibold">Welcome back,</p>
              <h1 className="text-2xl md:text-5xl font-heading text-foreground mt-2 uppercase tracking-tight leading-[1.05]">{partnerName}</h1>
              <p className="text-muted-foreground mt-3 font-semibold max-w-3xl">
                Accelerate measurable sustainability outcomes with an Eco-tech collaboration platform that unifies impact data, program operations,
                and partner governance in one workspace.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-gp-green border border-gp-green/30 hover:bg-gp-green/10 transition uppercase"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <a
              href="#onboarding-roadmap"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gp-green text-primary-foreground font-bold text-xs uppercase tracking-wider"
            >
              Start onboarding <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#contact-form"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-border text-foreground font-bold text-xs uppercase tracking-wider hover:border-gp-green hover:text-gp-green transition"
            >
              Request technical support
            </a>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "CO2e reduced", value: "1,245 t", icon: Leaf, bg: "bg-gp-green/10", text: "text-gp-green" },
            { label: "Energy saved", value: "3.8 GWh", icon: Cpu, bg: "bg-amber-50", text: "text-amber-700" },
            { label: "Waste diverted", value: "512 t", icon: Building2, bg: "bg-blue-50", text: "text-blue-700" },
            { label: "Communities impacted", value: "26", icon: Users, bg: "bg-purple-50", text: "text-purple-700" },
          ].map((item) => (
            <article key={item.label} className="bg-card border border-border p-5 hover:border-gp-green/40 transition">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-semibold">{item.label}</p>
                <div className={`w-9 h-9 flex items-center justify-center ${item.bg} ${item.text}`}>
                  <item.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-foreground mt-2">{item.value}</p>
              <p className="text-xs text-muted-foreground mt-2 font-semibold">Real-time signals from partner reports and verified project logs.</p>
            </article>
          ))}
        </section>

        <section className="bg-card border border-border p-6 md:p-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-foreground text-lg uppercase tracking-tight">Sponsor Journey Timeline</h3>
            <span className="text-xs font-bold uppercase tracking-wider text-gp-green">Current stage: Active</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { stage: "Pending Request", detail: "Application received by admin team.", status: "done" },
              { stage: "Approved", detail: "Partner credentials issued via email.", status: "done" },
              { stage: "Onboarding", detail: "Kickoff, compliance, and reporting setup.", status: "done" },
              { stage: "Active Program", detail: "Live execution and sponsor reporting.", status: "active" },
            ].map((item) => (
              <article
                key={item.stage}
                className={`border p-4 ${
                  item.status === "active"
                    ? "border-gp-green bg-gp-green/5"
                    : "border-border bg-background"
                }`}
              >
                <p className={`text-xs font-bold uppercase tracking-wider ${item.status === "active" ? "text-gp-green" : "text-muted-foreground"}`}>
                  {item.status === "active" ? "Current" : "Completed"}
                </p>
                <p className="font-bold text-foreground mt-2">{item.stage}</p>
                <p className="text-sm text-muted-foreground mt-2 font-semibold leading-relaxed">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-card border border-border p-6 md:p-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-foreground text-lg uppercase tracking-tight">Partner Types</h3>
            <span className="text-xs font-bold uppercase tracking-wider text-gp-green">Built for multi-sector collaboration</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Doanh nghiep",
                icon: Building2,
                detail: "For ESG-driven brands deploying low-carbon campaigns, circular packaging, and community climate initiatives at scale.",
              },
              {
                title: "To chuc",
                icon: Handshake,
                detail: "For NGOs, social enterprises, and education networks managing transparent impact programs across provinces and beneficiaries.",
              },
              {
                title: "Cong nghe",
                icon: Cpu,
                detail: "For climate-tech and data-tech teams integrating sensors, analytics, and AI insights to optimize environmental operations.",
              },
            ].map((type) => (
              <article key={type.title} className="border border-border bg-background p-5 hover:border-gp-green/40 transition">
                <div className="w-10 h-10 bg-gp-green/10 text-gp-green flex items-center justify-center mb-4">
                  <type.icon className="w-5 h-5" />
                </div>
                <h4 className="font-heading text-foreground text-base uppercase">{type.title}</h4>
                <p className="text-sm text-muted-foreground mt-2 font-semibold leading-relaxed">{type.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-card border border-border p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-foreground text-lg uppercase tracking-tight">Exclusive Benefits</h3>
              <span className="text-xs font-bold uppercase tracking-wider text-gp-green">Value and recognition</span>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "Impact Intelligence Dashboard",
                  detail: "Access KPI benchmarks, emissions trends, and monthly verification insights tailored to your projects.",
                },
                {
                  title: "Green Earth Trusted Partner Certification",
                  detail: "Receive annual co-branded certification based on verified contribution, transparency, and delivery standards.",
                },
                {
                  title: "Priority Co-marketing and Grant Matching",
                  detail: "Get prioritized participation in campaigns, partner showcases, and selected funding-matching opportunities.",
                },
              ].map((item) => (
                <article key={item.title} className="border border-border bg-background p-4 hover:border-gp-green/40 transition">
                  <div className="flex items-start gap-3">
                    <BadgeCheck className="w-5 h-5 text-gp-green mt-0.5" />
                    <div>
                      <p className="font-bold text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground mt-1 font-semibold leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="bg-gp-green text-primary-foreground p-6 flex flex-col">
            <h3 className="text-lg font-heading mb-2 uppercase">Certification Status</h3>
            <p className="text-primary-foreground/90 text-sm leading-relaxed font-semibold">2026 qualification review is active for your workspace.</p>
            <div className="mt-5 space-y-3">
              <div className="border border-primary-foreground/30 p-3">
                <p className="text-xs uppercase tracking-wider font-bold text-primary-foreground/80">Partner tier</p>
                <p className="text-lg font-heading uppercase">Gold Eco-tech</p>
              </div>
              <div className="border border-primary-foreground/30 p-3">
                <p className="text-xs uppercase tracking-wider font-bold text-primary-foreground/80">Compliance score</p>
                <p className="text-lg font-heading uppercase">92 / 100</p>
              </div>
            </div>
          </aside>
        </section>

        <section id="onboarding-roadmap" className="bg-card border border-border p-6 md:p-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-foreground text-lg uppercase tracking-tight">Onboarding Roadmap</h3>
            <span className="text-xs font-bold uppercase tracking-wider text-gp-green">4-step participation process</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "Step 1",
                title: "Submit profile",
                detail: "Complete organization profile, ESG objectives, and initial sustainability scope.",
              },
              {
                step: "Step 2",
                title: "Technical assessment",
                detail: "Green Earth specialists validate data readiness, compliance level, and project feasibility.",
              },
              {
                step: "Step 3",
                title: "Program alignment",
                detail: "Define measurable KPIs, timeline, ownership matrix, and reporting cadence.",
              },
              {
                step: "Step 4",
                title: "Launch and monitor",
                detail: "Activate campaigns and track real-world impact through monthly eco-performance reports.",
              },
            ].map((item) => (
              <article key={item.step} className="border border-border bg-background p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gp-green">{item.step}</p>
                <p className="font-bold text-foreground mt-1">{item.title}</p>
                <p className="text-sm text-muted-foreground mt-2 font-semibold leading-relaxed">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact-form" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <aside className="bg-card border border-border p-6">
            <h3 className="font-heading text-foreground text-lg uppercase tracking-tight">Contact Hub</h3>
            <p className="text-sm text-muted-foreground mt-2 font-semibold leading-relaxed">
              Connect with our partner success team for onboarding, certification, integration, and impact reporting support.
            </p>
            <div className="mt-5 space-y-3 text-sm font-semibold text-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gp-green" />
                partner.success@greenearth.org
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gp-green" />
                +84 28 7300 2026
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gp-green" />
                Workspace contact: {partnerEmail}
              </div>
            </div>
          </aside>

          <div className="lg:col-span-2 bg-card border border-border p-6">
            <h3 className="font-heading text-foreground text-lg mb-5 uppercase tracking-tight">Partner Contact Form</h3>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  placeholder="Organization name"
                  className="w-full border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground placeholder:text-muted-foreground outline-none focus:border-gp-green"
                />
                <input
                  required
                  type="text"
                  placeholder="Contact person"
                  className="w-full border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground placeholder:text-muted-foreground outline-none focus:border-gp-green"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  required
                  type="email"
                  placeholder="Business email"
                  className="w-full border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground placeholder:text-muted-foreground outline-none focus:border-gp-green"
                />
                <input
                  type="text"
                  placeholder="Requested support area (e.g. certification, data API)"
                  className="w-full border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground placeholder:text-muted-foreground outline-none focus:border-gp-green"
                />
              </div>
              <textarea
                required
                rows={5}
                placeholder="Describe your project goals, expected impact, and technical needs..."
                className="w-full border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground placeholder:text-muted-foreground outline-none focus:border-gp-green"
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gp-green text-primary-foreground font-bold text-xs uppercase tracking-wider"
                >
                  Send request <Send className="w-4 h-4" />
                </button>
                {submitted ? (
                  <p className="text-sm font-semibold text-gp-green">
                    Your request has been recorded. Our partner team will contact you within 24 hours.
                  </p>
                ) : null}
              </div>
            </form>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <article className="bg-card border border-border p-6">
            <h3 className="font-heading text-foreground text-lg uppercase tracking-tight">Sponsor Profile</h3>
            <p className="text-sm text-muted-foreground mt-2 font-semibold">Program owner: {partnerName}</p>
            <p className="text-sm text-muted-foreground font-semibold">Primary account: {partnerEmail}</p>
            <p className="text-sm text-muted-foreground mt-3 font-semibold leading-relaxed">
              This workspace is configured for funding oversight, ESG reporting, and milestone-based sponsor communications.
            </p>
          </article>
          <article className="bg-card border border-border p-6">
            <h3 className="font-heading text-foreground text-lg uppercase tracking-tight">Funding Utilization Snapshot</h3>
            <div className="space-y-3 mt-3 text-sm font-semibold">
              <p className="flex items-center justify-between text-muted-foreground"><span>Allocated budget</span><span className="text-foreground">$250,000</span></p>
              <p className="flex items-center justify-between text-muted-foreground"><span>Utilized to date</span><span className="text-foreground">$142,400</span></p>
              <p className="flex items-center justify-between text-muted-foreground"><span>Verified impact spend</span><span className="text-foreground">89%</span></p>
            </div>
          </article>
          <article className="bg-card border border-border p-6">
            <h3 className="font-heading text-foreground text-lg uppercase tracking-tight">Sponsor Actions</h3>
            <div className="mt-3 space-y-2 text-sm font-semibold text-muted-foreground">
              <p>- Review monthly impact report</p>
              <p>- Approve Q3 disbursement window</p>
              <p>- Confirm next campaign co-branding</p>
            </div>
          </article>
        </section>

        <section className="bg-card border border-border p-6">
          <h3 className="font-heading text-foreground text-lg mb-4 uppercase tracking-tight">Active Environmental Objectives</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="py-3 pr-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Objective</th>
                  <th className="py-3 pr-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Timeline</th>
                  <th className="py-3 pr-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Current progress</th>
                  <th className="py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Reduce logistics emissions", period: "Q2 2026", progress: "71%", status: "on-track" },
                  { name: "Scale circular packaging program", period: "Q3 2026", progress: "54%", status: "in-review" },
                  { name: "Deploy water-efficiency sensors", period: "Q4 2026", progress: "33%", status: "pilot" },
                ].map((item) => (
                  <tr key={item.name} className="border-b border-border/70">
                    <td className="py-3 pr-4 text-sm font-semibold text-foreground">{item.name}</td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground font-semibold">{item.period}</td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground font-semibold">{item.progress}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                          item.status === "on-track"
                            ? "bg-gp-green/10 text-gp-green"
                            : item.status === "in-review"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-card border border-border p-6 md:p-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-foreground text-lg uppercase tracking-tight">Sponsor Document Checklist</h3>
            <span className="text-xs font-bold uppercase tracking-wider text-gp-green">Submission readiness</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Partnership Agreement Draft", status: "Submitted", tone: "bg-gp-green/10 text-gp-green" },
              { name: "Funding Disbursement Plan", status: "Pending", tone: "bg-amber-50 text-amber-700" },
              { name: "Branding & Communication Assets", status: "Submitted", tone: "bg-gp-green/10 text-gp-green" },
              { name: "Compliance & Risk Checklist", status: "In Review", tone: "bg-blue-50 text-blue-700" },
              { name: "Impact KPI Baseline Sheet", status: "Pending", tone: "bg-amber-50 text-amber-700" },
              { name: "Point-of-Contact Matrix", status: "Submitted", tone: "bg-gp-green/10 text-gp-green" },
            ].map((doc) => (
              <article key={doc.name} className="border border-border bg-background px-4 py-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">{doc.name}</p>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${doc.tone}`}>{doc.status}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-card border border-border p-6 md:p-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-foreground text-lg uppercase tracking-tight">Recent Activity Log</h3>
            <span className="text-xs font-bold uppercase tracking-wider text-gp-green">Last 7 days</span>
          </div>
          <div className="space-y-3">
            {[
              {
                date: "Apr 08, 2026",
                title: "Compliance checklist moved to In Review",
                detail: "Admin team started verification on policy and risk-control documents.",
              },
              {
                date: "Apr 07, 2026",
                title: "Monthly impact report uploaded",
                detail: "CO2e and waste diversion report has been submitted by implementation team.",
              },
              {
                date: "Apr 05, 2026",
                title: "Branding assets approved",
                detail: "Co-branded media kit approved for campaign launch across digital channels.",
              },
              {
                date: "Apr 03, 2026",
                title: "Onboarding workshop completed",
                detail: "Sponsor and Green Earth core teams aligned KPI ownership and reporting cadence.",
              },
            ].map((item) => (
              <article key={item.title} className="border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-wider font-bold text-gp-green">{item.date}</p>
                <p className="font-bold text-foreground mt-1">{item.title}</p>
                <p className="text-sm text-muted-foreground font-semibold mt-1 leading-relaxed">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PartnerPortal;
