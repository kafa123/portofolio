
"use client";

import { useState } from "react";
import Link from "next/link";
import { SiGithub } from "react-icons/si";
import { FaLinkedin, FaLinkedinIn } from "react-icons/fa";
import { Mail, FileText, FileTextIcon } from "lucide-react";

const EMAIL = "123kafabih@gmail.com";
const GITHUB = "https://github.com/kafa123";
const LINKEDIN = "https://www.linkedin.com/in/nur-muhammad-kafabih/";
const CV = "/cv.pdf";

const channels = [
  {
    number: "01",
    label: "GITHUB",
    description: "A look at what I build.",
    href: GITHUB,
    external: true,
    icon: SiGithub 
  },
  {
    number: "02",
    label: "LINKEDIN",
    description: "My professional journey.",
    href: LINKEDIN,
    external: true,
    icon: FaLinkedin
  },
  {
    number: "03",
    label: "RESUME",
    description: "A little more about my background.",
    href: CV,
    external: true,
    icon: FileTextIcon
  },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-background py-8 text-foreground md:py-12"
    >
      <div className="mx-auto w-[calc(100%-36px)] max-w-[1100px]">

        {/* SECTION HEADER */}
        <div className="flex items-center justify-between border-b border-line pb-4 font-mono text-[10px] tracking-[0.15em] text-muted md:text-xs">
          <span>05 — CONTACT</span>
          <span>THE END / OR A BEGINNING</span>
        </div>

        {/* HEADLINE */}
        <div className="grid gap-10 py-20 md:grid-cols-[1.2fr_0.8fr] md:items-end md:py-28">
          <div>
            <span className="font-mono text-[11px] tracking-widest text-primary">
              ONE LAST THING
            </span>

            <h2 className="mt-8 text-[clamp(46px,8vw,88px)] leading-[0.98] font-bold tracking-[-0.075em]">
              Every conversation
              <br />
              has a <span className="text-primary">beginning.</span>
            </h2>
          </div>

          <div className="md:pb-2">
            <p className="text-xl leading-relaxed tracking-tight md:text-2xl">
              And perhaps this is one of them.
            </p>

            <p className="mt-5 text-sm leading-[1.9] text-secondary-text md:text-base">
              Whether it&apos;s an interesting idea, a new opportunity,
              or simply a conversation, I&apos;d be glad to hear from you.
            </p>
          </div>
        </div>

        <div className="h-px bg-line" />

        {/* COMMUNICATION CHANNELS */}
        <div className="grid gap-14 py-16 md:grid-cols-[0.7fr_1.3fr] md:gap-20 md:py-20">

          {/* EMAIL */}
          <div>
            <span className="font-mono text-xs tracking-widest text-primary">
              05.1 — DROP A LINE
            </span>

            <h3 className="mt-5 text-2xl font-semibold tracking-tight">
              Email works best.
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-secondary-text">
              Have something in mind? Feel free to send me an email.
            </p>

            <button
              type="button"
              onClick={copyEmail}
              className="group mt-7 flex w-full items-center justify-between gap-3 border border-line bg-surface px-4 py-4 text-left transition-colors hover:border-primary"
            >
<div className="flex min-w-0 items-center gap-3">
  <Mail size={18} className="shrink-0 text-primary" />
  <span className="truncate text-sm text-foreground">
    {EMAIL}
  </span>
</div>

              <span className="shrink-0 font-mono text-[10px] tracking-widest text-primary">
                {copied ? "COPIED!" : "COPY ↗"}
              </span>
            </button>

            <a
              href={`mailto:${EMAIL}`}
              className="mt-4 inline-flex items-center gap-2 text-xs text-muted transition-colors hover:text-primary"
            >
              Or send an email directly
              <span>↗</span>
            </a>
          </div>

          {/* OTHER CHANNELS */}
          <div>
            <span className="font-mono text-xs tracking-widest text-primary">
              05.2 — ELSEWHERE
            </span>

            <div className="mt-5">
              {channels.map((channel) => (
                <Link
                  key={channel.number}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-5 border-b border-line py-6 transition-colors first:border-t hover:border-primary"
                >
<div className="flex items-center gap-5">
  <span className="font-mono text-xs text-muted">
    {channel.number}
  </span>

  <channel.icon
    size={22}
    className="shrink-0 text-secondary-text transition-colors group-hover:text-primary"
  />

  <div>
    <h3 className="text-base font-semibold tracking-wide transition-colors group-hover:text-primary">
      {channel.label}
    </h3>

    <p className="mt-1 text-xs text-muted">
      {channel.description}
    </p>
  </div>
</div>

                  <span className="text-lg text-muted transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary">
                    ↗
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-line pt-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="font-mono text-xs tracking-widest text-primary">
                KAFABIH<span className="text-foreground">.</span>
              </p>
              <p className="mt-2 text-xs text-muted">
                Built with curiosity and a little bit of code.
              </p>
            </div>

            <a
              href="#hero"
              className="group inline-flex items-center gap-2 font-mono text-xs tracking-widest text-muted transition-colors hover:text-primary"
            >
              BACK TO TOP
              <span className="transition-transform group-hover:-translate-y-1">
                ↑
              </span>
            </a>
          </div>

          <div className="mt-10 flex justify-between font-mono text-[10px] text-muted">
            <span>© 2026 KAFABIH</span>
            <span>MADE WITH CURIOSITY_</span>
          </div>
        </div>
      </div>
    </section>
  );
}
