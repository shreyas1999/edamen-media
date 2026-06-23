import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";

const SERVICES = [
  { name: "Brand Partnerships", desc: "We bring you the deals worth signing. From category-defining campaigns to long-term collaborations." },
  { name: "Representation", desc: "We represent you across negotiations, contracts, public relations and creator-side decisions." },
  { name: "Campaign Management", desc: "Briefs, scripts, schedules, deliverables, approvals — handled end-to-end with editorial standards." },
  { name: "Negotiation", desc: "Rates, usage, exclusivity, performance — we structure the terms that make the relationship compound." },
  { name: "Career Growth", desc: "Beyond followers — equity, IP, products, books, ventures. We architect the next decade of your career." },
];

export default function CreatorRepresentation() {
  return (
    <div data-testid="creator-page">
      <section className="relative pt-24 pb-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <div className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">Division Two</div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="display text-[#F5F5F5] mt-6 text-5xl md:text-6xl lg:text-7xl tracking-tightest leading-[1.02]">
                Creator <br /> Representation.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 text-[#A1A1AA] text-lg max-w-xl leading-relaxed">
                For creators and personalities who want to build opportunities
                beyond followers — partnerships, products, ventures, equity.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-4">
            <Reveal delay={0.1}>
              <div className="surface p-6">
                <div className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">For</div>
                <ul className="mt-4 space-y-2 text-[#F5F5F5] text-sm">
                  <li>· Creators & personalities</li>
                  <li>· Hosts, writers, athletes</li>
                  <li>· Internet-native talent</li>
                  <li>· Multi-platform operators</li>
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
              className={i === 0 ? "md:col-span-5" : i === 1 ? "md:col-span-7" : i === 2 ? "md:col-span-7" : i === 3 ? "md:col-span-5" : "md:col-span-12"}
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
          <div className="lg:col-span-8">
            <Reveal>
              <h2 className="display text-[#F5F5F5] text-4xl md:text-5xl tracking-tightest leading-[1.04]">
                Apply for representation.
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-6 text-[#A1A1AA] text-lg max-w-xl leading-relaxed">
                We work with a small number of creators each year. Our application is
                deliberate — it helps us understand your goals and decide together if
                a long-term partnership makes sense.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <Reveal delay={0.1}>
              <Link to="/apply" data-testid="creator-cta-apply" className="btn-primary">
                Apply for Representation <ArrowUpRight size={16} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
