import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Reveal from "@/components/Reveal";

const PLATFORMS = ["Instagram", "TikTok", "YouTube", "X / Twitter", "LinkedIn", "Substack", "Other"];

const STEPS = [
  { key: "basics", title: "Basics", desc: "Tell us who you are." },
  { key: "social", title: "Social Profiles", desc: "Where your attention lives." },
  { key: "audience", title: "Audience", desc: "Who you reach, and how it lands." },
  { key: "content", title: "Content & Cadence", desc: "How you ship." },
  { key: "business", title: "Business", desc: "Monetisation and collaborations." },
  { key: "fit", title: "Fit", desc: "Goals, expectations and edges." },
];

const empty = {
  full_name: "", email: "", phone: "", location: "", profession: "",
  primary_platform: "",
  social_profiles: [{ platform: "", handle: "", url: "", followers: "" }],
  audience_size: "", audience_demographic: "", top_geographies: "",
  analytics_url: "", media_kit_url: "", portfolio_url: "",
  posting_frequency: "", content_output: "", content_pillars: "",
  currently_monetising: "", monthly_revenue_range: "", revenue_streams: "",
  past_brand_collaborations: "", notable_brands: "",
  preferred_brand_categories: "", restricted_categories: "", exclusivity_terms: "",
  twelve_month_goal: "", long_term_vision: "",
  expectations_from_edamen: "", open_questions: "",
};

