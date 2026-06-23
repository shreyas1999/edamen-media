import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="border-t border-white/5 mt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <div className="display text-[#F5F5F5] text-2xl tracking-tightest">
            Edamen <span className="text-[#A1A1AA]">Media</span>
          </div>
          <p className="text-[#A1A1AA] text-sm mt-4 max-w-sm leading-relaxed">
            Behind the internet&apos;s next creators. We help ambitious people and
            companies turn attention into leverage.
          </p>
          <a href="https://calendly.com/edamenmedia/discoverycall" data-testid="footer-cta" className="btn-ghost mt-8" target="_blank" rel="noopener noreferrer">
            Work With Us <ArrowUpRight size={14} />
          </a>
        </div>

        <div className="md:col-span-2">
          <div className="text-xs uppercase tracking-[0.18em] text-[#A1A1AA] mb-4">Studio</div>
          <ul className="space-y-3 text-sm text-[#F5F5F5]/85">
            <li><Link to="/framework" className="hover:text-white">Framework</Link></li>
            <li><Link to="/brand-building" className="hover:text-white">Brand Building</Link></li>
            <li><Link to="/creator-representation" className="hover:text-white">Representation</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <div className="text-xs uppercase tracking-[0.18em] text-[#A1A1AA] mb-4">Company</div>
          <ul className="space-y-3 text-sm text-[#F5F5F5]/85">
            <li><Link to="/work" className="hover:text-white">Work</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="text-xs uppercase tracking-[0.18em] text-[#A1A1AA] mb-4">Connect</div>
          <ul className="space-y-3 text-sm text-[#F5F5F5]/85">
            <li><a href="mailto:hello@edamenmedia.com" className="hover:text-white">hello@edamenmedia.com</a></li>
            <li><a href="https://x.com/edamenmedia" target="_blank" rel="noopener noreferrer" className="hover:text-white">X / Twitter</a></li>
            <li><a href="https://instagram.com/edamenmedia" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 flex items-center justify-between text-xs text-[#A1A1AA]">
          <div>© {new Date().getFullYear()} Edamen Media. All rights reserved.</div>
          <div className="hidden md:flex items-center gap-6">
            <span>The Edamen Leverage Framework™</span>
            <Link to="/admin/login" data-testid="footer-admin-link" className="hover:text-white">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
