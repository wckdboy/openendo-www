import { ScanLine, Stethoscope } from "lucide-react";
import { createContext, useContext, useEffect, useId, useState, type ReactNode } from "react";
import {
  diagramsFor,
  mechanismDiagram,
  strengthLabel,
  text,
  treatmentDiagram,
  type Claim,
  type Diagram,
  type FlowDiagram,
  type Locale,
  type MechanismDiagram,
  type Strength,
} from "@/content/explainers/diagrams";
import { SOURCES, type SourceId } from "@/content/explainers/sources";
import { formatDate } from "@/lib/dates";

const REVIEWED = "2026-10-28";
const AnchorContext = createContext("source");

const STROKE: Record<Strength, { color: string; width: number; dash?: string }> = {
  established: { color: "var(--primary)", width: 2 },
  likely: { color: "var(--ink)", width: 1.5 },
  uncertain: { color: "var(--ink-muted)", width: 2, dash: "4 4" },
  "not-yet-shown": { color: "var(--ink-subtle)", width: 2, dash: "1 4" },
};

export function ExplainerSet({
  locale,
  ids,
  showAsText,
  anchorPrefix = "source",
  listHeading,
}: {
  locale: Locale;
  ids?: string[];
  showAsText: string;
  anchorPrefix?: string;
  listHeading?: string;
}) {
  const diagrams = ids
    ? diagramsFor(locale).filter(
        (item) =>
          ids.includes(item.id) || (ids.includes("diagnosis") && item.id.startsWith("diagnosis")),
      )
    : diagramsFor(locale);
  const order = sourceOrder(diagrams);
  return (
    <div className="space-y-14">
      {diagrams.map((diagram) => (
        <Explainer
          key={diagram.id}
          diagram={diagram}
          locale={locale}
          order={order}
          showAsText={showAsText}
          anchorPrefix={anchorPrefix}
        />
      ))}
      {listHeading ? (
        <SourceList ids={order} heading={listHeading} anchorPrefix={anchorPrefix} />
      ) : null}
    </div>
  );
}

export function TreatmentExplainer({
  locale,
  showAsText,
  listHeading,
}: {
  locale: Locale;
  showAsText: string;
  listHeading?: string;
}) {
  const diagram = treatmentDiagram();
  const order = sourceOrder([diagram]);
  return (
    <>
      <Explainer
        diagram={diagram}
        locale={locale}
        order={order}
        showAsText={showAsText}
        anchorPrefix="treatment-source"
      />
      {listHeading ? (
        <SourceList ids={order} heading={listHeading} anchorPrefix="treatment-source" />
      ) : null}
    </>
  );
}

export function MechanismExplainer({ locale, showAsText }: { locale: Locale; showAsText: string }) {
  const diagram = mechanismDiagram();
  return (
    <Explainer
      diagram={diagram}
      locale={locale}
      order={sourceOrder([diagram])}
      showAsText={showAsText}
      anchorPrefix="mechanism-source"
    />
  );
}

function sourceOrder(diagrams: Diagram[]): SourceId[] {
  const ids: SourceId[] = [];
  for (const diagram of diagrams) {
    for (const claim of claimsOf(diagram)) {
      for (const id of claim.sources) {
        if (!ids.includes(id)) ids.push(id);
      }
    }
    if (diagram.kind === "mechanisms") {
      for (const edge of diagram.edges) {
        for (const id of edge.sources) {
          if (!ids.includes(id)) ids.push(id);
        }
      }
    }
  }
  return ids;
}

function claimsOf(diagram: Diagram): Claim[] {
  switch (diagram.kind) {
    case "flow":
      return diagram.side ? [...diagram.nodes, diagram.side] : diagram.nodes;
    case "theories":
      return diagram.rows;
    case "mechanisms":
      return diagram.nodes;
    case "treatment":
      return diagram.groups.flatMap((group) => group.options);
    case "known":
      return [...diagram.known, ...diagram.unknown];
    default: {
      const never: never = diagram;
      return never;
    }
  }
}

