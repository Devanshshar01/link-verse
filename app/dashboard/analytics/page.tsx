"use client";

import { useEffect, useState } from "react";
import { auth, subscribeToAnalytics, type AnalyticsData } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    totalClicks: 0,
    viewHistory: [],
    clickHistory: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const unsubAnalytics = subscribeToAnalytics(user.uid, (data) => {
          setAnalytics(data);
          setLoading(false);
        });
        return () => unsubAnalytics();
      }
      setLoading(false);
    });

    return () => unsubAuth();
  }, []);

  const clickRate = analytics.totalViews > 0 
    ? Math.round((analytics.totalClicks / analytics.totalViews) * 100) 
    : 0;

  // Get last 7 days data
  const last7DaysViews = analytics.viewHistory.slice(-7);
  const last7DaysClicks = analytics.clickHistory.slice(-7);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Analytics</h1>
        <p className="text-slate-600">Track your profile performance and engagement</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl">
            <p className="text-sm text-indigo-600 font-semibold mb-1">Total Views</p>
            <p className="text-4xl font-bold text-indigo-900 mb-1">{analytics.totalViews}</p>
            <p className="text-xs text-indigo-600">All time</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl">
            <p className="text-sm text-green-600 font-semibold mb-1">Link Clicks</p>
            <p className="text-4xl font-bold text-green-900 mb-1">{analytics.totalClicks}</p>
            <p className="text-xs text-green-600">All time</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl">
            <p className="text-sm text-purple-600 font-semibold mb-1">Click Rate</p>
            <p className="text-4xl font-bold text-purple-900 mb-1">{clickRate}%</p>
            <p className="text-xs text-purple-600">Clicks / Views</p>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="font-semibold text-slate-900 mb-4">Last 7 Days Activity</h3>
        {last7DaysViews.length === 0 && last7DaysClicks.length === 0 ? (
          <div className="p-12 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
            <div className="text-4xl mb-3">📈</div>
            <p className="font-medium text-slate-700 mb-1">No activity yet</p>
            <p className="text-sm">Share your profile link to start tracking visits</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-2">Profile Views</p>
              <div className="flex items-end gap-1 h-24">
                {last7DaysViews.map((day, i) => {
                  const maxViews = Math.max(...last7DaysViews.map(d => d.count), 1);
                  const height = (day.count / maxViews) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-indigo-500 rounded-t transition-all duration-300"
                        style={{ height: `${height}%`, minHeight: day.count > 0 ? '4px' : '0' }}
                      />
                      <span className="text-xs text-slate-500 mt-1">{day.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-2">Link Clicks</p>
              <div className="flex items-end gap-1 h-24">
                {last7DaysClicks.map((day, i) => {
                  const maxClicks = Math.max(...last7DaysClicks.map(d => d.count), 1);
                  const height = (day.count / maxClicks) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-green-500 rounded-t transition-all duration-300"
                        style={{ height: `${height}%`, minHeight: day.count > 0 ? '4px' : '0' }}
                      />
                      <span className="text-xs text-slate-500 mt-1">{day.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Activity Log</h3>
        {analytics.viewHistory.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <p className="text-sm">No activity recorded yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...analytics.viewHistory].reverse().slice(0, 10).map((day, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm">
                    👁️
                  </div>
                  <span className="text-sm text-slate-700">{day.date}</span>
                </div>
                <span className="text-sm font-medium text-slate-900">{day.count} views</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
