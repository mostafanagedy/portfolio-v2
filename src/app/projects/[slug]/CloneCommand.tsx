"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";

interface CloneCommandProps {
  repoUrl: string;
}

export default function CloneCommand({ repoUrl }: CloneCommandProps) {
  const [copied, setCopied] = useState(false);
  const command = `git clone ${repoUrl}.git`;

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
        return;
      }
      throw new Error("Clipboard API unavailable");
    } catch {
      // Fallback for browsers or environments without clipboard API permissions
      try {
        const textarea = document.createElement("textarea");
        textarea.value = command;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";
        textarea.setAttribute("readonly", "");
        document.body.appendChild(textarea);
        textarea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2200);
        }
      } catch (err) {
        console.warn("Could not copy clone command:", err);
      }
    }
  };

  return (
    <div className="pd-clone-box">
      <div className="pd-clone-header">
        <span className="pd-clone-label">
          <Terminal size={14} className="text-accent" aria-hidden="true" />
          <span>Clone Repository</span>
        </span>
        <button
          type="button"
          className={`pd-clone-copy-btn ${copied ? "pd-clone-copy-btn--copied" : ""}`}
          onClick={handleCopy}
          aria-label={copied ? "Command copied to clipboard" : "Copy git clone command to clipboard"}
          title="Click to copy clone command"
        >
          {copied ? (
            <>
              <Check size={12} className="text-success" aria-hidden="true" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} aria-hidden="true" />
              <span>Copy Command</span>
            </>
          )}
        </button>
      </div>
      <div className="pd-clone-cmd" title="Git clone command">
        <span className="pd-clone-prompt" aria-hidden="true">$</span>
        <code>{command}</code>
      </div>
    </div>
  );
}
