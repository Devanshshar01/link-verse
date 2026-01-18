export default function DashboardPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's an overview of your profile.</p>
      </div>
      
      <div className="grid gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-sm p-8 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Your Profile is Live
              </h2>
              <p className="text-indigo-100 text-sm">
                Share your unique link with the world
              </p>
            </div>
            <div className="text-4xl opacity-80">🚀</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-2xl">
                📊
              </div>
              <h3 className="font-semibold text-slate-900">Analytics</h3>
            </div>
            <p className="text-sm text-slate-600">
              Track your profile views and link clicks
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-2xl">
                🔗
              </div>
              <h3 className="font-semibold text-slate-900">Links</h3>
            </div>
            <p className="text-sm text-slate-600">
              Manage and schedule your links
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-2xl">
                🎨
              </div>
              <h3 className="font-semibold text-slate-900">Appearance</h3>
            </div>
            <p className="text-sm text-slate-600">
              Customize your profile look and feel
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-2xl">
                ⚙️
              </div>
              <h3 className="font-semibold text-slate-900">Settings</h3>
            </div>
            <p className="text-sm text-slate-600">
              Update your profile information
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
