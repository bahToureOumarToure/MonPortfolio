"use client";
import { useState } from "react";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input, Textarea } from "@/components/ui/input";
import { Field } from "./ui";

/** Langues traduites dans l'admin (l'anglais = les champs principaux). */
const LANGS = [
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "ar", label: "العربية" },
] as const;
type Lang = (typeof LANGS)[number]["code"];

export interface TranslationField {
  key: string;
  label: string;
  /** text (défaut) · textarea · lines (une valeur par ligne) · csv (virgules) */
  kind?: "text" | "textarea" | "lines" | "csv";
}

/** Saisie en cours : une chaîne par champ et par langue. */
export type TranslationsState = Partial<Record<Lang, Record<string, string>>>;

function toText(value: unknown, kind: TranslationField["kind"]): string {
  if (Array.isArray(value)) {
    return value
      .filter((v) => typeof v === "string")
      .join(kind === "csv" ? ", " : "\n");
  }
  return typeof value === "string" ? value : "";
}

/** JSON stocké en base → état du formulaire. */
export function translationsFromJson(
  json: unknown,
  fields: TranslationField[],
): TranslationsState {
  const state: TranslationsState = {};
  if (!json || typeof json !== "object") return state;
  for (const { code } of LANGS) {
    const tr = (json as Record<string, unknown>)[code];
    if (!tr || typeof tr !== "object") continue;
    state[code] = Object.fromEntries(
      fields.map((f) => [
        f.key,
        toText((tr as Record<string, unknown>)[f.key], f.kind),
      ]),
    );
  }
  return state;
}

/** État du formulaire → valeur envoyée au serveur (listes découpées). */
export function translationsToPayload(
  state: TranslationsState,
  fields: TranslationField[],
): Record<string, Record<string, string | string[]>> {
  const out: Record<string, Record<string, string | string[]>> = {};
  for (const { code } of LANGS) {
    const entry: Record<string, string | string[]> = {};
    for (const f of fields) {
      const raw = (state[code]?.[f.key] ?? "").trim();
      if (!raw) continue;
      if (f.kind === "lines" || f.kind === "csv") {
        const list = raw
          .split(f.kind === "csv" ? "," : "\n")
          .map((s) => s.trim())
          .filter(Boolean);
        if (list.length) entry[f.key] = list;
      } else {
        entry[f.key] = raw;
      }
    }
    if (Object.keys(entry).length) out[code] = entry;
  }
  return out;
}

/**
 * Onglets Français / Español / العربية sous les champs principaux (anglais,
 * langue par défaut du site). Un champ laissé vide affiche le texte anglais.
 */
export default function TranslationsEditor({
  fields,
  base,
  value,
  onChange,
  idPrefix,
}: {
  fields: TranslationField[];
  /** Valeurs anglaises actuelles, montrées en exemple. */
  base: Record<string, unknown>;
  value: TranslationsState;
  onChange: (next: TranslationsState) => void;
  idPrefix: string;
}) {
  const [lang, setLang] = useState<Lang>("fr");
  const rtl = lang === "ar";

  function set(key: string, text: string) {
    onChange({ ...value, [lang]: { ...(value[lang] ?? {}), [key]: text } });
  }

  const filled = (code: Lang) =>
    fields.filter((f) => (value[code]?.[f.key] ?? "").trim()).length;

  return (
    <div className="rounded-xl border bg-muted/30 p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Languages className="h-4 w-4 text-primary" /> Traductions
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Les champs ci-dessus sont en anglais (langue par défaut du site). Un
            champ laissé vide ici affiche le texte anglais.
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Langue de la traduction"
          className="flex shrink-0 gap-1 rounded-lg border bg-background p-1"
        >
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              role="tab"
              aria-selected={lang === code}
              aria-controls={`${idPrefix}-tr-panel`}
              onClick={() => setLang(code)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                lang === code
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
              <span
                className={cn(
                  "font-mono text-[10px]",
                  lang === code ? "opacity-70" : "opacity-60",
                )}
              >
                {filled(code)}/{fields.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        id={`${idPrefix}-tr-panel`}
        role="tabpanel"
        className="grid gap-4"
        lang={lang}
        dir={rtl ? "rtl" : "ltr"}
      >
        {fields.map((f) => {
          const id = `${idPrefix}-tr-${lang}-${f.key}`;
          const text = value[lang]?.[f.key] ?? "";
          const example = toText(base[f.key], f.kind);
          const multiline =
            f.kind === "textarea" || f.kind === "lines" || example.length > 90;
          const hint =
            f.kind === "lines"
              ? "Un élément par ligne."
              : f.kind === "csv"
                ? "Séparés par des virgules."
                : undefined;
          return (
            <Field key={id} label={f.label} htmlFor={id} hint={hint}>
              {multiline ? (
                <Textarea
                  id={id}
                  rows={f.kind === "lines" ? 4 : 3}
                  value={text}
                  placeholder={example}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              ) : (
                <Input
                  id={id}
                  value={text}
                  placeholder={example}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              )}
            </Field>
          );
        })}
      </div>
    </div>
  );
}
