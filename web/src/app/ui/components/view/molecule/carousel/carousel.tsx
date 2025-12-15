"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
}

const SWIPE_THRESHOLD = 50;

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const startX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragOffset(e.clientX - startX.current);
  };

  const onPointerUp = () => {
    if (!isDragging) return;

    if (dragOffset > SWIPE_THRESHOLD) {
      prev();
    } else if (dragOffset < -SWIPE_THRESHOLD) {
      next();
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  if (images.length === 0) return null;

  const containerWidth =
    containerRef.current?.getBoundingClientRect().width ?? 1;

  const percentage =
    (-currentIndex * 100) / images.length +
    (dragOffset / containerWidth) * (100 / images.length);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/9] overflow-hidden rounded-xl touch-pan-y"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div
        className={`flex h-full ${
          isDragging ? "" : "transition-transform duration-500 ease-out"
        }`}
        style={{
          width: `${images.length * 100}%`,
          transform: `translateX(${percentage}%)`,
        }}
      >
        {images.map((src, idx) => (
          <div
            key={idx}
            className="relative h-full flex-shrink-0"
            style={{ width: `${100 / images.length}%` }}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover select-none pointer-events-none"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2
                   bg-black/30 text-white text-xs rounded-full w-8 h-8"
      >
        {"<"}
      </button>

      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2
                   bg-black/30 text-white text-xs rounded-full w-8 h-8"
      >
        {">"}
      </button>
    </div>
  );
}
