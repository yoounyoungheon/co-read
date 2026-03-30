import { HeroProps } from "./OnlyCssComponents.type";

export function OnlyCssHero({ eyebrow, title, description }: HeroProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs font-semibold uppercase text-slate-500">
          {eyebrow}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
          {title}
        </h1>
        <p className="text-sm leading-6 text-slate-600 md:text-base">
          {description}
        </p>
      </div>
    </section>
  );
}

export default OnlyCssHero;
