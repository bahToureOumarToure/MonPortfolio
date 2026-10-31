// Projets : texte de base en anglais (langue par défaut du site) + traductions
// fr / es / ar. Les technologies, liens et dates ne se traduisent pas.

export interface ProjectText {
  name?: string;
  description: string;
  role: string;
  highlights: string[];
  challenges: string[];
}

export interface ProjectData extends ProjectText {
  id: number;
  name: string;
  tools: string[];
  code: string;
  demo: string;
  date: string;
  images: string[];
  videos: string[];
  translations: Record<"fr" | "es" | "ar", ProjectText>;
}

export const projectsData: ProjectData[] = [
  {
    id: 9,
    name: "Yahya-Express",
    description:
      "Development of the back-end API and a dedicated mobile app for an express delivery solution. REST architecture, management of rides, drivers and real-time delivery tracking. My first experience in a professional development environment.",
    tools: ["Spring Boot", "REST API", "MySQL", "JWT"],
    role: "Backend Developer (Professional)",
    code: "https://github.com/Yahya-Express/backend-api",
    demo: "",
    date: "2025-05-20",
    images: ["/projects/yahya-express/api-doc.png"],
    videos: [""],
    highlights: [
      "Design of a secure REST API for a delivery solution.",
      "Management of business entities: rides, drivers, customers, tracking.",
      "Collaboration in a professional environment with production constraints.",
    ],
    challenges: [
      "Adapting to a professional workflow with quality requirements.",
      "Modelling a complex business domain (delivery logistics).",
    ],
    translations: {
      fr: {
        description:
          "Développement de l'API back-end et d'une application mobile dédiée à une solution de livraison express. Architecture REST, gestion des courses, des chauffeurs et du suivi de livraison en temps réel. Première expérience en environnement de développement professionnel.",
        role: "Développeur back-end (expérience pro)",
        highlights: [
          "Conception d'une API REST sécurisée pour une solution de livraison.",
          "Gestion des entités métier : courses, chauffeurs, clients, suivi.",
          "Collaboration en environnement professionnel avec contraintes de production.",
        ],
        challenges: [
          "Adaptation à un workflow professionnel avec exigences de qualité.",
          "Modélisation d'un domaine métier complexe (logistique de livraison).",
        ],
      },
      es: {
        description:
          "Desarrollo de la API back-end y de una aplicación móvil dedicada para una solución de entrega exprés. Arquitectura REST, gestión de trayectos, conductores y seguimiento de entregas en tiempo real. Mi primera experiencia en un entorno de desarrollo profesional.",
        role: "Desarrollador back-end (profesional)",
        highlights: [
          "Diseño de una API REST segura para una solución de entregas.",
          "Gestión de las entidades de negocio: trayectos, conductores, clientes y seguimiento.",
          "Colaboración en un entorno profesional con restricciones de producción.",
        ],
        challenges: [
          "Adaptación a un flujo de trabajo profesional con exigencias de calidad.",
          "Modelado de un dominio de negocio complejo (logística de entregas).",
        ],
      },
      ar: {
        description:
          "تطوير واجهة برمجة التطبيقات الخلفية وتطبيق هاتف مخصص لحل توصيل سريع. معمارية REST، وإدارة الرحلات والسائقين وتتبع التوصيل في الوقت الفعلي. أول تجربة لي في بيئة تطوير احترافية.",
        role: "مطوّر الواجهة الخلفية (تجربة مهنية)",
        highlights: [
          "تصميم واجهة REST آمنة لحل توصيل.",
          "إدارة كيانات العمل: الرحلات، السائقون، الزبائن، والتتبع.",
          "العمل الجماعي في بيئة احترافية مع قيود بيئة الإنتاج.",
        ],
        challenges: [
          "التأقلم مع سير عمل احترافي ومتطلبات الجودة.",
          "نمذجة مجال عمل معقد (لوجستيك التوصيل).",
        ],
      },
    },
  },
  {
    id: 3,
    name: "Profila",
    description:
      "Single-page web platform for managing a professional profile: create, customise and share a modern digital business card. Integrates the Gemini Flash 2.5 model to automatically tailor the résumé to each job offer. Robust back-end with a REST API, secure authentication and a responsive interface showcasing skills and achievements.",
    tools: [
      "ReactJs",
      "Tailwind CSS",
      "Gemini Flash 2.5",
      "REST API",
      "PostgreSQL",
    ],
    role: "Full-Stack Developer",
    code: "https://github.com/bahToureOumarToure/profila-app",
    demo: "https://profila.bahoumartoure.com/",
    date: "2026-02-15",
    images: ["/projects/profila/cover.png"],
    videos: [""],
    highlights: [
      "Built a Next.js single-page web app integrating the Gemini Flash 2.5 model to automatically tailor the résumé to each job offer.",
      "Responsive, mobile-first interface with Tailwind CSS.",
    ],
    challenges: [
      "Optimising load time and server-side rendering (SSR).",
      "Orchestrating Gemini API calls while managing context and costs.",
      "Handling responsive layouts for every screen size.",
    ],
    translations: {
      fr: {
        description:
          "Plateforme web SPA de gestion de profil professionnel permettant de créer, personnaliser et partager une carte de visite numérique moderne. Intègre le modèle Gemini Flash 2.5 pour adapter automatiquement le CV aux différentes offres d'emploi. Architecture backend robuste avec API REST, authentification sécurisée et interface responsive mettant en avant compétences et réalisations.",
        role: "Développeur Full-Stack",
        highlights: [
          "Conception d'une application web SPA avec Next.js intégrant le modèle Gemini Flash 2.5 pour l'adaptation automatique du CV aux différentes offres.",
          "Interface responsive optimisée mobile-first avec Tailwind CSS.",
        ],
        challenges: [
          "Optimisation du temps de chargement et du rendu côté serveur (SSR).",
          "Orchestration des appels à l'API Gemini avec gestion du contexte et des coûts.",
          "Gestion du responsive pour tous les formats d'écran.",
        ],
      },
      es: {
        description:
          "Plataforma web SPA para gestionar un perfil profesional: crear, personalizar y compartir una tarjeta de visita digital moderna. Integra el modelo Gemini Flash 2.5 para adaptar automáticamente el CV a cada oferta de empleo. Back-end sólido con API REST, autenticación segura e interfaz responsive que destaca habilidades y logros.",
        role: "Desarrollador Full-Stack",
        highlights: [
          "Desarrollo de una aplicación web SPA con Next.js que integra el modelo Gemini Flash 2.5 para adaptar automáticamente el CV a cada oferta.",
          "Interfaz responsive pensada primero para móvil con Tailwind CSS.",
        ],
        challenges: [
          "Optimización del tiempo de carga y del renderizado en el servidor (SSR).",
          "Orquestación de las llamadas a la API de Gemini gestionando el contexto y los costes.",
          "Diseño responsive para todos los tamaños de pantalla.",
        ],
      },
      ar: {
        description:
          "منصة ويب أحادية الصفحة لإدارة الملف المهني: إنشاء بطاقة أعمال رقمية عصرية وتخصيصها ومشاركتها. تدمج نموذج Gemini Flash 2.5 لتكييف السيرة الذاتية تلقائيًا مع كل عرض عمل. واجهة خلفية متينة مع واجهة REST ومصادقة آمنة وواجهة متجاوبة تبرز المهارات والإنجازات.",
        role: "مطوّر Full-Stack",
        highlights: [
          "تطوير تطبيق ويب أحادي الصفحة بـ Next.js يدمج نموذج Gemini Flash 2.5 لتكييف السيرة الذاتية تلقائيًا مع كل عرض.",
          "واجهة متجاوبة مصممة للهاتف أولًا باستخدام Tailwind CSS.",
        ],
        challenges: [
          "تحسين زمن التحميل والعرض من جهة الخادم (SSR).",
          "تنظيم استدعاءات واجهة Gemini مع إدارة السياق والتكاليف.",
          "ضمان تجاوب الواجهة مع جميع أحجام الشاشات.",
        ],
      },
    },
  },
  {
    id: 1,
    name: "HubEats",
    description:
      "Full-stack food delivery platform inspired by marketplaces such as Uber Eats, built as my end-of-year project (PFA). Covers the whole order / payment / courier tracking cycle with a modern customer interface, a restaurant space and a real-time courier dashboard. The project also includes an intelligent solution.",
    tools: ["Spring Boot", "React", "PostgresSql", "Docker", "REST API"],
    role: "Full-Stack Developer (end-of-year project)",
    code: "https://github.com/bahToureOumarToure/hubeats",
    demo: "",
    date: "2025-12-20",
    images: ["/projects/hubeats/landing.png"],
    videos: [""],
    highlights: [
      "End-to-end design of a multi-party marketplace (customer, restaurant, courier).",
      "Real-time order tracking.",
      "Docker containerisation to simplify deployment.",
      "Integration of an intelligent solution into the platform.",
    ],
    challenges: [
      "Modelling a complex workflow between 3 types of users.",
      "Real-time synchronisation between the back-end and the courier interface.",
      "Handling payment transactions and order persistence.",
    ],
    translations: {
      fr: {
        description:
          "Plateforme full-stack de livraison de restauration inspirée des marketplaces type Uber Eats, développée comme Projet de Fin d'Année (PFA). Couvre l'ensemble du cycle commande/paiement/suivi livreur avec une interface client moderne, un espace restaurateur, et un dashboard livreur en temps réel. Le projet intègre également une solution intelligente.",
        role: "Développeur Full-Stack (PFA)",
        highlights: [
          "Conception complète d'une marketplace multi-acteurs (client, restaurateur, livreur).",
          "Mise en place d'un suivi de commande en temps réel.",
          "Conteneurisation Docker pour faciliter le déploiement.",
          "Intégration d'une solution intelligente à la plateforme.",
        ],
        challenges: [
          "Modélisation d'un workflow complexe entre 3 types d'utilisateurs.",
          "Synchronisation temps réel entre back-end et interface livreur.",
          "Gestion des transactions de paiement et de la persistance des commandes.",
        ],
      },
      es: {
        description:
          "Plataforma full-stack de reparto de comida inspirada en marketplaces como Uber Eats, desarrollada como proyecto de fin de curso (PFA). Cubre todo el ciclo de pedido, pago y seguimiento del repartidor, con una interfaz de cliente moderna, un espacio para restaurantes y un panel de repartidor en tiempo real. El proyecto también integra una solución inteligente.",
        role: "Desarrollador Full-Stack (proyecto de fin de curso)",
        highlights: [
          "Diseño completo de un marketplace con varios actores (cliente, restaurante, repartidor).",
          "Seguimiento de pedidos en tiempo real.",
          "Contenedorización con Docker para facilitar el despliegue.",
          "Integración de una solución inteligente en la plataforma.",
        ],
        challenges: [
          "Modelado de un flujo de trabajo complejo entre 3 tipos de usuarios.",
          "Sincronización en tiempo real entre el back-end y la interfaz del repartidor.",
          "Gestión de las transacciones de pago y de la persistencia de los pedidos.",
        ],
      },
      ar: {
        description:
          "منصة Full-Stack لتوصيل الطعام مستوحاة من منصات مثل Uber Eats، طُوّرت كمشروع نهاية السنة (PFA). تغطي الدورة الكاملة للطلب والدفع وتتبع عامل التوصيل، مع واجهة زبون عصرية وفضاء للمطاعم ولوحة تحكم لعامل التوصيل في الوقت الفعلي. يدمج المشروع أيضًا حلًا ذكيًا.",
        role: "مطوّر Full-Stack (مشروع نهاية السنة)",
        highlights: [
          "تصميم كامل لمنصة متعددة الأطراف (الزبون، المطعم، عامل التوصيل).",
          "تتبع الطلبات في الوقت الفعلي.",
          "حاويات Docker لتسهيل النشر.",
          "دمج حل ذكي في المنصة.",
        ],
        challenges: [
          "نمذجة سير عمل معقد بين 3 أنواع من المستخدمين.",
          "المزامنة الفورية بين الواجهة الخلفية وواجهة عامل التوصيل.",
          "إدارة معاملات الدفع وحفظ الطلبات.",
        ],
      },
    },
  },
  {
    id: 4,
    name: "Restaurant API - Microservices",
    description:
      "Distributed back-end for a restaurant management system built on a microservice architecture. Decoupled services communicate through an API Gateway, a Eureka service registry and asynchronous messaging. Demonstrates command of the Spring Cloud stack and horizontal scalability.",
    tools: [
      "Spring Boot",
      "Spring Cloud",
      "Eureka",
      "API Gateway",
      "REST API",
      "Docker",
    ],
    role: "Backend Developer",
    code: "https://github.com/bahToureOumarToure/restaurant-pfa-api-backend-microservices",
    demo: "",
    date: "2025-12-05",
    images: ["/projects/restaurant-microservices/architecture.png"],
    videos: [""],
    highlights: [
      "Complete microservice architecture with an API Gateway and Eureka service discovery.",
      "Business logic split into independent services (orders, menu, users).",
      "Inter-service communication over REST with centralised configuration.",
    ],
    challenges: [
      "Orchestrating and deploying many services together.",
      "Handling distributed transactions and data consistency.",
      "Setting up monitoring and circuit breakers for resilience.",
    ],
    translations: {
      fr: {
        name: "Restaurant API - Microservices",
        description:
          "Back-end distribué d'un système de gestion de restaurant suivant une architecture microservices. Services découplés communiquant via une API Gateway, registre de services Eureka et messagerie asynchrone. Démontre la maîtrise du pattern Spring Cloud et de la scalabilité horizontale.",
        role: "Développeur back-end",
        highlights: [
          "Architecture microservices complète avec API Gateway et service discovery Eureka.",
          "Découplage métier en plusieurs services indépendants (commandes, menu, utilisateurs).",
          "Communication inter-services via REST et configuration centralisée.",
        ],
        challenges: [
          "Orchestration et déploiement coordonné de multiples services.",
          "Gestion des transactions distribuées et de la cohérence des données.",
          "Mise en place du monitoring et du circuit-breaker pour la résilience.",
        ],
      },
      es: {
        name: "API de restaurante - Microservicios",
        description:
          "Back-end distribuido de un sistema de gestión de restaurantes basado en una arquitectura de microservicios. Servicios desacoplados que se comunican mediante un API Gateway, un registro de servicios Eureka y mensajería asíncrona. Demuestra el dominio de Spring Cloud y de la escalabilidad horizontal.",
        role: "Desarrollador back-end",
        highlights: [
          "Arquitectura de microservicios completa con API Gateway y descubrimiento de servicios con Eureka.",
          "Lógica de negocio dividida en servicios independientes (pedidos, menú, usuarios).",
          "Comunicación entre servicios por REST con configuración centralizada.",
        ],
        challenges: [
          "Orquestación y despliegue coordinado de múltiples servicios.",
          "Gestión de transacciones distribuidas y de la coherencia de los datos.",
          "Puesta en marcha de monitorización y circuit breakers para la resiliencia.",
        ],
      },
      ar: {
        name: "واجهة برمجة لمطعم - خدمات مصغّرة",
        description:
          "واجهة خلفية موزعة لنظام تسيير مطعم مبنية على معمارية الخدمات المصغّرة. خدمات مستقلة تتواصل عبر API Gateway وسجل خدمات Eureka ورسائل غير متزامنة. يبرز إتقان Spring Cloud وقابلية التوسع الأفقي.",
        role: "مطوّر الواجهة الخلفية",
        highlights: [
          "معمارية خدمات مصغّرة كاملة مع API Gateway واكتشاف الخدمات عبر Eureka.",
          "تقسيم منطق العمل إلى خدمات مستقلة (الطلبات، القائمة، المستخدمون).",
          "تواصل بين الخدمات عبر REST مع إعدادات مركزية.",
        ],
        challenges: [
          "تنسيق ونشر عدة خدمات بشكل متزامن.",
          "إدارة المعاملات الموزعة واتساق البيانات.",
          "إعداد المراقبة وآلية قاطع الدائرة (circuit breaker) لضمان المرونة.",
        ],
      },
    },
  },
  {
    id: 2,
    name: "MeteoLive",
    description:
      "Real-time weather app using the OpenWeather API to display forecasts, temperatures and current conditions for any city. Clean interface with dynamic search, geolocation and clear 5-day visualisation of atmospheric data.",
    tools: ["ReactJs", "Tailwind CSS", "OpenWeather API", "Geolocation API"],
    role: "Full-Stack Developer",
    code: "",
    demo: "https://meteolive.bahoumartoure.com/",
    date: "2026-01-20",
    images: ["/projects/meteolive/dashboard.png"],
    videos: [""],
    highlights: [
      "OpenWeather API integration with smart server-side caching.",
      "Instant city search with autocomplete.",
      "5-day forecasts with dynamic charts.",
    ],
    challenges: [
      "Coping with the external API's rate limits.",
      "Optimising a mobile-first user experience.",
    ],
    translations: {
      fr: {
        description:
          "Application météo en temps réel consommant l'API OpenWeather pour afficher prévisions, températures et conditions actuelles d'une ville donnée. Interface épurée avec recherche dynamique, géolocalisation et visualisation claire des données atmosphériques sur 5 jours.",
        role: "Développeur Full-Stack",
        highlights: [
          "Intégration de l'API OpenWeather avec mise en cache intelligente côté serveur.",
          "Recherche instantanée de ville avec auto-complétion.",
          "Affichage des prévisions sur 5 jours avec graphiques dynamiques.",
        ],
        challenges: [
          "Gestion des limitations de taux (rate limits) de l'API externe.",
          "Optimisation de l'expérience utilisateur mobile-first.",
        ],
      },
      es: {
        description:
          "Aplicación meteorológica en tiempo real que consume la API de OpenWeather para mostrar previsiones, temperaturas y condiciones actuales de cualquier ciudad. Interfaz limpia con búsqueda dinámica, geolocalización y una visualización clara de los datos atmosféricos a 5 días.",
        role: "Desarrollador Full-Stack",
        highlights: [
          "Integración de la API de OpenWeather con caché inteligente en el servidor.",
          "Búsqueda instantánea de ciudades con autocompletado.",
          "Previsiones a 5 días con gráficos dinámicos.",
        ],
        challenges: [
          "Gestión de los límites de peticiones (rate limits) de la API externa.",
          "Optimización de la experiencia de usuario pensada primero para móvil.",
        ],
      },
      ar: {
        description:
          "تطبيق طقس في الوقت الفعلي يعتمد على واجهة OpenWeather لعرض التوقعات ودرجات الحرارة والأحوال الحالية لأي مدينة. واجهة بسيطة مع بحث ديناميكي وتحديد الموقع الجغرافي وعرض واضح لبيانات الطقس على مدى 5 أيام.",
        role: "مطوّر Full-Stack",
        highlights: [
          "دمج واجهة OpenWeather مع تخزين مؤقت ذكي من جهة الخادم.",
          "بحث فوري عن المدن مع الإكمال التلقائي.",
          "عرض توقعات 5 أيام برسوم بيانية ديناميكية.",
        ],
        challenges: [
          "التعامل مع حدود عدد الطلبات (rate limits) في الواجهة الخارجية.",
          "تحسين تجربة المستخدم مع إعطاء الأولوية للهاتف.",
        ],
      },
    },
  },
  {
    id: 5,
    name: "Deep Learning - LSTM Sequence Engineering",
    description:
      "End-of-module Deep Learning mini-project exploring three major LSTM applications in NLP: autoregressive text generation on Frankenstein, Seq2Seq EN-FR machine translation, and multi-class classification on AG News. Comparative study of LSTM vs BiLSTM vs GRU in terms of performance and computational cost.",
    tools: [
      "Python",
      "TensorFlow",
      "Keras",
      "LSTM",
      "Seq2Seq",
      "NLP",
      "Beam Search",
    ],
    role: "ML Engineer",
    code: "",
    demo: "",
    date: "2025-11-25",
    images: ["/projects/deep-learning-lstm/courbes.png"],
    videos: [""],
    highlights: [
      "Part 1: two-layer autoregressive LSTM for character-level completion (71% validation accuracy, Beam Search with BEAM_SIZE=8).",
      "Part 2: Seq2Seq encoder-decoder architecture with teacher forcing for English-French translation.",
      "Part 3: AG News classification at 91% accuracy (F1 = 0.92), comparing LSTM / BiLSTM (+1.5%) / GRU.",
    ],
    challenges: [
      "Memory management of one-hot encoding on large corpora.",
      "Mitigating mode collapse in greedy generation (Beam Search, sampling).",
      "Understanding the fixed context-vector bottleneck in Seq2Seq.",
    ],
    translations: {
      fr: {
        name: "Deep Learning - Ingénierie des Séquences LSTM",
        description:
          "Mini-projet de fin de module Deep Learning explorant trois applications majeures des LSTM en NLP : génération de texte autoregressive sur Frankenstein, traduction automatique Seq2Seq EN-FR, et classification multi-classes sur AG News. Étude comparative LSTM vs BiLSTM vs GRU sur les performances et le coût computationnel.",
        role: "Ingénieur ML",
        highlights: [
          "Partie 1 : LSTM autoregressif 2 couches pour la complétion caractère par caractère (Accuracy validation 71%, Beam Search BEAM_SIZE=8).",
          "Partie 2 : Architecture encodeur-décodeur Seq2Seq avec teacher forcing pour la traduction Anglais-Français.",
          "Partie 3 : Classification AG News à 91% d'accuracy (F1 = 0.92), avec comparaison LSTM / BiLSTM (+1.5%) / GRU.",
        ],
        challenges: [
          "Gestion mémoire de l'encodage one-hot sur de grands corpus.",
          "Atténuation du mode collapse en génération greedy (Beam Search, sampling).",
          "Compréhension du goulot d'étranglement du vecteur de contexte fixe en Seq2Seq.",
        ],
      },
      es: {
        name: "Deep Learning - Ingeniería de secuencias LSTM",
        description:
          "Miniproyecto de fin de módulo de Deep Learning que explora tres aplicaciones clave de las LSTM en NLP: generación de texto autorregresiva sobre Frankenstein, traducción automática Seq2Seq EN-FR y clasificación multiclase sobre AG News. Estudio comparativo de LSTM, BiLSTM y GRU en rendimiento y coste computacional.",
        role: "Ingeniero de ML",
        highlights: [
          "Parte 1: LSTM autorregresiva de 2 capas para completar texto carácter a carácter (71 % de accuracy en validación, Beam Search con BEAM_SIZE=8).",
          "Parte 2: arquitectura codificador-decodificador Seq2Seq con teacher forcing para la traducción inglés-francés.",
          "Parte 3: clasificación de AG News con un 91 % de accuracy (F1 = 0,92), comparando LSTM / BiLSTM (+1,5 %) / GRU.",
        ],
        challenges: [
          "Gestión de memoria de la codificación one-hot en corpus grandes.",
          "Mitigación del mode collapse en la generación greedy (Beam Search, muestreo).",
          "Comprensión del cuello de botella del vector de contexto fijo en Seq2Seq.",
        ],
      },
      ar: {
        name: "التعلم العميق - هندسة المتتاليات بـ LSTM",
        description:
          "مشروع مصغّر في نهاية وحدة التعلم العميق يستكشف ثلاثة تطبيقات رئيسية لشبكات LSTM في معالجة اللغة الطبيعية: توليد نص ذاتي الانحدار على رواية فرانكنشتاين، والترجمة الآلية Seq2Seq من الإنجليزية إلى الفرنسية، والتصنيف متعدد الفئات على AG News. دراسة مقارنة بين LSTM وBiLSTM وGRU من حيث الأداء وكلفة الحساب.",
        role: "مهندس تعلم الآلة",
        highlights: [
          "الجزء 1: شبكة LSTM ذاتية الانحدار بطبقتين لإكمال النص حرفًا بحرف (دقة تحقق 71%، بحث شعاعي BEAM_SIZE=8).",
          "الجزء 2: معمارية مُرمِّز-مفكِّك Seq2Seq مع teacher forcing للترجمة من الإنجليزية إلى الفرنسية.",
          "الجزء 3: تصنيف AG News بدقة 91% (F1 = 0.92) مع مقارنة LSTM / BiLSTM (+1.5%) / GRU.",
        ],
        challenges: [
          "إدارة الذاكرة في الترميز الأحادي (one-hot) على مدوّنات كبيرة.",
          "الحد من ظاهرة mode collapse في التوليد الجشع (البحث الشعاعي، أخذ العينات).",
          "فهم عنق الزجاجة الناتج عن متجه السياق الثابت في Seq2Seq.",
        ],
      },
    },
  },
  {
    id: 7,
    name: "Power BI - Space Missions (1957-2024)",
    description:
      "Power BI analytics dashboard covering 67 years of space missions and more than 7,500 launches. Financial assessment of launch costs, modelling of success rates and profitability analysis by agency, country and launcher type. Historical dataset from Kaggle.",
    tools: ["Power BI", "DAX", "Data Modeling", "Kaggle Dataset"],
    role: "Data Analyst / BI Developer",
    code: "",
    demo: "",
    date: "2025-10-15",
    images: ["/projects/power-bi-space/dashboard.png"],
    videos: [""],
    highlights: [
      "Star-schema model over 7,500+ historical launches (1957-2024).",
      "Financial KPIs (average cost, ROI, success rate) computed in DAX.",
      "Interactive visuals by period, agency and mission type.",
    ],
    challenges: [
      "Cleaning and harmonising 67 years of historical data.",
      "Designing the data model for fast multi-dimensional analysis.",
    ],
    translations: {
      fr: {
        name: "Power BI - Missions Spatiales (1957-2024)",
        description:
          "Tableau de bord analytique Power BI couvrant 67 ans de missions spatiales et plus de 7500 lancements. Évaluation financière des coûts de lancement, modélisation des taux de succès et analyse de la rentabilité par agence, pays et type de lanceur. Dataset historisé issu de Kaggle.",
        role: "Data Analyst / Développeur BI",
        highlights: [
          "Modélisation en étoile sur 7500+ lancements historiques (1957-2024).",
          "Calcul des KPIs financiers (coût moyen, ROI, taux de succès) en DAX.",
          "Visualisations interactives par période, agence et type de mission.",
        ],
        challenges: [
          "Nettoyage et harmonisation des données sur 67 ans d'historique.",
          "Conception du modèle de données pour des analyses multi-dimensionnelles performantes.",
        ],
      },
      es: {
        name: "Power BI - Misiones espaciales (1957-2024)",
        description:
          "Panel analítico de Power BI que abarca 67 años de misiones espaciales y más de 7.500 lanzamientos. Evaluación financiera de los costes de lanzamiento, modelado de las tasas de éxito y análisis de rentabilidad por agencia, país y tipo de lanzador. Dataset histórico de Kaggle.",
        role: "Analista de datos / Desarrollador BI",
        highlights: [
          "Modelo en estrella sobre más de 7.500 lanzamientos históricos (1957-2024).",
          "Cálculo de KPI financieros (coste medio, ROI, tasa de éxito) en DAX.",
          "Visualizaciones interactivas por periodo, agencia y tipo de misión.",
        ],
        challenges: [
          "Limpieza y armonización de 67 años de datos históricos.",
          "Diseño del modelo de datos para análisis multidimensionales eficientes.",
        ],
      },
      ar: {
        name: "Power BI - المهمات الفضائية (1957-2024)",
        description:
          "لوحة تحليلية بـ Power BI تغطي 67 سنة من المهمات الفضائية وأكثر من 7500 عملية إطلاق. تقييم مالي لتكاليف الإطلاق ونمذجة معدلات النجاح وتحليل المردودية حسب الوكالة والبلد ونوع الصاروخ. بيانات تاريخية من Kaggle.",
        role: "محلل بيانات / مطوّر ذكاء الأعمال",
        highlights: [
          "نموذج نجمي يشمل أكثر من 7500 عملية إطلاق تاريخية (1957-2024).",
          "حساب مؤشرات الأداء المالية (متوسط الكلفة، العائد على الاستثمار، معدل النجاح) بلغة DAX.",
          "رسوم تفاعلية حسب الفترة والوكالة ونوع المهمة.",
        ],
        challenges: [
          "تنظيف وتوحيد بيانات تمتد على 67 سنة.",
          "تصميم نموذج بيانات يتيح تحليلات متعددة الأبعاد بأداء عالٍ.",
        ],
      },
    },
  },
  {
    id: 6,
    name: "Fitness Log",
    description:
      "Mobile workout tracking app to log sessions, follow progress and analyse performance over time. Cross-platform Flutter architecture with Firebase for authentication and cloud sync, and SQLite for offline local storage.",
    tools: ["Flutter", "Firebase", "JWT", "SQLite"],
    role: "Full-Stack Developer",
    code: "https://github.com/bahToureOumarToure/fitness_log_",
    demo: "",
    date: "2025-11-10",
    images: ["/projects/fitness-log/screens.png"],
    videos: [""],
    highlights: [
      "Cross-platform Flutter mobile app with Firebase + JWT authentication.",
      "Local SQLite persistence for offline mode with cloud synchronisation.",
      "Progress statistics and performance charts for each user.",
    ],
    challenges: [
      "Two-way synchronisation between local SQLite and remote Firebase.",
      "Resolving data conflicts when going offline and reconnecting.",
      "Designing a UX suited to everyday workout tracking.",
    ],
    translations: {
      fr: {
        description:
          "Application mobile de suivi d'entraînement sportif permettant d'enregistrer ses séances, suivre sa progression et analyser ses performances dans le temps. Architecture cross-platform Flutter avec Firebase pour l'authentification et la synchronisation cloud, et SQLite pour le stockage local hors-ligne.",
        role: "Développeur Full-Stack",
        highlights: [
          "Application mobile cross-platform Flutter avec authentification Firebase + JWT.",
          "Persistance locale SQLite pour le mode hors-ligne avec synchronisation cloud.",
          "Statistiques de progression et visualisation des performances par utilisateur.",
        ],
        challenges: [
          "Synchronisation bidirectionnelle entre SQLite local et Firebase distant.",
          "Gestion des conflits de données en mode hors-ligne / reconnexion.",
          "Conception UX adaptée au suivi sportif au quotidien.",
        ],
      },
      es: {
        description:
          "Aplicación móvil de seguimiento de entrenamientos para registrar sesiones, seguir el progreso y analizar el rendimiento a lo largo del tiempo. Arquitectura multiplataforma con Flutter, Firebase para la autenticación y la sincronización en la nube, y SQLite para el almacenamiento local sin conexión.",
        role: "Desarrollador Full-Stack",
        highlights: [
          "Aplicación móvil multiplataforma con Flutter y autenticación Firebase + JWT.",
          "Persistencia local con SQLite para el modo sin conexión, con sincronización en la nube.",
          "Estadísticas de progreso y gráficos de rendimiento por usuario.",
        ],
        challenges: [
          "Sincronización bidireccional entre SQLite local y Firebase remoto.",
          "Resolución de conflictos de datos al desconectarse y volver a conectarse.",
          "Diseño de una UX adaptada al seguimiento deportivo diario.",
        ],
      },
      ar: {
        description:
          "تطبيق هاتف لتتبع التمارين الرياضية يتيح تسجيل الحصص ومتابعة التقدم وتحليل الأداء مع مرور الوقت. معمارية متعددة المنصات بـ Flutter مع Firebase للمصادقة والمزامنة السحابية وSQLite للتخزين المحلي دون اتصال.",
        role: "مطوّر Full-Stack",
        highlights: [
          "تطبيق هاتف متعدد المنصات بـ Flutter مع مصادقة Firebase وJWT.",
          "تخزين محلي بـ SQLite للعمل دون اتصال مع مزامنة سحابية.",
          "إحصاءات التقدم ورسوم الأداء لكل مستخدم.",
        ],
        challenges: [
          "مزامنة ثنائية الاتجاه بين SQLite المحلي وFirebase البعيد.",
          "حل تعارضات البيانات عند انقطاع الاتصال وعودته.",
          "تصميم تجربة استخدام تناسب المتابعة الرياضية اليومية.",
        ],
      },
    },
  },
  {
    id: 8,
    name: "Department Management",
    description:
      "HR web application for managing departments and employees, showcasing a complete MVC architecture with Spring Boot. Routes secured with Spring Security, persistence through Spring Data JPA and server-side rendering with Thymeleaf. Team project carried out as part of the engineering curriculum.",
    tools: [
      "Java",
      "Spring Boot",
      "Spring Data JPA",
      "Spring Security",
      "Thymeleaf",
      "MySQL",
    ],
    role: "Backend Developer (Team)",
    code: "https://github.com/zahraemourid/JeeProject",
    demo: "",
    date: "2025-06-15",
    images: ["/projects/gestion-departement/listing.png"],
    videos: [""],
    highlights: [
      "Complete Spring Boot MVC architecture.",
      "Role-based security with Spring Security.",
      "Teamwork with a Git / pull request workflow.",
    ],
    challenges: [
      "Coordinating contributions from several developers on a shared repository.",
      "Handling complex JPA relationships between departments, employees and roles.",
    ],
    translations: {
      fr: {
        name: "Gestion de Département",
        description:
          "Application web RH pour la gestion de départements et d'employés, illustrant une architecture MVC complète avec Spring Boot. Sécurisation des routes par Spring Security, persistance via Spring Data JPA et rendu serveur avec Thymeleaf. Projet collaboratif en équipe étudiante dans le cadre du cursus d'ingénieur.",
        role: "Développeur back-end (en équipe)",
        highlights: [
          "Mise en œuvre d'une architecture MVC Spring Boot complète.",
          "Sécurisation par rôles avec Spring Security.",
          "Collaboration en équipe avec workflow Git / Pull Requests.",
        ],
        challenges: [
          "Coordination des contributions multi-développeurs sur un dépôt partagé.",
          "Gestion des relations JPA complexes entre départements, employés et rôles.",
        ],
      },
      es: {
        name: "Gestión de departamentos",
        description:
          "Aplicación web de RR. HH. para gestionar departamentos y empleados, que ilustra una arquitectura MVC completa con Spring Boot. Rutas protegidas con Spring Security, persistencia con Spring Data JPA y renderizado en el servidor con Thymeleaf. Proyecto en equipo realizado en el marco de la carrera de ingeniería.",
        role: "Desarrollador back-end (en equipo)",
        highlights: [
          "Arquitectura MVC completa con Spring Boot.",
          "Seguridad basada en roles con Spring Security.",
          "Trabajo en equipo con un flujo Git / pull requests.",
        ],
        challenges: [
          "Coordinación de las contribuciones de varios desarrolladores en un repositorio compartido.",
          "Gestión de relaciones JPA complejas entre departamentos, empleados y roles.",
        ],
      },
      ar: {
        name: "تسيير الأقسام",
        description:
          "تطبيق ويب للموارد البشرية لتسيير الأقسام والموظفين، يجسّد معمارية MVC كاملة بـ Spring Boot. تأمين المسارات بـ Spring Security، والحفظ عبر Spring Data JPA، والعرض من جهة الخادم بـ Thymeleaf. مشروع جماعي أُنجز ضمن مسار التكوين الهندسي.",
        role: "مطوّر الواجهة الخلفية (ضمن فريق)",
        highlights: [
          "معمارية MVC كاملة بـ Spring Boot.",
          "تأمين قائم على الأدوار بـ Spring Security.",
          "عمل جماعي بسير عمل Git وطلبات الدمج (Pull Requests).",
        ],
        challenges: [
          "تنسيق مساهمات عدة مطوّرين على مستودع مشترك.",
          "إدارة علاقات JPA معقدة بين الأقسام والموظفين والأدوار.",
        ],
      },
    },
  },
  {
    id: 10,
    name: "Burger Queen",
    description:
      "Flutter mobile app for managing orders in a fast-food chain. Order-taking interface for waiters, kitchen dashboard and billing system. Spring Boot back-end with a REST architecture and relational MySQL persistence.",
    tools: ["Flutter", "REST API"],
    role: "Full-Stack Developer",
    code: "https://github.com/bahToureOumarToure/burgger_queen",
    demo: "",
    date: "2025-04-05",
    images: ["/projects/burger-queen/order-screen.png"],
    videos: [""],
    highlights: [
      "Real-time order management system for the kitchen.",
      "Waiter interface optimised for tablets.",
      "Automatic generation of receipts.",
    ],
    challenges: [
      "Synchronising orders between several user roles.",
      "Designing a data model suited to a restaurant workflow.",
    ],
    translations: {
      fr: {
        description:
          "Application mobile Flutter de gestion de commandes pour une chaîne de restauration rapide. Interface de prise de commande pour les serveurs, tableau de bord cuisine et système de facturation. Backend Spring Boot avec architecture REST et persistance relationnelle MySQL.",
        role: "Développeur Full-Stack",
        highlights: [
          "Système de gestion de commandes en temps réel pour la cuisine.",
          "Interface serveur optimisée pour tablette.",
          "Génération automatique des tickets de caisse.",
        ],
        challenges: [
          "Synchronisation des commandes entre plusieurs rôles utilisateurs.",
          "Conception d'un modèle de données adapté à un workflow restaurant.",
        ],
      },
      es: {
        description:
          "Aplicación móvil en Flutter para gestionar los pedidos de una cadena de comida rápida. Interfaz de toma de pedidos para camareros, panel de cocina y sistema de facturación. Back-end en Spring Boot con arquitectura REST y persistencia relacional en MySQL.",
        role: "Desarrollador Full-Stack",
        highlights: [
          "Sistema de gestión de pedidos en tiempo real para la cocina.",
          "Interfaz para camareros optimizada para tableta.",
          "Generación automática de tickets de caja.",
        ],
        challenges: [
          "Sincronización de los pedidos entre varios roles de usuario.",
          "Diseño de un modelo de datos adaptado al flujo de trabajo de un restaurante.",
        ],
      },
      ar: {
        description:
          "تطبيق هاتف بـ Flutter لتسيير الطلبات في سلسلة مطاعم للوجبات السريعة. واجهة لتسجيل الطلبات خاصة بالنُّدُل، ولوحة تحكم للمطبخ، ونظام فوترة. واجهة خلفية بـ Spring Boot بمعمارية REST وتخزين علائقي في MySQL.",
        role: "مطوّر Full-Stack",
        highlights: [
          "نظام لتسيير الطلبات في الوقت الفعلي للمطبخ.",
          "واجهة للنُّدُل مُحسَّنة للأجهزة اللوحية.",
          "إنشاء تلقائي لتذاكر الصندوق.",
        ],
        challenges: [
          "مزامنة الطلبات بين عدة أدوار للمستخدمين.",
          "تصميم نموذج بيانات يلائم سير العمل في المطعم.",
        ],
      },
    },
  },
  {
    id: 11,
    name: "Personal Portfolio",
    description:
      "Responsive personal portfolio presenting my projects, skills and background. A showcase of my work in web development, AI and data, hosted on bahoumartoure.com with an architecture optimised for performance and SEO.",
    tools: ["React", "Next.js", "Tailwind CSS"],
    role: "Full-Stack Developer",
    code: "https://github.com/bahToureOumarToure/MonPortfolio",
    demo: "https://bahoumartoure.com",
    date: "2025-03-10",
    images: ["/projects/portfolio/home.png"],
    videos: [""],
    highlights: [
      "Modern Next.js architecture with hybrid SSR/SSG rendering.",
      "Responsive and accessible design with Tailwind CSS.",
      "Dynamic projects section driven by a structured data source.",
    ],
    challenges: [
      "SEO and Lighthouse performance optimisation.",
      "Designing a scalable, maintainable project data structure.",
    ],
    translations: {
      fr: {
        name: "Portfolio Personnel",
        description:
          "Site portfolio personnel responsive présentant mes projets, compétences et parcours. Vitrine de mes réalisations en développement web, IA et data, hébergée sur bahoumartoure.com avec architecture optimisée pour les performances et le SEO.",
        role: "Développeur Full-Stack",
        highlights: [
          "Architecture moderne Next.js avec rendu hybride SSR/SSG.",
          "Design responsive et accessible avec Tailwind CSS.",
          "Section projets dynamique alimentée par un fichier de données structuré.",
        ],
        challenges: [
          "Optimisation SEO et performance Lighthouse.",
          "Conception d'une structure de données projets évolutive et maintenable.",
        ],
      },
      es: {
        name: "Portafolio personal",
        description:
          "Portafolio personal responsive que presenta mis proyectos, habilidades y trayectoria. Escaparate de mis trabajos en desarrollo web, IA y datos, alojado en bahoumartoure.com con una arquitectura optimizada para el rendimiento y el SEO.",
        role: "Desarrollador Full-Stack",
        highlights: [
          "Arquitectura moderna con Next.js y renderizado híbrido SSR/SSG.",
          "Diseño responsive y accesible con Tailwind CSS.",
          "Sección de proyectos dinámica alimentada por una fuente de datos estructurada.",
        ],
        challenges: [
          "Optimización del SEO y del rendimiento en Lighthouse.",
          "Diseño de una estructura de datos de proyectos escalable y mantenible.",
        ],
      },
      ar: {
        name: "معرض الأعمال الشخصي",
        description:
          "موقع شخصي متجاوب يعرض مشاريعي ومهاراتي ومساري. واجهة لأعمالي في تطوير الويب والذكاء الاصطناعي والبيانات، مستضاف على bahoumartoure.com بمعمارية مُحسَّنة للأداء ولمحركات البحث.",
        role: "مطوّر Full-Stack",
        highlights: [
          "معمارية حديثة بـ Next.js مع عرض هجين SSR/SSG.",
          "تصميم متجاوب وسهل الوصول باستخدام Tailwind CSS.",
          "قسم مشاريع ديناميكي يعتمد على مصدر بيانات منظم.",
        ],
        challenges: [
          "تحسين محركات البحث والأداء في Lighthouse.",
          "تصميم بنية بيانات للمشاريع قابلة للتطور وسهلة الصيانة.",
        ],
      },
    },
  },
];
