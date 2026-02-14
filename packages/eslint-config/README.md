# @vinr/eslint-config

Shared ESLint configuration for the Vinr monorepo.

## Usage

### For Next.js apps

In your `.eslintrc.js`:

```js
module.exports = {
  extends: ['@vinr/eslint-config/next'],
};
```

### For React packages

In your `.eslintrc.js`:

```js
module.exports = {
  extends: ['@vinr/eslint-config/react'],
};
```

### For Node.js packages

In your `.eslintrc.js`:

```js
module.exports = {
  extends: ['@vinr/eslint-config'],
};
```

## Features

- Extends ESLint recommended rules
- Compatible with Prettier (no conflicting rules)
- Includes React and React Hooks plugins for React projects
- Includes Next.js specific rules for Next.js apps
- Warns on console statements (except warn/error)
- Enforces `const` where possible
- Allows unused variables prefixed with `_`
