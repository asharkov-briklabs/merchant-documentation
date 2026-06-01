import coreWebVitals from "eslint-config-next/core-web-vitals";

export default [
  ...coreWebVitals,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-html-link-for-pages": "off",
      // "reset state on pathname change" in useEffect is intentional in nav
      // components. This rule was added in react-hooks v5 and wasn't enforced
      // previously.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    ignores: ["node_modules/", ".next/", ".source/"],
  },
];
