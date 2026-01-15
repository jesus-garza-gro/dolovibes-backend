import type { StrapiApp } from '@strapi/strapi/admin';
import esTranslations from './translations/es.json';

export default {
    config: {
        // Registrar traducciones personalizadas para el admin
        locales: ['es'],
        translations: {
            es: esTranslations,
        },
    },
    bootstrap(app: StrapiApp) {
        console.log('Admin customizations loaded');
    },
};
