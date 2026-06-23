import { useState } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in name, email and message.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/contact", form);
      setSent(true);
      toast.success("Message sent. We'll be in touch.");
      setForm({ name: "", email: "", company: "", message: "" });
    } catch (err) {
      toast.error("Could not send right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div data-testid="contact-page">
      <section className="relative pt-24 pb-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">Contact</div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display text-[#F5F5F5] mt-6 text-5xl md:text-6xl lg:text-7xl tracking-tightest leading-[1.02] max-w-4xl">
              Tell us what <br /> you&apos;re building.
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-[#F5F5F5] text-lg leading-relaxed max-w-md">
                For brand building, media, partnerships and press —
                send us a note. We read every message.
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="mt-12 space-y-6">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-[#A1A1AA]">Email</div>
                  <a href="mailto:hello@edamenmedia.com" className="text-[#F5F5F5] text-lg mt-2 inline-block hover:opacity-80">
                    hello@edamenmedia.com
                  </a>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-[#A1A1AA]">Press</div>
                  <a href="mailto:press@edamenmedia.com" className="text-[#F5F5F5] text-lg mt-2 inline-block hover:opacity-80">
                    press@edamenmedia.com
                  </a>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-[#A1A1AA]">Apply</div>
                  <a href="/apply" className="text-[#F5F5F5] text-lg mt-2 inline-block hover:opacity-80">
                    /apply →
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.05}>
              <form data-testid="contact-form" onSubmit={onSubmit} className="surface p-8 md:p-10 space-y-6">
                <Field label="Name" testid="contact-name" value={form.name} onChange={set("name")} />
                <Field label="Email" type="email" testid="contact-email" value={form.email} onChange={set("email")} />
                <Field label="Company / Project" testid="contact-company" value={form.company} onChange={set("company")} optional />
                <Field
                  label="Message"
                  testid="contact-message"
                  value={form.message}
                  onChange={set("message")}
                  multiline
                />
                <button
                  type="submit"
                  data-testid="contact-submit"
                  disabled={submitting || sent}
                  className="btn-primary disabled:opacity-60"
                >
                  {submitting ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
                    : sent ? "Sent" : <>Send Message <ArrowUpRight size={16} /></>}
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, testid, type = "text", multiline = false, optional = false }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.28em] text-[#A1A1AA]">
        {label}{optional ? " (optional)" : ""}
      </span>
      {multiline ? (
        <textarea
          data-testid={testid}
          value={value}
          onChange={onChange}
          rows={6}
          className="mt-3 w-full bg-transparent border-b border-white/10 focus:border-white/40 text-[#F5F5F5] text-base py-2 outline-none placeholder-[#52525b] transition"
        />
      ) : (
        <input
          data-testid={testid}
          type={type}
          value={value}
          onChange={onChange}
          className="mt-3 w-full bg-transparent border-b border-white/10 focus:border-white/40 text-[#F5F5F5] text-base py-2 outline-none placeholder-[#52525b] transition"
        />
      )}
    </label>
  );
}
