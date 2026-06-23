import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, RefreshCw, Search, X, Download } from "lucide-react";
import { api, auth } from "@/lib/api";
import { toast } from "sonner";

const STATUS_OPTIONS = ["New", "Reviewing", "Qualified", "Call Scheduled", "Signed", "Rejected"];

const STATUS_TONE = {
  "New": "bg-white/10 text-white",
  "Reviewing": "bg-[#2563EB]/15 text-[#93c5fd] border border-[#2563EB]/30",
  "Qualified": "bg-[#F59E0B]/15 text-[#fcd34d] border border-[#F59E0B]/30",
  "Call Scheduled": "bg-white/15 text-white border border-white/20",
  "Signed": "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  "Rejected": "bg-red-500/10 text-red-300 border border-red-500/20",
};

export default function AdminDashboard() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState([]);
  const [stats, setStats] = useState({ total: 0, by_status: {} });
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!auth.isAuthed()) {
      nav("/admin/login");
      return;
    }
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    try {
      const [a, s] = await Promise.all([
        api.get("/applications", { params: filter ? { status: filter } : {} }),
        api.get("/applications/stats"),
      ]);
      setApps(a.data);
      setStats(s.data);
    } catch (e) {
      if (e?.response?.status === 401) {
        auth.clear();
        nav("/admin/login");
      } else {
        toast.error("Failed to load applications.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (auth.isAuthed()) refresh(); }, [filter]);

  const filtered = useMemo(() => {
    if (!query.trim()) return apps;
    const q = query.toLowerCase();
    return apps.filter((a) =>
      [a.full_name, a.email, a.profession, a.location, a.primary_platform]
        .filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [apps, query]);

  async function changeStatus(id, status, addNotes = null) {
    try {
      const body = { status };
      if (addNotes !== null) body.notes = addNotes;
      const r = await api.patch(`/applications/${id}`, body);
      setApps(apps.map((a) => (a.id === id ? r.data : a)));
      if (selected?.id === id) setSelected(r.data);
      refresh();
      toast.success(`Status set to ${status}`);
    } catch (e) {
      toast.error("Could not update status.");
    }
  }

  async function deleteApp(id) {
    if (!window.confirm("Delete this application?")) return;
    try {
      await api.delete(`/applications/${id}`);
      setSelected(null);
      refresh();
      toast.success("Application deleted.");
    } catch {
      toast.error("Could not delete.");
    }
  }

  function logout() {
    auth.clear();
    nav("/admin/login");
  }

  async function exportCsv({ filtered }) {
    try {
      const params = {};
      if (filtered) {
        if (filter) params.status = filter;
        if (query.trim()) params.search = query.trim();
      }
      const r = await api.get("/applications/export", { params, responseType: "blob" });
      const blob = new Blob([r.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ts = new Date().toISOString().replace(/[:.]/g, "-");
      const tag = filtered ? "filtered" : "all";
      a.download = `edamen-applications-${tag}-${ts}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Exported ${filtered ? "filtered" : "all"} applications.`);
    } catch (e) {
      toast.error("Export failed.");
    }
  }

  return (
    <div data-testid="admin-dashboard" className="min-h-screen relative">
      <header className="glass hairline sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="display text-[#F5F5F5] text-base tracking-tightest">
              EDAMEN <span className="text-[#A1A1AA]">MEDIA</span>
            </Link>
            <span className="text-[#A1A1AA] text-xs uppercase tracking-[0.28em]">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button data-testid="admin-export-all" onClick={() => exportCsv({ filtered: false })} className="btn-ghost text-xs">
              <Download size={14} /> Export All
            </button>
            <button data-testid="admin-export-filtered" onClick={() => exportCsv({ filtered: true })} className="btn-ghost text-xs">
              <Download size={14} /> Export Filtered
            </button>
            <button data-testid="admin-refresh" onClick={refresh} className="btn-ghost text-xs">
              <RefreshCw size={14} /> Refresh
            </button>
            <button data-testid="admin-logout" onClick={logout} className="btn-ghost text-xs">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-7 gap-px bg-white/5 hairline rounded-2xl overflow-hidden">
          <StatBox label="Total" value={stats.total} />
          {STATUS_OPTIONS.map((s) => (
            <StatBox key={s} label={s} value={stats.by_status?.[s] ?? 0} />
          ))}
        </section>

        {/* Toolbar */}
        <section className="mt-10 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 surface px-4 py-2">
            <Search size={14} className="text-[#A1A1AA]" />
            <input
              data-testid="admin-search"
              placeholder="Search by name, email, role…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent outline-none text-sm text-[#F5F5F5] placeholder-[#52525b] w-72"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterPill label="All" active={!filter} onClick={() => setFilter("")} testid="filter-all" />
            {STATUS_OPTIONS.map((s) => (
              <FilterPill
                key={s}
                label={s}
                active={filter === s}
                onClick={() => setFilter(s === filter ? "" : s)}
                testid={`filter-${s.toLowerCase().replace(/\s+/g, "-")}`}
              />
            ))}
          </div>
        </section>

        {/* Table */}
        <section className="mt-8 surface overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-[#A1A1AA] text-sm">Loading applications…</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-[#A1A1AA] text-sm">No applications yet.</div>
          ) : (
            <table data-testid="apps-table" className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.28em] text-[#A1A1AA] border-b border-white/5">
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Platform</th>
                  <th className="px-6 py-4">Audience</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr
                    key={a.id}
                    data-testid={`row-${a.id}`}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition cursor-pointer"
                    onClick={() => { setSelected(a); setNotes(a.notes || ""); }}
                  >
                    <td className="px-6 py-5">
                      <div className="text-[#F5F5F5] font-medium">{a.full_name}</div>
                      <div className="text-[#A1A1AA] text-xs mt-0.5">{a.email}</div>
                    </td>
                    <td className="px-6 py-5 text-[#F5F5F5]/85">{a.primary_platform || "—"}</td>
                    <td className="px-6 py-5 text-[#F5F5F5]/85">{a.audience_size || "—"}</td>
                    <td className="px-6 py-5 text-[#A1A1AA]">
                      {a.created_at ? new Date(a.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] uppercase tracking-[0.22em] px-2.5 py-1 rounded-full ${STATUS_TONE[a.status] || "bg-white/10"}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        data-testid={`open-${a.id}`}
                        onClick={(e) => { e.stopPropagation(); setSelected(a); setNotes(a.notes || ""); }}
                        className="text-[#A1A1AA] hover:text-white text-xs underline-offset-4 hover:underline"
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>

      {/* Drawer / Modal */}
      {selected && (
        <div className="fixed inset-0 z-40 flex" data-testid="application-drawer">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <aside className="w-full max-w-2xl h-full overflow-y-auto bg-[#0c0c0c] border-l border-white/5">
            <div className="sticky top-0 glass hairline px-6 py-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-[#A1A1AA]">Application</div>
                <div className="display text-[#F5F5F5] text-xl tracking-tightest">{selected.full_name}</div>
              </div>
              <button data-testid="drawer-close" onClick={() => setSelected(null)} className="text-[#A1A1AA] hover:text-white p-2">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    data-testid={`set-status-${s.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => changeStatus(selected.id, s)}
                    className={`text-[10px] uppercase tracking-[0.22em] px-3 py-1.5 rounded-full transition ${
                      selected.status === s
                        ? "bg-white text-[#090909]"
                        : "bg-white/5 text-[#F5F5F5]/80 hover:bg-white/10"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <Detail label="Email" value={selected.email} />
              <Detail label="Phone" value={selected.phone} />
              <Detail label="Location" value={selected.location} />
              <Detail label="What they do" value={selected.profession} />
              <Detail label="Primary platform" value={selected.primary_platform} />

              {Array.isArray(selected.social_profiles) && selected.social_profiles.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-[#A1A1AA]">Social profiles</div>
                  <div className="mt-3 space-y-2">
                    {selected.social_profiles.map((s, i) => (
                      <div key={i} className="text-sm text-[#F5F5F5]/90 border-b border-white/5 pb-2">
                        <span className="text-[#A1A1AA]">{s.platform || "—"}</span> · {s.handle || "—"} · {s.followers || "—"}
                        {s.url && <a href={s.url} target="_blank" rel="noreferrer" className="ml-2 text-blue-300/80 hover:text-blue-200 text-xs">open</a>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Detail label="Audience size" value={selected.audience_size} />
              <Detail label="Audience demographic" value={selected.audience_demographic} long />
              <Detail label="Top geographies" value={selected.top_geographies} />
              <DetailLink label="Analytics" value={selected.analytics_url} />
              <DetailLink label="Media Kit" value={selected.media_kit_url} />
              <DetailLink label="Portfolio" value={selected.portfolio_url} />

              <Detail label="Posting frequency" value={selected.posting_frequency} />
              <Detail label="Content output" value={selected.content_output} />
              <Detail label="Content pillars" value={selected.content_pillars} long />

              <Detail label="Currently monetising" value={selected.currently_monetising} />
              <Detail label="Monthly revenue range" value={selected.monthly_revenue_range} />
              <Detail label="Revenue streams" value={selected.revenue_streams} long />
              <Detail label="Past brand collaborations" value={selected.past_brand_collaborations} long />
              <Detail label="Notable brands" value={selected.notable_brands} />
              <Detail label="Preferred categories" value={selected.preferred_brand_categories} />
              <Detail label="Restricted categories" value={selected.restricted_categories} />
              <Detail label="Exclusivity terms" value={selected.exclusivity_terms} />

              <Detail label="12-month goal" value={selected.twelve_month_goal} long />
              <Detail label="Long-term vision" value={selected.long_term_vision} long />
              <Detail label="Expectations" value={selected.expectations_from_edamen} long />
              <Detail label="Open questions" value={selected.open_questions} long />

              <div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-[#A1A1AA]">Internal notes</div>
                <textarea
                  data-testid="drawer-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="mt-3 w-full bg-transparent border border-white/10 rounded-md p-3 text-sm text-[#F5F5F5] outline-none focus:border-white/30"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    data-testid="drawer-save-notes"
                    onClick={() => changeStatus(selected.id, selected.status, notes)}
                    className="btn-primary"
                  >
                    Save Notes
                  </button>
                  <button
                    data-testid="drawer-delete"
                    onClick={() => deleteApp(selected.id)}
                    className="btn-ghost text-red-300 hover:text-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="bg-[#0c0c0c] px-6 py-5">
      <div className="text-[#A1A1AA] text-[10px] uppercase tracking-[0.22em]">{label}</div>
      <div className="display text-[#F5F5F5] text-2xl tracking-tightest mt-2">{value}</div>
    </div>
  );
}

function FilterPill({ label, active, onClick, testid }) {
  return (
    <button
      data-testid={testid}
      onClick={onClick}
      className={`text-[10px] uppercase tracking-[0.22em] px-3 py-1.5 rounded-full transition ${
        active ? "bg-white text-[#090909]" : "bg-white/5 text-[#F5F5F5]/80 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

function Detail({ label, value, long = false }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.28em] text-[#A1A1AA]">{label}</div>
      <div className={`mt-2 text-[#F5F5F5] ${long ? "text-sm leading-relaxed" : "text-sm"}`}>{value}</div>
    </div>
  );
}

function DetailLink({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.28em] text-[#A1A1AA]">{label}</div>
      <a href={value} target="_blank" rel="noreferrer" className="mt-2 text-sm text-blue-300/90 hover:text-blue-200 underline-offset-4 hover:underline break-all">
        {value}
      </a>
    </div>
  );
}
