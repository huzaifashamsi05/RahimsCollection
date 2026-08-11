"use client";

import React from "react";

/* ============================================================
   Button — Rahim's Collection UI Component
   
   Variants : primary | secondary | ghost | dark
   Sizes     : sm | md | lg
   States    : hover · active · focus-visible · disabled · loading
   ============================================================ */

/* ── Spinner SVG ─────────────────────────────────────────────── */
function Spinner({ sizeClass }: { sizeClass: string }) {
  return (
    <svg
      className={`${sizeClass} animate-spin shrink-0`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

/* ── Types ───────────────────────────────────────────────────── */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "dark";
export type ButtonSize    = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?   : ButtonVariant;
  size?      : ButtonSize;
  isLoading? : boolean;
  icon?      : React.ReactNode;
  children   : React.ReactNode;
}

/* ── Style maps ──────────────────────────────────────────────── */

/**
 * Base classes shared by all variants/sizes.
 * Transitions: colors & transform 200ms ease-out for hover,
 * active:scale shrinks to 0.97 in 100ms via a shorter duration override.
 */
const BASE =
  "inline-flex items-center justify-center gap-2 " +
  "rounded-luxury font-sans font-medium tracking-wide " +
  "select-none cursor-pointer " +
  "transition-all duration-200 ease-out " +
  /* Active press — 100ms scale + shorter duration via active: */
  "active:scale-[0.97] active:duration-100 " +
  /* Focus ring — keyboard only (focus-visible), hidden on mouse */
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal " +
  /* Disabled state */
  "disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  /* Solid gold background, charcoal text */
  primary:
    "bg-gold text-charcoal border border-transparent " +
    "hover:bg-gold-light hover:shadow-[0_4px_16px_rgba(156,122,60,0.35)] hover:-translate-y-px",

  /* Transparent bg, gold border + text */
  secondary:
    "bg-transparent text-gold border border-gold " +
    "hover:border-gold-light hover:text-gold-light hover:bg-gold/5 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(156,122,60,0.15)]",

  /* No bg/border, gold text — low-emphasis */
  ghost:
    "bg-transparent text-gold border border-transparent " +
    "hover:bg-gold/10",

  /* Charcoal bg, cream text — for use on light backgrounds */
  dark:
    "bg-charcoal text-cream border border-charcoal-light " +
    "hover:border-gold hover:text-ivory hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(26,26,26,0.4)]",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "text-xs px-4 py-2 min-h-[36px]",
  md: "text-sm px-6 py-3 min-h-[44px]",
  /* lg: 48px min-height — thumb-friendly for WhatsApp CTA on mobile */
  lg: "text-base px-8 py-3.5 min-h-[48px]",
};

const SPINNER_SIZE: Record<ButtonSize, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

/* ── Component ───────────────────────────────────────────────── */
export default function Button({
  variant    = "primary",
  size       = "md",
  isLoading  = false,
  icon,
  disabled,
  className  = "",
  children,
  type       = "button",
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        BASE,
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      ]
        .join(" ")
        .trim()}
      aria-busy={isLoading}
      {...rest}
    >
      {/* Loading spinner — shown instead of icon when loading */}
      {isLoading ? (
        <Spinner sizeClass={SPINNER_SIZE[size]} />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}

      {/* Label — keep button width stable during loading */}
      <span>{children}</span>
    </button>
  );
}
