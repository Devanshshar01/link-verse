export default function AppearancePage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Appearance</h1>
        <p className="text-slate-600">Customize how your public profile looks</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="space-y-8">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Theme Color</h3>
            <p className="text-sm text-slate-600 mb-4">
              Choose a color theme for your profile
            </p>
            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-xl bg-indigo-500 ring-2 ring-offset-2 ring-indigo-500 hover:scale-110 transition-transform"></button>
              <button className="w-10 h-10 rounded-xl bg-pink-500 hover:ring-2 hover:ring-offset-2 hover:ring-pink-500 hover:scale-110 transition-all"></button>
              <button className="w-10 h-10 rounded-xl bg-green-500 hover:ring-2 hover:ring-offset-2 hover:ring-green-500 hover:scale-110 transition-all"></button>
              <button className="w-10 h-10 rounded-xl bg-orange-500 hover:ring-2 hover:ring-offset-2 hover:ring-orange-500 hover:scale-110 transition-all"></button>
              <button className="w-10 h-10 rounded-xl bg-slate-800 hover:ring-2 hover:ring-offset-2 hover:ring-slate-800 hover:scale-110 transition-all"></button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8">
            <h3 className="font-semibold text-slate-900 mb-2">Button Style</h3>
            <p className="text-sm text-slate-600 mb-4">
              Select how your link buttons appear
            </p>
            <div className="flex gap-3 flex-wrap">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors ring-2 ring-indigo-600 ring-offset-2">Rounded</button>
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors">Pill</button>
              <button className="px-6 py-3 bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">Square</button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8">
            <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <p className="font-medium text-sm mb-1">More customization coming soon</p>
                  <p className="text-xs text-indigo-600">We're working on adding more design options for your profile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
