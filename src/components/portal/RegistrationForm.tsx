"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  User,
  Users,
  Calendar,
  GraduationCap,
  Phone,
  Building2,
  School,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  CloudOff,
  CloudCheck,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const JK_DEFAULT = "Madina Tul Karim Nomal";

const schema = z.object({
  name: z
    .string()
    .min(2, "Please enter your full name (at least 2 characters)")
    .max(80, "Name is too long"),
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Please select your gender" }),
  }),
  age: z.coerce
    .number({
      errorMap: () => ({ message: "Age must be a number" }),
    })
    .int("Age must be a whole number")
    .min(11, "This camp is for ages 11–18")
    .max(18, "This camp is for ages 11–18"),
  class: z.string().min(1, "Please select your class"),
  whatsapp: z
    .string()
    .min(7, "Please enter a valid WhatsApp number")
    .max(20, "Number is too long")
    .regex(/^[0-9 +\-()]+$/, "Only digits, spaces, +, -, ( ) are allowed"),
  jkName: z.string().default(JK_DEFAULT),
  school: z
    .string()
    .min(2, "Please enter your school name")
    .max(120, "School name is too long"),
});

type FormValues = z.infer<typeof schema>;

const CLASS_OPTIONS = [
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];

export function RegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [confirmedSno, setConfirmedSno] = useState<number | null>(null);
  const [snoSource, setSnoSource] = useState<"sheet" | "fallback" | null>(null);
  const [sheetSynced, setSheetSynced] = useState<boolean>(false);
  const [sheetStatus, setSheetStatus] = useState<
    "loading" | "connected" | "not-configured" | "error"
  >("loading");

  // Check whether the Google Sheet integration is wired up.
  // This is informational — submissions are still saved locally as a backup
  // even if the Sheet is not connected.
  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const res = await fetch("/api/register/status", { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        if (data.configured && data.reachable) {
          setSheetStatus("connected");
        } else if (data.configured && !data.reachable) {
          setSheetStatus("error");
        } else {
          setSheetStatus("not-configured");
        }
      } catch {
        if (!cancelled) setSheetStatus("not-configured");
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      gender: undefined,
      age: undefined,
      class: "",
      whatsapp: "",
      jkName: JK_DEFAULT,
      school: "",
    },
  });

  const jkValue = watch("jkName");

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        const msg =
          data?.error ||
          (data?.errors &&
            Object.values(data.errors as Record<string, string>)[0]) ||
          "Registration failed. Please try again.";
        toast.error(msg);
        return;
      }

      setConfirmedSno(data.sno ?? null);
      setSnoSource(data.snoSource ?? null);
      setSheetSynced(Boolean(data.googleSheet));
      setSubmitted(true);

      if (data.googleSheet) {
        toast.success("Registration submitted and saved to the Google Sheet!");
      } else {
        toast.error(
          "Saved locally only — the Google Sheet is NOT connected. The organizer must set GOOGLE_SCRIPT_URL."
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please check your connection and try again.");
    }
  };

  if (submitted) {
    const isOk = sheetSynced;
    return (
      <Card
        id="register"
        className={`scroll-mt-24 shadow-xl ${
          isOk
            ? "border-emerald-500/30"
            : "border-amber-500/40 bg-amber-50/30"
        }`}
      >
        <CardHeader className="text-center pb-2">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full ${
              isOk
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {isOk ? (
              <CheckCircle2 className="h-9 w-9" />
            ) : (
              <AlertTriangle className="h-9 w-9" />
            )}
          </motion.div>
          <CardTitle className="text-2xl">
            {isOk ? "You're registered!" : "Saved — but action needed"}
          </CardTitle>
          <CardDescription>
            {isOk
              ? "Your registration has been saved to the Google Sheet."
              : "Your registration was saved to a local backup, but it did NOT reach the Google Sheet."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {confirmedSno !== null && (
            <div className="rounded-lg bg-muted/60 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {snoSource === "sheet"
                  ? "Your Registration ID"
                  : "Your Temporary ID"}
              </p>
              <p className="font-mono text-2xl font-bold text-primary">
                #{String(confirmedSno).padStart(3, "0")}
              </p>
              {snoSource === "fallback" ? (
                <p className="mt-1 text-xs text-amber-700">
                  Temporary — the real ID will appear in the Sheet once the
                  connection is restored.
                </p>
              ) : null}
            </div>
          )}

          {isOk ? (
            <div className="rounded-lg border border-amber-300/50 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>
                  Please keep your Registration ID handy. The organizer will
                  contact you on WhatsApp with the camp schedule and to confirm
                  your <strong>Rs. 500 registration fee</strong>.
                </span>
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-red-400/50 bg-red-50 p-4 text-sm text-red-900">
              <p className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>
                  <strong>The Google Sheet is not connected yet.</strong> The
                  organizer needs to set the <code>GOOGLE_SCRIPT_URL</code>{" "}
                  environment variable on Vercel — see the setup guide. Your
                  data is safely stored in the app&apos;s backup database and
                  will appear in the Sheet once the connection is fixed.
                </span>
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              onClick={() => {
                reset();
                setSubmitted(false);
                setConfirmedSno(null);
                setSnoSource(null);
                setSheetSynced(false);
              }}
            >
              Register another student
            </Button>
            <Button asChild>
              <a href="#course">Explore the course</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      id="register"
      className="scroll-mt-24 border-primary/20 shadow-2xl shadow-primary/5"
    >
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-amber-400 text-amber-950 hover:bg-amber-400">
            Registration is open
          </Badge>
          <span className="text-xs text-muted-foreground">
            Classes 6 – 12 · Ages 11 – 18
          </span>
          <SheetStatusBadge
            status={sheetStatus}
            onRetry={() => {
              setSheetStatus("loading");
              // Re-trigger the effect by toggling state — simplest approach:
              // just call the same fetch logic inline.
              fetch("/api/register/status", { cache: "no-store" })
                .then((r) => r.json())
                .then((data) => {
                  if (data.configured && data.reachable) setSheetStatus("connected");
                  else if (data.configured && !data.reachable) setSheetStatus("error");
                  else setSheetStatus("not-configured");
                })
                .catch(() => setSheetStatus("not-configured"));
            }}
          />
        </div>
        <CardTitle className="text-3xl">Register for the AI Literacy Camp</CardTitle>
        <CardDescription className="text-base">
          Fill in your details below to reserve your seat.
        </CardDescription>
        <div className="flex items-start gap-2 rounded-lg border border-emerald-600/30 bg-emerald-50 p-3 text-sm text-emerald-900">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-700" />
          <span>
            <strong>Participants only:</strong> This registration portal is only
            for participants of <strong>Madina Tul Karim Nomal JK</strong>.
          </span>
        </div>
        <div className="flex items-start gap-2 rounded-lg border border-amber-600/40 bg-amber-50 p-3 text-sm text-amber-900">
          <span className="mt-0.5 text-lg font-bold leading-none text-amber-700">
            Rs.
          </span>
          <span>
            <strong>Registration fee: Rs. 500</strong> (one-time, covers all 5
            sessions). Payable to the organizer. Your seat is confirmed once the
            fee is received.
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {/* Name */}
          <Field
            label="Full Name"
            htmlFor="name"
            error={errors.name?.message}
            icon={<User className="h-4 w-4" />}
            required
          >
            <Input
              id="name"
              placeholder="e.g. Alishan Ali"
              autoComplete="name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
          </Field>

          {/* Gender + Age */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Gender"
              htmlFor="gender"
              error={errors.gender?.message}
              icon={<Users className="h-4 w-4" />}
              required
            >
              <RadioGroup
                id="gender"
                className="flex flex-wrap gap-4 pt-1"
                onValueChange={(v) =>
                  setValue("gender", v as FormValues["gender"], {
                    shouldValidate: true,
                  })
                }
              >
                {(["Male", "Female", "Other"] as const).map((g) => (
                  <label
                    key={g}
                    htmlFor={`gender-${g}`}
                    className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm transition hover:bg-accent/50"
                  >
                    <RadioGroupItem id={`gender-${g}`} value={g} />
                    <span>{g}</span>
                  </label>
                ))}
              </RadioGroup>
            </Field>

            <Field
              label="Age"
              htmlFor="age"
              error={errors.age?.message}
              icon={<Calendar className="h-4 w-4" />}
              required
            >
              <Input
                id="age"
                type="number"
                inputMode="numeric"
                min={11}
                max={18}
                placeholder="11 – 18"
                aria-invalid={!!errors.age}
                {...register("age")}
              />
            </Field>
          </div>

          {/* Class + WhatsApp */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Class"
              htmlFor="class"
              error={errors.class?.message}
              icon={<GraduationCap className="h-4 w-4" />}
              required
            >
              <Select
                onValueChange={(v) => setValue("class", v, { shouldValidate: true })}
              >
                <SelectTrigger id="class" aria-invalid={!!errors.class}>
                  <SelectValue placeholder="Select your class" />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field
              label="WhatsApp Number"
              htmlFor="whatsapp"
              error={errors.whatsapp?.message}
              icon={<Phone className="h-4 w-4" />}
              required
            >
              <Input
                id="whatsapp"
                type="tel"
                inputMode="tel"
                placeholder="e.g. 0312 3456789"
                autoComplete="tel"
                aria-invalid={!!errors.whatsapp}
                {...register("whatsapp")}
              />
            </Field>
          </div>

          {/* JK Name (default) */}
          <Field
            label="JK Name"
            htmlFor="jkName"
            error={errors.jkName?.message}
            icon={<Building2 className="h-4 w-4" />}
            hint="Default JK is Madina Tul Karim Nomal — change only if needed."
          >
            <Input
              id="jkName"
              placeholder="Madina Tul Karim Nomal"
              aria-invalid={!!errors.jkName}
              {...register("jkName")}
            />
            {jkValue === JK_DEFAULT || !jkValue ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Most participants attend from <strong>{JK_DEFAULT}</strong>.
              </p>
            ) : null}
          </Field>

          {/* School */}
          <Field
            label="School Name"
            htmlFor="school"
            error={errors.school?.message}
            icon={<School className="h-4 w-4" />}
            required
          >
            <Input
              id="school"
              placeholder="e.g. Aga Khan School, Nomal"
              autoComplete="organization"
              aria-invalid={!!errors.school}
              {...register("school")}
            />
          </Field>

          {/* Privacy + submit */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
              <p>
                Your information is used only for camp registration and
                communication. It is saved to the official AKLEB STEM &
                Robotics registration sheet and a secure backup.
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Registration · Rs. 500"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By submitting, you confirm the information above is accurate. A
              one-time registration fee of <strong>Rs. 500</strong> applies —
              the organizer will share payment details on WhatsApp.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ---------- helper sub-components ---------- */

function Field({
  label,
  htmlFor,
  error,
  icon,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  icon?: React.ReactNode;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={htmlFor}
        className="flex items-center gap-2 text-sm font-medium"
      >
        {icon ? (
          <span className="text-muted-foreground">{icon}</span>
        ) : null}
        <span>{label}</span>
        {required ? <span className="text-destructive">*</span> : null}
      </Label>
      {children}
      {error ? (
        <p className="flex items-center gap-1 text-xs font-medium text-destructive">
          <AlertTriangle className="h-3 w-3" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

/* ---------- Sheet connection status badge ---------- */

function SheetStatusBadge({
  status,
  onRetry,
}: {
  status: "loading" | "connected" | "not-configured" | "error";
  onRetry?: () => void;
}) {
  if (status === "loading") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        Checking Sheet…
      </span>
    );
  }
  if (status === "connected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-900">
        <CloudCheck className="h-3 w-3" />
        Sheet connected
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-100 px-2.5 py-1 text-xs font-medium text-red-900">
        <AlertTriangle className="h-3 w-3" />
        Sheet reachable? No
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="ml-1 inline-flex items-center text-red-700 underline-offset-2 hover:underline"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        ) : null}
      </span>
    );
  }
  // not-configured
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-600/40 bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-900">
      <CloudOff className="h-3 w-3" />
      Sheet not connected
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="ml-1 inline-flex items-center text-amber-700 underline-offset-2 hover:underline"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      ) : null}
    </span>
  );
}
