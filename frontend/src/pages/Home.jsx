import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import LeverageFramework from "@/components/LeverageFramework";
import HeroBackdrop from "@/components/HeroBackdrop";
import Reveal from "@/components/Reveal";

const PHRASES = [
  "Content creates Attention.",
  "Distribution creates Reach.",
  "Partnerships create Opportunities.",
  "Opportunities create Leverage.",
  "Leverage compounds — over time.",
];

const TRUSTED = [
  "Founders", "Operators", "Creators", "Studios", "Funds", "Startups",
  "Authors", "Investors", "Journalists", "Independents",
];

export default function Home() {
  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center grain">
        <HeroBackdrop />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-32 w-full">
          <Reveal>
            <div className="flex items-center gap-3 mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse-soft" />
              <span className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">
                Edamen Media — Behind the internet&apos;s next creators
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display text-[#F5F5F5] text-5xl sm:text-6xl lg:text-[88px] leading-[1.02] tracking-tightest max-w-5xl">
              Behind The Internet&apos;s <br />
              <span className="text-[#A1A1AA]">Next Creators.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-10 max-w-xl text-[#A1A1AA] text-lg leading-relaxed">
              We help ambitious people and companies turn attention into leverage.
              Through content, distribution and strategic partnerships.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <a href="https://calendly.com/edamenmedia/discoverycall" data-testid="hero-cta-work" className="btn-primary" target="_blank" rel="noopener noreferrer">
                Work With Us <ArrowUpRight size={16} />
              </a>
              <Link to="/apply" data-testid="hero-cta-apply" className="btn-ghost">
                Apply for Representation <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>

          {/* Numeric ticker / proof strip */}
          <Reveal delay={0.3}>
            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 hairline rounded-2xl overflow-hidden">
              {[
                { k: "1.2B+", v: "Impressions distributed" },
                { k: "70+", v: "Founders & creators served" },
                { k: "$18M+", v: "In partnership value enabled" },
                { k: "8", v: "Industries we operate in" },
              ].map((s) => (
                <div key={s.k} className="bg-[#0c0c0c] px-6 py-7">
                  <div className="display text-[#F5F5F5] text-3xl md:text-4xl tracking-tightest">{s.k}</div>
                  <div className="text-[#A1A1AA] text-xs mt-2 uppercase tracking-[0.18em]">{s.v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="relative py-12 overflow-hidden border-y border-white/5">
        <div className="flex marquee-track whitespace-nowrap gap-12">
          {[...TRUSTED, ...TRUSTED].map((t, i) => (
            <span key={i} className="text-[#A1A1AA] text-sm uppercase tracking-[0.32em]">
              {t} <span className="text-white/15 mx-6">·</span>
            </span>
          ))}
        </div>
      </section>

      {/* FRAMEWORK */}
      <section id="framework" className="relative py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">
                The Edamen Leverage Framework™
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="display text-[#F5F5F5] mt-6 text-4xl md:text-5xl lg:text-6xl leading-[1.04] tracking-tightest">
                Attention is an asset. <br /> Everything compounds.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="mt-10 space-y-4">
                {PHRASES.map((p, i) => (
                  <li key={p} className="flex items-start gap-4">
                    <span className="text-[#A1A1AA] text-xs mt-2 w-6">0{i + 1}</span>
                    <span className="text-[#F5F5F5] text-lg leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.18}>
              <Link to="/framework" data-testid="framework-learn-more" className="btn-ghost mt-12">
                Explore the framework <ArrowRight size={14} />
              </Link>
            </Reveal>
          </div>

          <div className="lg:col-span-7 flex justify-center">
            <Reveal delay={0.1}>
              <LeverageFramework size={560} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* DIVISIONS */}
      <section className="relative py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="flex items-end justify-between gap-8 mb-16">
              <div>
                <div className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">Two Divisions</div>
                <h2 className="display text-[#F5F5F5] mt-4 text-4xl md:text-5xl tracking-tightest">
                  How we work.
                </h2>
              </div>
              <div className="hidden md:block text-[#A1A1AA] text-sm max-w-xs">
                Two operating systems. One philosophy: turn attention into leverage.
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Reveal>
              <DivisionCard
                eyebrow="Division One"
                title="Build Your Brand"
                copy="For founders, startups, businesses and ambitious people building authority on the internet."
                services={["Authority Systems", "Content Production", "Distribution Systems", "Content Strategy", "Thought Leadership"]}
                cta="Book a Strategy Call"
                href="/brand-building"
                testid="division-brand"
                accent="blue"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <DivisionCard
                eyebrow="Division Two"
                title="Creator Representation"
                copy="For creators and personalities building opportunities beyond followers."
                services={["Brand Partnerships", "Representation", "Campaign Management", "Negotiation", "Career Growth"]}
                cta="Apply for Representation"
                href="/creator-representation"
                testid="division-creator"
                accent="gold"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* WORK TEASER */}
      <section className="relative py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="flex items-end justify-between gap-8 mb-16">
              <div>
                <div className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">Selected Work</div>
                <h2 className="display text-[#F5F5F5] mt-4 text-4xl md:text-5xl tracking-tightest">
                  Outcomes, not deliverables.
                </h2>
              </div>
              <Link to="/work" data-testid="work-view-all" className="btn-ghost">
                View Case Studies <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { tag: "Founder Brand", title: "From operator to category voice.", metric: "0 → 184k", sub: "in 9 months" },
              { tag: "Creator", title: "Audience converted into enterprise opportunities.", metric: "$1.4M", sub: "partnership value" },
              { tag: "Startup", title: "A media engine that compounds.", metric: "37x", sub: "qualified inbound" },
            ].map((w, i) => (
              <Reveal key={w.title} delay={0.05 * i}>
                <div className="surface p-8 h-full flex flex-col">
                  <div className="text-[10px] tracking-[0.28em] uppercase text-[#A1A1AA]">{w.tag}</div>
                  <div className="display text-[#F5F5F5] text-2xl tracking-tightest leading-tight mt-4">
                    {w.title}
                  </div>
                  <div className="mt-auto pt-12">
                    <div className="display text-[#F5F5F5] text-4xl tracking-tightest">{w.metric}</div>
                    <div className="text-[#A1A1AA] text-xs uppercase tracking-[0.2em] mt-1">{w.sub}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="relative py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <h2 className="display text-[#F5F5F5] text-5xl md:text-6xl lg:text-7xl tracking-tightest leading-[1.02]">
                Make your <span className="text-[#A1A1AA]">attention</span><br />work for you.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-4 lg:items-end">
            <Reveal delay={0.1}>
              <a href="https://calendly.com/edamenmedia/discoverycall" data-testid="cta-strip-work" className="btn-primary" target="_blank" rel="noopener noreferrer">
                Work With Us <ArrowUpRight size={16} />
              </a>
            </Reveal>
            <Reveal delay={0.15}>
              <Link to="/apply" data-testid="cta-strip-apply" className="btn-ghost">
                Apply for Representation <ArrowRight size={14} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

function DivisionCard({ eyebrow, title, copy, services, cta, href, testid, accent }) {
  return (
    <div
      data-testid={testid}
      className="surface p-10 h-full flex flex-col group relative overflow-hidden"
    >
      <div
        className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background:
            accent === "blue"
              ? "radial-gradient(400px 200px at 30% 0%, rgba(37,99,235,0.12), transparent 70%)"
              : "radial-gradient(400px 200px at 30% 0%, rgba(245,158,11,0.10), transparent 70%)",
        }}
      />
      <div className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">{eyebrow}</div>
      <h3 className="display text-[#F5F5F5] mt-6 text-3xl md:text-4xl tracking-tightest">{title}</h3>
      <p className="text-[#A1A1AA] mt-4 text-sm md:text-base leading-relaxed max-w-md">{copy}</p>

      <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3">
        {services.map((s) => (
          <li key={s} className="text-[#F5F5F5]/85 text-sm flex items-center gap-2">
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: accent === "blue" ? "#2563EB" : "#F59E0B" }}
            />
            {s}
          </li>
        ))}
      </ul>

      <div className="mt-10 pt-8 border-t border-white/5">
        <Link to={href} data-testid={`${testid}-cta`} className="btn-ghost">
          {cta} <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
