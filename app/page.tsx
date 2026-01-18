import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              LinkVerse
            </span>
            <div className="flex gap-4">
              <Link href="/login" className="btn btn-ghost">
                Log in
              </Link>
              <Link href="/signup" className="btn btn-primary">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8">
          One link to rule them all.
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          The only link you'll ever need. Connect audiences to all of your content with just one URL. Smart scheduling included.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link href="/signup" className="btn btn-primary px-8 py-4 text-base rounded-full shadow-lg hover:shadow-indigo-500/25">
            Create your LinkVerse
          </Link>
          <a href="#features" className="btn btn-secondary px-8 py-4 text-base rounded-full">
            Learn more
          </a>
        </div>

        {/* Mockup */}
        <div className="relative max-w-sm mx-auto transform hover:scale-[1.02] transition-transform duration-500">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25"></div>
          <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">L</div>
              <div className="text-left">
                <div className="h-4 w-32 bg-slate-100 rounded mb-1"></div>
                <div className="h-3 w-20 bg-slate-50 rounded"></div>
              </div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-slate-50 rounded-lg w-full border border-slate-100"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust */}
      <div className="border-t border-slate-200 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">
            Trusted by creators worldwide
          </p>
          <div className="flex justify-center gap-8 opacity-50 grayscale">
            {/* Simple logo placeholders */}
            <div className="h-8 w-24 bg-slate-300 rounded"></div>
            <div className="h-8 w-24 bg-slate-300 rounded"></div>
            <div className="h-8 w-24 bg-slate-300 rounded"></div>
            <div className="h-8 w-24 bg-slate-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
