import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import { api } from "@/lib/api";

const SERVICES = [
  { name: "Authority Systems", desc: "Repeatable systems that turn expertise into category-defining presence." },
  { name: "Content Production", desc: "Editorial-grade video, writing and visuals — produced for the internet." },
  { name: "Distribution Systems", desc: "Channels, cadence, formats, hooks. Distribution as engineering." },
  { name: "Content Strategy", desc: "What to say, when, on which platform, and to whom." },
  { name: "Thought Leadership", desc: "Position founders and operators as the lens through which an industry is read." },
];

export default function BrandBuilding() {
  const [calendly, setCalendly] = useState("");
  useEffect(() => {
    api.get("/config").then((r) => setCalendly(r.data.calendly_url || ""));
  }, []);

  return (
    <div data-testid="brand-building-page">
      <section className="relative pt-24 pb-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <div className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">Division One</div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="display text-[#F5F5F5] mt-6 text-5xl md:text-6xl lg:text-7xl tracking-tightest leading-[1.02]">
                Build Your Brand.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 text-[#A1A1AA] text-lg max-w-xl leading-relaxed">
                For founders, startups, businesses and ambitious people looking to
                build authority on the internet — and convert it into outcomes.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-4">
            <Reveal delay={0.1}>
              <div className="surface p-6">
                <div className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">For</div>
                <ul className="mt-4 space-y-2 text-[#F5F5F5] text-sm">
                  <li>· Founders & operators</li>
                  <li>· Funded startups</li>
                  <li>· Internet-native businesses</li>
                  <li>· Investors & funds</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-12 gap-6">
          {SERVICES.map((s, i) => (
            <Reveal
              key={s.name}
              delay={i * 0.05}
              className={i === 0 ? "md:col-span-7" : i === 1 ? "md:col-span-5" : i === 2 ? "md:col-span-5" : i === 3 ? "md:col-span-7" : "md:col-span-12"}
            >
              <div className="surface p-10 h-full">
                <div className="flex items-center gap-3 text-[#A1A1AA] text-[11px] uppercase tracking-[0.32em]">
                  <Sparkles size={12} className="text-white/40" />
                  Service {String(i + 1).padStart(2, "0")}
                </div>
                <div className="display text-[#F5F5F5] text-3xl tracking-tightest mt-5">{s.name}</div>
                <p className="text-[#A1A1AA] mt-4 leading-relaxed text-sm md:text-base max-w-2xl">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="display text-[#F5F5F5] text-4xl md:text-5xl tracking-tightest leading-[1.04]">
                Book a strategy call.
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-6 text-[#A1A1AA] text-lg max-w-xl leading-relaxed">
                30 minutes. We map your goals to the framework, identify
                the highest-leverage moves, and decide if we&apos;re a fit.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5 flex flex-wrap gap-4 lg:justify-end">
            <Reveal delay={0.1}>
              <a
                href={calendly || "#"}
                target="_blank"
                rel="noreferrer"
                data-testid="brand-cta-call"
                className="btn-primary"
                onClick={(e) => { if (!calendly) e.preventDefault(); }}
              >
                Book a Strategy Call <ArrowUpRight size={16} />
              </a>
            </Reveal>
            <Reveal delay={0.15}>
              <a href="/apply" data-testid="brand-cta-work" className="btn-ghost">
                Work With Us <ArrowRight size={14} />
              </a>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
