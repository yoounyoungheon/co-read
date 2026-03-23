import Image from "next/image";
import { ProjectImage } from "../business/project.domain";
import { Card } from "@/app/shared/ui/molecule/card";

export interface ProjectImageListProps {
  images: Array<string | ProjectImage>;
}

export function ProjectImageList({ images }: ProjectImageListProps) {
  return (
    <Card className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {images.length === 0 ? (
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
          {images.map((image, index) => {
            const src = typeof image === "string" ? image : image.path;
            const description =
              typeof image === "string"
                ? `프로젝트 이미지 ${index + 1}`
                : image.description;
            const alt = description ?? `프로젝트 이미지 ${index + 1}`;

            return (
              <div
                key={`${src}-${index}`}
                className="
                  relative
                  flex
                  w-[250px]
                  shrink-0
                  flex-col
                  gap-2
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
                  <p className="line-clamp-2 text-sm leading-5 text-slate-600 font-bold">
                    {description}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
