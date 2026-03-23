import { MarkdownViewer } from "@/app/shared/ui/molecule/markdown-viewer";

export interface ProjectReviewProps {
  markdown: string;
}

export function ProjectReview({ markdown }: ProjectReviewProps) {
  return (
    <div
      className="
          h-full
          px-5
          py-5
        "
    >
      <MarkdownViewer
        markdown={markdown}
        variant="notion"
        className="max-w-none"
      />
    </div>
  );
}
