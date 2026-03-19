import Image from "next/image";
import { Card } from "@/app/shared/ui/molecule/card";

export interface ProjectImageListProps {
  images: string[];
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
            [scrollbar-width:none]
            [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="
                relative
                aspect-square
                w-36
                shrink-0
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-slate-100
              "
            >
              <Image
                src={src}
                alt={`프로젝트 이미지 ${index + 1}`}
                fill
                sizes="144px"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
