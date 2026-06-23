import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";

const CASES = [
  {
    tag: "Founder Brand",
    title: "From operator to category voice.",
    body: "We rebuilt a B2B founder's voice into the lens through which their category was discussed — and watched inbound flip from sales-led to brand-led in 9 months.",
    bullets: [
      "Editorial system across 3 platforms",
      "Compounding distribution loop",
      "Inbound deal flow from category leaders",
    ],
    metric: "0 → 184k",
    sub: "engaged followers in 9 months",
  },
  {
    tag: "Creator",
    title: "Audience converted into enterprise opportunities.",
    body: "A creator with a sharp niche became the operator other founders called. We turned their attention into board seats, brand equity and recurring partnerships.",
    bullets: [
      "Long-term partnerships, not one-off deals",
      "Negotiated equity into 2 ventures",
      "Built a personal IP layer beyond followers",
    ],
    metric: "$1.4M",
    sub: "in partnership value enabled",
  },
  {
    tag: "Startup",
    title: "A media engine that compounds for the company.",
    body: "We treated the company like a creator. Editorial cadence, distribution systems and a founder-led narrative compounded into product-led inbound.",
    bullets: [
      "Founder-led content engine",
      "Distribution playbook tuned to ICP",
      "Hiring and capital inbound, on autopilot",
    ],
    metric: "37x",
    sub: "increase in qualified inbound",
  },
];

export default function Work() {
  return (
    <div data-testid="work-page">
      <section className="relative pt-24 pb-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">Selected Work</div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display text-[#F5F5F5] mt-6 text-5xl md:text-6xl lg:text-7xl tracking-tightest leading-[1.02] max-w-4xl">
              The outcomes <br /> of compounding attention.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 text-[#A1A1AA] text-lg max-w-2xl leading-relaxed">
              We don&apos;t ship deliverables. We ship outcomes. A small selection of
              long-form partnerships with the kind of people we exist to serve.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-16">
          {CASES.map((c, i) => (
            <Reveal key={c.title} delay={0.05 * i}>
              <article
                data-testid={`case-${i}`}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start py-16 border-t border-white/5 first:border-t-0"
              >
                <div className="lg:col-span-3">
                  <div className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">
                    {String(i + 1).padStart(2, "0")} · {c.tag}
                  </div>
                </div>
                <div className="lg:col-span-6">
                  <h2 className="display text-[#F5F5F5] text-3xl md:text-4xl tracking-tightest leading-[1.05]">
                    {c.title}
                  </h2>
                  <p className="mt-6 text-[#A1A1AA] text-base leading-relaxed max-w-xl">
                    {c.body}
                  </p>
                  <ul className="mt-8 space-y-2">
                    {c.bullets.map((b) => (
                      <li key={b} className="text-[#F5F5F5]/85 text-sm flex items-start gap-3">
                        <span className="w-3 h-px bg-white/40 mt-3" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:col-span-3">
                  <div className="surface p-6">
                    <div className="display text-[#F5F5F5] text-4xl tracking-tightest">{c.metric}</div>
                    <div className="text-[#A1A1AA] text-xs uppercase tracking-[0.18em] mt-2">{c.sub}</div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <h2 className="display text-[#F5F5F5] text-4xl md:text-5xl tracking-tightest max-w-2xl">
            Be the next outcome.
          </h2>
          <Link to="/apply" data-testid="work-cta" className="btn-primary">
            Work With Us <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
