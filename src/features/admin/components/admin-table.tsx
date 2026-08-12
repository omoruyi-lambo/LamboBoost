import type { ReactNode } from "react";

interface AdminTableProps {
  headers: string[];
  children: ReactNode;
}

export function AdminTable({ headers, children }: AdminTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-[#F8FAFC]">
              {headers.map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">{children}</tbody>
        </table>
      </div>
    </div>
  );
}
