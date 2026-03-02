import { ReactNode } from "react";
import { Card } from "../view/molecule/card/card";

interface ProjectMarkdownViewProps {
  markdown?: string;
}

const INLINE_TOKEN_REGEX = /(`[^`]+`|\*\*[^*]+\*\*)/g;

const renderInline = (text: string): ReactNode[] => {
  return text.split(INLINE_TOKEN_REGEX).map((token, index) => {
    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code
          key={`inline-${index}`}
          className="rounded bg-slate-100 px-1 py-0.5 text-[11px] lg:text-xs"
        >
          {token.slice(1, -1)}
        </code>
      );
    }

    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={`inline-${index}`}>{token.slice(2, -2)}</strong>;
    }

    return <span key={`inline-${index}`}>{token}</span>;
  });
};

const renderParagraph = (lines: string[]): JSX.Element => {
  return (
    <p className="text-xs leading-6 lg:text-sm">
      {lines.map((line, lineIndex) => (
        <span key={`line-${lineIndex}`}>
          {renderInline(line)}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      ))}
    </p>
  );
};

export function ProjectMarkdownView({ markdown }: ProjectMarkdownViewProps) {
  if (!markdown?.trim()) {
    return null;
  }

  const lines = markdown.split("\n");
  const content: JSX.Element[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    if (/^---+$/.test(line)) {
      content.push(<hr key={`hr-${i}`} className="my-2 border-gray-200" />);
      continue;
    }

    if (line.startsWith("### ")) {
      content.push(
        <h3 key={`h3-${i}`} className="text-sm font-semibold lg:text-base">
          {renderInline(line.slice(4))}
        </h3>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      content.push(
        <h2 key={`h2-${i}`} className="text-sm font-bold lg:text-base">
          {renderInline(line.slice(3))}
        </h2>
      );
      continue;
    }

    if (line.startsWith("# ")) {
      content.push(
        <h1 key={`h1-${i}`} className="text-base font-bold lg:text-lg">
          {renderInline(line.slice(2))}
        </h1>
      );
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const orderedItems: string[] = [];
      let j = i;

      while (j < lines.length && /^\s*\d+\.\s+/.test(lines[j])) {
        orderedItems.push(lines[j].replace(/^\s*\d+\.\s+/, "").trim());
        j += 1;
      }

      content.push(
        <ol key={`ol-${i}`} className="list-decimal space-y-1 pl-5 text-xs lg:text-sm">
          {orderedItems.map((item, index) => (
            <li key={`ol-item-${i}-${index}`}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      i = j - 1;
      continue;
    }

    if (/^-\s+/.test(line)) {
      const unorderedItems: string[] = [];
      let j = i;

      while (j < lines.length && /^\s*-\s+/.test(lines[j])) {
        unorderedItems.push(lines[j].replace(/^\s*-\s+/, "").trim());
        j += 1;
      }

      content.push(
        <ul key={`ul-${i}`} className="list-disc space-y-1 pl-5 text-xs lg:text-sm">
          {unorderedItems.map((item, index) => (
            <li key={`ul-item-${i}-${index}`}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      i = j - 1;
      continue;
    }

    const paragraphLines = [rawLine.trimEnd()];
    let j = i + 1;

    while (j < lines.length) {
      const nextRaw = lines[j];
      const nextLine = nextRaw.trim();
      const isNextBlockBoundary =
        !nextLine ||
        /^---+$/.test(nextLine) ||
        nextLine.startsWith("# ") ||
        nextLine.startsWith("## ") ||
        nextLine.startsWith("### ") ||
        /^\d+\.\s+/.test(nextLine) ||
        /^-\s+/.test(nextLine);

      if (isNextBlockBoundary) {
        break;
      }

      paragraphLines.push(nextRaw.trimEnd());
      j += 1;
    }

    content.push(<div key={`p-${i}`}>{renderParagraph(paragraphLines)}</div>);
    i = j - 1;
  }

  return (
    <div className="space-y-5 mx-2 px-3">
      <div className="text font-bold">📝 Details</div>
      <Card className="space-y-4 p-4">{content}</Card>
    </div>
  );
}
