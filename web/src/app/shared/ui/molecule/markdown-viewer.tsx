import { cn } from "@/app/utils/style/helper";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface MarkdownViewerProps {
  markdown: string;
  className?: string;
}

// Renders markdown as React nodes without injecting raw HTML.
export function MarkdownViewer({ markdown, className }: MarkdownViewerProps) {
  return (
    <article
      className={cn(
        "w-full max-w-3xl text-slate-800",
        "[&_h1]:mt-8 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:leading-tight",
        "[&_h2]:mt-7 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-tight",
        "[&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-tight",
        "[&_p]:mt-3 [&_p]:text-base [&_p]:leading-7",
        "[&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6",
        "[&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6",
        "[&_li>p]:mt-0",
        "[&_blockquote]:mt-5 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:bg-slate-50 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:text-slate-700",
        "[&_pre]:mt-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-slate-950 [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-6 [&_pre]:text-slate-100",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit",
        "[&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.95em]",
        "[&_hr]:my-8 [&_hr]:border-slate-200",
        "[&_a]:font-medium [&_a]:text-sky-700 [&_a]:underline [&_a]:underline-offset-4",
        "[&_table]:mt-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-left",
        "[&_thead]:border-b [&_thead]:border-slate-300",
        "[&_tbody_tr]:border-b [&_tbody_tr]:border-slate-200",
        "[&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold",
        "[&_td]:px-3 [&_td]:py-2",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </article>
  );
}

export default MarkdownViewer;
