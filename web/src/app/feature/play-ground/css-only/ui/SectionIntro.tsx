import { SectionIntroProps } from "./OnlyCssComponents.type";

export function SectionIntro({
  indexLabel,
  title,
  description,
}: SectionIntroProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase text-slate-500">
        {indexLabel}
      </p>
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

export default SectionIntro;
