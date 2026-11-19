"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Quicksand } from "next/font/google";
import "./Contact.module.css";
// Font yang sama dengan Hero agar tampilannya serasi.
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});


const EMAIL = "123kafabih@gmail.com";
const GITHUB_URL = "https://github.com/kafa123";
const LINKEDIN_URL = "https://www.linkedin.com/in/nur-muhammad-kafabih"; 
const CV_HREF = "/CV_Kafabih.pdf"; // taruh file PDF-nya di folder public/

const COPY = {
  title: "Mari terhubung",
  lead: "Saya sedang mencari peluang sebagai backend developer. Kalau ada proyek atau lowongan yang cocok, kirim email dan saya akan membalas secepatnya.",
  copy: "Salin email",
  copied: "Tersalin",
  failed: "Gagal menyalin",
  copiedAnnouncement: "Email tersalin ke clipboard",
};

type CopyStatus = "idle" | "copied" | "failed";

type Channel = {
  label: string;
  handle: string;
  href: string;
  icon: ReactNode;
  external?: boolean;
  download?: boolean;
};

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="22" height="22" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 3h7l4 4v14H7z M14 3v4h4 M10 12h5 M10 16h5"
      />
    </svg>
  );
}

function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

const CHANNELS: Channel[] = [
  {
    label: "GitHub",
    handle: displayUrl(GITHUB_URL),
    href: GITHUB_URL,
    icon: <GitHubIcon />,
    external: true,
  },
  {
    label: "LinkedIn",
    handle: displayUrl(LINKEDIN_URL),
    href: LINKEDIN_URL,
    icon: <LinkedInIcon />,
    external: true,
  },
  {
    label: "Unduh CV",
    handle: "PDF",
    href: CV_HREF,
    icon: <DocumentIcon />,
    download: true,
  },
];

export default function Contact() {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timerRef = useRef(0);

  useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);

  const handleCopy = async () => {
    let next: CopyStatus = "failed";

    try {
      await navigator.clipboard.writeText(EMAIL);
      next = "copied";
    } catch {
      // Clipboard tidak tersedia (misalnya bukan HTTPS) atau izin ditolak.
    }

    setStatus(next);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setStatus("idle"), 2000);
  };

  const copyLabel =
    status === "copied"
      ? COPY.copied
      : status === "failed"
        ? COPY.failed
        : COPY.copy;

  return (
    <section id="contact" aria-labelledby="contact-title">

      <div className="ct-inner">
        <div className="ct-intro">
          <h2 id="contact-title" className={`ct-title ${quicksand.className}`}>
            {COPY.title}
          </h2>

          <p className="ct-lead">{COPY.lead}</p>

          <div className="ct-email-row">
            <a
              href={`mailto:${EMAIL}`}
              className={`ct-email ${quicksand.className}`}
            >
              {EMAIL}
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className={`ct-copy${status === "copied" ? " ct-copied" : ""}`}
            >
              {copyLabel}
            </button>

            <span className="ct-sr" role="status">
              {status === "copied" ? COPY.copiedAnnouncement : ""}
            </span>
          </div>
        </div>

        <ul className="ct-channels">
          {CHANNELS.map((channel) => (
            <li key={channel.label}>
              <a
                href={channel.href}
                className="ct-channel"
                {...(channel.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                {...(channel.download ? { download: true } : {})}
              >
                <span className="ct-icon">{channel.icon}</span>
                <span className="ct-label">{channel.label}</span>
                <span className="ct-handle">{channel.handle}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}