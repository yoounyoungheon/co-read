"use client";

import { useState } from "react";
import Image from "next/image";
import { ProjectImage } from "../business/project.domain";
import { Card } from "@/app/shared/ui/molecule/card";
import { ProjectImageDetailDialog } from "./ProjectImageDetailDialog";

export interface ProjectImageListProps {
  images: Array<string | ProjectImage>;
}

export function ProjectImageList({ images }: ProjectImageListProps) {
  const [selectedImage, setSelectedImage] = useState<string | ProjectImage>();
  const validImages = images.filter((image) => {
    const src = typeof image === "string" ? image : image.path;
    return Boolean(src);
  });

  return (
    <>
      <Card className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {validImages.length === 0 ? (
          <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
            등록된 이미지가 없습니다.
          </div>
        ) : (
          <div
            className="
              flex
              gap-3
              overflow-x-auto
              pb-3
              [scrollbar-color:rgb(203_213_225)_white]
              [scrollbar-width:thin]
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:border-none
              [&::-webkit-scrollbar-thumb]:bg-slate-300
              [&::-webkit-scrollbar-track]:border-none
              [&::-webkit-scrollbar-track]:bg-white
              [&::-webkit-scrollbar]:h-2
            "
          >
            {validImages.map((image, index) => {
              const src = typeof image === "string" ? image : image.path;
              const description =
                typeof image === "string"
                  ? `프로젝트 이미지 ${index + 1}`
                  : image.description;
              const alt = description ?? `프로젝트 이미지 ${index + 1}`;

              return (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className="
                    relative
                    flex
                    w-[250px]
                    shrink-0
                    flex-col
                    gap-2
                    text-left
                    md:w-[700px]
                  "
                >
                  <div
                    className="
                      relative
                      aspect-[7/4]
                      w-full
                      overflow-hidden
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-100
                      transition
                      hover:border-slate-300
                    "
                  >
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      sizes="2000px"
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                  {description ? (
                    <p className="line-clamp-2 text-sm font-bold leading-5 text-slate-600">
                      {description}
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </Card>

      <ProjectImageDetailDialog
        image={selectedImage}
        open={Boolean(selectedImage)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedImage(undefined);
          }
        }}
      />
    </>
  );
}
