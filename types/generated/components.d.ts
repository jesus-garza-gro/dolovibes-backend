import type { Schema, Struct } from '@strapi/strapi';

export interface PackageGalleryImage extends Struct.ComponentSchema {
  collectionName: 'components_package_gallery_images';
  info: {
    description: "Una imagen para la galer\u00EDa de fotos del paquete. El 'caption' es el pie de foto que se muestra debajo de la imagen.";
    displayName: '\uD83D\uDDBC\uFE0F Foto de Galer\u00EDa';
    icon: 'picture';
  };
  attributes: {
    caption: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface PackageIncludeItem extends Struct.ComponentSchema {
  collectionName: 'components_package_include_items';
  info: {
    description: "Un servicio o beneficio incluido en el precio del paquete. El 'label' es el t\u00EDtulo corto (ej: 'Gu\u00EDa UIAGM'), el 'detail' es la explicaci\u00F3n expandible.";
    displayName: '\u2705 Incluido en el paquete';
    icon: 'check-circle';
  };
  attributes: {
    detail: Schema.Attribute.Text;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PackageItineraryDay extends Struct.ComponentSchema {
  collectionName: 'components_package_itinerary_days';
  info: {
    description: 'Un d\u00EDa del itinerario del viaje. Incluye n\u00FAmero de d\u00EDa, t\u00EDtulo descriptivo, descripci\u00F3n detallada de las actividades, y una imagen representativa.';
    displayName: '\uD83D\uDCC5 D\u00EDa de Itinerario';
    icon: 'calendar';
  };
  attributes: {
    day: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PackageLocationInfo extends Struct.ComponentSchema {
  collectionName: 'components_package_location_info';
  info: {
    description: 'Informaci\u00F3n de ubicaci\u00F3n y c\u00F3mo llegar';
    displayName: 'Location Info';
  };
  attributes: {
    googleMapsUrl: Schema.Attribute.String;
    howToGetThere: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    latitude: Schema.Attribute.Decimal;
    longitude: Schema.Attribute.Decimal;
    nearestAirport: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    nearestCity: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface PackageStartDate extends Struct.ComponentSchema {
  collectionName: 'components_package_start_dates';
  info: {
    description: 'Fecha de inicio disponible para un paquete';
    displayName: 'StartDate';
    icon: 'clock';
  };
  attributes: {
    available: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    displayText: Schema.Attribute.String;
  };
}

export interface SharedLegalPage extends Struct.ComponentSchema {
  collectionName: 'components_shared_legal_pages';
  info: {
    description: 'Enlace a p\u00E1gina legal con t\u00EDtulo y URL';
    displayName: 'LegalPage';
    icon: 'file-contract';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    slug: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'Componente para metadatos SEO';
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    keywords: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSimpleText extends Struct.ComponentSchema {
  collectionName: 'components_shared_simple_texts';
  info: {
    description: 'Texto simple para listas';
    displayName: 'SimpleText';
    icon: 'align-left';
  };
  attributes: {
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedTag extends Struct.ComponentSchema {
  collectionName: 'components_shared_tags';
  info: {
    description: 'Etiqueta simple para categorizaci\u00F3n';
    displayName: 'Tag';
    icon: 'hashtag';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_shared_text_blocks';
  info: {
    description: 'Bloque de texto con t\u00EDtulo para secciones';
    displayName: 'TextBlock';
    icon: 'file-text';
  };
  attributes: {
    content: Schema.Attribute.RichText & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'package.gallery-image': PackageGalleryImage;
      'package.include-item': PackageIncludeItem;
      'package.itinerary-day': PackageItineraryDay;
      'package.location-info': PackageLocationInfo;
      'package.start-date': PackageStartDate;
      'shared.legal-page': SharedLegalPage;
      'shared.seo': SharedSeo;
      'shared.simple-text': SharedSimpleText;
      'shared.tag': SharedTag;
      'shared.text-block': SharedTextBlock;
    }
  }
}
