import { motion } from "framer-motion";

/**
 * Subtle Apple-like animated backdrop:
 *  - large soft moving radial gradient blobs
 *  - tiny floating particles
 *  - thin grid lines for editorial structure
 */
export default function HeroBackdrop() {
  return (
    <div data-testid="hero-backdrop" className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Editorial baseline grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "8.333% 100%",
        }}
      />

      {/* Moving gradient blobs */}
      <motion.div
        className="absolute -top-40 -left-32 w-[640px] h-[640px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(37,99,235,0.20), transparent 70%)",
          filter: "blur(20px)",
        }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute top-20 -right-32 w-[560px] h-[560px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(245,158,11,0.10), transparent 70%)",
          filter: "blur(30px)",
        }}
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 26, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-[-160px] left-1/3 w-[820px] h-[820px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.07), transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 30, ease: "easeInOut", repeat: Infinity }}
      />

      {/* Particles */}
      {Array.from({ length: 26 }).map((_, i) => {
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const size = Math.random() * 1.4 + 0.6;
        const delay = Math.random() * 6;
        const dur = 6 + Math.random() * 8;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white/60"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: size,
              height: size,
              boxShadow: "0 0 6px rgba(255,255,255,0.5)",
            }}
            animate={{ opacity: [0.1, 0.7, 0.1], y: [0, -10, 0] }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      })}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(9,9,9,0.85) 100%)",
        }}
      />
    </div>
  );
}
