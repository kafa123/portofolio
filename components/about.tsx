
"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

const principles = [
  {
    number: "01",
    label: "THINK",
    title: "Question\nthings.",
    description:
      "I find myself asking why something works the way it does before thinking about how to build it. Understanding the problem matters just as much as finding the solution.",
    quote: "Curiosity starts with a question.",
    color: "text-primary",
  },
  {
    number: "02",
    label: "EXPLORE",
    title: "Stay\ncurious.",
    description:
      "I enjoy stepping into unfamiliar territory, even when it means starting from zero. There is something exciting about discovering a subject I know almost nothing about.",
    quote: "There is always something new to discover.",
    color: "text-cyan",
  },
  {
    number: "03",
    label: "CREATE",
    title: "Learn by\ndoing.",
    description:
      "Ideas become clearer when I experiment, build, make mistakes, and try again. I would rather explore an imperfect idea than leave it untouched.",
    quote: "Build. Break. Understand. Repeat.",
    color: "text-purple",
  },
  {
    number: "04",
    label: "GROW",
    title: "Keep\nevolving.",
    description:
      "I see learning as a continuous process, not something that ends when a project is finished. Every experience leaves something worth carrying forward.",
    quote: "Never stop becoming.",
    color: "text-orange",
  },
];

export default function About() {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const active = principles[activeIndex];

  function selectPrinciple(index: number) {
    setActiveIndex(index);
  }

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
        <div className="flex items-center justify-between border-b border-line pb-4 font-mono text-[10px] tracking-[0.15em] text-muted md:text-xs">
          <span>01 — ABOUT ME</span>
          <span>BEYOND THE CODE</span>
        </div>

        {/* INTRODUCTION */}
        <div className="grid gap-10 py-20 md:grid-cols-[1.2fr_0.8fr] md:items-end md:py-28">
          <div>
            <span className="font-mono text-[11px] tracking-widest text-primary">
              A LITTLE ABOUT HOW I THINK
            </span>

            <h2 className="mt-8 text-[clamp(46px,8vw,88px)] leading-[0.98] font-bold tracking-[-0.075em]">
              Curiosity is
              <br />
              where I <span className="text-primary">start.</span>
            </h2>
          </div>

          <div className="md:pb-2">
            <p className="text-xl leading-relaxed tracking-tight md:text-2xl">
              I&apos;ve never been good at staying inside one box.
            </p>

            <p className="mt-5 text-sm leading-[1.9] text-secondary-text md:text-base">
              I enjoy exploring ideas, understanding how things work,
              and discovering connections between seemingly different
              things. For me, curiosity is not just about finding
              answers. It is also about knowing which questions to ask.
            </p>
          </div>
        </div>

        <div className="h-px bg-line" />

        {/* INTERACTIVE PRINCIPLES */}
        <div className="py-20 md:py-28">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="font-mono text-xs tracking-widest text-primary">
                01.1 — MY MINDSET
              </span>

              <h3 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                How I approach things.
              </h3>
            </div>

            <span className="font-mono text-[10px] tracking-widest text-muted">
              MY FOUR WAYS OF THINKING
            </span>
          </div>

          <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr] md:gap-16">

            {/* NAVIGATION */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:gap-0 md:overflow-visible md:pb-0">
              {principles.map((item, index) => {
                const isActive = activeIndex === index;

                return (
                  <button
                    key={item.number}
                    type="button"
                    onClick={() => selectPrinciple(index)}
                    aria-pressed={isActive}
                    className={`group relative flex min-w-fit items-center gap-4 border-b px-4 py-4 text-left transition-colors md:w-full md:gap-5 md:px-5 md:py-6 ${
                      isActive
                        ? "border-primary bg-surface"
                        : "border-line hover:bg-surface/60"
                    }`}
                  >
                    <span
                      className={`font-mono text-xs transition-colors ${
                        isActive ? "text-primary" : "text-muted"
                      }`}
                    >
                      {item.number}
                    </span>

                    <span
                      className={`text-sm font-semibold tracking-widest transition-colors ${
                        isActive
                          ? "text-foreground"
                          : "text-muted group-hover:text-secondary-text"
                      }`}
                    >
                      {item.label}
                    </span>

                    <span
                      className={`ml-auto hidden text-sm transition-all md:block ${
                        isActive
                          ? "translate-x-0 text-primary opacity-100"
                          : "-translate-x-2 text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }`}
                    >
                      →
                    </span>

                    {isActive && (
                      <motion.span
                        layoutId="about-active-indicator"
                        className="absolute bottom-0 left-0 h-[2px] w-full bg-primary md:bottom-0 md:left-0 md:h-full md:w-[2px]"
                        transition={transition}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* CONTENT PANEL */}
            <div className="relative min-h-[390px] overflow-hidden border border-line bg-surface p-7 md:min-h-[440px] md:p-12">
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={active.number}
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
                  className="relative z-10 flex h-full min-h-[340px] flex-col justify-between md:min-h-[340px]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs tracking-widest text-muted">
                        PRINCIPLE / {active.number}
                      </span>

                      <span className={`font-mono text-xs tracking-widest ${active.color}`}>
                        {active.label}
                      </span>
                    </div>

                    <h4 className="mt-12 whitespace-pre-line text-[clamp(48px,7vw,76px)] leading-[0.95] font-bold tracking-[-0.07em]">
                      {active.title.split("\n").map((line, index) => (
                        <span key={line}>
                          {index === 1 ? (
                            <span className={active.color}>{line}</span>
                          ) : (
                            line
                          )}
                          {index === 0 && <br />}
                        </span>
                      ))}
                    </h4>

                    <p className="mt-8 max-w-[520px] text-sm leading-[1.9] text-secondary-text md:text-base">
                      {active.description}
                    </p>
                  </div>

                  <div className="mt-12 border-t border-line pt-6">
                    <p className={`font-mono text-xs tracking-wide ${active.color}`}>
                     {active.quote}
                    </p>
                  </div>
                </motion.article>
              </AnimatePresence>

              {/* BACKGROUND NUMBER */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-5 -top-12 select-none font-mono text-[180px] font-bold leading-none tracking-tighter text-foreground/[0.025] md:-right-2 md:-top-16 md:text-[260px]"
              >
                {active.number}
              </span>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-primary">
                {active.number}
              </span>

              <div className="h-[2px] w-24 overflow-hidden bg-line md:w-40">
                <motion.div
                  className="h-full bg-primary"
                  animate={{
                    width: `${((activeIndex + 1) / principles.length) * 100}%`,
                  }}
                  transition={transition}
                />
              </div>

              <span className="font-mono text-xs text-muted">04</span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setActiveIndex(
                    (current) =>
                      (current - 1 + principles.length) % principles.length
                  )
                }
                aria-label="Previous principle"
                className="flex h-11 w-11 items-center justify-center border border-line text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                ←
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveIndex(
                    (current) => (current + 1) % principles.length
                  )
                }
                aria-label="Next principle"
                className="flex h-11 w-11 items-center justify-center border border-line text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div className="h-px bg-line" />

        {/* ACADEMIC BACKGROUND */}
        <div className="grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <span className="font-mono text-[10px] tracking-widest text-muted">
              ACADEMIC BACKGROUND
            </span>

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

            <p className="mt-1 font-mono text-[10px] tracking-widest text-muted">
              GPA / 4.00
            </p>
          </div>
        </div>

        {/* CLOSING */}
        <div className="border-t border-line px-5 pt-16 text-center md:pt-20">
          <p className="text-2xl leading-relaxed tracking-tight md:text-4xl">
            Still curious.
            <br />
            Still learning.
            <br />
            <span className="text-primary">Still becoming.</span>
          </p>

          <span className="mt-10 inline-block font-mono text-[10px] text-muted">
            END OF NOTE_
          </span>
        </div>
      </div>
    </section>
  );
}
