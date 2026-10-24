"use client";
import {
  createExperience,
  deleteExperience,
  reorderExperiences,
  updateExperience,
} from "@/lib/actions/collections";
import TimelineManager, { type TimelineRow } from "./TimelineManager";

export default function ExperienceManager({
  initial,
}: {
  initial: TimelineRow[];
}) {
  return (
    <TimelineManager
      initial={initial}
      withDetails
      labels={{
        noun: "Expérience",
        subtitle: "Entreprise / contexte",
        subtitlePlaceholder: "Nom de l'entreprise",
        titlePlaceholder: "Stage développeur Full-Stack",
      }}
      actions={{
        create: createExperience,
        update: updateExperience,
        remove: deleteExperience,
        reorder: reorderExperiences,
        toPayload: (f) => ({
          title: f.title,
          company: f.subtitle,
          duration: f.duration,
          details: f.details,
          active: f.active,
        }),
      }}
    />
  );
}
