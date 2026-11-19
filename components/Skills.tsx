type Tone = "primary" | "cyan" | "orange" | "pink";

type Group = { title: string; tone: Tone; items: string[] };

// Nama class ditulis utuh supaya terbaca oleh Tailwind
const TONE_STYLE: Record<Tone, { dot: string; text: string; chip: string }> = {
  primary: { dot: "bg-primary", text: "text-primary", chip: "border-primary/30" },
  cyan: { dot: "bg-cyan", text: "text-cyan", chip: "border-cyan/30" },
  orange: { dot: "bg-orange", text: "text-orange", chip: "border-orange/30" },
  pink: { dot: "bg-pink", text: "text-pink", chip: "border-pink/30" },
};

const GROUPS: Group[] = [
  { title: "Languages", tone: "primary", items: ["C#", "PHP", "Kotlin"] },
  {
    title: "Frameworks",
    tone: "cyan",
    items: ["ASP.NET Core", "Laravel", "Next.js", "Prisma ORM"],
  },
  { title: "Databases", tone: "orange", items: ["SQL Server", "MySQL", "PostgreSQL"] },
  {
    title: "Game Development",
    tone: "pink",
    items: ["Unity 2D", "Unreal Engine 5 (Blueprint)"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="border-y border-line bg-surface">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">Skills</h2>
        <p className="mt-3 max-w-2xl text-secondary-text">
          Tools and technologies I have used in internship work, coursework, and personal
          projects.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {GROUPS.map((g) => {
            const t = TONE_STYLE[g.tone];
            return (
              <div key={g.title} className="rounded-xl border border-line bg-background p-6">
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
                  <span className={`h-2 w-2 rounded-full ${t.dot}`} aria-hidden="true" />
                  <span className={t.text}>{g.title}</span>
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      className={`rounded-md border px-3 py-1.5 font-mono text-sm text-foreground ${t.chip}`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-sm text-muted">
          <span className="font-medium text-purple">Spoken languages:</span> Indonesian,
          Javanese, English (beginner)
        </p>
      </div>
    </section>
  );
}
