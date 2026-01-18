import { getUserByUsername, getPublicLinks, isLinkActive, type Link, type UserProfile } from "@/lib/firebase";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  
  const userData = await getUserByUsername(username);

  if (!userData) {
    notFound();
  }

  const { userId, profile } = userData;
  const allLinks = await getPublicLinks(userId);
  
  const now = new Date();
  const links = allLinks.filter(link => isLinkActive(link, now));

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-12 animate-fade-in">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.displayName || username}
              className="w-28 h-28 rounded-full mx-auto mb-6 shadow-lg ring-4 ring-white"
            />
          ) : (
            <div className="w-28 h-28 rounded-full mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-white">
              {(profile.displayName || username).charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            {profile.displayName || `@${username}`}
          </h1>
          {profile.displayName && (
            <p className="text-slate-500 text-base font-medium mb-4">@{username}</p>
          )}
          {profile.bio && (
            <p className="text-slate-600 text-lg max-w-md mx-auto leading-relaxed">{profile.bio}</p>
          )}
        </div>

        {/* Links */}
        {links.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔗</div>
            <p className="text-slate-500 text-lg">No links available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {links.map((link, index) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
                style={{
                  animation: `slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s both`,
                }}
              >
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 hover:border-indigo-200 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {link.icon && (
                        <div className="w-14 h-14 flex items-center justify-center bg-slate-50 rounded-xl flex-shrink-0 transform group-hover:scale-110 group-hover:bg-indigo-50 transition-all duration-300 text-3xl">
                          {link.icon}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-lg mb-1 truncate group-hover:text-indigo-600 transition-colors">
                          {link.title}
                        </h3>
                        <p className="text-sm text-slate-500 truncate font-medium">
                          {new URL(link.url).hostname}
                        </p>
                      </div>
                    </div>
                    <svg
                      className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-sm text-slate-400 font-medium">
            Powered by <span className="text-slate-600 font-semibold">Hmmm</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
