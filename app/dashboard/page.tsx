"use client";

import { useEffect, useState } from "react";
import { auth, db, subscribeToLinks, subscribeToAnalytics, type Link, type AnalyticsData } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import NextLink from "next/link";

interface UserProfile {
  username?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
}

const formatHour = (hour: number): string => {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
};

const isLinkActive = (link: Link, now: Date): boolean => {
  if (link.activeFrom === undefined || link.activeTo === undefined) {
    return true;
  }
  const currentHour = now.getHours();
  if (link.activeFrom <= link.activeTo) {
    return currentHour >= link.activeFrom && currentHour < link.activeTo;
  }
  return currentHour >= link.activeFrom || currentHour < link.activeTo;
};

const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile>({});
  const [links, setLinks] = useState<Link[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    totalClicks: 0,
    viewHistory: [],
    clickHistory: [],
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showTips, setShowTips] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubLinks = subscribeToLinks(user.uid, (fetchedLinks) => {
      setLinks(fetchedLinks);
    });
    const unsubAnalytics = subscribeToAnalytics(user.uid, (data) => {
      setAnalytics(data);
    });
    return () => {
      unsubLinks();
      unsubAnalytics();
    };
  }, [user]);

  const now = new Date();
  const activeLinks = links.filter((link) => isLinkActive(link, now));
  const scheduledLinks = links.filter(
    (link) => link.activeFrom !== undefined && link.activeTo !== undefined
  );
  const recentLinks = [...links]
    .sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(0);
      const bTime = b.createdAt?.toDate?.() || new Date(0);
      return bTime.getTime() - aTime.getTime();
    })
    .slice(0, 5);

  // Profile completion
  const completionItems = [
    { label: "Set username", done: !!profile.username },
    { label: "Add display name", done: !!profile.displayName },
    { label: "Write a bio", done: !!profile.bio },
    { label: "Add first link", done: links.length > 0 },
    { label: "Add 3+ links", done: links.length >= 3 },
  ];
  const completedCount = completionItems.filter((item) => item.done).length;
  const completionPercent = Math.round((completedCount / completionItems.length) * 100);

  const copyProfileUrl = () => {
    if (profile.username) {
      navigator.clipboard.writeText(`${window.location.origin}/u/${profile.username}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const accountAge = user?.metadata?.creationTime
    ? Math.floor(
        (new Date().getTime() - new Date(user.metadata.creationTime).getTime()) / 86400000
      )
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Welcome back{profile.displayName ? `, ${profile.displayName}` : ""}! 👋
          </h1>
          <p className="text-slate-600">Here's an overview of your profile and links.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyProfileUrl}
            disabled={!profile.username}
            className="btn px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 text-sm disabled:opacity-50"
          >
            {copied ? "✓ Copied!" : "📋 Copy URL"}
          </button>
          {profile.username && (
            <NextLink
              href={`/u/${profile.username}`}
              target="_blank"
              className="btn btn-primary px-4 py-2 text-sm"
            >
              View Profile →
            </NextLink>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm text-slate-500 mb-1">Profile Views</p>
          <p className="text-3xl font-bold text-indigo-600">{analytics.totalViews}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm text-slate-500 mb-1">Link Clicks</p>
          <p className="text-3xl font-bold text-green-600">{analytics.totalClicks}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm text-slate-500 mb-1">Total Links</p>
          <p className="text-3xl font-bold text-slate-900">{links.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm text-slate-500 mb-1">Active Now</p>
          <p className="text-3xl font-bold text-amber-600">{activeLinks.length}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Preview */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                {profile.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold truncate">
                  {profile.displayName || "Set your name"}
                </h2>
                {profile.username ? (
                  <p className="text-indigo-100 text-sm">@{profile.username}</p>
                ) : (
                  <p className="text-indigo-200 text-sm">No username set</p>
                )}
                {profile.bio && (
                  <p className="text-indigo-100 text-sm mt-1 line-clamp-1">{profile.bio}</p>
                )}
              </div>
              <NextLink
                href="/dashboard/settings"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
              >
                Edit Profile
              </NextLink>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <NextLink
                href="/dashboard/links"
                className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-indigo-50 rounded-xl transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center text-2xl transition-colors">
                  ➕
                </div>
                <span className="text-sm font-medium text-slate-700">Add Link</span>
              </NextLink>
              <NextLink
                href="/dashboard/appearance"
                className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-purple-50 rounded-xl transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center text-2xl transition-colors">
                  🎨
                </div>
                <span className="text-sm font-medium text-slate-700">Customize</span>
              </NextLink>
              <NextLink
                href="/dashboard/analytics"
                className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-blue-50 rounded-xl transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center text-2xl transition-colors">
                  📊
                </div>
                <span className="text-sm font-medium text-slate-700">Analytics</span>
              </NextLink>
              <button
                onClick={copyProfileUrl}
                disabled={!profile.username}
                className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-green-50 rounded-xl transition-colors group disabled:opacity-50"
              >
                <div className="w-12 h-12 rounded-xl bg-green-100 group-hover:bg-green-200 flex items-center justify-center text-2xl transition-colors">
                  🔗
                </div>
                <span className="text-sm font-medium text-slate-700">Share</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Recent Links</h3>
              <NextLink
                href="/dashboard/links"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View All →
              </NextLink>
            </div>
            {recentLinks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🔗</div>
                <p className="text-slate-500 text-sm">No links yet</p>
                <NextLink
                  href="/dashboard/links"
                  className="inline-block mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Add your first link →
                </NextLink>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLinks.map((link) => {
                  const isActive = isLinkActive(link, now);
                  const createdAt = link.createdAt?.toDate?.();
                  return (
                    <div
                      key={link.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      {link.icon && (
                        <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg text-xl">
                          {link.icon}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900 truncate">{link.title}</p>
                          {!isActive && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">
                              Scheduled
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 truncate">{link.url}</p>
                      </div>
                      {createdAt && (
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {getRelativeTime(createdAt)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Smart Link Schedule */}
          {scheduledLinks.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">📅 Link Schedule</h3>
              <div className="space-y-3">
                {scheduledLinks.map((link) => {
                  const isActive = isLinkActive(link, now);
                  return (
                    <div
                      key={link.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        isActive
                          ? "bg-green-50 border-green-200"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            isActive ? "bg-green-500 animate-pulse" : "bg-slate-400"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-slate-900">{link.title}</p>
                          <p className="text-sm text-slate-500">
                            {formatHour(link.activeFrom!)} - {formatHour(link.activeTo!)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Profile Strength */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900">Profile Strength</h3>
              <span className="text-sm font-bold text-indigo-600">{completionPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <ul className="space-y-2">
              {completionItems.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      item.done
                        ? "bg-green-100 text-green-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {item.done ? "✓" : "○"}
                  </span>
                  <span className={item.done ? "text-slate-500 line-through" : "text-slate-700"}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tips Card */}
          {showTips && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-amber-900">💡 Pro Tips</h3>
                <button
                  onClick={() => setShowTips(false)}
                  className="text-amber-600 hover:text-amber-800 text-lg leading-none"
                >
                  ×
                </button>
              </div>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Use Smart Links to show different content at different times</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Add emojis to your links to make them stand out</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Keep your bio short and memorable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Share your profile link in your social media bios</span>
                </li>
              </ul>
            </div>
          )}

          {/* Navigation Cards */}
          <div className="space-y-3">
            <NextLink
              href="/dashboard/links"
              className="block bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 group-hover:bg-green-100 flex items-center justify-center text-xl transition-colors">
                  🔗
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">Links</h4>
                  <p className="text-xs text-slate-500">{links.length} links</p>
                </div>
                <span className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
                  →
                </span>
              </div>
            </NextLink>

            <NextLink
              href="/dashboard/appearance"
              className="block bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center text-xl transition-colors">
                  🎨
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">Appearance</h4>
                  <p className="text-xs text-slate-500">Customize style</p>
                </div>
                <span className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
                  →
                </span>
              </div>
            </NextLink>

            <NextLink
              href="/dashboard/analytics"
              className="block bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-xl transition-colors">
                  📊
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">Analytics</h4>
                  <p className="text-xs text-slate-500">View stats</p>
                </div>
                <span className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
                  →
                </span>
              </div>
            </NextLink>

            <NextLink
              href="/dashboard/settings"
              className="block bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-xl transition-colors">
                  ⚙️
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">Settings</h4>
                  <p className="text-xs text-slate-500">Profile info</p>
                </div>
                <span className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
                  →
                </span>
              </div>
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  );
}
