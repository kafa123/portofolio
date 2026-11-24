"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

const topics = [
  {
    id: "hino",
    label: "Hino internship",
    period: "Aug 2025 – Feb 2026",
    title: "Returnable package tracking.",
    description:
      "At PT Hino Motors Manufacturing Indonesia I built the backend for a web-based inventory system that monitors returnable packages. My part covered application logic, database integration, and system testing. It is a monolith on ASP.NET Core, Entity Framework Core, and SQL Server.",
    stack: "ASP.NET Core, EF Core, SQL Server",
    color: "text-primary",
  },
  {
    id: "evaluation",
    label: "Evaluation",
    period: "Final project",
    title: "Tested against a standard.",
    description:
      "I evaluated the system with ISO/IEC 25010 on three characteristics: functional suitability, performance efficiency, and maintainability. During my thesis revision I added a before-and-after performance experiment.",
    stack: "ISO/IEC 25010",
    color: "text-cyan",
  },
  {
    id: "other",
    label: "Other projects",
    period: "2023 – 2025",
    title: "Backend in other domains.",
    description:
      "Open MRI is a simulation platform for nurse training, with admin tools to manage content and track progress. BROMO collects environmental and operational data from broiler farms in real time. I have also built two games, Finion in Unity and Anomali Hitam in Unreal Engine 5.",
    stack: "Next.js, Prisma, PostgreSQL, Laravel, Kotlin, MySQL",
    color: "text-purple",
  },
];

export default function About() {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const active = topics[activeIndex];

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as const,
      };

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-background py-24 text-foreground md:py-36"
    >
      <div className="mx-auto w-[calc(100%-36px)] max-w-[1100px]">

        {/* SECTION HEADER */}
        <div className="flex items-center justify-between border-b border-line pb-4 font-mono text-xs text-muted">
          <span>About</span>
          <span>Backend developer</span>
        </div>

        {/* INTRODUCTION */}
        <div className="grid gap-10 py-20 md:grid-cols-[1.2fr_0.8fr] md:items-end md:py-28">
          <h2 className="text-[clamp(40px,7vw,80px)] leading-[1] font-bold tracking-[-0.06em]">
            I build backend systems for real operations.
          </h2>

          <div className="md:pb-2">
            <p className="text-sm leading-[1.9] text-secondary-text md:text-base">
              I&apos;m a Software Engineering student at Universitas Gadjah
              Mada. My final project was an inventory system that monitors
              returnable packages, built during my internship at PT Hino
              Motors Manufacturing Indonesia.
            </p>

            <p className="mt-5 text-sm leading-[1.9] text-secondary-text md:text-base">
              Most of my work is backend: ASP.NET Core, Laravel, and
              Next.js, with SQL Server, MySQL, and PostgreSQL behind them.
            </p>
          </div>
        </div>

        <div className="h-px bg-line" />

        {/* WORK DETAILS */}
        <div className="py-20 md:py-28">
          <h3 className="mb-12 text-3xl font-semibold tracking-tight md:text-4xl">
            What I&apos;ve worked on
          </h3>

          <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr] md:gap-16">

            {/* NAVIGATION */}
            <div
              role="tablist"
              aria-label="Work details"
              className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:gap-0 md:overflow-visible md:pb-0"
            >
              {topics.map((item, index) => {
                const isActive = activeIndex === index;

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveIndex(index)}
                    className={`group relative flex min-w-fit flex-col gap-1 border-b px-4 py-4 text-left transition-colors md:w-full md:px-5 md:py-6 ${
                      isActive
                        ? "border-primary bg-surface"
                        : "border-line hover:bg-surface/60"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        isActive
                          ? "text-foreground"
                          : "text-muted group-hover:text-secondary-text"
                      }`}
                    >
                      {item.label}
                    </span>

                    <span className="font-mono text-xs text-muted">
                      {item.period}
                    </span>

                    {isActive && (
                      <motion.span
                        layoutId="about-active-indicator"
                        className="absolute bottom-0 left-0 h-[2px] w-full bg-primary md:h-full md:w-[2px]"
                        transition={transition}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* CONTENT PANEL */}
            <div
              role="tabpanel"
              className="relative min-h-[360px] overflow-hidden border border-line bg-surface p-7 md:min-h-[400px] md:p-12"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={active.id}
                  initial={{
                    opacity: 0,
                    y: shouldReduceMotion ? 0 : 18,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: shouldReduceMotion ? 0 : -12,
                  }}
                  transition={transition}
                  className="flex h-full min-h-[300px] flex-col justify-between"
                >
                  <div>
                    <h4 className="text-[clamp(32px,4.5vw,52px)] leading-[1.05] font-bold tracking-[-0.05em]">
                      {active.title}
                    </h4>

                    <p className="mt-8 max-w-[560px] text-sm leading-[1.9] text-secondary-text md:text-base">
                      {active.description}
                    </p>
                  </div>

                  <div className="mt-12 border-t border-line pt-6">
                    <p className={`font-mono text-xs ${active.color}`}>
                      {active.stack}
                    </p>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="h-px bg-line" />

        {/* ACADEMIC BACKGROUND */}
        <div className="grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <span className="font-mono text-xs text-muted">Education</span>

            <h3 className="mt-3 text-lg font-semibold">
              Software Engineering
            </h3>

            <p className="mt-1 text-sm text-secondary-text">
              Universitas Gadjah Mada
            </p>
          </div>

          <div className="md:text-right">
            <span className="text-4xl font-bold tracking-tight text-primary">
              3.84
            </span>

            <p className="mt-1 font-mono text-xs text-muted">GPA / 4.00</p>
          </div>
        </div>
      </div>
    </section>
  );
}
