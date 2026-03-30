import { Card } from "@/app/shared/ui/molecule/card";
import { CssOnlyTabItem } from "./OnlyCssComponents.type";

export interface CssOnlyTabItemCardProps {
  tab: CssOnlyTabItem;
  defaultChecked?: boolean;
}

export function CssOnlyTabItemCard({
  tab,
  defaultChecked = false,
}: CssOnlyTabItemCardProps) {
  return (
    <div className="contents">
      <input
        id={tab.id}
        type="radio"
        name="css-only-tabs"
        className="peer sr-only"
        defaultChecked={defaultChecked}
      />

      <label
        htmlFor={tab.id}
        className="
          flex
          cursor-pointer
          flex-col
          rounded-[2rem]
          border
          border-slate-200
          bg-white
          text-slate-900
          px-4
          py-4
          shadow-sm
          transition
          hover:border-slate-300
          lg:min-h-[108px]
          peer-checked:border-2
          peer-checked:border-primary-main
        "
      >
        <span className="text-xs font-semibold uppercase tracking-[0.22em] opacity-60">
          {tab.eyebrow}
        </span>
        <span className="mt-2 text-base font-semibold">{tab.label}</span>
      </label>

      <div className="hidden min-h-[340px] rounded-[2rem] bg-white p-6 peer-checked:block md:p-7">
        <Card className="flex h-full flex-col justify-between rounded-[1.6rem] border-none bg-white p-7 text-slate-900 shadow-none">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">
              {tab.eyebrow}
            </p>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight">
              {tab.title}
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
              {tab.description}
            </p>
          </div>

          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            {tab.points.map((point) => (
              <li
                key={point}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700"
              >
                {point}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default CssOnlyTabItemCard;
