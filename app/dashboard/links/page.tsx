"use client";

import { useEffect, useState } from "react";
import { auth, addLink, updateLink, deleteLink, subscribeToLinks, type Link } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const formatHour = (hour: number): string => {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
};

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [formData, setFormData] = useState({ 
    title: "", 
    url: "", 
    icon: "",
    activeFrom: undefined as number | undefined,
    activeTo: undefined as number | undefined,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToLinks(userId, (fetchedLinks) => {
      setLinks(fetchedLinks);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !formData.title || !formData.url) return;

    setLoading(true);
    setError("");

    try {
      const linkData = {
        title: formData.title,
        url: formData.url,
        icon: formData.icon || undefined,
        activeFrom: formData.activeFrom,
        activeTo: formData.activeTo,
      };

      if (editingId) {
        await updateLink(userId, editingId, linkData);
      } else {
        await addLink(userId, linkData);
      }
      setFormData({ title: "", url: "", icon: "", activeFrom: undefined, activeTo: undefined });
      setEditingId(null);
    } catch (err) {
      setError("Failed to save link");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (link: Link) => {
    setFormData({ 
      title: link.title, 
      url: link.url, 
      icon: link.icon || "",
      activeFrom: link.activeFrom,
      activeTo: link.activeTo,
    });
    setEditingId(link.id);
  };

  const handleDelete = async (linkId: string) => {
    if (!userId || !confirm("Are you sure you want to delete this link?")) return;

    try {
      await deleteLink(userId, linkId);
    } catch (err) {
      setError("Failed to delete link");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setFormData({ title: "", url: "", icon: "", activeFrom: undefined, activeTo: undefined });
    setEditingId(null);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Links</h1>
        <p className="text-slate-600">Manage your links and set smart schedules</p>
      </div>

      {/* Add/Edit Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          {editingId ? "Edit Link" : "Add New Link"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">
              Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="My Website"
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-1.5">
              URL *
            </label>
            <input
              type="url"
              id="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="input-field"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-slate-700 mb-1.5">
              Icon (emoji or short text)
            </label>
            <input
              type="text"
              id="icon"
              maxLength={5}
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="input-field"
              placeholder="🔗"
            />
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Smart Link Schedule (Optional)</h3>
            <p className="text-xs text-slate-600 mb-3">
              Set active hours to control when this link is visible on your public page
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="activeFrom" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Visible From
                </label>
                <select
                  id="activeFrom"
                  value={formData.activeFrom ?? ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    activeFrom: e.target.value === "" ? undefined : parseInt(e.target.value)
                  })}
                  className="input-field"
                >
                  <option value="">Always visible</option>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {formatHour(i)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="activeTo" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Visible Until
                </label>
                <select
                  id="activeTo"
                  value={formData.activeTo ?? ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    activeTo: e.target.value === "" ? undefined : parseInt(e.target.value)
                  })}
                  className="input-field"
                >
                  <option value="">Always visible</option>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {formatHour(i)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {formData.activeFrom !== undefined && formData.activeTo !== undefined && (
              <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg">
                {formData.activeFrom === formData.activeTo 
                  ? "⚠️ Same start and end time means always visible"
                  : formData.activeFrom > formData.activeTo
                  ? `✓ Visible overnight from ${formatHour(formData.activeFrom)} to ${formatHour(formData.activeTo)}`
                  : `✓ Visible from ${formatHour(formData.activeFrom)} to ${formatHour(formData.activeTo)}`
                }
              </p>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Saving..." : editingId ? "Update Link" : "Add Link"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="btn px-6 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 border-0"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Links List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Your Links</h2>
          <p className="text-sm text-slate-600 mt-0.5">
            {links.length} {links.length === 1 ? "link" : "links"}
          </p>
        </div>

        {links.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="text-4xl mb-3">🔗</div>
            <p className="text-sm">No links yet. Add your first link above!</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {links.map((link) => (
              <li key={link.id} className="p-5 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {link.icon && (
                      <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-xl text-2xl flex-shrink-0 group-hover:bg-indigo-50 transition-colors">{link.icon}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {link.title}
                        </h3>
                        {link.activeFrom !== undefined && link.activeTo !== undefined && (
                          <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-medium whitespace-nowrap">
                            {formatHour(link.activeFrom)} - {formatHour(link.activeTo)}
                          </span>
                        )}
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-500 hover:text-indigo-600 truncate block transition-colors"
                      >
                        {link.url}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(link)}
                      className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
