import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-card/90 backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto px-6 py-4">

        <div className="flex flex-col items-center text-center gap-1">

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent to-accent2
                flex items-center justify-center text-black text-sm font-bold">
              B
            </div>
            <span className="text-text text-sm font-semibold">BookBazaar</span>
          </div>

          <p className="text-xs text-muted">
            © {new Date().getFullYear()} BookBazaar
          </p>

        </div>

      </div>
    </footer>
  );
}
