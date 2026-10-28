import React from "react";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="view-container" style={{ textAlign: "center", alignItems: "center" }}>
      <div className="container">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 6vw, 6rem)", color: "var(--color-primary)", marginBottom: "12px" }}>
          404
        </h1>
        <h2 style={{ fontSize: "1.5rem", color: "var(--color-text)", marginBottom: "16px" }}>
          Page Not Found
        </h2>
        <p style={{ color: "var(--color-text-secondary)", maxWidth: "480px", margin: "0 auto 28px", lineHeight: "1.6" }}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="btn btn--primary" style={{ display: "inline-flex", gap: "8px" }}>
          <Home size={18} />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
