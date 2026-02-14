# Monorepo Enhancements

This document outlines the improvements and enhancements made to the Vinr Documentation Platform monorepo.

## Overview

The following features have been added to improve code quality, consistency, and developer experience:

1. ✅ **Prettier** - Code formatting
2. ✅ **Shared ESLint Configuration** - Consistent linting rules
3. ✅ **Shared TypeScript Configuration** - Reusable TypeScript configs
4. ✅ **Git Hooks** - Pre-commit quality checks
5. ✅ **Enhanced Turborepo Pipeline** - Format tasks integration

---

## 1. Prettier Configuration

### What was added:

- **`.prettierrc`** - Prettier configuration file with Tailwind CSS plugin
- **`.prettierignore`** - Files and directories to exclude from formatting
- **`prettier`** and **`prettier-plugin-tailwindcss`** packages

### Configuration details:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 80,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### Usage:

```bash
# Format all files in the monorepo
pnpm format

# Check formatting without making changes
pnpm format:check
```

---

## 2. Shared ESLint Configuration Package

### Location: `packages/eslint-config/`

A new shared package that provides consistent ESLint rules across all apps and packages.

### Available configurations:

1. **`@vinr/eslint-config`** - Base configuration for Node.js packages
2. **`@vinr/eslint-config/next`** - Configuration for Next.js apps
3. **`@vinr/eslint-config/react`** - Configuration for React libraries

### Features:

- Extends ESLint recommended rules
- Compatible with Prettier (no conflicting rules)
- Includes React and React Hooks plugins
- Custom rules for code quality
- Warns on console statements (except warn/error)
- Enforces `const` where possible
- Allows unused variables prefixed with `_`

### Usage example:

```js
// .eslintrc.js in a Next.js app
module.exports = {
  extends: ['@vinr/eslint-config/next'],
};
```

---

## 3. Shared TypeScript Configuration Package

### Location: `packages/typescript-config/`

A new shared package that provides reusable TypeScript configurations.

### Available configurations:

1. **`base.json`** - Base TypeScript configuration with strict settings
2. **`nextjs.json`** - Configuration for Next.js applications
3. **`react-library.json`** - Configuration for React component libraries

### Features:

- Strict type checking enabled
- Modern ES features support
- Path aliases support for Next.js apps
- Declaration file generation for libraries
- Optimized for both development and production

### Usage example:

```json
// tsconfig.json in a Next.js app
{
  "extends": "@vinr/typescript-config/nextjs.json",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 4. Git Hooks with Husky and lint-staged

### What was added:

- **`husky`** - Modern Git hooks management
- **`lint-staged`** - Run linters on staged files only
- **`.husky/pre-commit`** - Pre-commit hook
- **`.lintstagedrc.js`** - lint-staged configuration

### How it works:

When you commit code, the pre-commit hook automatically:

1. Runs Prettier on staged files to format them
2. Runs ESLint on staged TypeScript/JavaScript files to fix issues
3. Stages the fixed files
4. Allows commit only if all checks pass

### Configuration:

```js
// .lintstagedrc.js
module.exports = {
  // Lint and format TypeScript and JavaScript files
  '**/*.{js,jsx,ts,tsx}': (filenames) => [
    `prettier --write ${filenames.join(' ')}`,
    `eslint --fix ${filenames.join(' ')}`,
  ],
  // Format JSON, CSS, and Markdown files
  '**/*.{json,css,md,mdx}': (filenames) =>
    `prettier --write ${filenames.join(' ')}`,
};
```

### Benefits:

- Ensures code quality before commits
- Prevents poorly formatted code from entering the repository
- Fast - only checks staged files, not the entire codebase
- Automatic fixes for common issues

---

## 5. Enhanced Turborepo Pipeline

### Updated `turbo.json`:

Added `format` and `format:check` tasks to the Turborepo pipeline.

```json
{
  "pipeline": {
    "format": {
      "dependsOn": ["^format"],
      "cache": false
    },
    "format:check": {
      "dependsOn": ["^format:check"]
    }
  }
}
```

### Scripts added to all packages:

- `format` - Format code with Prettier
- `format:check` - Check formatting without modifying files

---

## Updated Package Scripts

### Root `package.json`:

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "format": "turbo run format",
    "format:check": "turbo run format:check",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean && rm -rf node_modules",
    "prepare": "husky"
  }
}
```

