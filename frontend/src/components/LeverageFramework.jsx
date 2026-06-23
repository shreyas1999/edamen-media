import { motion, useReducedMotion } from "framer-motion";

/**
 * The Edamen Leverage Framework™
 * Center: ATTENTION
 * Outer ring continuously rotates through the cycle:
 *   CONTENT → DISTRIBUTION → TRUST → OPPORTUNITIES → PARTNERSHIPS →
 *   LEVERAGE → COMPOUNDING → ATTENTION
 */
const STAGES = [
  "CONTENT",
  "DISTRIBUTION",
  "TRUST",
  "OPPORTUNITIES",
  "PARTNERSHIPS",
  "LEVERAGE",
  "COMPOUNDING",
  "ATTENTION",
];

export default function LeverageFramework({ size = 560 }) {
  const reduce = useReducedMotion();
  const R = size / 2;
  const center = R;
  const outerR = R - 22;
  const ringR = outerR - 36;
  const dotR = ringR - 28;
  const coreR = 78;

  return (
    <div
      data-testid="leverage-framework"
      className="relative inline-block"
      style={{ width: size, height: size }}
    >
      {/* Soft radial glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(37,99,235,0.15), rgba(245,158,11,0.05) 55%, transparent 75%)",
          filter: "blur(8px)",
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="relative"
        aria-hidden
      >
        <defs>
          <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#F5F5F5" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#090909" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ringStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
          </linearGradient>
          <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#F5F5F5" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Outermost faint ring */}
        <circle cx={center} cy={center} r={outerR} fill="none" stroke="url(#ringStroke)" strokeWidth="1" />

        {/* Inner dashed ring */}
        <circle
          cx={center}
          cy={center}
          r={ringR}
          fill="none"
          stroke="url(#dashGrad)"
          strokeWidth="1"
          strokeDasharray="2 6"
          opacity="0.85"
        />

        {/* Tick marks */}
        {Array.from({ length: 48 }).map((_, i) => {
          const a = (i / 48) * 2 * Math.PI;
          const r1 = outerR - 2;
          const r2 = outerR - (i % 4 === 0 ? 10 : 5);
          const x1 = center + r1 * Math.cos(a);
          const y1 = center + r1 * Math.sin(a);
          const x2 = center + r2 * Math.cos(a);
          const y2 = center + r2 * Math.sin(a);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="0.7"
            />
          );
        })}

        {/* Core glow */}
        <circle cx={center} cy={center} r={coreR + 30} fill="url(#coreGrad)" />
        <circle cx={center} cy={center} r={coreR} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <circle cx={center} cy={center} r={coreR - 14} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      </svg>

      {/* Rotating stage ring (HTML overlay for crisp text) */}
      <motion.div
        className="absolute inset-0"
        style={{ originX: "50%", originY: "50%" }}
        animate={reduce ? {} : { rotate: 360 }}
        transition={{ duration: 80, ease: "linear", repeat: Infinity }}
      >
        {STAGES.map((stage, i) => {
          const angle = (i / STAGES.length) * 360;
          return (
            <div
              key={stage + i}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${dotR}px)`,
              }}
            >
              <div
                className="flex flex-col items-center gap-1"
                style={{ transform: `rotate(${-angle}deg)` }}
              >
                <motion.div
                  initial={{ opacity: 0.35 }}
                  animate={{ opacity: [0.35, 0.95, 0.35] }}
                  transition={{
                    duration: 4,
                    delay: (i * 0.4) % 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-[6px] h-[6px] rounded-full bg-white"
                />
                <div className="text-[10px] tracking-[0.22em] text-[#F5F5F5]/80 uppercase whitespace-nowrap">
                  {stage}
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center text-center">
          <div className="text-[10px] tracking-[0.3em] text-[#A1A1AA] uppercase">
            The Asset
          </div>
          <div className="display text-[#F5F5F5] text-3xl md:text-4xl tracking-tightest mt-1">
            Attention
          </div>
          <div className="text-[10px] tracking-[0.25em] text-[#A1A1AA] uppercase mt-2">
            Compounds
          </div>
        </div>
      </div>
    </div>
  );
}
