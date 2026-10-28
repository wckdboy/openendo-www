export function Disclaimer({ title, body }: { title: string; body: string }) {
  return (
    <aside
      role="note"
      className="rounded-2xl border border-hairline bg-ribbon-soft/70 px-5 py-4 text-sm leading-relaxed"
    >
      <p className="font-semibold tracking-tight">{title}</p>
      <p className="mt-1.5 text-muted-foreground">{body}</p>
    </aside>
  );
}
