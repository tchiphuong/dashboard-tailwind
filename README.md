# Dashboard Tailwind

Modern admin dashboard built with React, TypeScript, and Tailwind CSS 4.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)

## 🚀 Demo

**Live Demo:** [https://tchiphuong.github.io/dashboard-tailwind/](https://tchiphuong.github.io/dashboard-tailwind/)

## ✨ Features

- 📊 **Dashboard Overview** - Analytics and statistics at a glance
- 👥 **User Management** - Users list and roles management
- 📦 **Products** - Product catalog with CRUD operations
- 📝 **Posts & Comments** - Content management
- 📋 **Projects** - Project tracking and creation
- 🏢 **Assets** - Asset management and requests
- 💰 **Finance** - Invoice management
- ✅ **Todos** - Task management
- 💬 **Quotes** - Quotes management
- ⚙️ **Settings** - Application settings
- 🌙 **Dark Mode** - Light/Dark theme toggle
- 🌐 **i18n** - Multi-language support
- 📱 **Responsive** - Mobile-first design

## 🛠️ Tech Stack

| Technology | Version | Description |
|------------|---------|-------------|
| React | 18.3 | UI Library |
| TypeScript | 5.5 | Type Safety |
| Tailwind CSS | 4.0 | Styling |
| Vite | 5.4 | Build Tool |
| React Router | 6.22 | Client Routing |
| Framer Motion | 11.0 | Animations |
| Recharts | 2.12 | Charts |
| HeroUI | 2.7 | UI Components |
| i18next | 24.2 | Internationalization |

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/tchiphuong/dashboard-tailwind.git
cd dashboard-tailwind

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   └── layout/       # Layout components (Sidebar, Header, etc.)
├── contexts/         # React contexts (Theme, Sidebar)
├── data/             # Static data and mock data
├── hooks/            # Custom React hooks
├── i18n/             # i18n configuration
├── locales/          # Translation files
├── pages/            # Page components
│   ├── assets/       # Asset management pages
│   ├── auth/         # Authentication pages
│   ├── comments/     # Comments pages
│   ├── dashboard/    # Dashboard pages
│   ├── finance/      # Finance pages
│   ├── posts/        # Posts pages
│   ├── products/     # Products pages
│   ├── projects/     # Projects pages
│   ├── quotes/       # Quotes pages
│   ├── settings/     # Settings pages
│   ├── todos/        # Todos pages
│   └── users/        # User management pages
└── types/            # TypeScript type definitions
```

## 🚀 Deployment

### GitHub Pages (Automatic)

This project includes GitHub Actions workflow for automatic deployment:

1. Push to `main` branch
2. GitHub Actions will build and deploy automatically
3. Access at: `https://<username>.github.io/dashboard-tailwind/`

### Manual Deployment

```bash
# Build the project
npm run build

# The 'dist' folder contains the production build
# Deploy the 'dist' folder to any static hosting service
```

## 🔧 Configuration

### Vite Configuration

Edit `vite.config.ts` to customize:

```typescript
export default defineConfig(({ command }) => ({
  // Change 'dashboard-tailwind' to your repo name for GitHub Pages
  base: command === 'build' ? '/dashboard-tailwind/' : '/',
  // ... other config
}))
```

### Environment Variables

Create `.env` file for environment-specific settings:

```env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=Dashboard
```

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Tchiphuong**

- GitHub: [@tchiphuong](https://github.com/tchiphuong)

---

⭐ If you like this project, please give it a star on GitHub!
