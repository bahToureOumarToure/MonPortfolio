import { ReactNode } from "react";
import type { ProjectVM } from "@/lib/content-types";

export interface AnimationLottieProps {
  animationPath: object; // JSON object for the animation data.
  width?: string | number; // Optional width prop for customization.
}
export interface GlowCardProps {
  children: ReactNode;
  identifier: string;
}
export interface ProjectCardProps {
  project: ProjectVM;
}
export interface Props {
  children: ReactNode;
}
