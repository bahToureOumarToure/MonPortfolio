"use client";
import {
  createActivity,
  deleteActivity,
  reorderActivities,
  updateActivity,
} from "@/lib/actions/collections";
import TimelineManager, { type TimelineRow } from "./TimelineManager";

export default function ActivitiesManager({
  initial,
}: {
  initial: TimelineRow[];
}) {
  return (
    <TimelineManager
      initial={initial}
      subtitleKey="organization"
      withDetails
      labels={{
        noun: "Activité",
        subtitle: "Association / club / événement",
        subtitlePlaceholder: "Nom de l'association",
        titlePlaceholder: "Volunteer",
      }}
      actions={{
        create: createActivity,
        update: updateActivity,
        remove: deleteActivity,
        reorder: reorderActivities,
        toPayload: (f) => ({
          title: f.title,
          organization: f.subtitle,
          duration: f.duration,
          details: f.details,
          active: f.active,
        }),
      }}
    />
  );
}
