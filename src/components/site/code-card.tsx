import { OWNER_NAME } from "@/lib/site";

const Str = ({ children }: { children: string }) => (
  <span className="text-code-string">&quot;{children}&quot;</span>
);

function List({ items }: { items: string[] }) {
  return (
    <>
      [
      {items.map((item, i) => (
        <span key={item}>
          <Str>{item}</Str>
          {i < items.length - 1 && ", "}
        </span>
      ))}
      ]
    </>
  );
}

const lines: React.ReactNode[] = [
  <>
    <span className="text-code-keyword">const</span> engineer{" "}
    <span className="text-code-muted">=</span> {"{"}
  </>,
  <>
    {"  "}name: <Str>{OWNER_NAME}</Str>,
  </>,
  <>
    {"  "}role: <Str>Junior Software Engineer</Str>,
  </>,
  <>
    {"  "}status: <Str>Open to work</Str>,
  </>,
  <>
    {"  "}stack: <List items={["Spring Boot", ".NET", "React", "Flutter"]} />,
  </>,
  <>
    {"  "}ai: <List items={["ML", "Deep Learning", "RL"]} />,
  </>,
  <>
    {"  "}workMode: <List items={["Berkane / Oujda", "Remote"]} />,
  </>,
  <>
    {"  "}passionate: <span className="text-code-keyword">true</span>,
  </>,
  <>{"};"}</>,
  <>&nbsp;</>,
  <>
    <span className="text-code-keyword">await</span> engineer.
    <span className="text-code-fn">design</span>().
    <span className="text-code-fn">build</span>().
    <span className="text-code-fn">ship</span>();
  </>,
];

/** Carte « éditeur de code » décorative du hero (s'adapte au thème). */
export function CodeCard() {
  return (
    // Du code : toujours de gauche à droite, même en arabe.
    <div
      aria-hidden="true"
      dir="ltr"
      className="w-full overflow-hidden rounded-xl border bg-card shadow-xl shadow-foreground/[0.04]"
    >
      <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-foreground/10" />
        <span className="h-3 w-3 rounded-full bg-foreground/10" />
        <span className="h-3 w-3 rounded-full bg-foreground/10" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">
          engineer.ts
        </span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-6 text-card-foreground sm:text-sm sm:leading-7">
        <code>
          {lines.map((line, i) => (
            <span key={i} className="flex">
              <span className="mr-5 w-5 shrink-0 select-none text-right text-code-muted">
                {i + 1}
              </span>
              <span className="whitespace-pre">{line}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
