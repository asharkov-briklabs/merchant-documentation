# Getting Started with Vinr Docs Monorepo

Your Vinr documentation platform is ready to use! This guide will help you get started.

## ✅ What's Been Created

### Apps
- **docs** - Main documentation site (docs.vinr.com)
  - Merchant documentation
  - Bank partner documentation  
  - API reference (merchant & bank)
  
- **support** - Support center (support.vinr.com)
  - Merchant support
  - Bank partner support

### Packages
- **ui** - Shared UI components used across both apps

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Install all dependencies
pnpm install
```

### 2. Start Development

```bash
# Run all apps
pnpm dev

# Run specific app
pnpm dev --filter=docs
pnpm dev --filter=support
```

The apps will be available at:
- **docs**: http://localhost:3000
- **support**: http://localhost:3001

### 3. View the Documentation

Open your browser and navigate to:
- http://localhost:3000/merchant - Merchant docs
- http://localhost:3000/banks - Bank partner docs
- http://localhost:3000/api - API reference
- http://localhost:3001/merchant - Merchant support

## 📁 Project Structure

```
vinr-docs-monorepo/
├── apps/
│   ├── docs/               # Main documentation
│   │   ├── app/           # Next.js App Router
│   │   ├── content/       # MDX documentation files
│   │   │   ├── merchant/  # Merchant docs
│   │   │   ├── banks/     # Bank partner docs
│   │   │   └── api-*/     # API documentation
│   │   └── lib/           # Source configuration
│   │
│   └── support/           # Support center
│       ├── app/
│       └── content/
│           ├── merchant/  # Merchant support
│           └── banks/     # Bank support
│
└── packages/
    └── ui/                # Shared components
        └── src/
            └── components/
```

## ✍️ Adding Content

### Merchant Documentation

Create MDX files in `apps/docs/content/merchant/`:

```bash
# Example: Create a new page
touch apps/docs/content/merchant/get-started/new-page.mdx
```

Update `meta.json` to add it to navigation:

```json
{
  "title": "Get Started",
  "pages": [
    "index",
    "quick-start",
    "new-page"  // Add here
  ]
}
```

### MDX Example

```mdx
---
title: My New Page
description: A description of this page
---

# My New Page

Content goes here with **markdown** support!

## Code Example

\`\`\`javascript
const vinr = new Vinr({
  apiKey: 'your-key'
});
\`\`\`

<Callout type="info">
This is a callout component!
</Callout>
```

## 🎨 Using Shared Components

Import from the UI package:

```typescript
import { Button } from '@vinr/ui';

export default function MyComponent() {
  return (
    <Button variant="default" size="lg">
      Click Me
    </Button>
  );
}
```

## 🔧 Configuration

### Fumadocs

Configure in `apps/docs/lib/source.ts`:
- Add new documentation sources
- Customize navigation
- Add icons

### Tailwind

Customize in `tailwind.config.ts`:
- Add custom colors
- Extend theme
- Add custom utilities

### Next.js

Configure in `next.config.mjs`:
- Add environment variables
- Configure MDX plugins
- Set up redirects

## 📦 Building for Production

```bash
# Build all apps
pnpm build

# Build specific app
pnpm build --filter=docs
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Vercel will auto-detect the monorepo
4. Deploy both apps:
   - docs → docs.vinr.com
   - support → support.vinr.com

### Manual Deployment

```bash
# Build
pnpm build

# Apps are in:
# - apps/docs/.next
# - apps/support/.next

# Start production server
cd apps/docs && pnpm start
```

## 🎯 Next Steps

### 1. Add More Content

- Complete merchant documentation sections
- Add bank partner guides
- Create API reference pages
- Write support articles

### 2. Customize Branding

- Update colors in `tailwind.config.ts`
- Add logo to `public/` directory
- Customize layouts in `app/layout.tsx`

### 3. Advanced Features

- Add authentication (see authentication-guide.md)
- Integrate AI chat (see ai-features-guide.md)
- Add analytics
- Set up CI/CD

## 📚 Available Documentation

- [Authentication Guide](./vinr-docs-authentication-guide.md)
- [AI Features Guide](./vinr-docs-ai-features-guide.md)
- [Core Implementation Plan](./vinr-docs-core-implementation-plan.md)

## 🆘 Need Help?

- **Fumadocs**: https://fumadocs.vercel.app
- **Next.js**: https://nextjs.org/docs
- **Turborepo**: https://turbo.build/repo/docs

## 🎉 You're Ready!

Your documentation platform is fully set up and ready to customize. Start by:

1. Running `pnpm dev`
2. Opening http://localhost:3000
3. Exploring the existing content
4. Adding your own pages

Happy documenting! 🚀
