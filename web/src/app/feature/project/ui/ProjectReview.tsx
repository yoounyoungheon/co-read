import { MarkdownViewer } from "@/app/shared/ui/molecule/markdown-viewer";
import { Card } from "@/app/shared/ui/molecule/card";

export interface ProjectReviewProps {
  markdown: string;
}

export function ProjectReview({ markdown }: ProjectReviewProps) {
  return (
    <Card className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm px-5">
      <div
        className="
          max-h-[900px]
          overflow-y-auto
          px-5
          py-5
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        <MarkdownViewer
          markdown={markdown}
          variant="notion"
          className="max-w-none"
        />
      </div>
    </Card>
  );
}
