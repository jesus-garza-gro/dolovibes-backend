/**
 * Script de Migración de Datos a Strapi
 * 
 * Este script transfiere los datos estáticos del frontend a Strapi.
 * 
 * USO:
 * 1. Iniciar Strapi: cd dolovibes-backend && npm run develop
 * 2. Crear usuario admin en http://localhost:1337/admin
 * 3. Crear un API Token en Settings > API Tokens (tipo: Full access)
 * 4. Establecer el token en STRAPI_API_TOKEN abajo
 * 5. Ejecutar: node scripts/migrate-data.js
 * 
 * NOTA: Las imágenes se mantienen como URLs de Unsplash.
 * Para subir imágenes a Strapi, se necesitaría descargarlas y usar la API de upload.
 */

// Cargar variables de entorno desde .env
require('dotenv').config();

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || 'TU_API_TOKEN_AQUI';

// ============================================
// DATOS DE EXPERIENCIAS (del frontend)
// ============================================
const experiences = [
  {
    title: "Hut 2 Hut",
    slug: "hut-2-hut",
    season: "summer",
    shortDescription: "Travesía de refugio a refugio por los senderos más icónicos de los Dolomitas.",
    longDescription: "Una aventura única de refugio en refugio (Hut to Hut) a través de los paisajes más impresionantes de los Alpes. Camina por senderos legendarios, duerme en refugios tradicionales de montaña y disfruta de la gastronomía alpina auténtica en cada parada. Esta es la forma más inmersiva de experimentar las montañas.",
    difficulty: "Intermedio",
    bestFor: "Senderistas con experiencia que buscan una aventura inmersiva",
    whatToExpect: "Caminarás entre 4-6 horas diarias por senderos marcados. El equipaje principal se transporta de refugio a refugio, solo llevas tu mochila de día. Cada noche disfrutarás de cenas típicas y el ambiente único de los refugios de montaña.",
    tags: [{ name: "Trekking" }, { name: "Aventura" }],
    highlights: [
      { text: "Travesía por senderos legendarios de alta montaña" },
      { text: "Noches en refugios tradicionales alpinos" },
      { text: "Gastronomía local en cada parada" },
      { text: "Vistas panorámicas incomparables" }
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1920"
  },
  {
    title: "Hiking",
    slug: "hiking",
    season: "summer",
    shortDescription: "Descubre los senderos más hermosos de los Alpes italianos.",
    longDescription: "Programa de senderismo diseñado para disfrutar de la naturaleza alpina a tu ritmo. Desde senderos panorámicos hasta rutas a través de bosques, lagos cristalinos y praderas de alta montaña. Perfecto para quienes quieren explorar la montaña sin el compromiso de largas travesías.",
    difficulty: "Fácil-Intermedio",
    bestFor: "Familias y grupos que quieren disfrutar la montaña con comodidad",
    whatToExpect: "Caminatas diarias de 3-5 horas con posibilidad de adaptar la dificultad. Regreso al hotel cada noche para descansar cómodamente. Transporte incluido a los puntos de inicio de cada ruta.",
    tags: [{ name: "Senderismo" }, { name: "Naturaleza" }],
    highlights: [
      { text: "Rutas para todos los niveles" },
      { text: "Lagos alpinos cristalinos" },
      { text: "Bosques y praderas de montaña" },
      { text: "Regreso al hotel cada noche" }
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1920"
  },
  {
    title: "City Lights",
    slug: "city-lights",
    season: "summer",
    shortDescription: "Explora las ciudades más emblemáticas del norte de Italia.",
    longDescription: "Un viaje cultural por las luces de las ciudades italianas más icónicas. Desde la moda de Milán hasta los canales de Venecia, pasando por la romántica Verona. Arte, arquitectura, gastronomía y vida nocturna en un solo viaje.",
    difficulty: "Fácil",
    bestFor: "Amantes de la cultura, el arte y la vida urbana",
    whatToExpect: "Tours guiados por el día con tiempo libre para explorar. Traslados cómodos entre ciudades. Hoteles céntricos para que puedas disfrutar de la vida nocturna.",
    tags: [{ name: "Cultura" }, { name: "Ciudades" }],
    highlights: [
      { text: "Arte y arquitectura de clase mundial" },
      { text: "Gastronomía italiana auténtica" },
      { text: "Compras en las mejores boutiques" },
      { text: "Experiencias nocturnas únicas" }
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&q=80&w=1920"
  },
  {
    title: "Ski Pull",
    slug: "ski-pull",
    season: "winter",
    shortDescription: "Esquí de alto nivel en las mejores pistas de los Dolomitas.",
    longDescription: "Una experiencia de esquí intensiva en las legendarias pistas de Cortina d'Ampezzo y el dominio de Dolomiti Superski. Más de 1,200km de pistas te esperan con guías expertos que te llevarán a descubrir los descensos más espectaculares.",
    difficulty: "Intermedio-Avanzado",
    bestFor: "Esquiadores experimentados que buscan nuevos desafíos",
    whatToExpect: "Esquí intensivo de 5-6 horas diarias. Guía que optimizará tu tiempo en pistas evitando colas. Almuerzo en refugios de montaña con gastronomía local.",
    tags: [{ name: "Esquí" }, { name: "Aventura" }],
    highlights: [
      { text: "Acceso a Dolomiti Superski" },
      { text: "Pistas legendarias de competición" },
      { text: "Guías de esquí expertos" },
      { text: "Descensos panorámicos únicos" }
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=1920"
  },
  {
    title: "Ski Family",
    slug: "ski-family",
    season: "winter",
    shortDescription: "Vacaciones de esquí perfectas para toda la familia.",
    longDescription: "Programa diseñado especialmente para familias con niños. Resorts con pistas para todos los niveles, escuelas de esquí especializadas para pequeños y actividades après-ski que disfrutarán tanto padres como hijos.",
    difficulty: "Todos los niveles",
    bestFor: "Familias con niños que quieren vacaciones de nieve",
    whatToExpect: "Los niños disfrutarán de clases con instructores especializados mientras los padres esquían. Actividades familiares por la tarde. Hoteles con habitaciones familiares y menú infantil.",
    tags: [{ name: "Familia" }, { name: "Esquí" }],
    highlights: [
      { text: "Escuelas de esquí para niños" },
      { text: "Pistas verdes y azules" },
      { text: "Actividades de nieve para toda la familia" },
      { text: "Hoteles con servicios familiares" }
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=1920"
  },
  {
    title: "Navidad",
    slug: "navidad",
    season: "winter",
    shortDescription: "Vive la magia de los mercados navideños de Europa.",
    longDescription: "Sumérgete en el espíritu navideño del Tirol del Sur y los Alpes. Visita los famosos Christkindlmärkte con sus luces, artesanías y vino caliente. Tradiciones centenarias en un ambiente mágico que te hará sentir la Navidad como nunca antes.",
    difficulty: "Fácil",
    bestFor: "Quienes quieren vivir la Navidad europea auténtica",
    whatToExpect: "Tours por los mejores mercados con tiempo libre para compras. Degustaciones de productos típicos navideños. Experiencias culturales y tradicionales.",
    tags: [{ name: "Navidad" }, { name: "Mercados" }],
    highlights: [
      { text: "Mercados navideños tradicionales" },
      { text: "Vino caliente y gastronomía festiva" },
      { text: "Artesanías únicas" },
      { text: "Ambiente mágico y festivo" }
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&q=80&w=1920"
  }
];

// ============================================
// DATOS DE PAQUETES (del frontend)
// ============================================
const packages = [
  {
    title: "Hut 2 Hut - Dolomitas Clásico",
    slug: "hut-2-hut-dolomitas-clasico",
    experienceSlug: "hut-2-hut",
    location: "Dolomitas",
    priceAmount: 25000,
    baseCurrency: "MXN",
    duration: "5 Días",
    rating: 4.9,
    hasDiscount: false,
    season: "summer",
    description: "La ruta clásica de las Tre Cime di Lavaredo. 5 días de travesía por los refugios más emblemáticos.",
    difficulty: "Intermedio",
    groupSize: "4-8 personas",
    guideType: "Guiado",
    availableDates: "Junio - Septiembre",
    tags: [{ name: "Trekking" }, { name: "Aventura" }],
    itinerary: [
      { day: 1, title: "Llegada a Cortina", description: "Llegada a Cortina d'Ampezzo y briefing de bienvenida. Primer tramo hacia el refugio Auronzo con vistas a las Tre Cime." },
      { day: 2, title: "Tre Cime di Lavaredo", description: "Caminata icónica alrededor de las Tre Cime. Aproximadamente 10km con vistas que quitan el aliento." },
      { day: 3, title: "Lago di Braies", description: "Travesía hacia el Lago di Braies, uno de los lagos más fotografiados de los Dolomitas." },
      { day: 4, title: "Paso Giau", description: "Cruce del Paso Giau con panorámicas de 360°. Noche en refugio con cena especial." },
      { day: 5, title: "Descenso y Despedida", description: "Último tramo descendiendo al valle. Llegada a Cortina y despedida del grupo." }
    ],
    includes: [
      { label: "Guía UIAGM", detail: "Guía de montaña certificado UIAGM con más de 10 años de experiencia en los Dolomitas." },
      { label: "Alojamiento en refugios", detail: "4 noches en refugios de montaña tradicionales con habitaciones compartidas." },
      { label: "Media pensión", detail: "Desayuno buffet y cena de 3 tiempos cada día en el refugio." },
      { label: "Transporte de equipaje", detail: "Tu maleta principal se transporta de refugio a refugio. Solo cargas tu mochila de día." }
    ],
    notIncludes: [
      { text: "Vuelos internacionales" },
      { text: "Almuerzos" },
      { text: "Seguro de viaje" },
      { text: "Propinas" }
    ],
    startDates: [
      { date: "2025-06-15", displayText: "15 Jun 2025" },
      { date: "2025-06-22", displayText: "22 Jun 2025" },
      { date: "2025-07-06", displayText: "6 Jul 2025" },
      { date: "2025-07-20", displayText: "20 Jul 2025" }
    ],
    gallery: [
      { caption: "Refugio Auronzo - Primer día de travesía" },
      { caption: "Vista panorámica de las Tre Cime di Lavaredo" },
      { caption: "Sendero hacia el Lago di Braies" },
      { caption: "Atardecer desde el refugio" },
      { caption: "Grupo de senderistas en el paso Giau" }
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1920"
  },
  {
    title: "Hut 2 Hut - Alta Via 1",
    slug: "hut-2-hut-alta-via-1",
    experienceSlug: "hut-2-hut",
    location: "Dolomitas Centrales",
    priceAmount: 32000,
    originalPriceAmount: 35000,
    baseCurrency: "MXN",
    duration: "7 Días",
    rating: 5.0,
    hasDiscount: true,
    season: "summer",
    description: "La legendaria Alta Via 1, la travesía más famosa de los Dolomitas. 7 días de aventura pura.",
    difficulty: "Avanzado",
    groupSize: "4-6 personas",
    guideType: "Guiado",
    availableDates: "Julio - Agosto",
    tags: [{ name: "Trekking" }, { name: "Expedición" }],
    itinerary: [
      { day: 1, title: "Lago di Braies", description: "Inicio en el icónico Lago di Braies. Primera etapa hacia refugio Biella." },
      { day: 2, title: "Fanes", description: "Travesía por el altiplano de Fanes con vistas espectaculares." },
      { day: 3, title: "Lagazuoi", description: "Ascenso al Lagazuoi con túneles de la Primera Guerra Mundial." },
      { day: 4, title: "Cinque Torri", description: "Paso por las icónicas Cinque Torri." },
      { day: 5, title: "Nuvolau", description: "Ascenso al Nuvolau con 360° de panorámicas." },
      { day: 6, title: "Civetta", description: "Travesía hacia la imponente pared del Civetta." },
      { day: 7, title: "Alleghe", description: "Descenso final a Alleghe. Celebración y despedida." }
    ],
    includes: [
      { label: "Guía experto", detail: "Guía experto, 6 noches en refugios, media pensión, transporte de equipaje." },
      { label: "Alojamiento", detail: "Alojamiento en los refugios más emblemáticos de la ruta." },
      { label: "Media pensión", detail: "Desayuno y cena incluidos cada día." },
      { label: "Servicios adicionales", detail: "Transporte de equipaje entre refugios." }
    ],
    notIncludes: [
      { text: "Vuelos" },
      { text: "Almuerzos" },
      { text: "Seguro" },
      { text: "Propinas" }
    ],
    startDates: [
      { date: "2025-07-01", displayText: "1 Jul 2025" },
      { date: "2025-07-15", displayText: "15 Jul 2025" },
      { date: "2025-08-01", displayText: "1 Ago 2025" }
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920"
  },
  {
    title: "Hiking - Lagos Alpinos",
    slug: "hiking-lagos-alpinos",
    experienceSlug: "hiking",
    location: "Tirol del Sur",
    priceAmount: 18500,
    baseCurrency: "MXN",
    duration: "4 Días",
    rating: 4.8,
    hasDiscount: false,
    season: "summer",
    description: "Descubre los lagos más cristalinos de los Alpes. Rutas suaves con paisajes increíbles.",
    difficulty: "Fácil",
    groupSize: "4-12 personas",
    availableDates: "Mayo - Septiembre",
    tags: [{ name: "Senderismo" }, { name: "Lagos" }],
    itinerary: [
      { day: 1, title: "Llegada", description: "Check-in en hotel y caminata de bienvenida." },
      { day: 2, title: "Lago di Carezza", description: "Ruta al famoso lago arcoíris de los Dolomitas." },
      { day: 3, title: "Lago di Anterselva", description: "Caminata alrededor del lago más grande del Tirol." },
      { day: 4, title: "Despedida", description: "Última caminata suave y regreso." }
    ],
    includes: [
      { label: "Guía local", detail: "Guía de senderismo con conocimiento especializado de la zona." },
      { label: "Hotel 3*", detail: "3 noches en hotel de montaña con spa." },
      { label: "Desayunos", detail: "Desayuno buffet cada mañana." },
      { label: "Transporte", detail: "Traslados a los puntos de inicio de cada ruta." }
    ],
    notIncludes: [
      { text: "Vuelos" },
      { text: "Comidas principales" },
      { text: "Seguro" }
    ],
    startDates: [
      { date: "2025-05-01", displayText: "1 May 2025" },
      { date: "2025-05-15", displayText: "15 May 2025" },
      { date: "2025-09-01", displayText: "1 Sep 2025" }
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1920"
  },
  {
    title: "City Lights - Norte de Italia",
    slug: "city-lights-norte-italia",
    experienceSlug: "city-lights",
    location: "Milán, Verona, Venecia",
    priceAmount: 22000,
    baseCurrency: "MXN",
    duration: "5 Días",
    rating: 4.7,
    hasDiscount: false,
    season: "summer",
    description: "El tour clásico por las joyas del norte italiano.",
    difficulty: "Fácil",
    groupSize: "6-14 personas",
    availableDates: "Junio - Septiembre",
    tags: [{ name: "Cultura" }, { name: "Ciudades" }],
    itinerary: [
      { day: 1, title: "Milán", description: "Llegada. Duomo, Galleria Vittorio Emanuele." },
      { day: 2, title: "Milán - Moda", description: "Quadrilatero della Moda y Navigli." },
      { day: 3, title: "Verona", description: "Arena de Verona, casa de Julieta." },
      { day: 4, title: "Venecia", description: "Plaza San Marco, paseo en góndola." },
      { day: 5, title: "Murano y Burano", description: "Islas de cristal y colores. Despedida." }
    ],
    includes: [
      { label: "Tours guiados", detail: "Guías locales en cada ciudad." },
      { label: "Hoteles céntricos", detail: "4 noches en hoteles boutique." },
      { label: "Transporte", detail: "Tren de alta velocidad entre ciudades." },
      { label: "Desayunos", detail: "Desayuno italiano cada mañana." }
    ],
    notIncludes: [
      { text: "Vuelos" },
      { text: "Comidas" },
      { text: "Entradas a museos" }
    ],
    startDates: [
      { date: "2025-06-01", displayText: "1 Jun 2025" },
      { date: "2025-06-15", displayText: "15 Jun 2025" },
      { date: "2025-09-01", displayText: "1 Sep 2025" }
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&q=80&w=1920"
  },
  {
    title: "Ski Pull - Cortina Classic",
    slug: "ski-pull-cortina-classic",
    experienceSlug: "ski-pull",
    location: "Cortina d'Ampezzo",
    priceAmount: 35000,
    baseCurrency: "MXN",
    duration: "5 Días",
    rating: 4.9,
    hasDiscount: false,
    season: "winter",
    description: "Esquí en las pistas olímpicas de Cortina con guía experto.",
    difficulty: "Intermedio-Avanzado",
    groupSize: "4-8 personas",
    availableDates: "Diciembre - Marzo",
    tags: [{ name: "Esquí" }, { name: "Aventura" }],
    itinerary: [
      { day: 1, title: "Llegada", description: "Check-in y reconocimiento del resort." },
      { day: 2, title: "Tofana", description: "Esquí en el área de Tofana." },
      { day: 3, title: "Lagazuoi", description: "Descenso legendario del Lagazuoi." },
      { day: 4, title: "Cinque Torri", description: "Esquí con vistas a las Cinque Torri." },
      { day: 5, title: "Día Libre", description: "Esquí libre o spa. Cena de despedida." }
    ],
    includes: [
      { label: "Ski pass Dolomiti Superski", detail: "Pase de 5 días con acceso a 1,200km de pistas." },
      { label: "Hotel con spa", detail: "4 noches en hotel 4* con spa y piscina." },
      { label: "Media pensión", detail: "Desayuno y cena gourmet." },
      { label: "Guía de esquí", detail: "Instructor para mejorar tu técnica." }
    ],
    notIncludes: [
      { text: "Vuelos" },
      { text: "Equipamiento de esquí" },
      { text: "Seguro" }
    ],
    startDates: [
      { date: "2025-12-15", displayText: "15 Dic 2025" },
      { date: "2026-01-05", displayText: "5 Ene 2026" },
      { date: "2026-02-01", displayText: "1 Feb 2026" }
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=1920"
  },
  {
    title: "Ski Family - Val Gardena",
    slug: "ski-family-val-gardena",
    experienceSlug: "ski-family",
    location: "Val Gardena",
    priceAmount: 28000,
    baseCurrency: "MXN",
    duration: "5 Días",
    rating: 4.8,
    hasDiscount: false,
    season: "winter",
    description: "Vacaciones de esquí perfectas para toda la familia.",
    difficulty: "Todos los niveles",
    groupSize: "Familias",
    availableDates: "Diciembre - Febrero",
    tags: [{ name: "Familia" }, { name: "Esquí" }],
    itinerary: [
      { day: 1, title: "Instalación", description: "Llegada al hotel familiar." },
      { day: 2, title: "Clases", description: "Clases de esquí para todos." },
      { day: 3, title: "Esquí Familiar", description: "Día de esquí en familia." },
      { day: 4, title: "Aventuras", description: "Trineos y actividades de nieve." },
      { day: 5, title: "Despedida", description: "Último día y entrega de diplomas." }
    ],
    includes: [
      { label: "Hotel familiar", detail: "4 noches con habitaciones familiares y kids club." },
      { label: "Ski pass familiar", detail: "Pases para toda la familia." },
      { label: "Clases niños", detail: "3 días de clases para los pequeños." },
      { label: "Pensión completa", detail: "Todas las comidas incluidas." }
    ],
    notIncludes: [
      { text: "Vuelos" },
      { text: "Equipamiento" },
      { text: "Extras" }
    ],
    startDates: [
      { date: "2025-12-20", displayText: "20 Dic 2025" },
      { date: "2025-12-26", displayText: "26 Dic 2025" },
      { date: "2026-02-01", displayText: "1 Feb 2026" }
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=1920"
  },
  {
    title: "Navidad - Mercados de Bolzano",
    slug: "navidad-mercados-bolzano",
    experienceSlug: "navidad",
    location: "Bolzano, Tirol del Sur",
    priceAmount: 28999,
    originalPriceAmount: 32000,
    baseCurrency: "MXN",
    duration: "5 Días",
    rating: 5.0,
    hasDiscount: true,
    season: "winter",
    description: "La magia de los mercados navideños del Tirol del Sur.",
    difficulty: "Fácil",
    groupSize: "6-14 personas",
    availableDates: "Diciembre",
    tags: [{ name: "Navidad" }, { name: "Mercados" }],
    itinerary: [
      { day: 1, title: "Bolzano", description: "Llegada y primer mercado navideño." },
      { day: 2, title: "Mercados", description: "Tour por los mercados de Bolzano." },
      { day: 3, title: "Merano", description: "Mercado flotante de Merano." },
      { day: 4, title: "Bressanone", description: "Mercado de Bressanone y cena tradicional." },
      { day: 5, title: "Despedida", description: "Últimas compras y brunch." }
    ],
    includes: [
      { label: "Hotel 4*", detail: "4 noches en hotel boutique navideño." },
      { label: "Desayunos", detail: "Desayuno buffet con productos locales." },
      { label: "Tours guiados", detail: "Guía experto en tradiciones navideñas." },
      { label: "Degustaciones", detail: "Vino caliente, strudel y productos típicos." }
    ],
    notIncludes: [
      { text: "Vuelos" },
      { text: "Comidas no especificadas" },
      { text: "Compras" }
    ],
    startDates: [
      { date: "2025-12-01", displayText: "1 Dic 2025" },
      { date: "2025-12-08", displayText: "8 Dic 2025" },
      { date: "2025-12-15", displayText: "15 Dic 2025" }
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&q=80&w=1920"
  }
];

// ============================================
// FUNCIONES DE MIGRACIÓN
// ============================================

async function makeRequest(endpoint, method = 'GET', data = null, locale = 'es') {
  // Si hay data y tiene locale, usarlo en la query string
  let url = `${STRAPI_URL}/api${endpoint}`;
  if (data && method === 'POST') {
    url += `?locale=${locale}`;
  }
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STRAPI_API_TOKEN}`
    }
  };
  
  if (data) {
    // Remover locale del data si existe, ya está en la query string
    const { locale: _, ...dataWithoutLocale } = data;
    options.body = JSON.stringify({ data: dataWithoutLocale });
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API Error: ${JSON.stringify(error)}`);
  }
  
  return response.json();
}

async function migrateExperiences() {
  console.log('\n📦 Migrando Experiencias...\n');
  const experienceMap = {};
  
  for (const exp of experiences) {
    try {
      // Preparar datos para Strapi con locale español
      const strapiData = {
        title: exp.title,
        slug: exp.slug,
        season: exp.season,
        shortDescription: exp.shortDescription,
        longDescription: exp.longDescription,
        difficulty: exp.difficulty,
        bestFor: exp.bestFor,
        whatToExpect: exp.whatToExpect,
        tags: exp.tags,
        highlights: exp.highlights,
        locale: 'es',
        // Las imágenes se dejan como URLs externas por ahora
        // Para subir a Strapi se necesitaría descargar y usar la API de upload
      };
      
      const result = await makeRequest('/experiences', 'POST', strapiData);
      experienceMap[exp.slug] = result.data.id;
      console.log(`  ✅ ${exp.title} (ID: ${result.data.id})`);
    } catch (error) {
      console.error(`  ❌ Error migrando ${exp.title}:`, error.message);
    }
  }
  
  return experienceMap;
}

async function migratePackages(experienceMap) {
  console.log('\n🎒 Migrando Paquetes...\n');
  
  for (const pkg of packages) {
    try {
      const experienceId = experienceMap[pkg.experienceSlug];
      
      // Preparar gallery con captions de ejemplo
      const galleryData = pkg.gallery && pkg.gallery.length > 0 ? pkg.gallery.map((url, index) => ({
        caption: `Imagen ${index + 1} - ${pkg.title}`
        // La imagen se subirá manualmente en Strapi Admin
      })) : [
        { caption: `Vista panorámica - ${pkg.title}` },
        { caption: `Sendero principal - ${pkg.title}` },
        { caption: `Refugio de montaña - ${pkg.title}` }
      ];
      
      // Preparar locationInfo con datos de ejemplo
      const locationInfoData = {
        howToGetThere: `Para llegar a ${pkg.location}, puedes tomar un vuelo a Venecia o Verona y luego un traslado terrestre de aproximadamente 2-3 horas. También ofrecemos servicio de transfer desde el aeropuerto.`,
        latitude: 46.5369,
        longitude: 11.9509,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${pkg.location?.replace(/ /g, '+')}`,
        nearestAirport: 'Aeropuerto de Venecia Marco Polo (VCE)',
        nearestCity: 'Cortina d\'Ampezzo'
      };
      
      // Preparar datos para Strapi
      const strapiData = {
        title: pkg.title,
        slug: pkg.slug,
        location: pkg.location,
        priceAmount: pkg.priceAmount,
        originalPriceAmount: pkg.originalPriceAmount || null,
        duration: pkg.duration,
        rating: pkg.rating,
        hasDiscount: pkg.hasDiscount,
        season: pkg.season,
        description: pkg.description,
        difficulty: pkg.difficulty,
        groupSize: pkg.groupSize,
        guideType: pkg.guideType,
        availableDates: pkg.availableDates,
        tags: pkg.tags,
        itinerary: pkg.itinerary,
        includes: pkg.includes,
        notIncludes: pkg.notIncludes,
        startDates: pkg.startDates,
        gallery: galleryData,
        locationInfo: locationInfoData,
        locale: 'es',
        // Relación con experiencia
        experience: experienceId ? { connect: [experienceId] } : undefined
      };
      
      const result = await makeRequest('/packages', 'POST', strapiData);
      console.log(`  ✅ ${pkg.title} (ID: ${result.data.id})`);
    } catch (error) {
      console.error(`  ❌ Error migrando ${pkg.title}:`, error.message);
    }
  }
}

async function migrateSiteSettings() {
  console.log('\n⚙️ Configurando Site Settings...\n');
  
  try {
    const siteData = {
      siteName: 'Dolovibes',
      location: 'Monterrey, México',
      phone: '+52 81 1234 5678',
      email: 'info@dolovibes.com',
      whatsappNumber: '+521234567890',
      instagramUrl: 'https://instagram.com/dolovibes',
      facebookUrl: 'https://facebook.com/dolovibes',
      tiktokUrl: 'https://tiktok.com/@dolovibes',
      footerDescription: 'Experiencias únicas en los Dolomitas italianos. Trekking, esquí y cultura alpina.',
      copyrightText: '© 2025 Dolovibes. Todos los derechos reservados.',
      defaultCurrency: 'MXN'
    };
    
    await makeRequest('/site-setting', 'PUT', siteData);
    console.log('  ✅ Site Settings configurado');
  } catch (error) {
    console.error('  ❌ Error configurando Site Settings:', error.message);
  }
}

async function migrateHeroSection() {
  console.log('\n🎬 Configurando Hero Section...\n');
  
  try {
    const heroData = {
      title: 'Vive experiencias',
      titleHighlight: 'inolvidables',
      badge: 'DESCUBRE TU PRÓXIMA AVENTURA',
      subtitle: 'Explora los Dolomitas con guías expertos'
    };
    
    await makeRequest('/hero-section', 'PUT', heroData);
    console.log('  ✅ Hero Section configurado');
  } catch (error) {
    console.error('  ❌ Error configurando Hero Section:', error.message);
  }
}

async function migrateAboutPage() {
  console.log('\n📄 Configurando About Page...\n');
  
  try {
    const aboutData = {
      pageTitle: 'Quiénes Somos',
      photoAlt: 'Equipo Dolovibes',
      origin: {
        title: 'Cómo nació Dolovibes',
        content: 'Dolovibes nació de la pasión por las montañas y el deseo de compartir las maravillas de los Dolomitas con viajeros de todo el mundo.'
      },
      essence: {
        title: 'Nuestra Esencia',
        content: 'Creemos que viajar es más que visitar lugares; es vivir experiencias que transforman. Cada viaje con Dolovibes está diseñado para crear momentos inolvidables.'
      },
      vision: {
        title: 'Visión',
        content: 'Ser la empresa líder en experiencias de turismo de montaña en los Dolomitas, reconocida por la calidad, seguridad y autenticidad de nuestros viajes.'
      },
      mission: {
        title: 'Misión',
        content: 'Conectar a los viajeros con la magia de los Dolomitas a través de experiencias cuidadosamente diseñadas que combinan aventura, cultura y gastronomía alpina.'
      }
    };
    
    await makeRequest('/about-page', 'PUT', aboutData);
    console.log('  ✅ About Page configurado');
  } catch (error) {
    console.error('  ❌ Error configurando About Page:', error.message);
  }
}

// ============================================
// EJECUCIÓN PRINCIPAL
// ============================================

async function main() {
  console.log('═══════════════════════════════════════════════');
  console.log('  🏔️  DOLOVIBES - Migración de Datos a Strapi');
  console.log('═══════════════════════════════════════════════');
  console.log(`\nURL: ${STRAPI_URL}`);
  console.log(`Token: ${STRAPI_API_TOKEN.substring(0, 10)}...`);
  
  if (STRAPI_API_TOKEN === 'TU_API_TOKEN_AQUI') {
    console.error('\n❌ Error: Debes configurar STRAPI_API_TOKEN');
    console.log('\nPasos:');
    console.log('1. Inicia Strapi: npm run develop');
    console.log('2. Ve a Settings > API Tokens');
    console.log('3. Crea un token con acceso Full');
    console.log('4. Establece: export STRAPI_API_TOKEN="tu_token"');
    process.exit(1);
  }
  
  try {
    // 1. Migrar experiencias primero (sin relaciones)
    const experienceMap = await migrateExperiences();
    
    // 2. Migrar paquetes (con relación a experiencias)
    await migratePackages(experienceMap);
    
    // 3. Migrar single types
    await migrateSiteSettings();
    await migrateHeroSection();
    await migrateAboutPage();
    
    console.log('\n═══════════════════════════════════════════════');
    console.log('  ✅ Migración completada exitosamente');
    console.log('═══════════════════════════════════════════════\n');
    
    console.log('📝 Próximos pasos:');
    console.log('1. Verificar datos en Strapi Admin: http://localhost:1337/admin');
    console.log('2. Subir imágenes manualmente a cada registro');
    console.log('3. Subir videos del Hero Section');
    console.log('4. Habilitar permisos públicos en Settings > Roles > Public');
    console.log('5. Cambiar VITE_USE_STRAPI=true en el frontend\n');
    
  } catch (error) {
    console.error('\n❌ Error durante la migración:', error);
    process.exit(1);
  }
}

main();
