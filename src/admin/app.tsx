import type { StrapiApp } from '@strapi/strapi/admin';
import esTranslations from './translations/es.json';
import enTranslations from './translations/en.json';

export default {
    config: {
        // Registrar traducciones personalizadas para el admin
        // El usuario puede cambiar el idioma desde su perfil
        locales: ['es', 'en'],
        translations: {
            es: esTranslations,
            en: enTranslations,
        },
    },
    bootstrap(app: StrapiApp) {
        console.log('Admin customizations loaded - ES/EN translations available');
    },
};
