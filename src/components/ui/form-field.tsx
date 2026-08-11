import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export function FormField({
  label,
  error,
  hint,
  required,
  children,
  className,
  htmlFor,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={htmlFor}>
          {label}
          {required && (
            <span className="text-destructive ml-0.5" aria-hidden>
              *
            </span>
          )}
        </Label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-destructive flex items-center gap-1" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
