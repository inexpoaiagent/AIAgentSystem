import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  ChevronLeft, Users, Search, RefreshCw, Trash2,
  Shield, CheckCircle, XCircle, AlertCircle, Crown, UserCog,
} from "lucide-react";
import { authFetch } from "../lib/api";
import { toast } from "sonner";

interface AdminUser {
  id: string; email: string; name: string; role: string; status: string;
  lastLoginAt: string | null; createdAt: string;
  company: { id: string; name: string; industry: string | null } | null;
}

interface PageData { items: AdminUser[]; total: number; page: number; pages: number }

const ROLE_COLOR: Record<string, string> = {
  SUPER_ADMIN: "bg-red-500/20 text-red-300 border-red-500/30",
  ADMIN: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  OWNER: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  MANAGER: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  MEMBER: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  VIEWER: "bg-gray-500/20 text-gray-400 border-gray-500/20",
};
const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "text-green-400", INACTIVE: "text-gray-500",
  SUSPENDED: "text-red-400", INVITED: "text-yellow-400",
};

export default function AdminUsers() {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) q.set("search", search);
      const res = await authFetch<PageData>(`/admin/users?${q}`);
      setData(res);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await authFetch(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
      toast.success("User updated");
      load();
    } catch (e) { toast.error((e as Error).message); }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user permanently?")) return;
    setDeleting(id);
    try {
      await authFetch(`/admin/users/${id}`, { method: "DELETE" });
      toast.success("User deleted");
      load();
    } catch (e) { toast.error((e as Error).message); }
    finally { setDeleting(null); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/admin"><Button variant="ghost" className="text-white hover:bg-white/10"><ChevronLeft className="w-4 h-4 mr-2" />Admin</Button></Link>
          <div className="flex items-center gap-2"><Users className="w-5 h-5 text-blue-400" /><h1 className="text-xl font-semibold">User Management</h1></div>
          <Button size="sm" variant="ghost" onClick={load} disabled={loading} className="text-gray-400 hover:text-white hover:bg-white/10">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: data?.total ?? "—", icon: Users, color: "text-blue-400" },
            { label: "Active", value: data?.items.filter(u => u.status === "ACTIVE").length ?? "—", icon: CheckCircle, color: "text-green-400" },
            { label: "Suspended", value: data?.items.filter(u => u.status === "SUSPENDED").length ?? "—", icon: XCircle, color: "text-red-400" },
            { label: "Admins", value: data?.items.filter(u => ["ADMIN","OWNER","SUPER_ADMIN"].includes(u.role)).length ?? "—", icon: Crown, color: "text-amber-400" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card className="bg-[#111117]/50 border-white/10 p-5">
                <div className="flex items-center justify-between">
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                  <span className="text-2xl font-bold">{s.value}</span>
                </div>
                <div className="text-xs text-gray-400 mt-2">{s.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Table */}
        <Card className="bg-[#111117]/50 border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {["User", "Company", "Pack", "Role", "Status", "Last Login", "Actions"].map(h => (
                    <th key={h} className="text-left p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && !data ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="p-4"><div className="h-4 bg-white/5 rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                ) : data?.items.map((user) => (
                  <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">{user.company?.name ?? "—"}</td>
                    <td className="p-4">
                      {user.company?.industry ? (
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs capitalize">
                          {user.company.industry.replace("-", " ")}
                        </Badge>
                      ) : <span className="text-gray-500 text-xs">No pack</span>}
                    </td>
                    <td className="p-4">
                      <Badge className={`text-xs ${ROLE_COLOR[user.role] ?? "bg-gray-500/20 text-gray-300"}`}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-medium ${STATUS_COLOR[user.status] ?? "text-gray-400"}`}>
                        ● {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-400">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {user.status === "ACTIVE" ? (
                          <Button size="sm" variant="ghost" onClick={() => updateStatus(user.id, "SUSPENDED")}
                            className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 px-2">
                            <XCircle className="w-3 h-3 mr-1" />Suspend
                          </Button>
                        ) : (
                          <Button size="sm" variant="ghost" onClick={() => updateStatus(user.id, "ACTIVE")}
                            className="text-xs text-green-400 hover:text-green-300 hover:bg-green-500/10 h-7 px-2">
                            <CheckCircle className="w-3 h-3 mr-1" />Activate
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => deleteUser(user.id)} disabled={deleting === user.id}
                          className="text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10 h-7 px-2">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.pages > 1 && (
            <div className="p-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-gray-400">{data.total} users · Page {data.page} of {data.pages}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="border-white/20 text-white hover:bg-white/10 h-7 text-xs">Prev</Button>
                <Button size="sm" variant="outline" onClick={() => setPage(p => Math.min(data.pages, p + 1))} disabled={page === data.pages} className="border-white/20 text-white hover:bg-white/10 h-7 text-xs">Next</Button>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