### App/Package-level scripts:

All apps and packages now have:
- `format` - Format files with Prettier
- `format:check` - Check formatting
- `lint` - Lint code with ESLint
- `type-check` - Type check with TypeScript

---

## Workflow Improvements

### Developer Workflow:

```bash
# 1. Install dependencies (runs husky setup automatically)
pnpm install

# 2. Start development
pnpm dev

# 3. Before committing (optional - hooks will run automatically)
pnpm format
pnpm lint
pnpm type-check

# 4. Commit changes (pre-commit hook runs automatically)
git add .
git commit -m "Your commit message"
```

### CI/CD Recommendations:

```bash
# In your CI pipeline, add these checks:
pnpm install --frozen-lockfile
pnpm format:check  # Fail if code is not formatted
pnpm lint          # Fail on lint errors
pnpm type-check    # Fail on type errors
pnpm build         # Build all apps
```

---

## Package Structure

The monorepo now has the following structure:

```
vinrdocsmonorepo/
├── apps/
│   ├── docs/              # Main documentation app
│   └── support/           # Support center app
├── packages/
│   ├── ui/                # Shared UI components
│   ├── eslint-config/     # ✨ NEW: Shared ESLint config
│   └── typescript-config/ # ✨ NEW: Shared TypeScript config
├── .husky/                # ✨ NEW: Git hooks
│   └── pre-commit
├── .prettierrc            # ✨ NEW: Prettier config
├── .prettierignore        # ✨ NEW: Prettier ignore file
└── .lintstagedrc.js       # ✨ NEW: lint-staged config
```

---

## Benefits

### Code Quality:
- ✅ Consistent code formatting across entire monorepo
- ✅ Automated linting catches bugs early
- ✅ Type safety enforced via shared TypeScript configs
- ✅ Pre-commit hooks prevent bad code from being committed

### Developer Experience:
- ✅ No more debates about code style - Prettier handles it
- ✅ Automatic code fixes on commit
- ✅ Fast feedback loop with lint-staged
- ✅ Easy to extend and customize configurations

### Maintainability:
- ✅ Shared configs reduce duplication
- ✅ Easy to update rules across all packages
- ✅ Clear separation of concerns
- ✅ Better onboarding for new developers

---

## Next Steps

### Optional enhancements to consider:

1. **Testing setup** - Add Jest or Vitest for unit testing
2. **Component testing** - Set up Storybook for UI components
3. **E2E testing** - Add Playwright or Cypress
4. **Commit message linting** - Add commitlint for conventional commits
5. **Bundle analysis** - Add bundle size tracking
6. **Performance monitoring** - Set up Lighthouse CI
7. **Documentation generation** - Add TypeDoc for API documentation

---

## Troubleshooting

### Husky hooks not running:

```bash
# Reinstall Git hooks
pnpm run prepare
```

### Prettier conflicts with ESLint:

The shared ESLint configs extend `eslint-config-prettier`, which disables all formatting-related ESLint rules. This prevents conflicts.

### lint-staged is slow:

lint-staged only runs on staged files, so it should be fast. If it's slow, check:
- Are you running it on too many files?
- Do you have large files staged?
- Is your ESLint configuration too complex?

---

## Documentation

- **Prettier**: https://prettier.io/
- **ESLint**: https://eslint.org/
- **Husky**: https://typicode.github.io/husky/
- **lint-staged**: https://github.com/okonet/lint-staged
- **Turborepo**: https://turbo.build/repo

---

## Summary

This enhanced setup provides a robust foundation for maintaining code quality and consistency across the entire monorepo. All changes are transparent, well-documented, and follow industry best practices.
