export default () => ({
  // Plugin i18n para soporte multiidioma (ES/EN)
  i18n: {
    enabled: true,
    config: {
      locales: ['es', 'en'],
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
