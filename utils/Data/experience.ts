// Parcours : texte de base en anglais + traductions fr / es / ar.

export interface ExperienceText {
  title: string;
  company: string;
  duration: string;
  details: string[];
}

export interface ExperienceData extends ExperienceText {
  id: number;
  translations: Record<"fr" | "es" | "ar", ExperienceText>;
}

export const experiences: ExperienceData[] = [
  {
    id: 1,
    title: "Looking for a summer internship (PFA)",
    company: "Open to opportunities",
    duration: "July 2026 – September 2026",
    details: [
      "Looking for a 2- to 3-month summer internship to apply my academic knowledge to real software projects.",
      "Eager to support a technical team on Full-Stack (Spring Boot) or Data/AI development work.",
      "Motivated to learn industry best practices, work with Agile methods and grow my technical skills.",
      "Available on site (Oujda-Berkane, Morocco) or remotely.",
    ],
    translations: {
      fr: {
        title: "À la recherche d'un stage d'été (PFA)",
        company: "À l'écoute d'opportunités",
        duration: "Juillet 2026 – Septembre 2026",
        details: [
          "À la recherche d'un stage d'été de 2 à 3 mois pour appliquer mes connaissances académiques sur des projets Software concrets.",
          "Désireux d'accompagner une équipe technique sur des missions en développement Full-Stack (Spring Boot) ou Data/IA.",
          "Motivé pour apprendre les bonnes pratiques de l'industrie, travailler en méthode Agile et monter en compétences techniques.",
          "Disponible pour des missions en présentiel (Oujda-Berkane/Maroc) ou en @Remote.",
        ],
      },
      es: {
        title: "En busca de prácticas de verano (PFA)",
        company: "Abierto a oportunidades",
        duration: "Julio de 2026 – Septiembre de 2026",
        details: [
          "Busco prácticas de verano de 2 a 3 meses para aplicar mis conocimientos académicos en proyectos de software reales.",
          "Con ganas de apoyar a un equipo técnico en tareas de desarrollo Full-Stack (Spring Boot) o de Data/IA.",
          "Motivado para aprender las buenas prácticas del sector, trabajar con metodologías ágiles y reforzar mis competencias técnicas.",
          "Disponible de forma presencial (Oujda-Berkane, Marruecos) o en remoto.",
        ],
      },
      ar: {
        title: "أبحث عن تدريب صيفي (PFA)",
        company: "منفتح على الفرص",
        duration: "يوليو 2026 – سبتمبر 2026",
        details: [
          "أبحث عن تدريب صيفي لمدة شهرين إلى ثلاثة أشهر لتطبيق معارفي الأكاديمية على مشاريع برمجية حقيقية.",
          "متحمس لمرافقة فريق تقني في مهام تطوير Full-Stack (Spring Boot) أو البيانات والذكاء الاصطناعي.",
          "متحفز لتعلم أفضل ممارسات المهنة والعمل وفق منهجية Agile وتطوير مهاراتي التقنية.",
          "متاح للعمل حضوريًا (وجدة - بركان، المغرب) أو عن بُعد.",
        ],
      },
    },
  },
  {
    id: 2,
    title: "Looking for a final-year internship (PFE)",
    company: "Open to pre-hiring opportunities",
    duration: "January 2027 – July 2027",
    details: [
      "Looking for a 6-month internship to complete my degree and launch my career as a junior software engineer.",
      "Interested in R&D topics or projects combining Web/Mobile development and Artificial Intelligence.",
      "Ready to take on a complete engineering problem, from software architecture design through to deployment.",
      "Keen to join a team that values mentoring and continuous learning.",
    ],
    translations: {
      fr: {
        title: "À la recherche d'un stage de fin d'études (PFE)",
        company: "Ouvert aux opportunités de pré-embauche",
        duration: "Janvier 2027 – Juillet 2027",
        details: [
          "À la recherche d'un stage de 6 mois pour valider mon diplôme et lancer ma carrière d'ingénieur Software junior.",
          "Intéressé par des sujets R&D ou des projets alliant développement Web/Mobile et Intelligence Artificielle.",
          "Prêt à m'investir sur une problématique d'ingénierie complète, de la conception de l'architecture logicielle jusqu'au déploiement.",
          "Souhaitant intégrer une équipe qui valorise le mentorat et l'apprentissage continu.",
        ],
      },
      es: {
        title: "En busca de prácticas de fin de carrera (PFE)",
        company: "Abierto a oportunidades de preincorporación",
        duration: "Enero de 2027 – Julio de 2027",
        details: [
          "Busco unas prácticas de 6 meses para obtener mi título e iniciar mi carrera como ingeniero de software junior.",
          "Interesado en temas de I+D o en proyectos que combinen desarrollo web/móvil e Inteligencia Artificial.",
          "Dispuesto a implicarme en un problema de ingeniería completo, desde el diseño de la arquitectura de software hasta el despliegue.",
          "Deseo unirme a un equipo que valore la mentoría y el aprendizaje continuo.",
        ],
      },
      ar: {
        title: "أبحث عن تدريب نهاية الدراسة (PFE)",
        company: "منفتح على فرص ما قبل التوظيف",
        duration: "يناير 2027 – يوليو 2027",
        details: [
          "أبحث عن تدريب لمدة 6 أشهر لنيل شهادتي وبدء مسيرتي كمهندس برمجيات مبتدئ.",
          "مهتم بمواضيع البحث والتطوير أو بالمشاريع التي تجمع بين تطوير الويب والهاتف والذكاء الاصطناعي.",
          "مستعد للانخراط في إشكالية هندسية متكاملة، من تصميم معمارية البرمجيات إلى النشر.",
          "أرغب في الانضمام إلى فريق يقدّر التأطير والتعلم المستمر.",
        ],
      },
    },
  },
];
