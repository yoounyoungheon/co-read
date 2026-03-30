import { FlipCard } from "@/app/shared/ui/molecule/flip-card";
import { FlipCardDemoProps } from "./OnlyCssComponents.type";

export function FlipCardDemo({ front, back }: FlipCardDemoProps) {
  return (
    <FlipCard
      className="h-[320px] w-full"
      innerClassName="h-full"
      frontClassName="rounded-[2rem] border border-slate-200 bg-white p-0 text-slate-900 shadow-[0_18px_50px_rgba(15,23,42,0.18)]"
      backClassName="rounded-[2rem] border border-slate-200 bg-white p-0 text-slate-900 shadow-[0_18px_50px_rgba(15,23,42,0.18)]"
      frontCard={
        <div className="flex h-full flex-col justify-between p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">
              {front.eyebrow}
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">
              {front.title}
            </h3>
          </div>
          <div className="space-y-2">
            {front.description ? (
              <p className="text-sm leading-6 text-slate-600">
                {front.description}
              </p>
            ) : null}
            {front.footer ? (
              <p className="text-xs font-semibold uppercase text-slate-400">
                {front.footer}
              </p>
            ) : null}
          </div>
        </div>
      }
      backCard={
        <div className="flex h-full flex-col justify-between p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">
              {back.eyebrow}
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">
              {back.title}
            </h3>
          </div>
          {back.list ? (
            <ul className="space-y-3 text-sm leading-6 text-slate-700">
              {back.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      }
    />
  );
}

export default FlipCardDemo;
