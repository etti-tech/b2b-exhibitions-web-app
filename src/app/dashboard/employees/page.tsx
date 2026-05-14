"use client";

import { useState, useMemo } from "react";
import { mockEmployees } from "@/data/mock-data";
import type { Employee, EmployeeStatus, EmployeeRole } from "@/data/mock-data";

/* ─── Constants ─── */

const PAGE_SIZE = 8;

const DEPARTMENTS = ["All", "Leadership", "Technology", "Sales", "Marketing", "Operations", "Finance", "HR"];

const statusStyles: Record<EmployeeStatus, string> = {
  active:   "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  inactive: "bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400",
  on_leave: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
};

const statusLabel: Record<EmployeeStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  on_leave: "On Leave",
};

const roleStyles: Record<EmployeeRole, string> = {
  admin:       "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
  manager:     "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
  coordinator: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  executive:   "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300",
  intern:      "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
};

const avatarColors = [
  "bg-indigo-500", "bg-emerald-500", "bg-sky-500", "bg-amber-500",
  "bg-violet-500", "bg-rose-500", "bg-teal-500", "bg-orange-500",
];

function avatarColor(id: string) {
  const n = parseInt(id.replace(/\D/g, ""), 10);
  return avatarColors[n % avatarColors.length];
}

/* ─── Empty form state ─── */

const emptyForm = (): Omit<Employee, "id"> => ({
  name: "",
  email: "",
  phone: "",
  avatar: "",
  department: "Technology",
  designation: "",
  role: "executive",
  status: "active",
  joinDate: "",
  location: "Mumbai",
  reportingTo: "",
});

