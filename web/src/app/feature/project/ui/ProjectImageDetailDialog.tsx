"use client";

import Image from "next/image";
import { Dialog, DialogContent } from "@/app/shared/ui/molecule/dialog";
import { ProjectImage } from "../business/project.domain";

export interface ProjectImageDetailDialogProps {
  image?: string | ProjectImage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectImageDetailDialog({
  image,
  open,
  onOpenChange,
}: ProjectImageDetailDialogProps) {
  if (!image) {
    return null;
  }

  const src = typeof image === "string" ? image : image.path;
  if (!src) {
    return null;
  }

  const description = typeof image === "string" ? null : image.description;
  const alt = description ?? "프로젝트 이미지 상세";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          left-0
          top-0
          h-screen
          w-screen
          max-w-none
          -translate-x-0
          -translate-y-0
          rounded-none
          border-none
          bg-black
          p-0
          shadow-none
        "
        titleClassName="sr-only"
        descriptionClassName="sr-only"
        title="프로젝트 이미지 상세"
        description={description ?? "프로젝트 이미지 전체 화면"}
      >
        <div className="relative flex h-full w-full flex-col bg-black text-white">
          {description ? (
            <div className="absolute left-0 right-0 top-0 z-10 bg-gradient-to-b from-black/80 via-black/55 to-transparent px-5 py-5 md:px-8 md:py-6">
              <p className="max-w-4xl text-base font-semibold leading-6 text-white md:text-lg md:leading-7">
                {description}
              </p>
            </div>
          ) : null}

          <button
            type="button"
            aria-label="이미지 상세 닫기"
            onClick={() => onOpenChange(false)}
            className="absolute right-5 top-5 z-20 rounded-full bg-white/12 px-3 py-1 text-sm font-semibold text-white transition hover:bg-white/20 md:right-8 md:top-6"
          >
            닫기
          </button>

          <div className="relative flex h-full w-full items-center justify-center px-4 py-20 md:px-10 md:py-24">
            <div className="relative h-full w-full">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
