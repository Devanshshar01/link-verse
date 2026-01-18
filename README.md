<div align="center">

# 🔗 Hmmm

### *Your Premium Link-in-Bio Platform*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

**A modern, sleek, and powerful link-in-bio platform inspired by Linear, Vercel, and Notion.**

[Demo](https://hmmm.vercel.app) · [Report Bug](https://github.com/Devanshshar01/hmmm/issues) ·
</div>

---

## ✨ Features

🎨 **Premium Design**
- Clean, minimal UI inspired by world-class SaaS products
- Smooth animations and micro-interactions
- Mobile-first responsive design
- Dark mode ready

🔗 **Smart Link Management**
- Create unlimited custom links
- Schedule links with time-based visibility
- Drag-and-drop reordering (coming soon)
- Custom icons and emojis for each link

👤 **Personalized Profiles**
- Custom username (`/u/yourname`)
- Profile picture and bio
- Customizable themes and button styles
- Professional public profile pages

📊 **Analytics Dashboard** *(Coming Soon)*
- Track profile views
- Monitor link clicks
- Engagement metrics
- Real-time statistics

🔐 **Secure Authentication**
- Email/Password sign up
- Google OAuth integration
- Protected dashboard routes
- Firebase backend

---

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| **[Next.js 16](https://nextjs.org/)** | React framework with App Router |
| **[React 19](https://react.dev/)** | UI library with latest features |
| **[TypeScript](https://www.typescriptlang.org/)** | Type-safe development |
| **[Tailwind CSS 4](https://tailwindcss.com/)** | Utility-first styling |
| **[Firebase](https://firebase.google.com/)** | Authentication & Firestore database |
| **[Vercel](https://vercel.com/)** | Deployment platform |

---

## 📦 Installation

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Firebase** project ([Create one here](https://console.firebase.google.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/hmmm.git
cd hmmm
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

> 💡 **Tip:** Get these values from your [Firebase Console](https://console.firebase.google.com/) → Project Settings → General → Your apps

### 4. Set Up Firebase

1. Enable **Authentication** (Email/Password & Google)
2. Create a **Firestore Database**
3. Add security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
      
      match /links/{linkId} {
        allow read: if true;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🎯 Usage

### For Users

1. **Sign Up** at `/signup` with email or Google
2. **Set Your Username** in Settings
3. **Add Your Links** in the Links page
4. **Customize Appearance** with themes and styles
5. **Share Your Profile** at `/u/yourusername`

### For Developers

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 📂 Project Structure

```
hmmm/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page
│   │   └── signup/         # Signup page
│   ├── dashboard/
│   │   ├── analytics/      # Analytics view
│   │   ├── appearance/     # Theme customization
│   │   ├── links/          # Link management
│   │   ├── settings/       # Profile settings
│   │   └── layout.tsx      # Dashboard layout
│   ├── u/
│   │   └── [username]/     # Public profile pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── lib/
│   └── firebase.ts         # Firebase config & helpers
├── components/             # Reusable components
├── public/                 # Static assets
└── .env.local             # Environment variables
```

---

## 🎨 Design System

### Colors

- **Slate** - Primary neutral (`slate-50` to `slate-900`)
- **Indigo** - Brand accent (`indigo-500`, `indigo-600`)
- **White/Black** - Pure tones for contrast

### Components

- **Buttons**: `.btn`, `.btn-primary`, `.btn-secondary`
- **Inputs**: `.input-field`
- **Cards**: `.card`, `.glass-card`

### Typography

- **Font**: System font stack (SF Pro, Segoe UI, Roboto)
- **Scale**: `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`

---

## 🗺️ Roadmap

- [x] User authentication
- [x] Link CRUD operations
- [x] Smart scheduling
- [x] Public profiles
- [x] Premium UI redesign
- [ ] Analytics dashboard
- [ ] Link click tracking
- [ ] Custom domains
- [ ] Link expiration
- [ ] QR code generation
- [ ] Export data
- [ ] API access

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Design inspiration: [Linear](https://linear.app/), [Vercel](https://vercel.com/), [Notion](https://notion.so/)
- Icons: [Emoji](https://emojipedia.org/)
- Badges: [Shields.io](https://shields.io/)

---

<div align="center">

**Built with ❤️ using Next.js and Firebase**

⭐ Star this repo if you find it helpful!

[Website](https://hmmm.vercel.app) · [GitHub](https://github.com/yourusername/hmmm) · [Twitter](https://twitter.com/yourusername)

</div>
