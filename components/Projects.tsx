type Kind = "backend" | "fullstack" | "frontend" | "game";

type Project = {
  title: string;
  role: string;
  period: string;
  description: string;
  stack: string[];
  kind: Kind;
  href?: string; // isi link demo atau repo kalau ada, tombolnya muncul otomatis
};

// Nama class ditulis utuh supaya terbaca oleh Tailwind (jangan digabung dari potongan string)
const KIND_STYLE: Record<Kind, { label: string; text: string; dot: string; hover: string }> = {
  backend: { label: "Backend", text: "text-primary", dot: "bg-primary", hover: "hover:border-primary" },
  fullstack: { label: "Fullstack", text: "text-orange", dot: "bg-orange", hover: "hover:border-orange" },
  frontend: { label: "Frontend", text: "text-cyan", dot: "bg-cyan", hover: "hover:border-cyan" },
  game: { label: "Game", text: "text-pink", dot: "bg-pink", hover: "hover:border-pink" },
};

const PROJECTS: Project[] = [
  {
    title: "Inventory Management System",
    role: "Fullstack Developer · Internship, PT Hino Motors Manufacturing Indonesia",
    period: "Aug 2025 – Feb 2026",
    description:
      "Web-based inventory management system, including returnable package monitoring. Built application features, backend logic, database integration, and system testing.",
    stack: ["ASP.NET Core", "C#", "SQL Server"],
    kind: "fullstack",
  },
  {
    title: "Open MRI",
    role: "Backend Developer",
    period: "Feb 2025 – Jun 2025",
    description:
      "Learning website for nurse training through interactive simulation. Admins manage simulation content, track user progress, and customize training modules.",
    stack: ["Next.js", "PostgreSQL", "Prisma ORM"],
    kind: "backend",
  },
  {
    title: "BROMO – Broiler Monitoring",
    role: "Backend Developer",
    period: "Jul 2023 – Dec 2024",
    description:
      "System to monitor and manage broiler chicken farms. Collects environmental and operational data in real time and turns it into insights that help farmers work more efficiently.",
    stack: ["Kotlin", "Laravel", "MySQL"],
    kind: "backend",
  },
  {
    title: "ASSETS Website",
    role: "Frontend Developer",
    period: "Jul 2023 – Oct 2023",
    description:
      "Information website for the Software Engineering Program at Gadjah Mada University, including an election feature for the organization's chairman.",
    stack: ["Laravel"],
    kind: "frontend",
  },
  {
    title: "Finion",
    role: "Game Developer",
    period: "Aug 2024 – Jan 2025",
    description:
      "Semi open-world 2D game that introduces financial literacy to children.",
    stack: ["Unity 2D", "C#"],
    kind: "game",
  },
  {
    title: "Anomali Hitam",
    role: "Game Developer",
    period: "Feb 2025 – Jun 2025",
    description:
      "Horror game made as a final project for the Game Development course, where players uncover the secrets behind a series of dark anomalies.",
    stack: ["Unreal Engine 5", "Blueprint"],
    kind: "game",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
      <h2 className="text-3xl font-bold text-foreground md:text-4xl">Projects</h2>
      <p className="mt-3 max-w-2xl text-secondary-text">
        A selection of backend, web, and game projects from my internship, coursework, and
        student organization work.
      </p>

      <ul className="mt-10 grid gap-5 md:grid-cols-2">
        {PROJECTS.map((p) => {
          const k = KIND_STYLE[p.kind];
          return (
            <li key={p.title} className="flex">
              <article
                className={`flex w-full flex-col rounded-xl border border-line bg-surface p-6 transition-colors duration-200 ${k.hover}`}
              >
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
                  <span className={`h-2 w-2 rounded-full ${k.dot}`} aria-hidden="true" />
                  <span className={k.text}>{k.label}</span>
                  <span className="text-muted">· {p.period}</span>
                </div>

                <h3 className="mt-3 text-xl font-semibold text-foreground">{p.title}</h3>
                <p className="mt-1 text-sm text-muted">{p.role}</p>
                <p className="mt-4 flex-1 text-secondary-text">{p.description}</p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <li
                      key={s}
                      className="rounded-md bg-elevated px-2.5 py-1 font-mono text-xs text-yellow"
                    >
                      {s}
                    </li>
                  ))}
                </ul>

                {p.href && (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex w-fit text-sm font-medium text-cyan hover:underline"
                  >
                    View project →
                  </a>
                )}
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
