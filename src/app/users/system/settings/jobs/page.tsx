"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  fetchDepartments, createDepartment, updateDepartment, deleteDepartment,
  fetchJobTemplates, createJobTemplate, updateJobTemplate, deleteJobTemplate,
  fetchBenefits, createBenefit, updateBenefit, deleteBenefit,
  fetchExternalPublishers, createExternalPublisher, updateExternalPublisher, deleteExternalPublisher
} from "../../../../../services/settingsServices/jobSettingsServices";

type TabId =
  | "departments"
  | "job_templates"
  | "benefits"
  | "external_publishers";

const TABS: { id: TabId; label: string; icon: string; title: string; subtitle: string }[] = [
  { id: "departments", label: "Departments", icon: "domain", title: "Departments", subtitle: "Manage your organization's departments." },
  { id: "job_templates", label: "Job Templates", icon: "description", title: "Job Templates", subtitle: "Define reusable job structures." },
  { id: "benefits", label: "Benefits", icon: "redeem", title: "Benefits", subtitle: "Manage perks and employee benefits." },
  { id: "external_publishers", label: "External Publishers", icon: "campaign", title: "External Publishers", subtitle: "Manage external job board integrations." },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, ease: "easeOut" },
  },
};

const itemVariants: Variants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("departments");
  const [data, setData] = useState<Record<TabId, any[]>>({
    departments: [],
    job_templates: [],
    benefits: [],
    external_publishers: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [deps, templates, bens, pubs] = await Promise.all([
        fetchDepartments(),
        fetchJobTemplates(),
        fetchBenefits(),
        fetchExternalPublishers()
      ]);
      setData({
        departments: deps,
        job_templates: templates,
        benefits: bens,
        external_publishers: pubs,
      });
    } catch (error) {
      console.error("Failed to fetch settings data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditId(item.id);
      setFormData({ ...item });
    } else {
      setEditId(null);
      setFormData({ is_active: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setEditId(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: any) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let savedItem;
      const isNew = !editId;

      if (activeTab === "departments") {
        savedItem = isNew ? await createDepartment(formData) : await updateDepartment(editId!, formData);
      } else if (activeTab === "job_templates") {
        savedItem = isNew ? await createJobTemplate(formData) : await updateJobTemplate(editId!, formData);
      } else if (activeTab === "benefits") {
        savedItem = isNew ? await createBenefit(formData) : await updateBenefit(editId!, formData);
      } else if (activeTab === "external_publishers") {
        savedItem = isNew ? await createExternalPublisher(formData) : await updateExternalPublisher(editId!, formData);
      }

      if (savedItem) {
        const currentTabData = [...data[activeTab]];
        if (isNew) {
          currentTabData.push(savedItem);
        } else {
          const index = currentTabData.findIndex((i) => i.id === editId);
          if (index !== -1) currentTabData[index] = savedItem;
        }

        setData((prev) => ({
          ...prev,
          [activeTab]: currentTabData,
        }));
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this specific record?")) return;
    
    try {
      if (activeTab === "departments") await deleteDepartment(id);
      else if (activeTab === "job_templates") await deleteJobTemplate(id);
      else if (activeTab === "benefits") await deleteBenefit(id);
      else if (activeTab === "external_publishers") await deleteExternalPublisher(id);

      const currentTabData = data[activeTab].filter((i) => i.id !== id);
      setData((prev) => ({ ...prev, [activeTab]: currentTabData }));
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Failed to delete the record.");
    }
  };

  const currentRecords = data[activeTab] || [];
  const activeTabConfig = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="min-h-screen flex flex-col rounded-3xl mesh-gradient no-scrollbar bg-[var(--background)] pb-32">
      <main className="w-full px-4 md:px-8 py-6 md:py-10 max-w-[1400px] mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6">
          <div className="space-y-2">
            <motion.nav
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="flex text-xs font-semibold text-primary items-center gap-2"
            >
              <span className="opacity-60 text-[var(--text-muted)]">System</span>
              <span className="opacity-40 text-[var(--text-muted)]">/</span>
              <span>Settings</span>
            </motion.nav>
            <motion.h1
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-main)]"
            >
              {activeTabConfig.title}
              <span className="text-[var(--text-muted)] ml-3 text-lg font-normal opacity-50">
                {currentRecords.length} records
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="text-sm font-medium text-[var(--text-muted)] mt-2"
            >
              {activeTabConfig.subtitle}
            </motion.p>
          </div>
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-3 w-full sm:w-auto"
          >
            <button
              onClick={() => handleOpenModal()}
              className="flex-1 sm:flex-none active-tab-gradient text-white font-semibold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-premium text-sm"
            >
              <span className="material-symbols-outlined text-xl">add_circle</span>
              Add New
            </button>
          </motion.div>
        </header>

        {/* Tab Navigation */}
        <section className="mb-8 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 pb-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                    : "glass-panel text-[var(--text-muted)] border-[var(--border-subtle)] hover:border-primary/30 hover:text-[var(--text-main)]"
                }`}
              >
                <span className="material-symbols-outlined text-lg opacity-80">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Table Rendering */}
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {isLoading ? (
            <div className="glass-panel rounded-[2.5rem] p-20 text-center border-dashed border-2 border-[var(--border-subtle)] bg-white/5 opacity-80">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-6 shadow-glow"></div>
              <h2 className="text-xl font-bold text-[var(--text-main)] mb-2 animate-pulse tracking-tight">
                Loading Data...
              </h2>
              <p className="text-sm text-[var(--text-muted)] font-medium">Please wait while we fetch the records.</p>
            </div>
          ) : currentRecords.length > 0 ? (
            <div className="glass-panel rounded-[2.5rem] overflow-visible border-[var(--border-subtle)] shadow-sm">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px] overflow-visible">
                  <thead>
                    <tr className="bg-[var(--input-bg)] border-b border-[var(--border-subtle)]">
                      <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-left">
                        Name
                      </th>
                      {(activeTab === "departments" || activeTab === "benefits" || activeTab === "external_publishers") && (
                        <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-left">
                          Description
                        </th>
                      )}
                      {activeTab === "benefits" && (
                        <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-left">
                          Icon URL
                        </th>
                      )}
                      {activeTab !== "benefits" && (
                        <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-center">
                          Status
                        </th>
                      )}
                      <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.map((item) => (
                      <motion.tr
                        key={item.id}
                        variants={itemVariants}
                        whileHover={{ backgroundColor: "rgba(19, 236, 164, 0.02)" }}
                        className="border-b border-[var(--border-subtle)] last:border-0 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-[var(--text-main)] text-sm group-hover:text-primary transition-colors">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-bold text-[var(--text-muted)] tracking-widest">
                              ID: {item.id}
                            </span>
                          </div>
                        </td>
                        {(activeTab === "departments" || activeTab === "benefits" || activeTab === "external_publishers") && (
                          <td className="px-8 py-6">
                            <span className="text-xs font-semibold text-[var(--text-muted)]">
                              {item.description || "—"}
                            </span>
                          </td>
                        )}
                        {activeTab === "benefits" && (
                          <td className="px-8 py-6">
                            <span className="text-xs font-semibold text-[var(--text-muted)]">
                              {item.icon_url || "—"}
                            </span>
                          </td>
                        )}
                        {activeTab !== "benefits" && (
                          <td className="px-8 py-6 text-center">
                            <span
                              className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                item.is_active
                                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                  : "bg-red-500/10 text-red-500 border border-red-500/20"
                              }`}
                            >
                              {item.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                        )}
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenModal(item)}
                              className="text-[var(--text-muted)] hover:text-primary transition-colors p-2"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-[var(--text-muted)] hover:text-red-500 transition-colors p-2"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-[2.5rem] p-20 text-center border-dashed border-2 border-[var(--border-subtle)] bg-white/5">
              <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-glow">
                <span className="material-symbols-outlined text-primary text-5xl">inventory_2</span>
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-main)] mb-3 tracking-tight">
                No Data Found
              </h2>
              <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto mb-10 leading-relaxed font-medium">
                There are currently no records for {activeTabConfig.title.toLowerCase()}. Start by adding a new record.
              </p>
            </div>
          )}
        </motion.div>
      </main>

      {/* Modal / Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel relative w-full max-w-lg rounded-[2.5rem] p-8 border border-[var(--border-subtle)] shadow-2xl z-10 flex flex-col bg-[var(--surface)]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">
                  {editId ? "Edit" : "Add"} {activeTabConfig.title.slice(0, -1)}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-5 flex-1 overflow-y-auto no-scrollbar pb-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    name="name"
                    value={formData.name || ""}
                    onChange={handleFormChange}
                    className="w-full bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl px-4 py-3.5 text-sm text-[var(--text-main)] focus:border-primary/50 focus:ring-0 transition-all font-medium"
                    placeholder="Enter name"
                  />
                </div>

                {(activeTab === "departments" || activeTab === "benefits" || activeTab === "external_publishers") && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description || ""}
                      onChange={handleFormChange}
                      rows={3}
                      className="w-full bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl px-4 py-3.5 text-sm text-[var(--text-main)] focus:border-primary/50 focus:ring-0 transition-all font-medium resize-none"
                      placeholder="Enter description (optional)"
                    />
                  </div>
                )}

                {activeTab === "benefits" && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      Icon Material Name
                    </label>
                    <input
                      name="icon_url"
                      value={formData.icon_url || ""}
                      onChange={handleFormChange}
                      className="w-full bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl px-4 py-3.5 text-sm text-[var(--text-main)] focus:border-primary/50 focus:ring-0 transition-all font-medium"
                      placeholder="e.g. heal, stars, redeem"
                    />
                  </div>
                )}

                {activeTab !== "benefits" && (
                  <div className="flex items-center gap-3 mt-4">
                    <input
                      type="checkbox"
                      name="is_active"
                      id="is_active"
                      checked={formData.is_active ?? true}
                      onChange={handleFormChange}
                      className="w-5 h-5 rounded border-[var(--border-subtle)] text-primary focus:ring-primary/50 bg-[var(--input-bg)]"
                    />
                    <label htmlFor="is_active" className="text-sm font-bold text-[var(--text-main)] cursor-pointer">
                      Is Active
                    </label>
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3.5 rounded-xl font-bold text-sm text-[var(--text-main)] border border-[var(--border-subtle)] hover:bg-[var(--input-bg)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 active-tab-gradient px-6 py-3.5 rounded-xl font-bold text-sm text-white shadow-premium hover:translate-y-[-2px] transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex justify-center items-center gap-2"
                  disabled={!formData.name?.trim() || isSaving}
                >
                  {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                  {isSaving ? "Saving..." : editId ? "Save Changes" : "Create"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
