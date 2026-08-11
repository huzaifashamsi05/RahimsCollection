"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout } from "@/lib/actions/auth";
import { useState } from "react";

export default function AdminSidebar({ email }: { email: string | undefined }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/reviews", label: "Reviews" },
    { href: "/admin/settings", label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b border-cream/10 bg-charcoal z-20">
        <div className="font-serif text-xl tracking-wide text-gold">Rahim's Collection Admin</div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-cream p-2"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div className={`
        fixed lg:static inset-y-0 left-0 w-64 bg-charcoal-light border-r border-cream/10 flex flex-col z-20
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="hidden lg:block p-6 border-b border-cream/10">
          <div className="font-serif text-xl tracking-wide text-gold">Rahim's Collection</div>
          <div className="text-xs text-cream/50 mt-1 uppercase tracking-widest">Admin Panel</div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded transition-colors ${
                  isActive 
                    ? "bg-gold text-charcoal font-medium" 
                    : "text-cream hover:bg-cream/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-cream/10">
          <div className="text-xs text-cream/50 mb-3 px-2 truncate">{email}</div>
          <form action={adminLogout}>
            <button 
              type="submit"
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
