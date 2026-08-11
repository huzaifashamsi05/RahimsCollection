"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { adminLogin } from "@/lib/actions/auth";

export default function AdminLoginForm() {
  const [formState, setFormState] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("submitting");
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await adminLogin(formData);

    if (result?.error) {
      setError(result.error);
      setFormState("idle");
    }
    // On success, the server action handles the redirect
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-xs uppercase tracking-wider text-cream/50 mb-2" htmlFor="email">
          Email Address
        </label>
        <input 
          id="email"
          name="email"
          type="email" 
          required
          className="w-full bg-charcoal border border-cream/10 rounded px-4 py-3 text-cream focus:outline-none focus:border-gold transition-colors"
          placeholder="admin@example.com"
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-cream/50 mb-2" htmlFor="password">
          Password
        </label>
        <input 
          id="password"
          name="password"
          type="password" 
          required
          className="w-full bg-charcoal border border-cream/10 rounded px-4 py-3 text-cream focus:outline-none focus:border-gold transition-colors"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-950/50 border border-red-500/30 rounded text-red-200 text-sm text-center">
          {error}
        </div>
      )}

      <div className="pt-4">
        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          className="w-full"
          disabled={formState === "submitting"}
        >
          {formState === "submitting" ? "Signing In..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
}
