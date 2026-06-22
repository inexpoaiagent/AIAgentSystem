import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  ChevronLeft, Tag, Plus, Pencil, Trash2, RefreshCw,
  Check, X, ToggleLeft, ToggleRight, Building2,
} from "lucide-react";
import { authFetch } from "../lib/api";
import { toast } from "sonner";

interface Category {
  id: string; name: string; slug: string; description: string | null;
  icon: string | null; isActive: boolean; sortOrder: number;
  createdAt: string; _count: { companies: number };
}

const EMPTY_FORM = { name: "", slug: "", description: "", icon: "", sortOrder: 0 };

export default function AdminCategories() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch<Category[]>("/admin/categories");
      setCats(res);
    } catch (e) { toast.error((e as Error).message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (cat: Category) => {
    setEditing(cat);
    setCreating(false);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? "", icon: cat.icon ?? "", sortOrder: cat.sortOrder });
  };

  const startCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const cancel = () => { setEditing(null); setCreating(false); setForm(EMPTY_FORM); };

  const slugify = (name: string) =>
    name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const save = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.slug.trim()) return toast.error("Slug is required");
    setSaving(true);
    try {
      if (editing) {
        await authFetch(`/admin/categories/${editing.id}`, { method: "PUT", body: JSON.stringify(form) });
        toast.success("Category updated");
      } else {
        await authFetch("/admin/categories", { method: "POST", body: JSON.stringify(form) });
        toast.success("Category created");
      }
      cancel();
      load();
    } catch (e) { toast.error((e as Error).message); }
    finally { setSaving(false); }
  };

  const toggleActive = async (cat: Category) => {
    try {
      await authFetch(`/admin/categories/${cat.id}`, { method: "PUT", body: JSON.stringify({ isActive: !cat.isActive }) });
      toast.success(cat.isActive ? "Category deactivated" : "Category activated");
      load();
    } catch (e) { toast.error((e as Error).message); }
  };

  const deleteCat = async (id: string) => {
    if (!confirm("Delete this category? Companies using it will be unlinked.")) return;
    setDeleting(id);
    try {
      await authFetch(`/admin/categories/${id}`, { method: "DELETE" });
      toast.success("Category deleted");
      load();
    } catch (e) { toast.error((e as Error).message); }
    finally { setDeleting(null); }
  };

  const showForm = editing !== null || creating;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/admin"><Button variant="ghost" className="text-white hover:bg-white/10"><ChevronLeft className="w-4 h-4 mr-2" />Admin</Button></Link>
          <div className="flex items-center gap-2"><Tag className="w-5 h-5 text-green-400" /><h1 className="text-xl font-semibold">Business Categories</h1></div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={load} disabled={loading} className="text-gray-400 hover:text-white hover:bg-white/10">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button size="sm" onClick={startCreate} className="bg-green-600 hover:bg-green-700 text-white border-0 h-8 px-3 text-sm">
              <Plus className="w-3.5 h-3.5 mr-1" /> New Category
            </Button>
          </div>
        </div>
      </nav>

      <main className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-[#111117]/50 border-white/10 p-5">
            <div className="flex items-center justify-between"><Tag className="w-6 h-6 text-green-400" /><span className="text-2xl font-bold">{cats.length}</span></div>
            <div className="text-xs text-gray-400 mt-2">Total Categories</div>
          </Card>
          <Card className="bg-[#111117]/50 border-white/10 p-5">
            <div className="flex items-center justify-between"><Check className="w-6 h-6 text-blue-400" /><span className="text-2xl font-bold">{cats.filter(c => c.isActive).length}</span></div>
            <div className="text-xs text-gray-400 mt-2">Active</div>
          </Card>
          <Card className="bg-[#111117]/50 border-white/10 p-5">
            <div className="flex items-center justify-between"><Building2 className="w-6 h-6 text-purple-400" /><span className="text-2xl font-bold">{cats.reduce((s, c) => s + c._count.companies, 0)}</span></div>
            <div className="text-xs text-gray-400 mt-2">Companies Linked</div>
          </Card>
        </div>

        {/* Create / Edit form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="bg-[#111117]/50 border-green-500/30 p-6">
                <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                  {creating ? <><Plus className="w-4 h-4 text-green-400" /> New Category</> : <><Pencil className="w-4 h-4 text-blue-400" /> Edit Category</>}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400">Category Name *</label>
                    <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value, slug: creating ? slugify(e.target.value) : f.slug }))}
                      placeholder="e.g. Real Estate & Property"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400">Slug * (URL-safe)</label>
                    <Input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: slugify(e.target.value) }))}
                      placeholder="e.g. real-estate"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400">Icon (emoji)</label>
                    <Input value={form.icon} onChange={(e) => setForm(f => ({ ...f, icon: e.target.value }))}
                      placeholder="🏠" maxLength={4}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-2xl w-20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400">Sort Order</label>
                    <Input type="number" value={form.sortOrder} onChange={(e) => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
                      className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs text-gray-400">Description</label>
                    <Input value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Brief description of this business category..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={save} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white border-0">
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span className="ml-2">{saving ? "Saving..." : "Save"}</span>
                  </Button>
                  <Button variant="ghost" onClick={cancel} className="text-gray-400 hover:text-white hover:bg-white/10">
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories list */}
        <div className="space-y-2">
          {loading && cats.length === 0 ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
            ))
          ) : cats.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className={`bg-[#111117]/50 border-white/10 p-4 hover:border-white/20 transition-all ${!cat.isActive ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-4">
                  {/* Icon + order */}
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
                    {cat.icon || "🏢"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold">{cat.name}</span>
                      {!cat.isActive && <Badge className="text-xs bg-gray-500/20 text-gray-400 border-gray-500/20">Inactive</Badge>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="font-mono bg-white/5 px-1.5 py-0.5 rounded">{cat.slug}</span>
                      {cat.description && <span className="line-clamp-1 hidden sm:block">{cat.description}</span>}
                    </div>
                  </div>

                  {/* Company count */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="font-semibold text-white">{cat._count.companies}</span>
                    <span>companies</span>
                  </div>

                  {/* Sort order badge */}
                  <span className="text-xs text-gray-500 w-6 text-center shrink-0">#{cat.sortOrder}</span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => toggleActive(cat)}
                      className={`h-7 w-7 p-0 ${cat.isActive ? 'text-green-400 hover:text-green-300' : 'text-gray-500 hover:text-gray-300'} hover:bg-white/10`}>
                      {cat.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => startEdit(cat)}
                      className="h-7 w-7 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteCat(cat.id)} disabled={deleting === cat.id}
                      className="h-7 w-7 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {cats.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-500">
            <Tag className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg mb-2">No categories yet</p>
            <p className="text-sm">Click "New Category" to add the first one</p>
          </div>
        )}
      </main>
    </div>
  );
}
