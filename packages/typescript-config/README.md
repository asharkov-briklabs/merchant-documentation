# @vinr/typescript-config

Shared TypeScript configuration for the Vinr monorepo.

## Usage

### For Next.js apps

In your `tsconfig.json`:

```json
{
  "extends": "@vinr/typescript-config/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./app/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### For React library packages

In your `tsconfig.json`:

```json
{
  "extends": "@vinr/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

### For general packages

In your `tsconfig.json`:

```json
{
  "extends": "@vinr/typescript-config/base.json"
}
```

## Configurations

- `base.json` - Base TypeScript configuration with strict settings
- `nextjs.json` - Configuration for Next.js applications
- `react-library.json` - Configuration for React component libraries
