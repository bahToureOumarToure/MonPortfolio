// Registre d'icônes pour les liens sociaux — config technique (reste en code).
// L'admin choisit une `iconKey` ; le rendu résout l'icône + une couleur par défaut.
import type { IconType } from "react-icons";
import {
  FaGithub,
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaStackOverflow,
  FaLink,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";

export const getSocialIcon = (key?: string | null): IconType => {
  switch ((key ?? "").toLowerCase().trim()) {
    case "github":
      return FaGithub;
    case "linkedin":
      return FaLinkedinIn;
    case "twitter":
    case "x":
      return FaXTwitter;
    case "facebook":
      return FaFacebookF;
    case "instagram":
      return FaInstagram;
    case "stackoverflow":
    case "stack overflow":
      return FaStackOverflow;
    case "leetcode":
      return SiLeetcode;
    default:
      return FaLink;
  }
};

export const getSocialColor = (key?: string | null): string => {
  switch ((key ?? "").toLowerCase().trim()) {
    case "github":
      return "#ffffff";
    case "linkedin":
      return "#0077b5";
    case "twitter":
    case "x":
      return "#1da1f2";
    case "facebook":
      return "#1877f2";
    case "instagram":
      return "#e4405f";
    case "stackoverflow":
    case "stack overflow":
      return "#f48024";
    case "leetcode":
      return "#ffa116";
    default:
      return "#ef4444";
  }
};
