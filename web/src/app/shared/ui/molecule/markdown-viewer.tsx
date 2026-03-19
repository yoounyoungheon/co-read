import { cn } from "@/app/utils/style/helper";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface MarkdownViewerProps {
  markdown: string;
  className?: string;
  variant?: "default" | "notion";
}

// Renders markdown as React nodes without injecting raw HTML.
export function MarkdownViewer({
  markdown,
  className,
  variant = "default",
}: MarkdownViewerProps) {
  const notionVariantClassName =
    variant === "notion"
      ? [
          "text-[15px] leading-7 text-[#37352f]",
          "[&_h1]:mt-10 [&_h1]:text-[2.25rem] [&_h1]:font-semibold [&_h1]:tracking-[-0.02em] [&_h1]:text-[#2f3437]",
          "[&_h2]:mt-9 [&_h2]:border-b [&_h2]:border-slate-200 [&_h2]:pb-2 [&_h2]:text-[1.5rem] [&_h2]:font-semibold [&_h2]:tracking-[-0.01em] [&_h2]:text-[#2f3437]",
          "[&_h3]:mt-7 [&_h3]:text-[1.125rem] [&_h3]:font-semibold [&_h3]:text-[#2f3437]",
          "[&_p]:mt-3 [&_p]:leading-7 [&_p]:text-[#37352f]",
          "[&_ul]:mt-3 [&_ul]:space-y-1.5 [&_ul]:pl-6",
          "[&_ol]:mt-3 [&_ol]:space-y-1.5 [&_ol]:pl-6",
          "[&_li]:marker:text-slate-400",
          "[&_blockquote]:border-l-[3px] [&_blockquote]:border-slate-300 [&_blockquote]:bg-transparent [&_blockquote]:px-4 [&_blockquote]:py-0.5 [&_blockquote]:text-[#6b6f76]",
          "[&_pre]:rounded-2xl [&_pre]:border [&_pre]:border-slate-200 [&_pre]:bg-[#0f172a] [&_pre]:px-5 [&_pre]:py-4 [&_pre]:shadow-sm",
          "[&_code]:rounded-md [&_code]:bg-[#f1f1ef] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_code]:text-[#eb5757]",
          "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-slate-100",
          "[&_hr]:my-10 [&_hr]:border-slate-200",
          "[&_a]:font-normal [&_a]:text-[#0b6e99] [&_a]:decoration-[#0b6e99]/30 [&_a]:underline-offset-2",
          "[&_table]:mt-5 [&_table]:overflow-hidden [&_table]:rounded-lg [&_table]:border [&_table]:border-slate-200 [&_table]:bg-white",
          "[&_thead]:border-b [&_thead]:border-slate-200 [&_thead]:bg-[#f7f6f3]",
          "[&_tbody_tr]:border-b [&_tbody_tr]:border-slate-100",
          "[&_tbody_tr:last-child]:border-b-0",
          "[&_th]:px-4 [&_th]:py-2.5 [&_th]:text-sm [&_th]:font-medium [&_th]:text-[#37352f]",
          "[&_td]:px-4 [&_td]:py-2.5 [&_td]:align-top [&_td]:text-sm [&_td]:text-[#4b4f56]",
        ].join(" ")
      : "";

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
        notionVariantClassName,
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </article>
  );
}

export default MarkdownViewer;