/* ─── Main page ─── */

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);

  // Filters
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | EmployeeStatus>("all");
  const [roleFilter, setRoleFilter] = useState<"all" | EmployeeRole>("all");

  // Pagination
  const [page, setPage] = useState(1);

  // Modals
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Employee | null>(null);
  const [detailTarget, setDetailTarget] = useState<Employee | null>(null);

  // Form
  const [form, setForm] = useState<Omit<Employee, "id">>(emptyForm());
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Employee, string>>>({});

  /* ─── Derived data ─── */

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.designation.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q);
      const matchesDept   = deptFilter === "All"  || e.department === deptFilter;
      const matchesStatus = statusFilter === "all" || e.status === statusFilter;
      const matchesRole   = roleFilter === "all"   || e.role === roleFilter;
      return matchesSearch && matchesDept && matchesStatus && matchesRole;
    });
  }, [employees, search, deptFilter, statusFilter, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const stats = [
    { label: "Total Employees", value: employees.length, color: "text-indigo-600 dark:text-indigo-400" },
    { label: "Active",          value: employees.filter((e) => e.status === "active").length,   color: "text-emerald-600 dark:text-emerald-400" },
    { label: "On Leave",        value: employees.filter((e) => e.status === "on_leave").length, color: "text-amber-600 dark:text-amber-400" },
    { label: "Inactive",        value: employees.filter((e) => e.status === "inactive").length, color: "text-zinc-500 dark:text-zinc-400" },
  ];

  /* ─── Handlers ─── */

  function resetFilters() {
    setSearch(""); setDeptFilter("All"); setStatusFilter("all"); setRoleFilter("all"); setPage(1);
  }

  function openAdd() {
    setForm(emptyForm());
    setFormErrors({});
    setAddOpen(true);
  }

  function openEdit(emp: Employee) {
    setForm({ name: emp.name, email: emp.email, phone: emp.phone, avatar: emp.avatar,
      department: emp.department, designation: emp.designation, role: emp.role,
      status: emp.status, joinDate: emp.joinDate, location: emp.location,
      reportingTo: emp.reportingTo ?? "" });
    setFormErrors({});
    setEditTarget(emp);
  }

  function validateForm(): boolean {
    const errs: Partial<Record<keyof Employee, string>> = {};
    if (!form.name.trim())        errs.name        = "Name is required";
    if (!form.email.trim())       errs.email       = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
    if (!form.designation.trim()) errs.designation = "Designation is required";
    if (!form.joinDate.trim())    errs.joinDate    = "Join date is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleAddSubmit() {
    if (!validateForm()) return;
    const initials = form.name.trim().split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    const newEmp: Employee = {
      ...form,
      id: `EMP-${String(employees.length + 1).padStart(3, "0")}`,
      avatar: initials,
      reportingTo: form.reportingTo || undefined,
    };
    setEmployees((prev) => [newEmp, ...prev]);
    setAddOpen(false);
  }

  function handleEditSubmit() {
    if (!editTarget || !validateForm()) return;
    const initials = form.name.trim().split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === editTarget.id
          ? { ...e, ...form, avatar: initials, reportingTo: form.reportingTo || undefined }
          : e
      )
    );
    setEditTarget(null);
  }

  function handleDeactivate(emp: Employee) {
    setEmployees((prev) =>
      prev.map((e) => e.id === emp.id ? { ...e, status: e.status === "inactive" ? "active" : "inactive" } : e)
    );
    setDeactivateTarget(null);
  }

  function handleDelete(empId: string) {
    setEmployees((prev) => prev.filter((e) => e.id !== empId));
    setDeactivateTarget(null);
  }

  /* ─── Render ─── */

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Employees</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your team — add, edit roles, and track employment status
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Employee
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-52">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, designation…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500"
          />
        </div>

        {/* Department */}
        <select
          value={deptFilter}
          onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as "all" | EmployeeStatus); setPage(1); }}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="on_leave">On Leave</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Role */}
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value as "all" | EmployeeRole); setPage(1); }}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="coordinator">Coordinator</option>
          <option value="executive">Executive</option>
          <option value="intern">Intern</option>
        </select>

        {(search || deptFilter !== "All" || statusFilter !== "all" || roleFilter !== "all") && (
          <button type="button" onClick={resetFilters} className="text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 underline">
            Clear filters
          </button>
        )}

        <span className="ml-auto text-xs text-zinc-400">
          {filtered.length} employee{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {paginated.length === 0 ? (
          <div className="py-16 text-center text-sm text-zinc-400">No employees found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  {["Employee", "Department", "Designation", "Role", "Status", "Joined", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-zinc-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {paginated.map((emp) => (
                  <tr key={emp.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    {/* Employee */}
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setDetailTarget(emp)}
                        className="flex items-center gap-3 text-left"
                      >
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarColor(emp.id)}`}>
                          {emp.avatar}
                        </span>
                        <div>
                          <p className="font-semibold text-zinc-900 hover:text-indigo-600 dark:text-zinc-50 dark:hover:text-indigo-400">{emp.name}</p>
                          <p className="text-xs text-zinc-400">{emp.email}</p>
                        </div>
                      </button>
                    </td>
                    {/* Department */}
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{emp.department}</td>
                    {/* Designation */}
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{emp.designation}</td>
                    {/* Role */}
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${roleStyles[emp.role]}`}>
                        {emp.role}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[emp.status]}`}>
                        {statusLabel[emp.status]}
                      </span>
                    </td>
                    {/* Joined */}
                    <td className="px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">{emp.joinDate}</td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => setDetailTarget(emp)}
                          title="View details"
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-indigo-600 dark:hover:bg-zinc-700 dark:hover:text-indigo-400"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(emp)}
                          title="Edit"
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-sky-600 dark:hover:bg-zinc-700 dark:hover:text-sky-400"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeactivateTarget(emp)}
                          title={emp.status === "inactive" ? "Reactivate" : "Deactivate / Remove"}
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-xs text-zinc-400">
            Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  p === safePage
                    ? "bg-indigo-600 text-white"
                    : "border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ─── Add / Edit Modal ─── */}
      {(addOpen || editTarget) && (
        <EmployeeFormModal
          title={addOpen ? "Add Employee" : "Edit Employee"}
          form={form}
          errors={formErrors}
          employees={employees}
          editId={editTarget?.id}
          onChange={(field, value) => {
            setForm((prev) => ({ ...prev, [field]: value }));
            setFormErrors((prev) => { const next = { ...prev }; delete next[field as keyof Employee]; return next; });
          }}
          onSubmit={addOpen ? handleAddSubmit : handleEditSubmit}
          onClose={() => { setAddOpen(false); setEditTarget(null); }}
        />
      )}

      {/* ─── Deactivate / Delete Confirm ─── */}
      {deactivateTarget && (
        <ConfirmModal
          employee={deactivateTarget}
          onDeactivate={() => handleDeactivate(deactivateTarget)}
          onDelete={() => handleDelete(deactivateTarget.id)}
          onClose={() => setDeactivateTarget(null)}
        />
      )}

      {/* ─── Employee Detail Drawer ─── */}
      {detailTarget && (
        <DetailDrawer
          employee={detailTarget}
          onEdit={() => { openEdit(detailTarget); setDetailTarget(null); }}
          onClose={() => setDetailTarget(null)}
        />
      )}
    </div>
  );
}

/* ─── Employee Form Modal ─── */

function EmployeeFormModal({
  title,
  form,
  errors,
  employees,
  editId,
  onChange,
  onSubmit,
  onClose,
}: {
  title: string;
  form: Omit<Employee, "id">;
  errors: Partial<Record<keyof Employee, string>>;
  employees: Employee[];
  editId?: string;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const managers = employees.filter((e) => (e.role === "admin" || e.role === "manager") && e.id !== editId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Full Name *" error={errors.name}>
              <input value={form.name} onChange={(e) => onChange("name", e.target.value)} placeholder="e.g. Priya Sharma" className={inputCls(!!errors.name)} />
            </FormField>
            <FormField label="Email Address *" error={errors.email}>
              <input type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} placeholder="priya@company.com" className={inputCls(!!errors.email)} />
            </FormField>
            <FormField label="Phone">
              <input value={form.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder="+91 98200 XXXXX" className={inputCls(false)} />
            </FormField>
            <FormField label="Designation *" error={errors.designation}>
              <input value={form.designation} onChange={(e) => onChange("designation", e.target.value)} placeholder="e.g. Senior Sales Executive" className={inputCls(!!errors.designation)} />
            </FormField>
            <FormField label="Department">
              <select value={form.department} onChange={(e) => onChange("department", e.target.value)} className={inputCls(false)}>
                {DEPARTMENTS.filter((d) => d !== "All").map((d) => <option key={d}>{d}</option>)}
              </select>
            </FormField>
            <FormField label="System Role">
              <select value={form.role} onChange={(e) => onChange("role", e.target.value)} className={inputCls(false)}>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="coordinator">Coordinator</option>
                <option value="executive">Executive</option>
                <option value="intern">Intern</option>
              </select>
            </FormField>
            <FormField label="Status">
              <select value={form.status} onChange={(e) => onChange("status", e.target.value)} className={inputCls(false)}>
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </FormField>
            <FormField label="Location">
              <select value={form.location} onChange={(e) => onChange("location", e.target.value)} className={inputCls(false)}>
                {["Mumbai", "Bengaluru", "Delhi NCR", "Chennai", "Hyderabad", "Pune", "Remote"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Join Date *" error={errors.joinDate}>
              <input type="date" value={form.joinDate} onChange={(e) => onChange("joinDate", e.target.value)} className={inputCls(!!errors.joinDate)} />
            </FormField>
            <FormField label="Reporting To">
              <select value={form.reportingTo ?? ""} onChange={(e) => onChange("reportingTo", e.target.value)} className={inputCls(false)}>
                <option value="">— None —</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.name}>{m.name} ({m.designation})</option>
                ))}
              </select>
            </FormField>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <button type="button" onClick={onClose} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800">
            Cancel
          </button>
          <button type="button" onClick={onSubmit} className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
            {title === "Add Employee" ? "Add Employee" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Confirm Modal (deactivate / delete) ─── */

function ConfirmModal({
  employee,
  onDeactivate,
  onDelete,
  onClose,
}: {
  employee: Employee;
  onDeactivate: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const isInactive = employee.status === "inactive";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        <div className="px-6 pt-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h3 className="mt-3 text-base font-bold text-zinc-900 dark:text-zinc-50">Manage {employee.name}</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Choose an action for this employee record.
          </p>
        </div>
        <div className="mt-5 flex flex-col gap-2 px-6 pb-6">
          <button
            type="button"
            onClick={onDeactivate}
            className="w-full rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
          >
            {isInactive ? "Reactivate Employee" : "Deactivate Employee"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="w-full rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
          >
            Remove Permanently
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Detail Drawer ─── */

function DetailDrawer({
  employee,
  onEdit,
  onClose,
}: {
  employee: Employee;
  onEdit: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Employee Profile</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Avatar + name */}
          <div className="flex flex-col items-center text-center">
            <span className={`flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white ${avatarColor(employee.id)}`}>
              {employee.avatar}
            </span>
            <h3 className="mt-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">{employee.name}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{employee.designation}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${roleStyles[employee.role]}`}>
                {employee.role}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[employee.status]}`}>
                {statusLabel[employee.status]}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="mt-6 space-y-3">
            {[
              { label: "Employee ID",  value: employee.id },
              { label: "Department",   value: employee.department },
              { label: "Email",        value: employee.email },
              { label: "Phone",        value: employee.phone },
              { label: "Location",     value: employee.location },
              { label: "Joined",       value: employee.joinDate },
              { label: "Reporting To", value: employee.reportingTo ?? "—" },
            ].map((row) => (
              <div key={row.label} className="flex items-start justify-between gap-4 rounded-lg bg-zinc-50 px-4 py-2.5 dark:bg-zinc-800">
                <span className="text-xs font-semibold text-zinc-400 whitespace-nowrap">{row.label}</span>
                <span className="text-right text-xs font-medium text-zinc-800 dark:text-zinc-200 break-all">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-100 p-5 dark:border-zinc-800">
          <button
            type="button"
            onClick={onEdit}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Edit Profile
          </button>
        </div>
      </aside>
    </>
  );
}

/* ─── Helpers ─── */

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-zinc-500 dark:text-zinc-400">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full rounded-lg border px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-zinc-50 ${
    hasError
      ? "border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-500/10"
      : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
  }`;
}
