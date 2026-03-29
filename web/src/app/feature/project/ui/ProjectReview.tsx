import { MarkdownViewer } from "@/app/shared/ui/molecule/markdown-viewer";
import { ProjectImage } from "../business/project.domain";
import { ProjectImageList } from "./ProjectImageList";

export interface ProjectReviewProps {
  markdown: string;
  images?: ProjectImage[];
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
