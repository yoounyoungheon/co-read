import { Card } from "../view/molecule/card/card";

interface TechStackViewProps {
  betechs: string[];
  fetechs: string[];
  infratechs: string[];
}

export function TechStackView({ betechs, fetechs, infratechs }: TechStackViewProps) {
  const renderTechChips = (techs: string[]): JSX.Element[] =>
    techs.map((tech, index) => (
      <span
        key={index}
        className="flex items-center gap-1 bg-blue-900 text-white text-sm font-medium px-3 py-1 rounded-full"
      >
        {tech}
      </span>
    ));

  return (
    <Card className="grid gap-4 p-6 rounded-2xl shadow-md">
      <div className="text-xl font-bold">💻 Tech Stack</div>

      <div>
        <h3 className="text-lg font-semibold mb-2">🛠️ Backend</h3>
        <div className="flex flex-wrap gap-3">{renderTechChips(betechs)}</div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">📱 Frontend</h3>
        <div className="flex flex-wrap gap-3">{renderTechChips(fetechs)}</div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">☁️ Infra</h3>
        <div className="flex flex-wrap gap-3">{renderTechChips(infratechs)}</div>
      </div>
    </Card>
  );
};
