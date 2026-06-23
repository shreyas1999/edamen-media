import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";

const PILLARS = [
  { k: "Storytelling", v: "Years of editing, writing, and editorial production for internet-native audiences." },
  { k: "Production", v: "Long-form video, short-form distribution, podcasts, articles, social — built in-house." },
  { k: "Creator Ecosystems", v: "We operate inside creator economies. We understand the unwritten rules of the platforms." },
  { k: "Founder Brands", v: "We work natively with founders. We understand the line between operator and personality." },
  { k: "Internet Culture", v: "We don't just observe culture — we ship into it. Velocity, taste, and timing." },
];

export default function About() {
  return (
    <div data-testid="about-page">
      <section className="relative pt-24 pb-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">About</div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display text-[#F5F5F5] mt-6 text-5xl md:text-6xl lg:text-7xl tracking-tightest leading-[1.02] max-w-5xl">
              A founder-led company, <br />
              <span className="text-[#A1A1AA]">built for the internet&apos;s next decade.</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-[#F5F5F5] text-2xl md:text-3xl leading-[1.35] tracking-tight max-w-2xl">
                Edamen Media exists to help people turn attention into leverage.
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-8 text-[#A1A1AA] text-base md:text-lg leading-relaxed max-w-2xl">
                Built from years of experience in storytelling, content creation,
                editing, production, creator ecosystems, founder brands and
                internet culture — we sit at the intersection of editorial,
                operations and partnerships.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-[#A1A1AA] text-base md:text-lg leading-relaxed max-w-2xl">
                The shape of what we do may evolve. The mission stays the same:
                <span className="text-[#F5F5F5]"> behind the internet&apos;s next creators.</span>
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="surface p-8">
                <div className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">Where we operate</div>
                <ul className="mt-6 space-y-4">
                  {PILLARS.map((p) => (
                    <li key={p.k} className="border-t border-white/5 pt-4 first:border-t-0 first:pt-0">
                      <div className="text-[#F5F5F5] text-sm font-medium">{p.k}</div>
                      <div className="text-[#A1A1AA] text-sm mt-1 leading-relaxed">{p.v}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <h2 className="display text-[#F5F5F5] text-4xl md:text-5xl tracking-tightest max-w-2xl">
            Work with us.
          </h2>
          <a href="https://calendly.com/edamenmedia/discoverycall" data-testid="about-cta" className="btn-primary" target="_blank" rel="noopener noreferrer">
            Work With Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
