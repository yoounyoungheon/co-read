import { Card } from "../view/molecule/card/card";

interface TechStackViewProps {
  betechs: string[];
  fetechs: string[];
  infratechs: string[];
}

export function TechStackView({
  betechs,
  fetechs,
  infratechs,
}: TechStackViewProps) {
  const renderTechChips = (techs: string[]): JSX.Element[] =>
    techs.map((tech, index) => (
      <span
        key={index}
        className="flex items-center gap-1 bg-blue-900 text-white text-xs font-medium px-3 py-1 rounded-full"
      >
        {tech}
      </span>
    ));

  return (
    <Card className="p-3 rounded-2xl shadow-md space-y-5">
      <div className="text font-bold py-2">💻 Tech Stack</div>

      <div className="flex flex-col gap-3 h-full">
        {betechs.length !== 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2">🛠️ Backend</h3>
            <div className="flex flex-wrap gap-3">
              {renderTechChips(betechs)}
            </div>
          </div>
        )}

        {fetechs.length !== 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2">📱 Frontend</h3>
            <div className="flex flex-wrap gap-3">
              {renderTechChips(fetechs)}
            </div>
          </div>
        )}

        {infratechs.length !== 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2">☁️ Infra</h3>
            <div className="flex flex-wrap gap-3">
              {renderTechChips(infratechs)}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
