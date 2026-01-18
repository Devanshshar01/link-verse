"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, updateProfile, type User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setDisplayName(user.displayName || "");
        
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUsername(data.username || "");
          setBio(data.bio || "");
          if (data.displayName) setDisplayName(data.displayName);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Update Firebase Auth display name
      await updateProfile(user, { displayName });

      // Update Firestore user document
      await setDoc(doc(db, "users", user.uid), {
        username: username.toLowerCase().replace(/[^a-z0-9]/g, ""),
        displayName,
        bio,
      }, { merge: true });

      setMessage({ type: "success", text: "Settings saved successfully!" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to save settings" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Settings</h1>
        <p className="text-slate-600">Manage your account and profile information</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-5">Profile Settings</h2>
        
        <div className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 mt-1.5">Email cannot be changed</p>
          </div>

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-slate-700 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="input-field"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
              Username
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 text-slate-600 text-sm font-medium">
                /u/
              </span>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="yourname"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">This is your public profile URL</p>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1.5">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="input-field resize-none"
              placeholder="Tell visitors about yourself..."
            />
          </div>

          {message.text && (
            <div className={`p-3 rounded-lg text-sm font-medium border ${
              message.type === "success" 
                ? "bg-green-50 text-green-700 border-green-100" 
                : "bg-red-50 text-red-700 border-red-100"
            }`}>
              {message.text}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Public Link</h2>
        {username ? (
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}/u/${username}`}
              readOnly
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 text-sm font-mono"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/u/${username}`);
                setMessage({ type: "success", text: "Link copied!" });
              }}
              className="btn px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 whitespace-nowrap"
            >
              Copy Link
            </button>
          </div>
        ) : (
          <p className="text-slate-500 text-sm bg-slate-50 p-4 rounded-lg">Set a username above to get your public profile link</p>
        )}
      </div>
    </div>
  );
}
