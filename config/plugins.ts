export default () => ({
  // Plugin i18n - Solo español
  i18n: {
    enabled: true,
    config: {
      locales: ['es'],
      defaultLocale: 'es',
    },
  },
  // Configuración de upload para videos grandes
  upload: {
    config: {
      sizeLimit: 250 * 1024 * 1024, // 250MB para videos hero
    },
  },
});
