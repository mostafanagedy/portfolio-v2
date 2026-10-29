"use client";

import React, { useState, useMemo } from "react";
import { BookOpen, ExternalLink, Copy, Check, FileText, ChevronDown, ChevronUp } from "lucide-react";
import "./MarkdownViewer.css";

interface MarkdownViewerProps {
  content: string | null;
  repoName: string;
  defaultBranch?: string;
  githubReadmeUrl?: string;
}


/**
 * Sanitizes and cleans raw HTML/Markdown content
 */
function sanitizeMarkdown(
  rawMarkdown: string,
  repoName: string,
  defaultBranch: string = "main"
): string {
  let text = rawMarkdown;

  // 1. Remove dangerous script and iframe tags completely
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  text = text.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
  text = text.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "");
  text = text.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "");

  // 2. Remove inline event handlers (onload, onerror, onclick, etc.)
  text = text.replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "");
  text = text.replace(/\son\w+\s*=\s*[^\s>]+/gi, "");

  // 3. Strip javascript: URLs
  text = text.replace(/href\s*=\s*(['"])javascript:.*?\1/gi, 'href="#"');
  text = text.replace(/\[([^\]]+)\]\(javascript:[^)]*\)/gi, "[$1](#)");

  // 4. Resolve relative images in markdown ![alt](path) to raw.githubusercontent.com
  const rawBase = `https://raw.githubusercontent.com/mostafanagedy/${repoName}/${defaultBranch}/`;
  text = text.replace(/!\[(.*?)\]\((?!https?:\/\/|\/\/)(.*?)\)/g, (match, alt, path) => {
    const cleanPath = path.startsWith("./") ? path.slice(2) : path.startsWith("/") ? path.slice(1) : path;
    return `![${alt}](${rawBase}${cleanPath})`;
  });

  // 5. Resolve relative <img src="..."> tags
  text = text.replace(/<img([^>]+)src=(['"])(?!https?:\/\/|\/\/)(.*?)\2([^>]*)>/gi, (match, p1, q, src, p2) => {
    const cleanPath = src.startsWith("./") ? src.slice(2) : src.startsWith("/") ? src.slice(1) : src;
    return `<img${p1}src="${rawBase}${cleanPath}"${p2}>`;
  });

  return text;
}

export default function MarkdownViewer({
  content,
  repoName,
  defaultBranch = "main",
  githubReadmeUrl,
}: MarkdownViewerProps) {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const sanitizedContent = useMemo(() => {
    if (!content) return "";
    return sanitizeMarkdown(content, repoName, defaultBranch);
  }, [content, repoName, defaultBranch]);

  // Determine if content is long enough to justify collapsible preview
  const lineCount = useMemo(() => {
    if (!sanitizedContent) return 0;
    return sanitizedContent.split("\n").length;
  }, [sanitizedContent]);

  const isSubstantial = lineCount > 20 || sanitizedContent.length > 900;

  const handleCopyCode = async (code: string, id: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
        setCopiedCodeId(id);
        setTimeout(() => setCopiedCodeId(null), 2000);
        return;
      }
      throw new Error("Clipboard API not available");
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopiedCodeId(id);
        setTimeout(() => setCopiedCodeId(null), 2000);
      } catch (err) {
        console.warn("Failed to copy code block:", err);
      }
    }
  };

  if (!content || sanitizedContent.trim() === "") {
    return (
      <div className="mv-card mv-empty" role="region" aria-label="Repository README">
        <div className="mv-empty__icon">
          <FileText size={32} />
        </div>
        <h3 className="mv-empty__title">No README.md Available</h3>
        <p className="mv-empty__desc">
          This repository doesn't have a README documentation file yet on GitHub.
        </p>
        {githubReadmeUrl && (
          <a
            href={githubReadmeUrl.replace("/README.md", "")}
            target="_blank"
            rel="noopener noreferrer"
            className="mv-header__link"
          >
            <span>View repository files on GitHub</span>
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        )}
      </div>
    );
  }

  // Parse lines into structured tokens
  const renderFormattedMarkdown = () => {
    const lines = sanitizedContent.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = "";
    let codeBuffer: string[] = [];
    let codeBlockIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks ```lang
      if (line.trim().startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.trim().slice(3).trim() || "code";
          codeBuffer = [];
        } else {
          // Close code block
          const blockId = `code-block-${codeBlockIndex++}`;
          const fullCode = codeBuffer.join("\n");
          elements.push(
            <div key={blockId} className="mv-code-block">
              <div className="mv-code-header">
                <span className="mv-code-lang">{codeLanguage}</span>
                <button
                  type="button"
                  className="mv-code-copy"
                  onClick={() => handleCopyCode(fullCode, blockId)}
                  aria-label="Copy code to clipboard"
                  title="Copy code"
                >
                  {copiedCodeId === blockId ? (
                    <>
                      <Check size={13} className="text-success" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="mv-code-content">
                <code>{fullCode}</code>
              </pre>
            </div>
          );
          inCodeBlock = false;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Headers #, ##, ###, ####
      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={`h1-${i}`} className="mv-h1">
            {formatInlineText(line.slice(2))}
          </h1>
        );
        continue;
      }
      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={`h2-${i}`} className="mv-h2">
            {formatInlineText(line.slice(3))}
          </h2>
        );
        continue;
      }
      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={`h3-${i}`} className="mv-h3">
            {formatInlineText(line.slice(4))}
          </h3>
        );
        continue;
      }
      if (line.startsWith("#### ")) {
        elements.push(
          <h4 key={`h4-${i}`} className="mv-h4">
            {formatInlineText(line.slice(5))}
          </h4>
        );
        continue;
      }

      // Blockquotes >
      if (line.startsWith("> ")) {
        elements.push(
          <blockquote key={`bq-${i}`} className="mv-blockquote">
            {formatInlineText(line.slice(2))}
          </blockquote>
        );
        continue;
      }

      // Horizontal Rule ---
      if (line.trim() === "---" || line.trim() === "***" || line.trim() === "___") {
        elements.push(<hr key={`hr-${i}`} className="mv-hr" />);
        continue;
      }

      // Unordered list items (- or *)
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const itemText = line.trim().slice(2);
        elements.push(
          <li key={`li-${i}`} className="mv-li">
            {formatInlineText(itemText)}
          </li>
        );
        continue;
      }

      // Images in Markdown: ![alt](url)
      const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        const [, alt, url] = imgMatch;
        elements.push(
          <figure key={`img-${i}`} className="mv-figure">
            <img
              src={url}
              alt={alt || "Repository diagram or screenshot"}
              className="mv-img"
              loading="lazy"
            />
            {alt && <figcaption className="mv-figcaption">{alt}</figcaption>}
          </figure>
        );
        continue;
      }

      // Empty lines
      if (line.trim() === "") {
        continue;
      }

      // Regular Paragraph
      elements.push(
        <p key={`p-${i}`} className="mv-p">
          {formatInlineText(line)}
        </p>
      );
    }

    return elements;
  };

  return (
    <section className="mv-card" aria-label="Repository README Documentation">
      {/* README Header */}
      <div className="mv-header">
        <div className="mv-header__left">
          <BookOpen size={18} className="mv-header__icon" aria-hidden="true" />
          <h2 className="mv-header__title">README.md</h2>
          <span className="mv-badge-lines" title="Total line count">
            {lineCount} lines
          </span>
        </div>

        {githubReadmeUrl && (
          <a
            href={githubReadmeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mv-header__link"
            title="View original README file on GitHub"
          >
            <span>View on GitHub</span>
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        )}
      </div>

      {/* Rendered README Content */}
      <div
        id="readme-content"
        className={`mv-body-wrapper ${isSubstantial && !isExpanded ? "mv-body-wrapper--collapsed" : ""}`}
      >
        <div className="mv-body">{renderFormattedMarkdown()}</div>
        {isSubstantial && !isExpanded && (
          <div className="mv-fade-overlay" aria-hidden="true" />
        )}
      </div>

      {/* Collapsible Toggle Footer */}
      {isSubstantial && (
        <div className="mv-footer">
          <button
            type="button"
            className="mv-toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-controls="readme-content"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={14} aria-hidden="true" />
                <span>Show Less</span>
              </>
            ) : (
              <>
                <ChevronDown size={14} aria-hidden="true" />
                <span>Show Full README</span>
                <span className="mv-toggle-lines">({lineCount} lines)</span>
              </>
            )}
          </button>

          {githubReadmeUrl && (
            <a
              href={githubReadmeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mv-footer__link"
              title="Open full README directly on GitHub"
            >
              <span>View Original on GitHub</span>
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </section>
  );
}

/**
 * Handles inline formatting: **bold**, `code`, [link](url)
 */
function formatInlineText(text: string): React.ReactNode {
  // Regex to split by inline code `...`, links [text](url), and **bold**
  const tokens = text.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);

  return tokens.map((token, idx) => {
    if (!token) return null;

    // Inline code
    if (token.startsWith("`") && token.endsWith("`") && token.length > 2) {
      return (
        <code key={idx} className="mv-inline-code">
          {token.slice(1, -1)}
        </code>
      );
    }

    // Bold text
    if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
      return <strong key={idx}>{token.slice(2, -2)}</strong>;
    }

    // Link [text](url)
    const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      const isSafe = url.startsWith("http://") || url.startsWith("https://") || url.startsWith("#");
      return (
        <a
          key={idx}
          href={isSafe ? url : "#"}
          target={url.startsWith("#") ? "_self" : "_blank"}
          rel={url.startsWith("#") ? "" : "noopener noreferrer"}
          className="mv-inline-link"
        >
          {label}
        </a>
      );
    }

    return token;
  });
}
