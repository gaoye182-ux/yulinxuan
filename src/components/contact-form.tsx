"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { AlertCircle, CheckCircle2, Mail, MessageSquareText, Phone, Send, UserRound } from "lucide-react";
import { submitContactAction } from "@/lib/contact-actions";
import type { Language } from "@/lib/i18n";
import { localizedPath } from "@/lib/navigation";

export type ContactFormCopy = {
  form: {
    eyebrow: string;
    title: string;
    lead: string;
    required: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    category: string;
    message: string;
    messagePlaceholder: string;
    privacy: string;
    privacyLink: string;
    submit: string;
    successTitle: string;
    successText: string;
    errors: {
      name: string;
      email: string;
      emailFormat: string;
      message: string;
      privacy: string;
    };
  };
  options: {
    categories: string[];
  };
};

type ContactFormProps = {
  copy: ContactFormCopy;
  lang: Language;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  category: string;
  message: string;
  privacy: boolean;
};

type ErrorMap = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  category: "",
  message: "",
  privacy: false
};

function inputClass(hasError?: boolean) {
  return [
    "min-h-12 w-full min-w-0 border bg-[color:var(--paper)] px-4 text-base text-[color:var(--ink)] outline-none transition",
    "placeholder:text-[color:var(--muted)]/60 focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/20",
    hasError ? "border-[color:var(--red-seal)] bg-[rgba(143,46,36,0.04)]" : "border-[color:var(--border)]"
  ].join(" ");
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-[color:var(--red-seal)]">
      <AlertCircle aria-hidden size={16} className="mt-1 shrink-0" />
      {message}
    </p>
  );
}

export function ContactForm({ copy, lang }: ContactFormProps) {
  const [form, setForm] = useState<FormState>({
    ...initialForm,
    category: copy.options.categories[0]
  });
  const [errors, setErrors] = useState<ErrorMap>({});
  const [state, formAction, pending] = useActionState(submitContactAction, { ok: false });

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validate() {
    const nextErrors: ErrorMap = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) {
      nextErrors.name = copy.form.errors.name;
    }

    if (!form.email.trim()) {
      nextErrors.email = copy.form.errors.email;
    } else if (!emailPattern.test(form.email)) {
      nextErrors.email = copy.form.errors.emailFormat;
    }

    if (!form.message.trim()) {
      nextErrors.message = copy.form.errors.message;
    }

    if (!form.privacy) {
      nextErrors.privacy = copy.form.errors.privacy;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (!validate()) {
      event.preventDefault();
      return;
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="border border-[color:var(--border)] bg-[color:var(--paper)] p-5 md:p-8">
      <input type="hidden" name="lang" value={lang} />
      <div className="border-b border-[color:var(--border)] pb-6">
        <p className="text-xs tracking-[0.3em] text-[color:var(--gold)]">{copy.form.eyebrow}</p>
        <h2 className="mt-3 break-words font-serif text-3xl font-light text-[color:var(--ink)]">{copy.form.title}</h2>
        <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{copy.form.lead}</p>
      </div>

      {state.ok ? (
        <div className="mt-6 border border-[color:var(--gold)] bg-[rgba(176,141,87,0.08)] p-5 text-[color:var(--ink)]">
          <p className="flex items-start gap-3 font-serif text-2xl font-light">
            <CheckCircle2 aria-hidden size={24} className="mt-1 shrink-0 text-[color:var(--gold-dark)]" />
            {copy.form.successTitle}
          </p>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{copy.form.successText}</p>
        </div>
      ) : null}
      {!state.ok && state.message ? (
        <p className="mt-4 flex items-start gap-2 border border-[color:var(--red-seal)] bg-[rgba(143,46,36,0.04)] p-4 text-sm leading-6 text-[color:var(--red-seal)]">
          <AlertCircle aria-hidden size={16} className="mt-1 shrink-0" />
          {state.message}
        </p>
      ) : null}

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-[color:var(--ink)]">
          <span>
            {copy.form.name} <b className="font-normal text-[color:var(--red-seal)]">{copy.form.required}</b>
          </span>
          <div className="relative">
            <UserRound aria-hidden size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--gold-dark)]" />
            <input
              name="name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder={copy.form.namePlaceholder}
              className={`${inputClass(Boolean(errors.name))} pl-11`}
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
            />
          </div>
          <FieldError message={errors.name} />
        </label>

        <label className="grid gap-2 text-sm text-[color:var(--ink)]">
          <span>
            {copy.form.email} <b className="font-normal text-[color:var(--red-seal)]">{copy.form.required}</b>
          </span>
          <div className="relative">
            <Mail aria-hidden size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--gold-dark)]" />
            <input
              name="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder={copy.form.emailPlaceholder}
              className={`${inputClass(Boolean(errors.email))} pl-11`}
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
            />
          </div>
          <FieldError message={errors.email} />
        </label>

        <label className="grid gap-2 text-sm text-[color:var(--ink)]">
          <span>{copy.form.phone}</span>
          <div className="relative">
            <Phone aria-hidden size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--gold-dark)]" />
            <input
              name="phone"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder={copy.form.phonePlaceholder}
              className={`${inputClass()} pl-11`}
              type="tel"
              autoComplete="tel"
            />
          </div>
        </label>

        <label className="grid gap-2 text-sm text-[color:var(--ink)]">
          <span>{copy.form.category}</span>
          <select
            name="category"
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            className={inputClass()}
          >
            {copy.options.categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm text-[color:var(--ink)] md:col-span-2">
          <span>
            {copy.form.message} <b className="font-normal text-[color:var(--red-seal)]">{copy.form.required}</b>
          </span>
          <div className="relative">
            <MessageSquareText aria-hidden size={17} className="absolute left-4 top-5 text-[color:var(--gold-dark)]" />
            <textarea
              name="message"
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder={copy.form.messagePlaceholder}
              className={`${inputClass(Boolean(errors.message))} min-h-40 py-3 pl-11 leading-7`}
              aria-invalid={Boolean(errors.message)}
            />
          </div>
          <FieldError message={errors.message} />
        </label>

        <div className="md:col-span-2">
          <label className={`flex min-h-12 items-start gap-3 border px-4 py-3 text-sm leading-7 ${
            errors.privacy ? "border-[color:var(--red-seal)] bg-[rgba(143,46,36,0.04)]" : "border-[color:var(--border)] bg-[color:var(--ivory)]"
          }`}>
            <input
              type="checkbox"
              name="privacy"
              checked={form.privacy}
              onChange={(event) => updateField("privacy", event.target.checked)}
              className="mt-1 size-5 accent-[color:var(--gold)]"
              aria-invalid={Boolean(errors.privacy)}
            />
            <span>
              {copy.form.privacy}{" "}
              <Link
                href={localizedPath(lang, "/privacy")}
                target="_blank"
                className="text-[color:var(--gold-dark)] underline underline-offset-4"
              >
                {copy.form.privacyLink}
              </Link>
              <b className="ml-2 font-normal text-[color:var(--red-seal)]">{copy.form.required}</b>
            </span>
          </label>
          <FieldError message={errors.privacy} />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-3 border border-[color:var(--gold)] bg-[color:var(--gold)] px-6 text-sm tracking-[0.16em] text-white transition hover:bg-[color:var(--gold-dark)] md:w-auto"
      >
        {pending ? "送信中..." : copy.form.submit}
        <Send aria-hidden size={16} />
      </button>
    </form>
  );
}
