"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

const sidebarItems = [
  { name: "My Page", href: "/dashboard", icon: "📄" },
  { name: "Links", href: "/dashboard/links", icon: "🔗" },
  { name: "Appearance", href: "/dashboard/appearance", icon: "🎨" },
  { name: "Analytics", href: "/dashboard/analytics", icon: "📊" },
  { name: "Settings", href: "/dashboard/settings", icon: "⚙️" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-50">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              H
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">Hmmm</span>
          </Link>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
               {user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.displayName || "User"}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 overflow-y-auto">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-slate-100 text-slate-900 font-medium shadow-sm ring-1 ring-slate-200"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className={`mr-3 text-lg transition-transform group-hover:scale-110 ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2.5 flex items-center justify-center gap-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm font-medium border border-transparent hover:border-red-100"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="max-w-5xl mx-auto p-8 lg:p-12">
            {children}
        </div>
      </main>
    </div>
  );
}