function Explainer({
  diagram,
  locale,
  order,
  showAsText,
  anchorPrefix,
}: {
  diagram: Diagram;
  locale: Locale;
  order: SourceId[];
  showAsText: string;
  anchorPrefix: string;
}) {
  const titleId = useId();
  const captionId = useId();
  const [openId, setOpenId] = useState<string | null>(null);
  const [hover, setHover] = useState<SourceId[]>([]);
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenId(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  const used = sourceOrder([diagram]);
  return (
    <AnchorContext.Provider value={anchorPrefix}>
      <section className="max-w-[720px]" aria-labelledby={titleId}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 id={titleId} className="text-[var(--text-xl)]">
            {text(diagram.title, locale)}
          </h3>
          <Legend locale={locale} />
        </div>
        <p id={captionId} className="mt-2 text-base text-[var(--ink-muted)]">
          {text(diagram.caption, locale)}
        </p>
        <div className="relative mt-4">
          <DiagramBody
            diagram={diagram}
            locale={locale}
            order={order}
            titleId={titleId}
            captionId={captionId}
            openId={openId}
            setOpenId={setOpenId}
            setHover={setHover}
          />
        </div>
        <p className="mt-3 text-sm text-[var(--ink-muted)]">
          {used.map((id, index) => (
            <span
              key={id}
              className={hover.includes(id) ? "rounded bg-[var(--sunken)]" : undefined}
            >
              {index > 0 ? " · " : null}
              <a href={`#${anchorPrefix}-${order.indexOf(id) + 1}`}>
                {order.indexOf(id) + 1} {SOURCES[id].short}
              </a>
            </span>
          ))}
        </p>
        <p className="mt-1 text-sm text-[var(--ink-subtle)]">
          {locale === "da" ? "Sidst gennemgået" : "Last reviewed"} {formatDate(REVIEWED, locale)}
        </p>
        <details className="explainer-text mt-3">
          <summary className="min-h-11 cursor-pointer text-base">{showAsText}</summary>
          <TextVersion diagram={diagram} locale={locale} order={order} />
        </details>
      </section>
    </AnchorContext.Provider>
  );
}

function Legend({ locale }: { locale: Locale }) {
  const items: Strength[] = ["established", "likely", "uncertain", "not-yet-shown"];
  return (
    <ul
      className="flex flex-wrap gap-x-3 gap-y-1"
      aria-label={locale === "da" ? "Evidensstyrke" : "Evidence strength"}
    >
      {items.map((item) => (
        <li key={item} className="flex items-center gap-1.5 text-[12px] text-[var(--ink)]">
          <svg width="28" height="8" aria-hidden="true">
            <line
              x1="0"
              y1="4"
              x2="28"
              y2="4"
              stroke={STROKE[item].color}
              strokeWidth={STROKE[item].width}
              strokeDasharray={STROKE[item].dash}
              strokeLinecap="round"
            />
          </svg>
          {strengthLabel(item, locale)}
        </li>
      ))}
    </ul>
  );
}

function DiagramBody(props: {
  diagram: Diagram;
  locale: Locale;
  order: SourceId[];
  titleId: string;
  captionId: string;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  setHover: (ids: SourceId[]) => void;
}) {
  const { diagram, locale, order, titleId, captionId, openId, setOpenId, setHover } = props;
  switch (diagram.kind) {
    case "flow":
      return (
        <FlowView
          diagram={diagram}
          locale={locale}
          order={order}
          titleId={titleId}
          captionId={captionId}
          openId={openId}
          setOpenId={setOpenId}
          setHover={setHover}
        />
      );
    case "theories":
      return (
        <TheoryView
          diagram={diagram}
          locale={locale}
          order={order}
          openId={openId}
          setOpenId={setOpenId}
          setHover={setHover}
        />
      );
    case "mechanisms":
      return (
        <MechanismView
          diagram={diagram}
          locale={locale}
          order={order}
          titleId={titleId}
          captionId={captionId}
          openId={openId}
          setOpenId={setOpenId}
          setHover={setHover}
        />
      );
    case "treatment":
      return (
        <TreatmentView
          diagram={diagram}
          locale={locale}
          order={order}
          openId={openId}
          setOpenId={setOpenId}
          setHover={setHover}
        />
      );
    case "known":
      return (
        <KnownView
          diagram={diagram}
          locale={locale}
          order={order}
          openId={openId}
          setOpenId={setOpenId}
          setHover={setHover}
        />
      );
    default: {
      const never: never = diagram;
      return never;
    }
  }
}

function FlowView({
  diagram,
  locale,
  order,
  titleId,
  captionId,
  openId,
  setOpenId,
  setHover,
}: {
  diagram: FlowDiagram;
  locale: Locale;
  order: SourceId[];
  titleId: string;
  captionId: string;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  setHover: (ids: SourceId[]) => void;
}) {
  return (
    <>
      <ol className="hidden items-start gap-1 md:flex">
        {diagram.nodes.map((node, index) => (
          <li key={node.id} className="flex min-w-0 flex-1 flex-col items-stretch">
            <div className="flex items-center">
              <Node
                claim={node}
                locale={locale}
                order={order}
                open={openId === node.id}
                onOpen={() => setOpenId(openId === node.id ? null : node.id)}
                onHover={setHover}
                icon={flowIcon(node.id)}
              />
              {index < diagram.nodes.length - 1 ? (
                <Arrow direction="right" strength="established" />
              ) : null}
            </div>
            {diagram.side && diagram.sideAfter === node.id ? (
              <div className="mt-3">
                <Node
                  claim={diagram.side}
                  locale={locale}
                  order={order}
                  open={openId === diagram.side.id}
                  onOpen={() =>
                    setOpenId(openId === diagram.side?.id ? null : (diagram.side?.id ?? null))
                  }
                  onHover={setHover}
                  info
                />
              </div>
            ) : null}
          </li>
        ))}
      </ol>
      <ol className="space-y-2 md:hidden">
        {diagram.nodes.map((node, index) => (
          <li key={node.id}>
            <Node
              claim={node}
              locale={locale}
              order={order}
              open={openId === node.id}
              onOpen={() => setOpenId(openId === node.id ? null : node.id)}
              onHover={setHover}
              icon={flowIcon(node.id)}
            />
            {diagram.side && diagram.sideAfter === node.id ? (
              <div className="mt-2">
                <Node
                  claim={diagram.side}
                  locale={locale}
                  order={order}
                  open={openId === diagram.side.id}
                  onOpen={() =>
                    setOpenId(openId === diagram.side?.id ? null : (diagram.side?.id ?? null))
                  }
                  onHover={setHover}
                  info
                />
              </div>
            ) : null}
            {index < diagram.nodes.length - 1 ? (
              <div className="flex justify-center py-1">
                <Arrow direction="down" strength="established" />
              </div>
            ) : null}
          </li>
        ))}
      </ol>
      <svg className="sr-only" role="img" aria-labelledby={`${titleId} ${captionId}`} />
    </>
  );
}

function flowIcon(id: string): ReactNode {
  if (id === "history" || id === "gp" || id === "exam")
    return <Stethoscope className="h-4 w-4" strokeWidth={1.5} aria-hidden />;
  if (id === "imaging" || id === "scan-da")
    return <ScanLine className="h-4 w-4" strokeWidth={1.5} aria-hidden />;
  if (id.startsWith("scope")) return <ScopeIcon />;
  return null;
}

function ScopeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
      <circle cx="7" cy="7" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10.2 10.2 L13.5 13.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TheoryView(props: {
  diagram: Extract<Diagram, { kind: "theories" }>;
  locale: Locale;
  order: SourceId[];
  openId: string | null;
  setOpenId: (id: string | null) => void;
  setHover: (ids: SourceId[]) => void;
}) {
  const { diagram, locale, order, openId, setOpenId, setHover } = props;
  return (
    <ol className="space-y-4">
      {diagram.rows.map((row) => (
        <li key={row.id}>
          <div className="flex gap-3">
            <Scale level={row.level} label={strengthLabel(row.strength, locale)} />
            <div className="min-w-0 flex-1">
              <Node
                claim={row}
                locale={locale}
                order={order}
                open={openId === row.id}
                onOpen={() => setOpenId(openId === row.id ? null : row.id)}
                onHover={setHover}
              />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Scale({ level, label }: { level: 1 | 2 | 3 | 4; label: string }) {
  return (
    <span className="mt-3 flex shrink-0 gap-0.5" aria-label={label}>
      {[1, 2, 3, 4].map((step) => (
        <span
          key={step}
          className="block h-2.5 w-2.5 border border-[var(--ink)]"
          style={{ background: step <= level ? "var(--ink)" : "transparent" }}
        />
      ))}
    </span>
  );
}

function MechanismView({
  diagram,
  locale,
  order,
  titleId,
  captionId,
  openId,
  setOpenId,
  setHover,
}: {
  diagram: MechanismDiagram;
  locale: Locale;
  order: SourceId[];
  titleId: string;
  captionId: string;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  setHover: (ids: SourceId[]) => void;
}) {
  const anchorPrefix = useContext(AnchorContext);
  const col = [0, 230, 460];
  const rowH = 88;
  const width = 200;
  const height = 76;
  const box = (node: (typeof diagram.nodes)[number]) => ({
    x: col[node.col] ?? 0,
    y: 8 + node.row * rowH,
    w: width,
    h: height,
  });
  const byId = new Map(diagram.nodes.map((node) => [node.id, node]));
  return (
    <>
      <div className="relative hidden h-[460px] md:block" style={{ maxWidth: 660 }}>
        <svg
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-labelledby={`${titleId} ${captionId}`}
        >
          {diagram.edges.map((edge) => {
            const from = byId.get(edge.from);
            const to = byId.get(edge.to);
            if (!from || !to) return null;
            const a = box(from);
            const b = box(to);
            const x1 = a.x + a.w;
            const y1 = a.y + a.h / 2;
            const x2 = b.x;
            const y2 = b.y + b.h / 2;
            const elbow = x2 - 14;
            const stroke = STROKE[edge.strength];
            const cites = edge.sources.map((id) => order.indexOf(id) + 1).join(" ");
            return (
              <g key={`${edge.from}-${edge.to}`}>
                <path
                  d={`M ${x1} ${y1} H ${elbow} V ${y2} H ${x2 - 6} M ${x2 - 7} ${y2 - 4} L ${x2 - 1} ${y2} L ${x2 - 7} ${y2 + 4}`}
                  fill="none"
                  stroke={stroke.color}
                  strokeWidth={stroke.width}
                  strokeDasharray={stroke.dash}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <text
                  x={elbow - 4}
                  y={y2 - 6}
                  textAnchor="end"
                  fontSize="12"
                  fontFamily="Atkinson Hyperlegible Next, system-ui, sans-serif"
                  fill="var(--primary)"
                >
                  {cites}
                </text>
              </g>
            );
          })}
        </svg>
        {diagram.nodes.map((node) => {
          const place = box(node);
          return (
            <div
              key={node.id}
              className="absolute"
              style={{ left: place.x, top: place.y, width: place.w }}
            >
              <Node
                claim={node}
                locale={locale}
                order={order}
                open={openId === node.id}
                onOpen={() => setOpenId(openId === node.id ? null : node.id)}
                onHover={setHover}
              />
            </div>
          );
        })}
      </div>
      <ul className="space-y-4 md:hidden">
        {diagram.nodes
          .filter((node) => node.col === 0)
          .map((node) => (
            <li key={node.id}>
              <Node
                claim={node}
                locale={locale}
                order={order}
                open={openId === node.id}
                onOpen={() => setOpenId(openId === node.id ? null : node.id)}
                onHover={setHover}
              />
              <ul className="mt-2 space-y-2 border-l border-[var(--border-strong)] pl-3">
                {follow(diagram, node.id).map((child) => {
                  const edge = diagram.edges.find((item) => item.to === child.id);
                  return (
                    <li key={child.id}>
                      {edge ? (
                        <p className="mb-1 text-sm text-[var(--ink-muted)]">
                          {strengthLabel(edge.strength, locale)}
                          {edge.sources.map((id) => (
                            <sup key={id} className="ml-0.5">
                              <a href={`#${anchorPrefix}-${order.indexOf(id) + 1}`}>
                                {order.indexOf(id) + 1}
                              </a>
                            </sup>
                          ))}
                        </p>
                      ) : null}
                      <Node
                        claim={child}
                        locale={locale}
                        order={order}
                        open={openId === child.id}
                        onOpen={() => setOpenId(openId === child.id ? null : child.id)}
                        onHover={setHover}
                      />
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
      </ul>
    </>
  );
}

function follow(diagram: MechanismDiagram, id: string): Claim[] {
  const byId = new Map(diagram.nodes.map((node) => [node.id, node]));
  const next = diagram.edges.filter((edge) => edge.from === id).map((edge) => edge.to);
  const out: Claim[] = [];
  for (const target of next) {
    const node = byId.get(target);
    if (!node) continue;
    out.push(node);
    for (const grandchild of diagram.edges.filter((edge) => edge.from === target)) {
      const child = byId.get(grandchild.to);
      if (child) out.push(child);
    }
  }
  return out;
}

function TreatmentView(props: {
  diagram: Extract<Diagram, { kind: "treatment" }>;
  locale: Locale;
  order: SourceId[];
  openId: string | null;
  setOpenId: (id: string | null) => void;
  setHover: (ids: SourceId[]) => void;
}) {
  const { diagram, locale, order, openId, setOpenId, setHover } = props;
  return (
    <>
      <div className="hidden space-y-6 md:block">
        {diagram.groups.map((group) => (
          <section key={group.id}>
            <h4 className="text-[var(--text-lg)]">{text(group.title, locale)}</h4>
            <ul className="mt-3 space-y-3">
              {group.options.map((option) => (
                <li key={option.id}>
                  <Node
                    claim={option}
                    locale={locale}
                    order={order}
                    open={openId === option.id}
                    onOpen={() => setOpenId(openId === option.id ? null : option.id)}
                    onHover={setHover}
                    extra={text(option.guideline, locale)}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="space-y-2 md:hidden">
        {diagram.groups.map((group) => (
          <details
            key={group.id}
            className="rounded-[8px] border border-[var(--border-strong)] bg-[var(--surface)]"
          >
            <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-2 px-3 py-2">
              <span className="text-base font-semibold">{text(group.title, locale)}</span>
              <span className="flex flex-wrap justify-end gap-1">
                {group.options.map((option) => (
                  <Pill key={option.id}>{strengthLabel(option.strength, locale)}</Pill>
                ))}
              </span>
            </summary>
            <ul className="space-y-3 px-3 pb-3">
              {group.options.map((option) => (
                <li key={option.id}>
                  <Node
                    claim={option}
                    locale={locale}
                    order={order}
                    open={openId === option.id}
                    onOpen={() => setOpenId(openId === option.id ? null : option.id)}
                    onHover={setHover}
                    extra={text(option.guideline, locale)}
                  />
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </>
  );
}

function KnownView(props: {
  diagram: Extract<Diagram, { kind: "known" }>;
  locale: Locale;
  order: SourceId[];
  openId: string | null;
  setOpenId: (id: string | null) => void;
  setHover: (ids: SourceId[]) => void;
}) {
  const { diagram, locale, order, openId, setOpenId, setHover } = props;
  const columns = [
    {
      key: "known",
      title: locale === "da" ? "Kendt" : "Known",
      items: diagram.known,
      dashed: false,
    },
    {
      key: "unknown",
      title: locale === "da" ? "Endnu ikke kendt" : "Not yet known",
      items: diagram.unknown,
      dashed: true,
    },
  ];
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        {columns.map((column) => (
          <section
            key={column.key}
            className="rounded-[8px] bg-[var(--surface)] p-3"
            style={{
              border: column.dashed
                ? "1.5px dashed var(--border-strong)"
                : "1.5px solid var(--border-strong)",
            }}
          >
            <h4 className="text-[var(--text-lg)]">{column.title}</h4>
            <ul className="mt-3 space-y-3">
              {column.items.map((item) => (
                <li key={item.id}>
                  <Node
                    claim={item}
                    locale={locale}
                    order={order}
                    open={openId === item.id}
                    onOpen={() => setOpenId(openId === item.id ? null : item.id)}
                    onHover={setHover}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-base">
        {diagram.questions.map((question) => (
          <li key={question.en}>{text(question, locale)}</li>
        ))}
      </ul>
    </div>
  );
}

function Node({
  claim,
  locale,
  order,
  open,
  onOpen,
  onHover,
  info,
  icon,
  extra,
}: {
  claim: Claim;
  locale: Locale;
  order: SourceId[];
  open: boolean;
  onOpen: () => void;
  onHover: (ids: SourceId[]) => void;
  info?: boolean;
  icon?: ReactNode;
  extra?: string;
}) {
  const anchorPrefix = useContext(AnchorContext);
  const muted = claim.strength === "not-yet-shown";
  return (
    <div className="relative min-w-0">
      <button
        type="button"
        className="w-full min-h-11 rounded-[8px] bg-[var(--surface)] p-2 text-left"
        style={{
          border: info ? "1.5px solid var(--info)" : "1.5px solid var(--border-strong)",
          borderLeft: claim.strength === "established" ? "3px solid var(--primary)" : undefined,
          color: muted ? "var(--ink-muted)" : "var(--ink)",
        }}
        aria-expanded={open}
        onClick={onOpen}
        onMouseEnter={() => onHover(claim.sources)}
        onMouseLeave={() => onHover([])}
        onFocus={() => onHover(claim.sources)}
        onBlur={() => onHover([])}
      >
        <span className="flex items-start gap-1.5">
          {icon}
          <span className="text-[15px] font-semibold leading-snug">
            {text(claim.title, locale)}
          </span>
        </span>
        <span className="mt-1 block text-sm leading-snug text-[var(--ink-muted)]">
          {text(claim.detail, locale)}
          {claim.sources.map((id) => (
            <sup key={id} className="ml-0.5">
              <a
                href={`#${anchorPrefix}-${order.indexOf(id) + 1}`}
                className="text-[var(--primary)]"
                onClick={(event) => event.stopPropagation()}
              >
                {order.indexOf(id) + 1}
              </a>
            </sup>
          ))}
        </span>
        <span className="mt-1 flex flex-wrap gap-1">
          <Pill>{strengthLabel(claim.strength, locale)}</Pill>
          {extra ? <Pill>{extra}</Pill> : null}
        </span>
      </button>
      {open ? (
        <div
          role="dialog"
          className="absolute z-10 mt-1 w-full rounded-[8px] border border-[var(--border-strong)] bg-[var(--surface)] p-3 text-sm shadow-[var(--shadow-card)]"
        >
          <p className="font-semibold">{strengthLabel(claim.strength, locale)}</p>
          <ul className="mt-2 space-y-1">
            {claim.sources.map((id) => (
              <li key={id}>
                <a href={SOURCES[id].url}>{SOURCES[id].short}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] px-1.5 text-[12px] leading-4 text-[var(--ink)]">
      {children}
    </span>
  );
}

function Arrow({ direction, strength }: { direction: "right" | "down"; strength: Strength }) {
  const stroke = STROKE[strength];
  const d = direction === "right" ? "M2 8 H22 M16 3 L23 8 L16 13" : "M8 2 V22 M3 16 L8 23 L13 16";
  return (
    <svg width="28" height="28" aria-hidden="true" className="shrink-0">
      <path
        d={d}
        fill="none"
        stroke={stroke.color}
        strokeWidth={stroke.width}
        strokeDasharray={stroke.dash}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TextVersion({
  diagram,
  locale,
  order,
}: {
  diagram: Diagram;
  locale: Locale;
  order: SourceId[];
}) {
  if (diagram.kind === "theories") {
    return (
      <table className="mt-3 w-full text-left text-base">
        <tbody>
          {diagram.rows.map((row) => (
            <tr key={row.id} className="border-b border-hairline align-top">
              <th scope="row" className="py-2 pr-3 font-medium">
                {text(row.title, locale)}
              </th>
              <td className="py-2 pr-3">{strengthLabel(row.strength, locale)}</td>
              <td className="py-2">{text(row.detail, locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  const claims = claimsOf(diagram);
  const byId =
    diagram.kind === "mechanisms" ? new Map(diagram.nodes.map((node) => [node.id, node])) : null;
  return (
    <>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-base">
        {claims.map((claim) => (
          <li key={claim.id}>
            <span className="font-semibold">{text(claim.title, locale)}. </span>
            {text(claim.detail, locale)} ({strengthLabel(claim.strength, locale)}
            {claim.sources.map((id) => ` [${order.indexOf(id) + 1}]`).join("")})
          </li>
        ))}
      </ol>
      {diagram.kind === "mechanisms" && byId ? (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-base">
          {diagram.edges.map((edge) => (
            <li key={`${edge.from}-${edge.to}`}>
              {text(byId.get(edge.from)?.title ?? { en: edge.from, da: edge.from }, locale)}
              {" → "}
              {text(byId.get(edge.to)?.title ?? { en: edge.to, da: edge.to }, locale)}
              {". "}
              {strengthLabel(edge.strength, locale)}
              {edge.sources.map((id) => ` [${order.indexOf(id) + 1}]`).join("")}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

export function SourceList({
  ids,
  heading,
  anchorPrefix = "source",
}: {
  ids: SourceId[];
  heading: string;
  anchorPrefix?: string;
}) {
  return (
    <section className="mt-14 max-w-[var(--measure)]">
      <h2 className="text-[var(--text-xl)]">{heading}</h2>
      <ol className="mt-4 space-y-4">
        {ids.map((id, index) => {
          const source = SOURCES[id];
          return (
            <li key={id} id={`${anchorPrefix}-${index + 1}`} className="text-base">
              <span className="mr-2 inline-flex rounded-full bg-[var(--sunken)] px-2 py-0.5 text-sm">
                {source.kind}
              </span>
              <a href={source.url}>
                {source.title}. {source.org}. {source.section}. {formatDate(source.accessed, "en")}
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
