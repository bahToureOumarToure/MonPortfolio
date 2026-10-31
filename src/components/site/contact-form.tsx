"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import emailjs from "@emailjs/browser";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { isValidEmail } from "@/../utils/check-email";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

const EMPTY = { name: "", email: "", message: "" };

export default function ContactForm({
  fallbackEmail,
}: {
  fallbackEmail: string;
}) {
  const t = useTranslations("Contact.form");
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState<Record<keyof typeof EMPTY, boolean>>({
    name: false,
    email: false,
    message: false,
  });
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const errors = {
    name: values.name.trim() ? "" : t("errName"),
    email: !values.email.trim()
      ? t("errEmail")
      : isValidEmail(values.email)
        ? ""
        : t("errEmailInvalid"),
    message: values.message.trim().length >= 10 ? "" : t("errMessage"),
  };
  const hasErrors = Object.values(errors).some(Boolean);

  function set(field: keyof typeof EMPTY, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (status.kind !== "idle" && status.kind !== "sending")
      setStatus({ kind: "idle" });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (hasErrors) return;

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (!serviceId || !templateId || !publicKey) {
      setStatus({
        kind: "error",
        message: t("notConfigured", { email: fallbackEmail }),
      });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: values.name.trim(),
          email: values.email.trim(),
          message: `${values.message.trim()}\n\nEmail : ${values.email.trim()}`,
        },
        { publicKey },
      );
      setValues(EMPTY);
      setTouched({ name: false, email: false, message: false });
      setStatus({ kind: "sent" });
    } catch {
      setStatus({
        kind: "error",
        message: t("failed", { email: fallbackEmail }),
      });
    }
  }

  const fieldError = (field: keyof typeof EMPTY) =>
    touched[field] && errors[field] ? errors[field] : "";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-xl border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="contact-name" label={t("name")} error={fieldError("name")}>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            maxLength={100}
            placeholder={t("namePlaceholder")}
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            aria-invalid={!!fieldError("name")}
            aria-describedby={
              fieldError("name") ? "contact-name-error" : undefined
            }
          />
        </Field>
        <Field
          id="contact-email"
          label={t("email")}
          error={fieldError("email")}
        >
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={120}
            placeholder={t("emailPlaceholder")}
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            aria-invalid={!!fieldError("email")}
            aria-describedby={
              fieldError("email") ? "contact-email-error" : undefined
            }
          />
        </Field>
      </div>
      <Field
        id="contact-message"
        label={t("message")}
        error={fieldError("message")}
      >
        <Textarea
          id="contact-message"
          name="message"
          rows={5}
          maxLength={1000}
          placeholder={t("messagePlaceholder")}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, message: true }))}
          aria-invalid={!!fieldError("message")}
          aria-describedby={
            fieldError("message") ? "contact-message-error" : undefined
          }
        />
      </Field>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite" className="text-sm">
          {status.kind === "sent" && (
            <p className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-4 w-4" /> {t("sent")}
            </p>
          )}
          {status.kind === "error" && (
            <p className="text-destructive">{status.message}</p>
          )}
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={status.kind === "sending"}
          className="shrink-0"
        >
          {status.kind === "sending" ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Send />
          )}
          {status.kind === "sending" ? t("sending") : t("send")}
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
