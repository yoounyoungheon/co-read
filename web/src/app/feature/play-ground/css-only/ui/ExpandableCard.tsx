import { Card } from "@/app/shared/ui/molecule/card";
import { ExpandableCardProps } from "./OnlyCssComponents.type";

export function ExpandableCard({
  eyebrow,
  title,
  description,
  items,
}: ExpandableCardProps) {
  return (
    <details className="group rounded-[2rem] border border-slate-200 bg-white shadow-sm transition">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 marker:content-none">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            {eyebrow}
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <span className="inline-flex shrink-0 rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition group-open:bg-slate-700">
          <span className="group-open:hidden">펼치기</span>
          <span className="hidden group-open:inline">접기</span>
        </span>
      </summary>

      <div className="grid gap-4 border-t border-slate-100 px-6 py-5 md:grid-cols-3">
        {items.map((item) => (
          <Card
            key={item.title}
            className="rounded-2xl border-slate-200 bg-slate-50 p-4 shadow-none"
          >
            <p className="text-xs font-semibold uppercase text-slate-500">
              {item.title}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">{item.body}</p>
          </Card>
        ))}
      </div>
    </details>
  );
}

export default ExpandableCard;
