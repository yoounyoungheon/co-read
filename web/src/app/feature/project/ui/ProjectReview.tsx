import { MarkdownViewer } from "@/app/shared/ui/molecule/markdown-viewer";
import { ProjectImageList } from "./ProjectImageList";
import type { ProjectImageViewModel } from "../presentation/project.view-model";

export interface ProjectReviewProps {
  markdown: string;
  images?: ProjectImageViewModel[];
}

export function ProjectReview({ markdown, images = [] }: ProjectReviewProps) {
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
      {images.length > 0 ? <ProjectImageList images={images} /> : null}
    </div>
  );
}
