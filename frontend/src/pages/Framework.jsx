import LeverageFramework from "@/components/LeverageFramework";
import Reveal from "@/components/Reveal";
import { ArrowUpRight } from "lucide-react";

const STEPS = [
  { stage: "Content", body: "Original ideas, captured with intent. Editorial production for the internet, not the boardroom." },
  { stage: "Distribution", body: "We treat distribution as a system, not a coincidence. Owned, earned and partner-led reach." },
  { stage: "Trust", body: "Compounding trust is the unfair advantage of the internet's most leveraged people." },
  { stage: "Opportunities", body: "Inbound flips: deals, hires, capital, partnerships and collaborations begin to find you." },
  { stage: "Partnerships", body: "We curate the opportunities worth signing. We negotiate the ones worth keeping." },
  { stage: "Leverage", body: "Time, capital and optionality begin to bend in your favor." },
  { stage: "Compounding", body: "Each loop strengthens the next. The asset is the attention, not the post." },
];

export default function Framework() {
  return (
    <div data-testid="framework-page" className="relative">
      <section className="relative pt-24 pb-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">
                Our Operating System
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="display text-[#F5F5F5] text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tightest mt-6">
                The Edamen <br /> Leverage Framework™
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 text-[#A1A1AA] text-lg max-w-xl leading-relaxed">
                A simple, compounding loop that turns attention into the most
                valuable asset of the internet era.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-6 flex justify-center">
            <Reveal delay={0.1}>
              <LeverageFramework size={520} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {STEPS.map((s, i) => {
              const spans = ["md:col-span-8", "md:col-span-4", "md:col-span-5", "md:col-span-7", "md:col-span-7", "md:col-span-5", "md:col-span-12"];
              return (
              <Reveal key={s.stage} delay={i * 0.04} className={spans[i] || "md:col-span-6"}>
                <div className="surface p-8 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">
                      Step {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  </div>
                  <div className="display text-[#F5F5F5] text-3xl tracking-tightest mt-6">{s.stage}</div>
                  <p className="text-[#A1A1AA] mt-3 text-sm md:text-base leading-relaxed">{s.body}</p>
                </div>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <h2 className="display text-[#F5F5F5] text-4xl md:text-5xl tracking-tightest max-w-2xl">
            See the framework applied to your work.
          </h2>
          <a href="https://calendly.com/edamenmedia/discoverycall" data-testid="framework-cta" className="btn-primary" target="_blank" rel="noopener noreferrer">
            Work With Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
