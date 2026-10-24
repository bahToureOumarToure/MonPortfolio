"use client";
import { useMemo, useState } from "react";
import {
  Check,
  LoaderCircle,
  Monitor,
  Moon,
  RotateCcw,
  Save,
  Sun,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { normalizeHex } from "@/lib/color";
import { resetTheme, updateTheme } from "@/lib/actions/theme";
import {
  ACCENT_PRESETS,
  DEFAULT_THEME,
  MODE_LABELS,
  RADIUS_LABELS,
  RADIUS_VALUES,
  THEME_MODES,
  THEME_RADII,
  accentWarnings,
  brandVars,
  type ThemeMode,
  type ThemeVM,
} from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { ColorInput, Panel } from "./ui";
import { useAction, useUnsavedWarning } from "./use-action";

const MODE_ICONS: Record<ThemeMode, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export default function AppearanceForm({
  initial,
  disabled = false,
}: {
  initial: ThemeVM;
  disabled?: boolean;
}) {
  const [theme, setTheme] = useState<ThemeVM>(initial);
  const [saved, setSaved] = useState<ThemeVM>(initial);
  const [customAccent, setCustomAccent] = useState(initial.accent);
  const [previewSurface, setPreviewSurface] = useState<"light" | "dark">(
    initial.mode === "dark" ? "dark" : "light",
  );
  const { pending, execute } = useAction();

  const dirty = JSON.stringify(theme) !== JSON.stringify(saved);
  useUnsavedWarning(dirty && !pending);
  const warnings = useMemo(() => accentWarnings(theme), [theme]);

  function set<K extends keyof ThemeVM>(key: K, value: ThemeVM[K]) {
    setTheme((t) => ({ ...t, [key]: value }));
    if (key === "mode") setPreviewSurface(value === "dark" ? "dark" : "light");
  }

  function setAccent(value: string) {
    setCustomAccent(value);
    const hex = normalizeHex(value);
    if (hex) set("accent", hex);
  }

  async function save() {
    const res = await execute(() => updateTheme(theme), {
      success: "Apparence enregistrée : le site est à jour.",
    });
    if (res.ok) setSaved(theme);
  }

  async function reset() {
    if (!window.confirm("Revenir au thème par défaut (clair, accent rouge) ?"))
      return;
    const res = await execute(() => resetTheme(), {
      success: "Thème par défaut rétabli.",
    });
    if (res.ok) {
      setTheme(DEFAULT_THEME);
      setSaved(DEFAULT_THEME);
      setCustomAccent(DEFAULT_THEME.accent);
      setPreviewSurface("light");
    }
  }

  const isPreset = ACCENT_PRESETS.some((p) => p.value === theme.accent);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
      <div className="flex flex-col gap-6">
        <Panel
          title="Mode"
          description="Le mode clair est recommandé pour un rendu simple et lisible."
        >
          <div
            role="radiogroup"
            aria-label="Mode d'affichage"
            className="grid gap-3 sm:grid-cols-3"
          >
            {THEME_MODES.map((mode) => {
              const Icon = MODE_ICONS[mode];
              const active = theme.mode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={disabled}
                  onClick={() => set("mode", mode)}
                  className={cn(
                    "flex flex-col gap-3 rounded-xl border p-3 text-left transition-colors disabled:opacity-60",
                    active
                      ? "border-primary ring-2 ring-primary/20"
                      : "hover:bg-muted/50",
                  )}
                >
                  <ModeSwatch mode={mode} accent={theme.accent} />
                  <span className="flex items-start gap-2">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>
                      <span className="block text-sm font-medium">
                        {MODE_LABELS[mode].label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {MODE_LABELS[mode].description}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel
          title="Couleur d'accent"
          description="Boutons, liens, titres mis en avant et icônes."
        >
          <div className="flex flex-col gap-5">
            <div
              role="radiogroup"
              aria-label="Couleurs prédéfinies"
              className="flex flex-wrap gap-3"
            >
              {ACCENT_PRESETS.map((preset) => {
                const active = theme.accent === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={preset.name}
                    title={preset.name}
                    disabled={disabled}
                    onClick={() => setAccent(preset.value)}
                    className={cn(
                      "relative h-10 w-10 rounded-full border-2 shadow-[inset_0_0_0_1px_hsl(var(--foreground)/0.12)] transition-transform hover:scale-105 disabled:opacity-60",
                      active ? "border-foreground" : "border-transparent",
                    )}
                    style={{ backgroundColor: preset.value }}
                  >
                    {active && (
                      <Check
                        className="absolute inset-0 m-auto h-4 w-4"
                        style={{
                          color: `hsl(${brandVars(preset.value, "light").foreground})`,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col gap-2 sm:max-w-xs">
              <span className="text-sm font-medium">
                Couleur personnalisée{" "}
                {!isPreset && <span className="text-primary">· active</span>}
              </span>
              <ColorInput
                value={customAccent}
                onChange={setAccent}
                placeholder="#dc2626"
              />
            </div>
            {warnings.map((w) => (
              <p
                key={w}
                className="flex items-start gap-2 text-sm text-warning"
              >
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                {w}
              </p>
            ))}
          </div>
        </Panel>

        <Panel
          title="Arrondis"
          description="Forme des cartes, boutons et champs."
        >
          <div
            role="radiogroup"
            aria-label="Arrondis"
            className="grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {THEME_RADII.map((radius) => {
              const active = theme.radius === radius;
              return (
                <button
                  key={radius}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={disabled}
                  onClick={() => set("radius", radius)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-3 text-sm transition-colors disabled:opacity-60",
                    active
                      ? "border-primary ring-2 ring-primary/20"
                      : "hover:bg-muted/50",
                  )}
                >
                  <span
                    className="h-8 w-12 border-2 border-foreground/40 bg-muted"
                    style={{ borderRadius: RADIUS_VALUES[radius] }}
                  />
                  {RADIUS_LABELS[radius]}
                </button>
              );
            })}
          </div>
        </Panel>
      </div>

      <div className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
        <Panel
          title="Aperçu"
          actions={
            theme.mode === "system" && (
              <div className="inline-flex rounded-lg border p-0.5 text-xs">
                {(["light", "dark"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPreviewSurface(s)}
                    aria-pressed={previewSurface === s}
                    className={cn(
                      "rounded-md px-2.5 py-1",
                      previewSurface === s
                        ? "bg-muted font-medium"
                        : "text-muted-foreground",
                    )}
                  >
                    {s === "light" ? "Clair" : "Sombre"}
                  </button>
                ))}
              </div>
            )
          }
        >
          <ThemePreview theme={theme} surface={previewSurface} />
        </Panel>

        <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm">
          {dirty ? (
            <p className="text-xs text-muted-foreground">
              Modifications non enregistrées.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Le site utilise ces réglages.
            </p>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={reset}
              disabled={pending || disabled}
            >
              <RotateCcw /> Par défaut
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={save}
              disabled={pending || disabled || !dirty}
            >
              {pending ? <LoaderCircle className="animate-spin" /> : <Save />}
              Enregistrer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeSwatch({ mode, accent }: { mode: ThemeMode; accent: string }) {
  const half = (surface: "light" | "dark") => (
    <div
      className={cn(surface, "flex flex-1 flex-col gap-1.5 bg-background p-2")}
      style={
        { "--primary": brandVars(accent, surface).brand } as React.CSSProperties
      }
    >
      <span className="h-1.5 w-8 rounded-full bg-foreground/70" />
      <span className="h-1.5 w-12 rounded-full bg-muted-foreground/40" />
      <span className="mt-auto h-3 w-8 rounded bg-primary" />
    </div>
  );
  return (
    <div className="flex h-16 overflow-hidden rounded-lg border">
      {mode === "system" ? (
        <>
          {half("light")}
          {half("dark")}
        </>
      ) : (
        half(mode)
      )}
    </div>
  );
}

/** Mini page rendue avec les tokens du thème en cours d'édition. */
function ThemePreview({
  theme,
  surface,
}: {
  theme: ThemeVM;
  surface: "light" | "dark";
}) {
  const brand = brandVars(theme.accent, surface);
  const style = {
    "--brand": brand.brand,
    "--brand-foreground": brand.foreground,
    "--primary": brand.brand,
    "--primary-foreground": brand.foreground,
    "--ring": brand.brand,
    "--radius": RADIUS_VALUES[theme.radius],
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        surface,
        "overflow-hidden rounded-xl border bg-background text-foreground",
      )}
      style={style}
    >
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-xs font-semibold">Bah Oumar Touré</span>
        <span className="rounded-md bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground">
          Me contacter
        </span>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <span className="w-fit rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground">
          Disponible pour un stage
        </span>
        <p className="text-lg font-semibold leading-tight">
          Crafting Digital <span className="text-primary">Masterpieces</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Applications full-stack, mobile, data et IA.
        </p>
        <div className="flex gap-2">
          <span className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
            Voir mes projets
          </span>
          <span className="rounded-lg border px-3 py-1.5 text-xs font-medium">
            Télécharger le CV
          </span>
        </div>
        <div className="mt-1 rounded-xl border bg-card p-3 shadow-sm">
          <p className="text-xs font-semibold">HubEats</p>
          <p className="text-[10px] font-medium text-primary">
            Full-Stack Developer
          </p>
          <div className="mt-2 flex gap-1">
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">
              Spring Boot
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
              React
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
