import { getUserByUsername, getPublicLinks, isLinkActive, type Link, type UserProfile, type AppearanceSettings } from "@/lib/firebase";
import { notFound } from "next/navigation";
import { ProfileTracker, TrackableLink } from "@/components/ProfileTracker";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

const getThemeClasses = (color: AppearanceSettings['themeColor']) => {
  const themes = {
    indigo: { bg: 'bg-indigo-500', bgGradient: 'from-indigo-500 to-indigo-600', hover: 'hover:border-indigo-200', hoverBg: 'group-hover:bg-indigo-50', text: 'group-hover:text-indigo-600' },
    pink: { bg: 'bg-pink-500', bgGradient: 'from-pink-500 to-pink-600', hover: 'hover:border-pink-200', hoverBg: 'group-hover:bg-pink-50', text: 'group-hover:text-pink-600' },
    green: { bg: 'bg-green-500', bgGradient: 'from-green-500 to-green-600', hover: 'hover:border-green-200', hoverBg: 'group-hover:bg-green-50', text: 'group-hover:text-green-600' },
    orange: { bg: 'bg-orange-500', bgGradient: 'from-orange-500 to-orange-600', hover: 'hover:border-orange-200', hoverBg: 'group-hover:bg-orange-50', text: 'group-hover:text-orange-600' },
    slate: { bg: 'bg-slate-800', bgGradient: 'from-slate-700 to-slate-800', hover: 'hover:border-slate-300', hoverBg: 'group-hover:bg-slate-100', text: 'group-hover:text-slate-800' },
  };
  return themes[color] || themes.indigo;
};

const getButtonStyle = (style: AppearanceSettings['buttonStyle']) => {
  const styles = {
    rounded: 'rounded-2xl',
    pill: 'rounded-full',
    square: 'rounded-none',
  };
  return styles[style] || styles.rounded;
};

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

  const appearance = profile.appearance || { themeColor: 'indigo', buttonStyle: 'rounded' };
  const theme = getThemeClasses(appearance.themeColor);
  const buttonStyle = getButtonStyle(appearance.buttonStyle);

  return (
    <ProfileTracker userId={userId}>
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
              <div className={`w-28 h-28 rounded-full mx-auto mb-6 bg-gradient-to-br ${theme.bgGradient} flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-white`}>
                {appearance.profileIcon || (profile.displayName || username).charAt(0).toUpperCase()}
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
                <TrackableLink
                  key={link.id}
                  userId={userId}
                  linkId={link.id}
                  href={link.url}
                  className="block group animate-slide-in"
                  style={{
                    animationDelay: `${index * 0.08}s`,
                  }}
                >
                  <div className={`bg-white ${buttonStyle} shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 ${theme.hover} p-6`}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {link.icon && (
                          <div className={`w-14 h-14 flex items-center justify-center bg-slate-50 ${buttonStyle} flex-shrink-0 transform group-hover:scale-110 ${theme.hoverBg} transition-all duration-300 text-3xl`}>
                            {link.icon}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-slate-900 text-lg mb-1 truncate ${theme.text} transition-colors`}>
                            {link.title}
                          </h3>
                          <p className="text-sm text-slate-500 truncate font-medium">
                            {new URL(link.url).hostname}
                          </p>
                        </div>
                      </div>
                      <svg
                        className={`w-6 h-6 text-slate-400 ${theme.text} group-hover:translate-x-1 transition-all duration-300 flex-shrink-0`}
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
                </TrackableLink>
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
      </div>
    </ProfileTracker>
  );
}
