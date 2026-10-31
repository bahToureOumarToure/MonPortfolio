import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations("NotFound");
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="font-mono text-sm font-medium text-primary">{t("code")}</p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        {t("title")}
      </h1>
      <p className="max-w-md text-muted-foreground">{t("text")}</p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">{t("home")}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/projects">{t("projects")}</Link>
        </Button>
      </div>
    </div>
  );
}
