"use client";

import { useEffect, useState } from "react";
import { auth, db, updateAppearance, type AppearanceSettings } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const themeColors = [
  { id: 'indigo', bg: 'bg-indigo-500', ring: 'ring-indigo-500', label: 'Indigo' },
  { id: 'pink', bg: 'bg-pink-500', ring: 'ring-pink-500', label: 'Pink' },
  { id: 'green', bg: 'bg-green-500', ring: 'ring-green-500', label: 'Green' },
  { id: 'orange', bg: 'bg-orange-500', ring: 'ring-orange-500', label: 'Orange' },
  { id: 'slate', bg: 'bg-slate-800', ring: 'ring-slate-800', label: 'Dark' },
] as const;

const buttonStyles = [
  { id: 'rounded', label: 'Rounded', className: 'rounded-lg' },
  { id: 'pill', label: 'Pill', className: 'rounded-full' },
  { id: 'square', label: 'Square', className: 'rounded-none' },
] as const;

const profileIcons = ['👤', '🚀', '💼', '🎨', '🎵', '📸', '💻', '🎮', '📚', '✨', '🌟', '⚡'];

export default function AppearancePage() {
  const [user, setUser] = useState<User | null>(null);
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    themeColor: 'indigo',
    buttonStyle: 'rounded',
    profileIcon: undefined,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.appearance) {
              setAppearance({
                themeColor: data.appearance.themeColor || 'indigo',
                buttonStyle: data.appearance.buttonStyle || 'rounded',
                profileIcon: data.appearance.profileIcon,
              });
            }
          }
        } catch (error) {
          console.error("Error loading appearance:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await updateAppearance(user.uid, appearance);
      setMessage({ type: 'success', text: 'Appearance settings saved!' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to save appearance settings' });
    } finally {
      setSaving(false);
    }
  };

  const selectedColor = themeColors.find(c => c.id === appearance.themeColor) || themeColors[0];
  const selectedStyle = buttonStyles.find(s => s.id === appearance.buttonStyle) || buttonStyles[0];

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
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Appearance</h1>
        <p className="text-slate-600">Customize how your public profile looks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="space-y-8">
            {/* Theme Color */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Theme Color</h3>
              <p className="text-sm text-slate-600 mb-4">
                Choose a color theme for your profile
              </p>
              <div className="flex gap-3 flex-wrap">
                {themeColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setAppearance({ ...appearance, themeColor: color.id })}
                    className={`w-10 h-10 rounded-xl ${color.bg} hover:scale-110 transition-transform ${
                      appearance.themeColor === color.id 
                        ? `ring-2 ring-offset-2 ${color.ring}` 
                        : ''
                    }`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            {/* Button Style */}
            <div className="border-t border-slate-100 pt-8">
              <h3 className="font-semibold text-slate-900 mb-2">Button Style</h3>
              <p className="text-sm text-slate-600 mb-4">
                Select how your link buttons appear
              </p>
              <div className="flex gap-3 flex-wrap">
                {buttonStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setAppearance({ ...appearance, buttonStyle: style.id })}
                    className={`px-6 py-3 ${selectedColor.bg} text-white ${style.className} text-sm font-medium hover:opacity-90 transition-all ${
                      appearance.buttonStyle === style.id 
                        ? `ring-2 ring-offset-2 ${selectedColor.ring}` 
                        : ''
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Icon */}
            <div className="border-t border-slate-100 pt-8">
              <h3 className="font-semibold text-slate-900 mb-2">Profile Icon</h3>
              <p className="text-sm text-slate-600 mb-4">
                Choose an icon to display on your profile (optional)
              </p>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setAppearance({ ...appearance, profileIcon: undefined })}
                  className={`w-12 h-12 rounded-xl border-2 text-sm font-medium transition-all ${
                    !appearance.profileIcon
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                      : 'border-slate-200 text-slate-400 hover:border-slate-300'
                  }`}
                >
                  None
                </button>
                {profileIcons.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setAppearance({ ...appearance, profileIcon: icon })}
                    className={`w-12 h-12 rounded-xl border-2 text-2xl transition-all hover:scale-110 ${
                      appearance.profileIcon === icon 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="border-t border-slate-100 pt-6">
              {message.text && (
                <div className={`mb-4 p-3 rounded-lg text-sm font-medium border ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-700 border-green-100' 
                    : 'bg-red-50 text-red-700 border-red-100'
                }`}>
                  {message.text}
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary w-full"
              >
                {saving ? 'Saving...' : 'Save Appearance'}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-slate-100 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 mb-4 text-center">Preview</h3>
          <div className="bg-slate-50 rounded-2xl p-6 shadow-inner">
            <div className="text-center mb-6">
              <div className={`w-20 h-20 rounded-full mx-auto mb-4 ${selectedColor.bg} flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>
                {appearance.profileIcon || 'J'}
              </div>
              <h2 className="text-xl font-bold text-slate-900">John Doe</h2>
              <p className="text-slate-500 text-sm">@johndoe</p>
            </div>
            
            <div className="space-y-3">
              {['My Website', 'Twitter', 'GitHub'].map((label) => (
                <div
                  key={label}
                  className={`${selectedColor.bg} text-white ${selectedStyle.className} p-4 text-center font-medium shadow-sm`}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
