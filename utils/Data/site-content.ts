// Textes des sections uniques (accueil, à propos, paramètres) : base en
// anglais + traductions fr / es / ar. Utilisés par le seed et comme contenu de
// repli si la base est vide.

type Lang = "fr" | "es" | "ar";

export interface HeroText {
  tagline: string;
  headingTop: string;
  headingBottom: string;
  designation: string;
  alternateWords: string[];
  subheading: string;
  ctaPrimaryLabel: string;
  ctaResumeLabel: string;
}

export interface ProfileText {
  aboutTitle: string;
  aboutHighlight: string;
  description: string;
}

export interface SettingsText {
  siteTitle: string;
  metaDescription: string;
  footerTagline: string;
  address: string;
}

export const heroContent: HeroText & { translations: Record<Lang, HeroText> } =
  {
    tagline: "WELCOME TO MY UNIVERSE",
    headingTop: "Crafting Digital",
    headingBottom: "Masterpieces",
    designation: "Full-Stack Web/Mobile & AI/Data and Designer",
    alternateWords: [
      "Developer.",
      "DevOps.",
      "Engineer.",
      "Blogger.",
      "Innovator.",
      "Designer.",
    ],
    subheading:
      "dedicated to building high-performance, user-focused digital products",
    ctaPrimaryLabel: "Let's Collaborate",
    ctaResumeLabel: "Get Resume",
    translations: {
      fr: {
        tagline: "BIENVENUE DANS MON UNIVERS",
        headingTop: "Créer des",
        headingBottom: "chefs-d'œuvre numériques",
        designation: "Full-Stack Web/Mobile, IA/Data et Designer",
        alternateWords: [
          "Développeur logiciel.",
          "Ingénieur DevOps.",
          "Ingénieur logiciel.",
          "Blogueur.",
          "Innovateur.",
          "Designer.",
        ],
        subheading:
          "dédié à la création de produits numériques performants et centrés sur l'utilisateur",
        ctaPrimaryLabel: "Collaborons",
        ctaResumeLabel: "Télécharger mon CV",
      },
      es: {
        tagline: "BIENVENIDO A MI UNIVERSO",
        headingTop: "Creando obras maestras",
        headingBottom: "digitales",
        designation: "Full-Stack Web/Móvil, IA/Data y Diseñador",
        alternateWords: [
          "Desarrollador de software.",
          "Ingeniero DevOps.",
          "Ingeniero de software.",
          "Bloguero.",
          "Innovador.",
          "Diseñador.",
        ],
        subheading:
          "dedicado a crear productos digitales de alto rendimiento centrados en el usuario",
        ctaPrimaryLabel: "Colaboremos",
        ctaResumeLabel: "Descargar CV",
      },
      ar: {
        tagline: "مرحبًا بك في عالمي",
        headingTop: "صناعة",
        headingBottom: "روائع رقمية",
        designation: "Full-Stack ويب وهاتف، ذكاء اصطناعي وبيانات، ومصمّم",
        alternateWords: [
          "مطوّر برمجيات.",
          "مهندس DevOps.",
          "مهندس برمجيات.",
          "مدوّن.",
          "مبتكر.",
          "مصمّم.",
        ],
        subheading: "مكرّس لبناء منتجات رقمية عالية الأداء تتمحور حول المستخدم",
        ctaPrimaryLabel: "لنتعاون",
        ctaResumeLabel: "تحميل السيرة الذاتية",
      },
    },
  };

export const profileContent: ProfileText & {
  translations: Record<Lang, ProfileText>;
} = {
  aboutTitle: "About",
  aboutHighlight: "The Software Engineer",
  description:
    "Junior Web & Mobile Developer, DevOps, Designer, and Blogger. I combine code, AI, and content creation to build strong brand identities and high-performance digital experiences.",
  translations: {
    fr: {
      aboutTitle: "À propos de",
      aboutHighlight: "l'ingénieur logiciel",
      description:
        "Développeur Web & Mobile junior, DevOps, designer et blogueur. J'associe code, IA et création de contenu pour bâtir des identités de marque fortes et des expériences numériques performantes.",
    },
    es: {
      aboutTitle: "Sobre",
      aboutHighlight: "el ingeniero de software",
      description:
        "Desarrollador web y móvil junior, DevOps, diseñador y bloguero. Combino código, IA y creación de contenido para construir identidades de marca sólidas y experiencias digitales de alto rendimiento.",
    },
    ar: {
      aboutTitle: "نبذة عن",
      aboutHighlight: "مهندس البرمجيات",
      description:
        "مطوّر ويب وتطبيقات هاتف مبتدئ، مهتم بـ DevOps، مصمّم ومدوّن. أجمع بين البرمجة والذكاء الاصطناعي وصناعة المحتوى لبناء هويات قوية للعلامات وتجارب رقمية عالية الأداء.",
    },
  },
};

export const settingsContent: SettingsText & {
  translations: Record<Lang, SettingsText>;
} = {
  siteTitle: "Bah Oumar Touré Portfolio",
  metaDescription:
    "Portfolio of Bah Oumar Touré — engineering student at ENIAD Berkane. AI, Data, DevOps & Full-Stack.",
  footerTagline:
    "A curated showcase of high-performance full-stack applications, AI experiments, and intuitive digital experiences built with purpose.",
  address: "Berkane, Morocco",
  translations: {
    fr: {
      siteTitle: "Portfolio de Bah Oumar Touré",
      metaDescription:
        "Portfolio de Bah Oumar Touré — Étudiant ingénieur ENIAD Berkane. IA, Data, DevOps & Full-Stack.",
      footerTagline:
        "Une sélection d'applications full-stack performantes, d'expérimentations en IA et d'expériences numériques intuitives, conçues avec soin.",
      address: "Berkane, Maroc",
    },
    es: {
      siteTitle: "Portafolio de Bah Oumar Touré",
      metaDescription:
        "Portafolio de Bah Oumar Touré — estudiante de ingeniería en la ENIAD Berkane. IA, Data, DevOps y Full-Stack.",
      footerTagline:
        "Una selección de aplicaciones full-stack de alto rendimiento, experimentos de IA y experiencias digitales intuitivas, creadas con propósito.",
      address: "Berkane, Marruecos",
    },
    ar: {
      siteTitle: "معرض أعمال باه عمر توري",
      metaDescription:
        "معرض أعمال باه عمر توري — طالب مهندس بالمدرسة الوطنية للذكاء الاصطناعي والرقمنة ببركان. الذكاء الاصطناعي، البيانات، DevOps وFull-Stack.",
      footerTagline:
        "مجموعة مختارة من تطبيقات Full-Stack عالية الأداء وتجارب في الذكاء الاصطناعي وتجارب رقمية سلسة، صُنعت بعناية.",
      address: "بركان، المغرب",
    },
  },
};
