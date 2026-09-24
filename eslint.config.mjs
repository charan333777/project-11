import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
    ...nextVitals,
    {
        // The copied UI intentionally restores browser state and resets modal state in effects.
        // These React 19 advisory rules would require a broader UI refactor unrelated to demo isolation.
        rules: {
            'react-hooks/set-state-in-effect': 'off',
            'react-hooks/purity': 'off',
        },
    },
    globalIgnores([
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
    ]),
]);
