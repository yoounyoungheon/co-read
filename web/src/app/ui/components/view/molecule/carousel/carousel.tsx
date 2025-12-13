"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) return null;

  return (
    <div className="relative w-full aspect-[3/2] overflow-hidden">
      <Image
        src={images[currentIndex]}
        alt=""
        fill
        className="object-cover rounded-xl transition-all duration-300"
      />

      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2
                   bg-black/30 text-white text-xs rounded-full p-2 w-8 h-8"
      >
        {"<"}
      </button>

      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2
                   bg-black/30 text-white text-xs rounded-full p-2 w-8 h-8"
      >
        {">"}
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full ${
              idx === currentIndex ? "bg-white" : "bg-black/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
