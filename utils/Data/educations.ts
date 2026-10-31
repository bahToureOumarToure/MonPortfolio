// Formation : texte de base en anglais + traductions fr / es / ar.

export interface EducationText {
  title: string;
  duration: string;
  institution: string;
}

export interface EducationData extends EducationText {
  id: number;
  translations: Record<"fr" | "es" | "ar", EducationText>;
}

export const educations: EducationData[] = [
  {
    id: 1,
    title: "State Engineering Degree, Computer Engineering — 3rd year",
    duration: "Oct. 2024 – Jul. 2027",
    institution:
      "National School of Artificial Intelligence and Digital Technology, Berkane (ENIADB)",
    translations: {
      fr: {
        title: "3e année cycle ingénieur d’État — Génie informatique",
        duration: "oct. 2024 – juil. 2027",
        institution:
          "École Nationale de l’Intelligence Artificielle et du Digital de Berkane (ENIADB)",
      },
      es: {
        title: "Ingeniería de Estado en Informática — 3.er año",
        duration: "oct. 2024 – jul. 2027",
        institution:
          "Escuela Nacional de Inteligencia Artificial y Digital de Berkane (ENIADB)",
      },
      ar: {
        title: "السنة الثالثة من سلك مهندس الدولة — هندسة الإعلاميات",
        duration: "أكتوبر 2024 – يوليو 2027",
        institution:
          "المدرسة الوطنية للذكاء الاصطناعي والرقمنة ببركان (ENIADB)",
      },
    },
  },
  {
    id: 2,
    title:
      "DEUG (two-year university degree) — Applied Mathematics and Computer Science",
    duration: "Oct. 2022 – May 2024",
    institution: "Faculty of Sciences, Oujda",
    translations: {
      fr: {
        title: "DEUG — Mathématiques et Informatique Appliquées",
        duration: "oct. 2022 – mai 2024",
        institution: "Faculté des Sciences d’Oujda",
      },
      es: {
        title:
          "DEUG (diploma universitario de dos años) — Matemáticas e Informática Aplicadas",
        duration: "oct. 2022 – may. 2024",
        institution: "Facultad de Ciencias de Oujda",
      },
      ar: {
        title:
          "دبلوم الدراسات الجامعية العامة (DEUG) — الرياضيات والإعلاميات التطبيقية",
        duration: "أكتوبر 2022 – مايو 2024",
        institution: "كلية العلوم بوجدة",
      },
    },
  },
];
