import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  ChevronLeft, Layers, RefreshCw, Plus, Pencil, Trash2,
  Check, X, ToggleLeft, ToggleRight, Bot, Eye,
} from "lucide-react";
import { authFetch } from "../lib/api";
import { type Pack } from "../hooks/usePacks";
import { toast } from "sonner";

const EMPTY: Partial<Pack> = {
  slug: "", name: "", emoji: "🏢", tagline: "", valueProposition: "",
  tier: "professional", price: 299, color: "#3b82f6",
  gradientFrom: "#1e40af", gradientTo: "#7c3aed", sortOrder: 0,
  isActive: true,
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function AdminIndustryPacks() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Pack | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Partial<Pack>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await authFetch<Pack[]>("/admin/packs");
      setPacks(data.map(parsePack));
    } catch (e) { toast.error((e as Error).message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function parsePack(p: any): Pack {
    const j = (v: any) => {
      if (typeof v === "string") { try { return JSON.parse(v); } catch { return []; } }
      return v ?? [];
    };
    return { ...p, targetCustomers: j(p.targetCustomers), painPoints: j(p.painPoints), agents: j(p.agents), outcomes: j(p.outcomes), kpis: j(p.kpis) };
  }

  const startEdit = (pack: Pack) => {
    setEditing(pack); setCreating(false);
    setForm({ slug: pack.slug, name: pack.name, emoji: pack.emoji, tagline: pack.tagline,
      valueProposition: pack.valueProposition, tier: pack.tier, price: pack.price,
      color: pack.color, gradientFrom: pack.gradientFrom, gradientTo: pack.gradientTo,
      sortOrder: pack.sortOrder, isActive: pack.isActive });
  };
  const startCreate = () => { setCreating(true); setEditing(null); setForm({ ...EMPTY }); };
  const cancel = () => { setEditing(null); setCreating(false); setForm(EMPTY); };

  const save = async () => {
    if (!form.name?.trim() || !form.slug?.trim()) return toast.error("Name and slug required");
    setSaving(true);
    try {
      if (editing) {
        await authFetch(`/admin/packs/${editing.id}`, { method: "PUT", body: JSON.stringify(form) });
        toast.success("Pack updated");
      } else {
        await authFetch("/admin/packs", { method: "POST", body: JSON.stringify(form) });
        toast.success("Pack created");
      }
      cancel(); load();
    } catch (e) { toast.error((e as Error).message); }
    finally { setSaving(false); }
  };

  const toggleActive = async (pack: Pack) => {
    try {
      await authFetch(`/admin/packs/${pack.id}`, { method: "PUT", body: JSON.stringify({ isActive: !pack.isActive }) });
      toast.success(pack.isActive ? "Pack deactivated" : "Pack activated");
      load();
    } catch (e) { toast.error((e as Error).message); }
  };

  const deletePack = async (id: string) => {
    if (!confirm("Delete this industry pack? Companies using it will lose their pack assignment.")) return;
    setDeleting(id);
    try {
      await authFetch(`/admin/packs/${id}`, { method: "DELETE" });
      toast.success("Pack deleted"); load();
    } catch (e) { toast.error((e as Error).message); }
    finally { setDeleting(null); }
  };

  const f = (key: keyof typeof form, val: any) => setForm(p => ({ ...p, [key]: val }));
  const showForm = editing !== null || creating;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/admin"><Button variant="ghost" className="text-white hover:bg-white/10"><ChevronLeft className="w-4 h-4 mr-2" />Admin</Button></Link>
          <div className="flex items-center gap-2"><Layers className="w-5 h-5 text-teal-400" /><h1 className="text-xl font-semibold">Industry Pack Manager</h1></div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={load} disabled={loading} className="text-gray-400 hover:text-white hover:bg-white/10">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button size="sm" onClick={startCreate} className="bg-teal-600 hover:bg-teal-700 text-white border-0 h-8 px-3 text-sm">
              <Plus className="w-3.5 h-3.5 mr-1" /> New Pack
            </Button>
          </div>
        </div>
      </nav>

      <main className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Packs", value: packs.length, color: "text-teal-400" },
            { label: "Active", value: packs.filter(p => p.isActive).length, color: "text-green-400" },
            { label: "Pro Tier", value: packs.filter(p => p.tier === "professional").length, color: "text-blue-400" },
            { label: "Gold Tier", value: packs.filter(p => p.tier === "gold").length, color: "text-amber-400" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card className="bg-[#111117]/50 border-white/10 p-5">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-400 mt-1">{s.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="bg-[#111117]/50 border-teal-500/30 p-6">
                <h2 className="text-lg font-semibold mb-5">
                  {creating ? "➕ New Industry Pack" : `✏️ Edit: ${editing?.name}`}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400">Pack Name *</label>
                    <Input value={form.name ?? ""} onChange={e => f("name", e.target.value)}
                      placeholder="e.g. Real Estate" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400">Slug * (URL-safe)</label>
                    <Input value={form.slug ?? ""} onChange={e => f("slug", slugify(e.target.value))}
                      placeholder="e.g. real-estate" className="bg-white/5 border-white/10 text-white font-mono placeholder:text-gray-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400">Emoji</label>
                    <Input value={form.emoji ?? ""} onChange={e => f("emoji", e.target.value)}
                      placeholder="🏠" maxLength={4} className="bg-white/5 border-white/10 text-white text-2xl w-20" />
                  </div>
                  <div className="lg:col-span-2 space-y-1.5">
                    <label className="text-xs text-gray-400">Tagline</label>
                    <Input value={form.tagline ?? ""} onChange={e => f("tagline", e.target.value)}
                      placeholder="Your AI Real Estate Sales Force" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400">Tier</label>
                    <select value={form.tier ?? "professional"} onChange={e => f("tier", e.target.value)}
                      className="w-full h-10 rounded-md bg-white/5 border border-white/10 text-white px-3 text-sm outline-none">
                      <option value="professional" className="bg-[#111117]">Professional</option>
                      <option value="gold" className="bg-[#111117]">Gold</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400">Price ($/month)</label>
                    <Input type="number" value={form.price ?? 299} onChange={e => f("price", Number(e.target.value))}
                      className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400">Sort Order</label>
                    <Input type="number" value={form.sortOrder ?? 0} onChange={e => f("sortOrder", Number(e.target.value))}
                      className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400">Brand Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={form.color ?? "#3b82f6"} onChange={e => f("color", e.target.value)} className="h-10 w-14 rounded cursor-pointer bg-transparent border-0" />
                      <Input value={form.color ?? ""} onChange={e => f("color", e.target.value)} className="bg-white/5 border-white/10 text-white font-mono text-xs flex-1" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400">Gradient From</label>
                    <div className="flex gap-2">
                      <input type="color" value={form.gradientFrom ?? "#1e40af"} onChange={e => f("gradientFrom", e.target.value)} className="h-10 w-14 rounded cursor-pointer bg-transparent border-0" />
                      <Input value={form.gradientFrom ?? ""} onChange={e => f("gradientFrom", e.target.value)} className="bg-white/5 border-white/10 text-white font-mono text-xs flex-1" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400">Gradient To</label>
                    <div className="flex gap-2">
                      <input type="color" value={form.gradientTo ?? "#7c3aed"} onChange={e => f("gradientTo", e.target.value)} className="h-10 w-14 rounded cursor-pointer bg-transparent border-0" />
                      <Input value={form.gradientTo ?? ""} onChange={e => f("gradientTo", e.target.value)} className="bg-white/5 border-white/10 text-white font-mono text-xs flex-1" />
                    </div>
                  </div>
                </div>

                {/* Color preview */}
                <div className="mb-5 h-12 rounded-xl flex items-center justify-center text-white font-semibold"
                  style={{ background: `linear-gradient(135deg, ${form.gradientFrom ?? "#1e40af"}, ${form.gradientTo ?? "#7c3aed"})` }}>
                  {form.emoji} {form.name || "Pack Preview"}
                </div>

                <div className="flex gap-3">
                  <Button onClick={save} disabled={saving} className="bg-teal-600 hover:bg-teal-700 text-white border-0">
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                    {saving ? "Saving..." : "Save Pack"}
                  </Button>
                  <Button variant="ghost" onClick={cancel} className="text-gray-400 hover:text-white hover:bg-white/10">
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Packs list */}
        <div className="space-y-3">
          {loading && packs.length === 0 ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
            ))
          ) : packs.map((pack, i) => (
            <motion.div key={pack.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`bg-[#111117]/50 border-white/10 overflow-hidden hover:border-white/20 transition-all ${!pack.isActive ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-4 p-4">
                  {/* Color bar */}
                  <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: pack.color }} />

                  {/* Emoji */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: `${pack.color}22` }}>
                    {pack.emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-semibold">{pack.name}</span>
                      <Badge className="text-xs" style={{ background: `${pack.color}22`, color: pack.color, borderColor: `${pack.color}44` }}>
                        {pack.tier === "gold" ? "Gold" : "Pro"}
                      </Badge>
                      {!pack.isActive && <Badge className="text-xs bg-gray-500/20 text-gray-400 border-gray-500/20">Inactive</Badge>}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">{pack.slug} · ${pack.price}/mo · {pack.agents?.length ?? 0} agents</div>
                  </div>

                  {/* Usage */}
                  <div className="text-center shrink-0 hidden sm:block">
                    <div className="text-lg font-bold" style={{ color: pack.color }}>{pack._count?.companies ?? 0}</div>
                    <div className="text-xs text-gray-500">companies</div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => toggleActive(pack)}
                      className={`h-7 w-7 p-0 ${pack.isActive ? 'text-green-400 hover:text-green-300' : 'text-gray-500 hover:text-gray-300'} hover:bg-white/10`}>
                      {pack.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    </Button>
                    <Link to={`/industry/${pack.slug}`} target="_blank">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-white/10">
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    <Button size="sm" variant="ghost" onClick={() => startEdit(pack)}
                      className="h-7 w-7 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deletePack(pack.id)} disabled={deleting === pack.id}
                      className="h-7 w-7 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {packs.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-500">
            <Layers className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg mb-2">No industry packs yet</p>
            <Button onClick={startCreate} className="bg-teal-600 hover:bg-teal-700 text-white border-0 mt-3">
              <Plus className="w-4 h-4 mr-2" /> Create First Pack
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
