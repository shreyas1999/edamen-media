import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/framework", label: "Framework" },
  { to: "/brand-building", label: "Brand Building" },
  { to: "/creator-representation", label: "Creator Representation" },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [loc.pathname]);

  return (
    <header
      data-testid="site-nav"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass hairline" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-2 group">
          <span className="display text-[#F5F5F5] tracking-tightest text-[1.05rem]">
            EDAMEN <span className="text-[#A1A1AA]">MEDIA</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="nav-link text-[0.86rem] tracking-tight"
              data-active={loc.pathname === l.to ? "true" : "false"}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href="https://calendly.com/edamenmedia/discoverycall" data-testid="nav-cta-work" className="btn-primary" target="_blank" rel="noopener noreferrer">
            Work With Us <ArrowUpRight size={16} />
          </a>
        </div>

        <button
          data-testid="nav-mobile-toggle"
          className="lg:hidden text-[#F5F5F5] p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div data-testid="nav-mobile-menu" className="lg:hidden glass hairline">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                data-testid={`nav-mobile-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-[#F5F5F5] text-base"
              >
                {l.label}
              </Link>
            ))}
            <a href="https://calendly.com/edamenmedia/discoverycall" data-testid="nav-mobile-cta" className="btn-primary justify-center mt-2" target="_blank" rel="noopener noreferrer">
              Work With Us <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
