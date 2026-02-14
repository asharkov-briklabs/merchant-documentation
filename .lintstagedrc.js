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