export default function Apply() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);

  const set = (k) => (e) => setData({ ...data, [k]: e?.target ? e.target.value : e });
  const setSocial = (i, k, v) => {
    const next = [...data.social_profiles];
    next[i] = { ...next[i], [k]: v };
    setData({ ...data, social_profiles: next });
  };
  const addSocial = () =>
    setData({ ...data, social_profiles: [...data.social_profiles, { platform: "", handle: "", url: "", followers: "" }] });
  const removeSocial = (i) =>
    setData({ ...data, social_profiles: data.social_profiles.filter((_, idx) => idx !== i) });

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  const canNext = () => {
    if (step === 0) return data.full_name.trim() && data.email.trim();
    return true;
  };

  const next = () => {
    if (!canNext()) {
      toast.error("Please fill in name and email to continue.");
      return;
    }
    setStep(Math.min(STEPS.length - 1, step + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => {
    setStep(Math.max(0, step - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function submit() {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        social_profiles: data.social_profiles.filter((s) => s.platform || s.handle || s.url),
      };
      const r = await api.post("/applications", payload);
      setDone(r.data);
      toast.success("Application submitted.");
    } catch (e) {
      const msg = e?.response?.data?.detail || "Could not submit. Please try again.";
      toast.error(Array.isArray(msg) ? "Please check the form." : String(msg));
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div data-testid="apply-success" className="min-h-[80vh] flex items-center">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 py-32 text-center">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">
              Application Received
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display text-[#F5F5F5] mt-6 text-5xl md:text-6xl tracking-tightest leading-[1.05]">
              Thank you. <br /> We'll be in touch.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 text-[#A1A1AA] text-lg max-w-xl mx-auto leading-relaxed">
              We review every application personally. If we see a strong fit,
              you&apos;ll hear from a member of the team within 7 days.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Link to="/" className="btn-ghost">Back to Home <ArrowRight size={14} /></Link>
              <Link to="/framework" className="btn-primary">Read the Framework <ArrowUpRight size={16} /></Link>
            </div>
          </Reveal>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="apply-page" className="relative">
      <section className="relative pt-24 pb-12 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">Apply</div>
          <h1 className="display text-[#F5F5F5] mt-6 text-4xl md:text-5xl lg:text-6xl tracking-tightest leading-[1.04]">
            Apply for Representation.
          </h1>
          <p className="mt-6 text-[#A1A1AA] text-base md:text-lg max-w-2xl leading-relaxed">
            Six short steps. Be honest — the form is for us to understand
            where you are, and where you want to go.
          </p>
        </div>
      </section>

      <section className="relative py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          {/* Progress */}
          <div className="mb-10">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-[#A1A1AA]">
              <span>Step {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}</span>
              <span>{STEPS[step].title}</span>
            </div>
            <div className="mt-3 h-px bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-white"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>

          <div className="surface p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={STEPS[step].key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">
                  {STEPS[step].title}
                </div>
                <h2 className="display text-[#F5F5F5] text-3xl md:text-4xl tracking-tightest mt-4">
                  {STEPS[step].desc}
                </h2>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {step === 0 && (
                    <>
                      <Field label="Full name" testid="apply-full-name" value={data.full_name} onChange={set("full_name")} required />
                      <Field label="Email" type="email" testid="apply-email" value={data.email} onChange={set("email")} required />
                      <Field label="Phone (optional)" testid="apply-phone" value={data.phone} onChange={set("phone")} />
                      <Field label="Location" testid="apply-location" value={data.location} onChange={set("location")} />
                      <Field label="What do you do?" testid="apply-profession" value={data.profession} onChange={set("profession")} colSpan />
                    </>
                  )}

                  {step === 1 && (
                    <div className="md:col-span-2 space-y-6">
                      <Field
                        label="Primary platform"
                        testid="apply-primary-platform"
                        value={data.primary_platform}
                        onChange={set("primary_platform")}
                        select
                        options={PLATFORMS}
                      />
                      <div className="space-y-4">
                        <div className="text-[11px] uppercase tracking-[0.28em] text-[#A1A1AA]">
                          Social profiles
                        </div>
                        {data.social_profiles.map((sp, i) => (
                          <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-3">
                              <Field
                                label="Platform"
                                testid={`apply-sp-platform-${i}`}
                                value={sp.platform}
                                onChange={(e) => setSocial(i, "platform", e.target.value)}
                                select
                                options={PLATFORMS}
                              />
                            </div>
                            <div className="md:col-span-3">
                              <Field label="Handle" testid={`apply-sp-handle-${i}`} value={sp.handle} onChange={(e) => setSocial(i, "handle", e.target.value)} />
                            </div>
                            <div className="md:col-span-4">
                              <Field label="URL" testid={`apply-sp-url-${i}`} value={sp.url} onChange={(e) => setSocial(i, "url", e.target.value)} />
                            </div>
                            <div className="md:col-span-2 flex gap-2">
                              <div className="flex-1">
                                <Field label="Followers" testid={`apply-sp-followers-${i}`} value={sp.followers} onChange={(e) => setSocial(i, "followers", e.target.value)} />
                              </div>
                              {data.social_profiles.length > 1 && (
                                <button
                                  type="button"
                                  data-testid={`apply-sp-remove-${i}`}
                                  onClick={() => removeSocial(i)}
                                  className="mb-2 text-[#A1A1AA] hover:text-white text-xs"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        <button type="button" data-testid="apply-add-social" onClick={addSocial} className="btn-ghost">
                          + Add another profile
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <>
                      <Field label="Total audience size (across platforms)" testid="apply-audience-size" value={data.audience_size} onChange={set("audience_size")} colSpan />
                      <Field label="Audience demographic" testid="apply-audience-demo" value={data.audience_demographic} onChange={set("audience_demographic")} multiline />
                      <Field label="Top geographies" testid="apply-top-geo" value={data.top_geographies} onChange={set("top_geographies")} multiline />
                      <Field label="Analytics screenshots / link (Drive)" testid="apply-analytics-url" value={data.analytics_url} onChange={set("analytics_url")} placeholder="https://drive.google.com/..." />
                      <Field label="Media kit (Drive / website)" testid="apply-media-kit-url" value={data.media_kit_url} onChange={set("media_kit_url")} placeholder="https://drive.google.com/..." />
                      <Field label="Portfolio / standout work" testid="apply-portfolio-url" value={data.portfolio_url} onChange={set("portfolio_url")} placeholder="https://..." colSpan />
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <Field label="Posting frequency" testid="apply-post-freq" value={data.posting_frequency} onChange={set("posting_frequency")} placeholder="e.g. 3 longs / week, daily shorts" />
                      <Field label="Monthly content output" testid="apply-content-output" value={data.content_output} onChange={set("content_output")} placeholder="e.g. 4 long-form + 30 shorts" />
                      <Field label="Content pillars" testid="apply-content-pillars" value={data.content_pillars} onChange={set("content_pillars")} multiline colSpan />
                    </>
                  )}

                  {step === 4 && (
                    <>
                      <Field label="Are you currently monetising?" testid="apply-monetising" value={data.currently_monetising} onChange={set("currently_monetising")} select options={["Yes", "Partially", "Not yet"]} />
                      <Field label="Monthly revenue range" testid="apply-revenue-range" value={data.monthly_revenue_range} onChange={set("monthly_revenue_range")} select options={["< $1k", "$1k–5k", "$5k–25k", "$25k–100k", "$100k+"]} />
                      <Field label="Revenue streams" testid="apply-revenue-streams" value={data.revenue_streams} onChange={set("revenue_streams")} multiline colSpan />
                      <Field label="Past brand collaborations" testid="apply-past-collabs" value={data.past_brand_collaborations} onChange={set("past_brand_collaborations")} multiline />
                      <Field label="Notable brands" testid="apply-notable-brands" value={data.notable_brands} onChange={set("notable_brands")} multiline />
                      <Field label="Preferred brand categories" testid="apply-preferred-cats" value={data.preferred_brand_categories} onChange={set("preferred_brand_categories")} />
                      <Field label="Restricted categories" testid="apply-restricted-cats" value={data.restricted_categories} onChange={set("restricted_categories")} />
                      <Field label="Existing exclusivity terms" testid="apply-exclusivity" value={data.exclusivity_terms} onChange={set("exclusivity_terms")} colSpan />
                    </>
                  )}

                  {step === 5 && (
                    <>
                      <Field label="12-month goal" testid="apply-goal-12" value={data.twelve_month_goal} onChange={set("twelve_month_goal")} multiline colSpan />
                      <Field label="Long-term vision" testid="apply-long-vision" value={data.long_term_vision} onChange={set("long_term_vision")} multiline colSpan />
                      <Field label="What do you expect from Edamen?" testid="apply-expectations" value={data.expectations_from_edamen} onChange={set("expectations_from_edamen")} multiline colSpan />
                      <Field label="Open questions for us" testid="apply-open-q" value={data.open_questions} onChange={set("open_questions")} multiline colSpan />
                    </>
                  )}
                </div>

                <div className="mt-12 flex items-center justify-between">
                  <button
                    type="button"
                    data-testid="apply-back"
                    onClick={back}
                    disabled={step === 0}
                    className="btn-ghost disabled:opacity-40"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  {step < STEPS.length - 1 ? (
                    <button type="button" data-testid="apply-next" onClick={next} className="btn-primary">
                      Continue <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      data-testid="apply-submit"
                      disabled={submitting}
                      onClick={submit}
                      className="btn-primary disabled:opacity-60"
                    >
                      {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : <>Submit Application <Check size={16} /></>}
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label, value, onChange, testid, type = "text",
  multiline = false, required = false, select = false, options = [],
  placeholder = "", colSpan = false,
}) {
  return (
    <label className={`block ${colSpan ? "md:col-span-2" : ""}`}>
      <span className="text-[11px] uppercase tracking-[0.28em] text-[#A1A1AA]">
        {label}{required ? " *" : ""}
      </span>
      {select ? (
        <select
          data-testid={testid}
          value={value}
          onChange={onChange}
          className="mt-3 w-full bg-transparent border-b border-white/10 focus:border-white/40 text-[#F5F5F5] text-base py-2 outline-none appearance-none"
          style={{ backgroundColor: "transparent" }}
        >
          <option value="" className="bg-[#111] text-[#A1A1AA]">Select…</option>
          {options.map((o) => (
            <option key={o} value={o} className="bg-[#111] text-[#F5F5F5]">{o}</option>
          ))}
        </select>
      ) : multiline ? (
        <textarea
          data-testid={testid}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          className="mt-3 w-full bg-transparent border-b border-white/10 focus:border-white/40 text-[#F5F5F5] text-base py-2 outline-none placeholder-[#52525b]"
        />
      ) : (
        <input
          data-testid={testid}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="mt-3 w-full bg-transparent border-b border-white/10 focus:border-white/40 text-[#F5F5F5] text-base py-2 outline-none placeholder-[#52525b]"
        />
      )}
    </label>
  );
}
