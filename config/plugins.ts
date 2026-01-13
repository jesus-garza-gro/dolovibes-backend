export default () => ({
  // Plugin i18n - Soporte multiidioma (optimizado por ROI)
  i18n: {
    enabled: true,
    config: {
      locales: ['es', 'en', 'it', 'de'],
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
