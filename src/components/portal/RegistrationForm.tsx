"use client";

import { useState } from "react";
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
      setSubmitted(true);
      if (data.warning) {
        toast.warning(data.warning);
      } else {
        toast.success("Registration submitted successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please check your connection and try again.");
    }
  };

  if (submitted) {
    return (
      <Card
        id="register"
        className="scroll-mt-24 border-emerald-500/30 shadow-xl"
      >
        <CardHeader className="text-center pb-2">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
          >
            <CheckCircle2 className="h-9 w-9" />
          </motion.div>
          <CardTitle className="text-2xl">You&apos;re registered!</CardTitle>
          <CardDescription>
            We&apos;ve saved your spot for the AI Literacy Camp.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {confirmedSno !== null && (
            <div className="rounded-lg bg-muted/60 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Your Registration ID
              </p>
              <p className="font-mono text-2xl font-bold text-primary">
                #{String(confirmedSno).padStart(3, "0")}
              </p>
            </div>
          )}
          <div className="rounded-lg border border-amber-300/50 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>
                Please keep your Registration ID handy. The organizer will
                contact you on WhatsApp with the camp schedule and any updates.
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              onClick={() => {
                reset();
                setSubmitted(false);
                setConfirmedSno(null);
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
                "Submit Registration"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By submitting, you confirm the information above is accurate.
              Please contact the organizer if you need to update your details.
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
