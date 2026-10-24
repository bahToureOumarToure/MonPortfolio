"use client";
import {
  createEducation,
  deleteEducation,
  reorderEducations,
  updateEducation,
} from "@/lib/actions/collections";
import TimelineManager, { type TimelineRow } from "./TimelineManager";

export default function EducationManager({
  initial,
}: {
  initial: TimelineRow[];
}) {
  return (
    <TimelineManager
      initial={initial}
      withDetails={false}
      labels={{
        noun: "Formation",
        subtitle: "Établissement",
        subtitlePlaceholder: "ENIAD Berkane",
        titlePlaceholder: "Cycle ingénieur en Génie Informatique",
      }}
      actions={{
        create: createEducation,
        update: updateEducation,
        remove: deleteEducation,
        reorder: reorderEducations,
        toPayload: (f) => ({
          title: f.title,
          institution: f.subtitle,
          duration: f.duration,
          active: f.active,
        }),
      }}
    />
  );
}
