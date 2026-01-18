export default function AnalyticsPage() {
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
            <p className="text-4xl font-bold text-indigo-900 mb-1">0</p>
            <p className="text-xs text-indigo-600">All time</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl">
            <p className="text-sm text-green-600 font-semibold mb-1">Link Clicks</p>
            <p className="text-4xl font-bold text-green-900 mb-1">0</p>
            <p className="text-xs text-green-600">All time</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl">
            <p className="text-sm text-purple-600 font-semibold mb-1">Click Rate</p>
            <p className="text-4xl font-bold text-purple-900 mb-1">0%</p>
            <p className="text-xs text-purple-600">Clicks / Views</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
        <div className="p-12 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
          <div className="text-4xl mb-3">📈</div>
          <p className="font-medium text-slate-700 mb-1">No activity yet</p>
          <p className="text-sm">Share your profile link to start tracking visits</p>
        </div>
        <div className="mt-6 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <p className="font-medium text-sm mb-1">Detailed analytics coming soon</p>
              <p className="text-xs text-indigo-600">We're building advanced analytics features for your profile</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
