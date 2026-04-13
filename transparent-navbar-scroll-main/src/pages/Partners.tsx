import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Handshake,
  Leaf,
  Mail,
  Rocket,
  Send,
  ShieldCheck,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { apiUrl } from "@/lib/apiBase";

type Partner = {
  id: number;
  name: string;
  category: string;
  desc: string;
  website: string;
};

const PARTNERS: Partner[] = [
  {
    id: 1,
    name: "EcoVanguard",
    category: "Agriculture",
    desc: "Revolutionizing soil health through carbon-negative farming techniques.",
    website: "https://example.com/ecovanguard",
  },
  {
    id: 2,
    name: "OceanClear",
    category: "Marine Life",
    desc: "Global leader in large-scale ocean plastic recovery and recycling.",
    website: "https://example.com/oceanclear",
  },
  {
    id: 3,
    name: "Solara Mesh",
    category: "Energy",
    desc: "Decentralized solar micro-grids for rural communities.",
    website: "https://example.com/solara-mesh",
  },
  {
    id: 4,
    name: "TerraTech",
    category: "Forestry",
    desc: "AI-driven reforestation monitoring and precision seed planting.",
    website: "https://example.com/terratech",
  },
];

const STATS = [
  { label: "Active Partners", value: "250+" },
  { label: "Trees Planted", value: "1.4M" },
  { label: "Carbon Offset", value: "85K Tons" },
];

const BENEFITS = [
  {
    title: "Brand Credibility",
    desc: "Co-brand with measurable environmental outcomes and trusted reporting.",
    icon: ShieldCheck,
  },
  {
    title: "Joint Campaign Reach",
    desc: "Access campaigns, media kits, and audience channels to scale impact quickly.",
    icon: TrendingUp,
  },
  {
    title: "Fast Execution",
    desc: "Launch pilot projects in weeks using our playbooks and dedicated partner team.",
    icon: Rocket,
  },
  {
    title: "Long-Term Collaboration",
    desc: "Build multi-year initiatives with milestone tracking and transparent governance.",
    icon: Handshake,
  },
];

const PROGRAMS = [
  {
    name: "Strategic Sponsor",
    details: "Best for enterprises funding flagship restoration projects.",
    bullets: ["High-visibility campaigns", "Quarterly impact reports", "Executive alignment workshops"],
  },
  {
    name: "Technology Partner",
    details: "For teams contributing platforms, data, or tooling.",
    bullets: ["API and data collaboration", "Pilot-ready test beds", "Technical co-innovation roadmap"],
  },
  {
    name: "Community Partner",
    details: "For NGOs, schools, and local groups driving grassroots change.",
    bullets: ["Volunteer activations", "Regional ambassador support", "Educational toolkits"],
  },
];

const PROCESS_STEPS = [
  {
    title: "Discovery",
    desc: "We align goals, target outcomes, and partnership scope.",
  },
  {
    title: "Design",
    desc: "Teams co-create an action plan, KPI framework, and timeline.",
  },
  {
    title: "Launch",
    desc: "Initiatives go live with campaign assets and communication support.",
  },
  {
    title: "Measure & Scale",
    desc: "Track impact and iterate into larger programs.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "In just one quarter, our joint campaign lifted engagement by 42% while funding meaningful reforestation.",
    author: "Linh Tran",
    role: "CSR Director, Solara Mesh",
  },
  {
    quote:
      "The onboarding process was clear, fast, and practical. We launched a pilot in under 30 days.",
    author: "Daniel Vu",
    role: "Partnership Lead, TerraTech",
  },
];

const FAQS = [
  {
    question: "What types of organizations can become partners?",
    answer: "We work with companies, NGOs, schools, communities, and technology teams aligned with sustainability.",
  },
  {
    question: "How long does onboarding usually take?",
    answer: "Typical onboarding takes 2-4 weeks depending on project complexity and legal review timelines.",
  },
  {
    question: "Do you provide impact reporting?",
    answer: "Yes. We provide milestone-based reporting with clear KPIs, outcomes, and recommendations.",
  },
  {
    question: "Can we start with a small pilot first?",
    answer: "Absolutely. Many partners begin with a pilot before scaling to multi-region initiatives.",
  },
];

const PARTNER_APPLICATION_API = apiUrl("/api/green_earth/partner-applications/public-request");

