# Deployment Guide

This monorepo contains two Next.js applications that need to be deployed separately:

- **Docs App** (`apps/docs`) - Documentation site
- **Support App** (`apps/support`) - Support/FAQ site

## Quick Setup

### 1. Deploy Docs App

**Current Repository Setup:**

- Already configured with `vercel.json` at root
- Just import this project in Vercel and it will deploy the docs app automatically

**Steps:**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import this repository
4. Vercel will auto-detect the configuration
5. Deploy!

**Custom Domain (Optional):**

- Add your domain in Project Settings → Domains
- Example: `docs.yourdomain.com`

---

### 2. Deploy Support App

Create a **second Vercel project** for the support app:

**Steps:**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import **the same repository** again
4. In the project setup, configure:

   **Build & Development Settings:**

   ```
   Framework Preset: Next.js
   Root Directory: Leave blank (or set to root)
   Build Command: turbo run build --filter=@vinr/support
   Output Directory: apps/support/.next
   Install Command: npm install
   ```

5. Deploy!

**Custom Domain (Optional):**

- Add your domain in Project Settings → Domains
- Example: `support.yourdomain.com`

---

## Configuration Files

### Current Setup

- **`vercel.json`** - Configured for docs app
- **`vercel.support.json`** - Reference config for support app (not used directly)

### Alternative: Manual Configuration

If you prefer to configure in the Vercel dashboard instead of using `vercel.json`:

**For Docs App:**

```json
{
  "buildCommand": "turbo run build --filter=@vinr/docs",
  "installCommand": "npm install",
  "outputDirectory": "apps/docs/.next"
}
```

**For Support App:**

```json
{
  "buildCommand": "turbo run build --filter=@vinr/support",
  "installCommand": "npm install",
  "outputDirectory": "apps/support/.next"
}
```

---

## Environment Variables

If your apps need environment variables:

1. Go to Project Settings → Environment Variables in each project
2. Add the required variables for each app
3. Redeploy if needed

---

## Deployment Workflow

### Automatic Deployments

Both projects will automatically deploy when you:

- Push to your main/production branch (production deployment)
- Push to any other branch (preview deployment)
- Open a pull request (preview deployment)

### Branch Configuration

Configure which branch triggers production deployments:

1. Go to Project Settings → Git
2. Set "Production Branch" (usually `main` or `master`)

---

## Troubleshooting

### "No Output Directory" Error

- Ensure `outputDirectory` is set to the correct `.next` path
- Verify the build command includes the Turbo filter for the correct app

### Build Fails

- Check that dependencies are installed: `npm install`
- Verify the Turbo filter matches the package name in `package.json`
- Check build logs for specific errors

### Both Apps Deploying to Same Project

- You need **two separate Vercel projects**
- Each project deploys one app from the same repository

---

## Summary

| App     | Vercel Project | Build Filter             | Output Dir           | Domain                 |
| ------- | -------------- | ------------------------ | -------------------- | ---------------------- |
| Docs    | vinr-docs      | `--filter=@vinr/docs`    | `apps/docs/.next`    | docs.yourdomain.com    |
| Support | vinr-support   | `--filter=@vinr/support` | `apps/support/.next` | support.yourdomain.com |

Both projects point to the same GitHub repository but build different apps! 🚀
