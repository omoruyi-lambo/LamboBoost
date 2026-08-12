interface AdminPageHeaderProps {
  title: string;
  description?: string;
}

export function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <div className="border-b border-line pb-5">
      <p className="inline-flex items-center gap-1.5 rounded-full bg-[#E0F2FE] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0369A1]">
        Admin · {title}
      </p>
      <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink">{title}</h1>
      {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
    </div>
  );
}
