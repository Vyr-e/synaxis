module.exports = {
  extends: [
    // ... your other extends
  ],
  rules: {
    // Encourage named exports
    'import/prefer-named-exports': 'error',

    // Allow default exports only in specific files (if needed)
    'import/no-default-export': [
      'error',
      {
        allowList: [
          'page.tsx', // Next.js pages
          'layout.tsx', // Next.js layouts
          'loading.tsx', // Next.js loading
          'error.tsx', // Next.js error
          '*.default.ts', // if needed create a file ending with .default.ts
          '*.default.tsx', // if needed create a file ending with .default.ts
        ],
      },
    ],
  },
};