const PARTNER_RESOURCES = [
  {
    title: "Partner Onboarding Checklist",
    desc: "A practical checklist covering kickoff, legal, branding, and launch readiness.",
  },
  {
    title: "Impact Reporting Template",
    desc: "Standard KPI format to align outcomes across sponsor and implementation teams.",
  },
  {
    title: "Campaign Co-Branding Guide",
    desc: "Rules and examples for logo use, copy tone, and media asset consistency.",
  },
];

const Partners = () => {
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openedFaq, setOpenedFaq] = useState<number | null>(0);
  const [fitData, setFitData] = useState({
    orgSize: "Mid-size Team",
    priority: "Community impact",
    budget: "Starter",
  });
  const [formData, setFormData] = useState({
    organizationName: "",
    contactName: "",
    workEmail: "",
    country: "",
    companySize: "1-50",
    message: "",
    consent: false,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPartners(PARTNERS);
      setLoading(false);
    }, 700);
    return () => window.clearTimeout(timer);
  }, []);

  const categories = useMemo(() => ["All", ...new Set(partners.map((item) => item.category))], [partners]);

  const filteredPartners = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return partners.filter((item) => {
      const matchCategory = category === "All" || item.category === category;
      const matchQuery =
        normalizedQuery.length === 0 ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.desc.toLowerCase().includes(normalizedQuery);
      return matchCategory && matchQuery;
    });
  }, [partners, category, query]);

  const recommendedProgram = useMemo(() => {
    if (fitData.budget === "Enterprise" || fitData.priority === "Brand visibility") {
      return "Strategic Sponsor";
    }

    if (fitData.priority === "Technology pilot") {
      return "Technology Partner";
    }

    return "Community Partner";
  }, [fitData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (
      !formData.organizationName ||
      !formData.contactName ||
      !formData.workEmail ||
      !formData.country ||
      !formData.message
    ) {
      setError("Please complete all required fields before submitting.");
      return;
    }
    if (!formData.consent) {
      setError("Please confirm data consent to continue.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(PARTNER_APPLICATION_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationName: formData.organizationName,
          contactName: formData.contactName,
          email: formData.workEmail,
          country: formData.country,
          companySize: formData.companySize,
          programType: recommendedProgram,
          message: formData.message,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result?.data) {
        throw new Error(result?.message || result?.messenge || "Unable to submit request. Please try again.");
      }

      setSubmitted(true);
      setSuccessMessage("Request submitted successfully. We will email you after admin approval.");
      setFormData({
        organizationName: "",
        contactName: "",
        workEmail: "",
        country: "",
        companySize: "1-50",
        message: "",
        consent: false,
      });
      window.setTimeout(() => setSubmitted(false), 4500);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background">
      <section className="relative w-full h-[80vh] min-h-[500px] overflow-hidden bg-gp-dark">
        <div className="absolute inset-0 bg-gp-dark/45" />
        <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 w-[480px] h-[480px] bg-gp-green/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[420px] h-[420px] bg-accent/20 rounded-full blur-[120px]" />

        <div className="relative z-10 container mx-auto h-full flex flex-col justify-center px-4 lg:px-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-gp-green-light/30 text-gp-green-light text-xs font-bold uppercase tracking-wider mb-8 w-fit md:mx-0 mx-auto">
            <Leaf className="w-3 h-3" />
            Global Ecosystem
          </div>

          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-primary-foreground mb-6 animate-slide-in leading-[1.05]">
            Empowering the
            <br />
            <span className="text-gp-green-light">Green Revolution</span>
          </h1>

          <p className="text-primary-foreground/90 max-w-2xl text-base md:text-lg mb-8 animate-slide-in md:mx-0 mx-auto" style={{ animationDelay: "0.1s" }}>
            Join a worldwide network of forward-thinking organizations committed to sustainable growth and ecological
            restoration.
          </p>
          <p className="text-primary-foreground/80 max-w-2xl text-sm md:text-base mb-8 animate-slide-in md:mx-0 mx-auto font-semibold" style={{ animationDelay: "0.15s" }}>
            Flow: submit request - admin review - approval email - partner login.
          </p>

          <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4 animate-slide-in" style={{ animationDelay: "0.2s" }}>
            <a
              href="#partner-form"
              className="w-full sm:w-auto bg-accent text-accent-foreground px-8 py-4 font-bold text-sm hover:brightness-110 transition text-center"
            >
              Send Partnership Request
            </a>
            <a
              href="/partner-login"
              className="w-full sm:w-auto px-8 py-4 bg-gp-green text-primary-foreground font-bold text-sm hover:brightness-110 transition text-center"
            >
              Partner Login
            </a>
          </div>
        </div>
      </section>

      <section className="py-10 px-6 -mt-8 relative z-20">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-8 border border-border bg-card shadow-sm">
          {STATS.map((item) => (
            <div key={item.label} className="text-center md:border-r last:border-r-0 border-border md:px-4">
              <p className="text-4xl md:text-5xl font-heading text-gp-green mb-2">{item.value}</p>
              <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto">
          <div className="max-w-3xl mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gp-green mb-3">Partner benefits</p>
            <h2 className="text-4xl font-heading text-foreground mb-3 uppercase">Why Teams Partner With Us</h2>
            <p className="text-muted-foreground font-semibold">
              A strong partner page should communicate trust, measurable value, and a clear collaboration model.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="border border-border bg-card p-6 hover:border-gp-green transition-colors">
                  <div className="w-12 h-12 mb-4 bg-gp-green/10 text-gp-green flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-xl text-foreground mb-2 uppercase">{item.title}</h3>
                  <p className="text-sm font-semibold text-muted-foreground leading-relaxed">{item.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="border border-border bg-card p-8">
            <h2 className="text-3xl font-heading text-foreground mb-3 uppercase">Partner Fit Estimator</h2>
            <p className="text-muted-foreground font-semibold mb-6">
              Quickly identify the partnership model that best matches your goals and team profile.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Team Size
                </label>
                <select
                  value={fitData.orgSize}
                  onChange={(e) => setFitData((prev) => ({ ...prev, orgSize: e.target.value }))}
                  className="w-full px-4 py-3 border border-border bg-background outline-none focus:ring-2 focus:ring-gp-green/20 focus:border-gp-green transition"
                >
                  <option>Small Team</option>
                  <option>Mid-size Team</option>
                  <option>Enterprise Team</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Priority
                </label>
                <select
                  value={fitData.priority}
                  onChange={(e) => setFitData((prev) => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-4 py-3 border border-border bg-background outline-none focus:ring-2 focus:ring-gp-green/20 focus:border-gp-green transition"
                >
                  <option>Community impact</option>
                  <option>Technology pilot</option>
                  <option>Brand visibility</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Budget Range
                </label>
                <select
                  value={fitData.budget}
                  onChange={(e) => setFitData((prev) => ({ ...prev, budget: e.target.value }))}
                  className="w-full px-4 py-3 border border-border bg-background outline-none focus:ring-2 focus:ring-gp-green/20 focus:border-gp-green transition"
                >
                  <option>Starter</option>
                  <option>Growth</option>
                  <option>Enterprise</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border border-gp-green bg-gp-green text-primary-foreground p-8 flex flex-col">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3 text-primary-foreground/80">Recommendation</p>
            <h3 className="text-4xl font-heading uppercase mb-3">{recommendedProgram}</h3>
            <p className="font-semibold text-primary-foreground/90 mb-6">
              Based on your selected profile, this program gives the fastest path to measurable outcomes.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                Suggested playbook and KPI set shared in kickoff.
              </li>
              <li className="flex items-start gap-2 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                Priority support from partner success team.
              </li>
              <li className="flex items-start gap-2 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                Pilot-to-scale roadmap tailored to your timeline.
              </li>
            </ul>
            <a
              href="#partner-form"
              className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary-foreground text-gp-green font-bold uppercase"
            >
              Continue With This Program <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto">
          <div className="max-w-3xl mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gp-green mb-3">Programs</p>
            <h2 className="text-4xl font-heading text-foreground mb-3 uppercase">Partnership Programs</h2>
            <p className="text-muted-foreground font-semibold">
              Choose the program that best fits your resources, impact goals, and execution model.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROGRAMS.map((program) => (
              <article key={program.name} className="border border-border bg-card p-7 flex flex-col hover:border-gp-green transition-colors">
                <h3 className="text-2xl font-heading text-foreground mb-2 uppercase">{program.name}</h3>
                <p className="text-sm font-semibold text-muted-foreground mb-5">{program.details}</p>
                <ul className="space-y-3 mb-6">
                  {program.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-sm font-semibold text-foreground">
                      <BadgeCheck className="w-4 h-4 text-gp-green mt-0.5 shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <a href="#partner-form" className="mt-auto inline-flex items-center gap-2 text-gp-green font-bold text-sm">
                  Apply to this program <ArrowRight className="w-4 h-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="partner-directory" className="py-20 px-6 scroll-mt-24 bg-secondary/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gp-green mb-3">Directory</p>
              <h2 className="text-4xl font-heading text-foreground mb-3 uppercase">Our Partner Ecosystem</h2>
              <p className="text-muted-foreground font-semibold">
                Explore organizations shaping sustainable innovation worldwide.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search partner..."
                className="w-full sm:w-56 px-4 py-3 border border-border bg-card outline-none focus:ring-2 focus:ring-gp-green/20 focus:border-gp-green transition"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full sm:w-44 px-4 py-3 border border-border bg-card outline-none focus:ring-2 focus:ring-gp-green/20 focus:border-gp-green transition"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gp-green" />
            </div>
          ) : filteredPartners.length === 0 ? (
            <div className="py-14 px-6 border border-dashed border-border text-center bg-card">
              <p className="text-foreground font-bold mb-2">No partners found</p>
              <p className="text-muted-foreground">Try changing keyword or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPartners.map((item) => (
                <article
                  key={item.id}
                  className="group relative p-8 bg-card border border-border hover:border-gp-green transition overflow-hidden"
                >
                  <Leaf className="absolute -right-4 -bottom-4 w-20 h-20 text-gp-green/10 group-hover:rotate-12 transition-transform duration-700" />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-gp-green/10 flex items-center justify-center group-hover:bg-gp-green transition-colors">
                        <Leaf className="w-7 h-7 text-gp-green group-hover:text-primary-foreground" />
                      </div>
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-gp-green transition-colors"
                        aria-label={`Open ${item.name} website`}
                      >
                        <ExternalLink size={20} />
                      </a>
                    </div>

                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-gp-green mb-2 block">
                      {item.category}
                    </span>
                    <h3 className="text-2xl font-heading text-foreground mb-3 uppercase">{item.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed font-semibold">{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto">
          <div className="max-w-3xl mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gp-green mb-3">Workflow</p>
            <h2 className="text-4xl font-heading text-foreground mb-3 uppercase">Onboarding Process</h2>
            <p className="text-muted-foreground font-semibold">
              From first contact to launch, here is how we move from vision to outcomes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step, index) => (
              <article key={step.title} className="border border-border bg-card p-6 hover:border-gp-green transition-colors">
                <p className="text-xs tracking-[0.2em] font-bold text-gp-green mb-3">STEP {index + 1}</p>
                <h3 className="text-xl font-heading text-foreground mb-2 uppercase">{step.title}</h3>
                <p className="text-sm font-semibold text-muted-foreground">{step.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="border border-border bg-card p-8">
            <h2 className="text-3xl font-heading text-foreground mb-5 uppercase">Partner Voices</h2>
            <div className="space-y-5">
              {TESTIMONIALS.map((item) => (
                <article key={item.author} className="border border-border p-5 bg-background hover:border-gp-green transition-colors">
                  <p className="text-foreground font-semibold mb-3">&quot;{item.quote}&quot;</p>
                  <p className="text-sm text-gp-green font-bold uppercase">{item.author}</p>
                  <p className="text-xs text-muted-foreground font-semibold">{item.role}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="border border-border bg-card p-8">
            <h2 className="text-3xl font-heading text-foreground mb-5 uppercase">FAQ</h2>
            <div className="space-y-3">
              {FAQS.map((faq, index) => {
                const opened = openedFaq === index;
                return (
                  <article key={faq.question} className="border border-border bg-background">
                    <button
                      type="button"
                      onClick={() => setOpenedFaq(opened ? null : index)}
                      className="w-full text-left p-4 flex items-center justify-between gap-3"
                    >
                      <span className="text-sm font-bold text-foreground">{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground transition-transform ${opened ? "rotate-180" : ""}`}
                      />
                    </button>
                    {opened ? <p className="px-4 pb-4 text-sm text-muted-foreground font-semibold">{faq.answer}</p> : null}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto">
          <div className="max-w-3xl mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gp-green mb-3">Resources</p>
            <h2 className="text-4xl font-heading text-foreground mb-3 uppercase">Partner Resources</h2>
            <p className="text-muted-foreground font-semibold">
              Everything teams usually ask for before signing: process, templates, and branding guidance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PARTNER_RESOURCES.map((resource) => (
              <article key={resource.title} className="border border-border bg-card p-7 hover:border-gp-green transition-colors">
                <h3 className="text-xl font-heading text-foreground mb-2 uppercase">{resource.title}</h3>
                <p className="text-sm font-semibold text-muted-foreground mb-5">{resource.desc}</p>
                <a
                  href="#partner-form"
                  className="inline-flex items-center gap-2 text-gp-green font-bold text-sm"
                >
                  Request Access <ArrowRight className="w-4 h-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="partner-form" className="py-20 px-6 scroll-mt-24 bg-card">
        <div className="container mx-auto max-w-4xl border border-border p-8 md:p-12 bg-background">
          {submitted ? (
            <div className="text-center py-10 animate-slide-in">
              <div className="w-20 h-20 bg-gp-green/10 text-gp-green flex items-center justify-center mx-auto mb-6">
                <Send size={32} />
              </div>
              <h2 className="text-3xl font-heading text-foreground mb-4 uppercase">Request Sent</h2>
              <p className="text-muted-foreground font-semibold">
                Your request has been sent to admin for review.
              </p>
              <div className="mt-5 inline-block text-left border border-border bg-card px-5 py-4">
                <p className="text-xs uppercase tracking-wider font-bold text-gp-green mb-2">Next steps</p>
                <p className="text-sm text-muted-foreground font-semibold">1. Admin reviews your request.</p>
                <p className="text-sm text-muted-foreground font-semibold">2. After approval, you receive login details via email.</p>
                <p className="text-sm text-muted-foreground font-semibold">3. Use the email credentials to access Partner Portal.</p>
              </div>
              {successMessage ? <p className="text-xs text-gp-green font-bold mt-4">{successMessage}</p> : null}
              <a
                href="/partner-login"
                className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-gp-green uppercase"
              >
                Go to partner login <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-heading text-foreground mb-4 uppercase">
                  Let&apos;s Build the <span className="text-gp-green">Future Together</span>
                </h2>
                <p className="text-muted-foreground font-semibold">
                  Fill out the form to submit your request. Admin approval is required before partner login access is issued.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Organization Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      required
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, organizationName: e.target.value }))}
                      placeholder="EcoVanguard Ltd."
                      className="w-full pl-12 pr-4 py-4 bg-card border border-border outline-none focus:ring-2 focus:ring-gp-green/20 focus:border-gp-green transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contact Name</label>
                  <div className="relative">
                    <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      required
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, contactName: e.target.value }))}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-4 bg-card border border-border outline-none focus:ring-2 focus:ring-gp-green/20 focus:border-gp-green transition"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      required
                      type="email"
                      value={formData.workEmail}
                      onChange={(e) => setFormData((prev) => ({ ...prev, workEmail: e.target.value }))}
                      placeholder="partnership@greenearth.com"
                      className="w-full pl-12 pr-4 py-4 bg-card border border-border outline-none focus:ring-2 focus:ring-gp-green/20 focus:border-gp-green transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Country</label>
                  <input
                    required
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                    placeholder="Vietnam"
                    className="w-full px-4 py-4 bg-card border border-border outline-none focus:ring-2 focus:ring-gp-green/20 focus:border-gp-green transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Company Size</label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => setFormData((prev) => ({ ...prev, companySize: e.target.value }))}
                    className="w-full px-4 py-4 bg-card border border-border outline-none focus:ring-2 focus:ring-gp-green/20 focus:border-gp-green transition"
                  >
                    <option value="1-50">1-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    How can we collaborate?
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us about your mission..."
                    className="w-full p-4 bg-card border border-border outline-none focus:ring-2 focus:ring-gp-green/20 focus:border-gp-green resize-none transition"
                  />
                </div>

                {error ? (
                  <p className="md:col-span-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3">
                    {error}
                  </p>
                ) : null}

                <label className="md:col-span-2 flex items-start gap-3 text-sm text-muted-foreground font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData((prev) => ({ ...prev, consent: e.target.checked }))}
                    className="mt-1"
                  />
                  I agree to share this information for admin evaluation and approval workflow.
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="md:col-span-2 w-full py-4 bg-gp-green hover:brightness-110 disabled:opacity-70 text-primary-foreground font-bold transition flex items-center justify-center gap-2 uppercase"
                >
                  {submitting ? "Sending Request..." : "Send Partnership Request"}
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      <section className="px-6 pb-24 bg-background">
        <div className="container mx-auto border border-gp-green bg-gp-green text-primary-foreground p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading uppercase mb-2">Ready To Co-Create Impact?</h2>
            <p className="font-semibold text-primary-foreground/90">
              Tell us your mission and we will propose a tailored collaboration path.
            </p>
          </div>
          <a
            href="#partner-form"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-foreground text-gp-green font-bold uppercase hover:brightness-95 transition"
          >
            Start Partnership <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Partners;
