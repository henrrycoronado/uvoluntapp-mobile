// Formato: tipo(PUCB-xx): descripción  |  sin historia: tipo(alcance): descripción
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-empty': [2, 'never'],
    'subject-case': [0],
    'header-max-length': [2, 'always', 100],
  },
  plugins: [
    {
      rules: {
        // AGENTS.md: sin Co-authored-by ni firmas de herramientas de IA.
        'no-ai-signature': ({ raw }) => {
          const bad = /co-authored-by|generated with|claude/i.test(raw ?? '');
          return [
            !bad,
            'No incluyas Co-authored-by ni firmas de IA en el commit',
          ];
        },
      },
    },
  ],
};
module.exports.rules['no-ai-signature'] = [2, 'always'];
