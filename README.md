# Bah Oumar Touré-Portfolio

Personal developer portfolio built with **Next.js 15**, **React 19**, **Tailwind CSS 3**, and modern web tooling. Showcases my journey, skills, and projects in a responsive, animated UI.

---

## Live Demo

[https://mon-portfolio-rho-liard.vercel.app](https://mon-portfolio-rho-liard.vercel.app)

---

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Language**: TypeScript -fully typed components and utilities
- **Animations**: [GSAP](https://gsap.com/) + [Lottie React](https://www.npmjs.com/package/lottie-react)
- **Contact**: [EmailJS](https://www.emailjs.com/) integration
- **PWA**: [`@ducanh2912/next-pwa`](https://www.npmjs.com/package/@ducanh2912/next-pwa)
- **Icons**: [Lucide](https://lucide.dev/), [React Icons](https://react-icons.github.io/)
- **Code quality**: Prettier, ESLint 9 (flat config), Husky pre-commit hooks

---

## Folder Structure

```
portfolio_obtoure/
├── public/                  # Static assets, Lottie files, images, PWA icons
├── src/
│   ├── app/
│   │   ├── components/      # Reusable UI sections (Hero, About, Skills, etc.)
│   │   ├── projects/        # Project detail and listing pages
│   │   ├── css/             # Custom CSS (glow card effects)
│   │   └── fonts/           # Local fonts (Geist)
│   ├── components/ui/       # Shadcn UI primitives (Button, Card, Carousel…)
│   ├── Types/               # Shared TypeScript types
│   └── lib/                 # Utility functions (cn, etc.)
├── utils/                   # Data files (PersonalData, projects, skills…)
├── .husky/                  # Git pre-commit hook
├── eslint.config.mjs        # ESLint 9 flat config
├── tailwind.config.ts       # Tailwind theme configuration
└── next.config.ts           # Next.js + PWA configuration
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/bahToureOumarToure/portfolio_obtoure.git
cd portfolio_obtoure
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your EmailJS credentials:

```bash
cp example.env .env.local
```

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

### 4. Start the development server

```bash
pnpm dev
```

Then visit: [http://localhost:3000](http://localhost:3000)

---

## Deployment

The project is deployed on [Vercel](https://vercel.com). Any push to `main` triggers an automatic production deployment.

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

## Contact

Have a project in mind or just want to say hi?

- Email: [o.t.bahtoure@gmail.com](mailto:o.t.bahtoure@gmail.com)
- LinkedIn: [linkedin.com/in/bahoumartoure](https://www.linkedin.com/in/bahoumartoure)
- GitHub: [github.com/bahToureOumarToure](https://github.com/bahToureOumarToure)
