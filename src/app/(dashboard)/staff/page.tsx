"use client";

import { useState, useEffect } from "react";
import {
  FiSearch as FiSearchBase,
  FiUserPlus as FiUserPlusBase,
  FiTrash2 as FiTrash2Base,
  FiEdit2 as FiEdit2Base,
  FiShield as FiShieldBase,
  FiX as FiXBase,
} from "react-icons/fi";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";
import Pagination from "@/components/ui/Pagination";
import AdminRouteGuard from "@/components/auth/AdminRouteGuard";
import {
  fetchStaffMembersAction,
  createStaffMemberAction,
  updateStaffMemberAction,
  deleteStaffMemberAction,
} from "@/actions/staff.actions";
import { User } from "@/types/user";
import Button from "@/components/ui/Button";

const FiSearch = FiSearchBase as React.ElementType;
const FiUserPlus = FiUserPlusBase as React.ElementType;
const FiTrash2 = FiTrash2Base as React.ElementType;
const FiEdit2 = FiEdit2Base as React.ElementType;
const FiShield = FiShieldBase as React.ElementType;
const FiX = FiXBase as React.ElementType;

export default function StaffPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Add / Edit Staff Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff" as "staff" | "admin",
  });
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  const loadStaff = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetchStaffMembersAction(page, limit, debouncedSearch, token);
      if (res.success) {
        setStaffList(res.data || []);
        setTotal(res.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Failed to load staff list:", err);
      toast.error("Failed to load staff members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, [page, limit, debouncedSearch]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ name: "", email: "", password: "", role: "staff" });
    setModalError("");
    setIsModalOpen(true);
  };

  const openEditModal = (member: User) => {
    setEditingId(member._id);
    setFormData({
      name: member.name,
      email: member.email,
      password: "",
      role: (member.role as "staff" | "admin") || "staff",
    });
    setModalError("");
    setIsModalOpen(true);
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setModalError("Please fill out name and email address.");
      return;
    }

    if (!editingId && (!formData.password || formData.password.length < 6)) {
      setModalError("Password must be at least 6 characters long.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("accessToken");
      let res;
      if (editingId) {
        res = await updateStaffMemberAction(
          editingId,
          {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            ...(formData.password.trim() ? { password: formData.password } : {}),
          },
          token
        );
      } else {
        res = await createStaffMemberAction(formData, token);
      }

      if (!res.success) {
        setModalError(res.error || "Failed to save staff member");
        return;
      }

      toast.success(editingId ? `Staff account updated!` : `Staff account created for ${formData.name}!`);
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: "", email: "", password: "", role: "staff" });
      loadStaff();
    } catch (err: any) {
      setModalError(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStaff = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from staff?`)) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await deleteStaffMemberAction(id, token);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success(`${name} has been removed.`);
      loadStaff();
    } catch (err) {
      toast.error("Failed to delete staff member");
    }
  };

  return (
    <AdminRouteGuard>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">Staff & Team</h1>
          <p className="text-sm sm:text-base text-stone-500 mt-1">
            Manage staff accounts for product management, inventory, and promotional campaigns.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={openCreateModal}
          leftIcon={<FiUserPlus className="w-4 h-4" />}
        >
          Add Staff Member
        </Button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-stone-200/80 overflow-hidden flex flex-col">
        <div className="p-4.5 border-b border-stone-100 flex flex-col sm:flex-row gap-4 justify-between bg-stone-50/40 shrink-0">
          <div className="relative w-full sm:max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4.5 h-4.5" />
            <input
              type="text"
              placeholder="Search staff by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm font-medium text-stone-900"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-stone-500 bg-stone-100 px-3.5 py-2 rounded-xl">
            <FiShield className="text-brand-600 w-4 h-4" />
            <span>Staff Role: Product & Promotion Access</span>
          </div>
        </div>

        <div className="overflow-auto scroll-smooth max-h-[calc(100vh-390px)] min-h-[250px]">
          <table className="min-w-full divide-y divide-stone-100">
            <thead className="bg-stone-50/95 backdrop-blur-xs sticky top-0 z-10 shadow-2xs">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Staff Member</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Email Address</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Role / Access</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Joined Date</th>
                <th className="px-6 py-4 text-right text-xs font-black text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-stone-400 font-medium">
                    Loading staff members...
                  </td>
                </tr>
              ) : staffList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mb-3 text-xl">
                        👥
                      </div>
                      <p className="text-base font-bold text-stone-900">No staff members found</p>
                      <p className="text-xs text-stone-400 mt-0.5">Click "Add Staff Member" to invite staff.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                staffList.map((member) => (
                  <tr key={member._id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-amber-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                          {member.name?.slice(0, 2).toUpperCase() || "ST"}
                        </div>
                        <span className="text-sm font-bold text-stone-900">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-semibold text-stone-600">
                      {member.email}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                          member.role === "admin"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        <FiShield className="w-3 h-3" />
                        {member.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-medium text-stone-500">
                      {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(member)}
                          className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit staff info"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>

                        {member.role === "admin" || member.email === "admin@kibble.com" ? (
                          <span className="text-[11px] font-extrabold text-stone-400 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200/80 cursor-default select-none ml-1">
                            Protected
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDeleteStaff(member._id, member.name)}
                            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove staff member"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          limit={limit}
          total={total}
          onPageChange={setPage}
          itemLabel="staff members"
        />
      </div>

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  {editingId ? <FiEdit2 className="w-4.5 h-4.5" /> : <FiUserPlus className="w-4.5 h-4.5" />}
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-900">
                    {editingId ? "Edit Staff Member" : "Add Staff Member"}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {editingId ? "Update account profile and permissions" : "Grant product and promotion management access"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded-xl text-xs font-semibold text-rose-700">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex.staff@kibble.com"
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  {editingId ? "New Password (Optional)" : "Initial Password"} {!editingId && <span className="text-rose-500">*</span>}
                </label>
                <input
                  type="password"
                  required={!editingId}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingId ? "Leave blank to keep current password" : "At least 6 characters"}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Access Level / Role
                </label>
                <select
                  value={formData.role}
                  disabled={formData.email === "admin@kibble.com"}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as "staff" | "admin" })}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm font-bold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="staff">Staff Member (Products & Promotions)</option>
                  <option value="admin">Administrator (Full Access)</option>
                </select>
                {formData.email === "admin@kibble.com" && (
                  <p className="text-[11px] font-semibold text-stone-400 mt-1 italic">
                    Super Admin role is locked to preserve primary workspace ownership.
                  </p>
                )}
              </div>

              <div className="pt-4 flex gap-3 justify-end border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-stone-200 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Saving..." : editingId ? "Update Staff Info" : "Create Staff Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </AdminRouteGuard>
  );
}
