'use client'
import { UserInterface } from "@/app/business/project/user-interface.domain";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from "../view/molecule/dialog/dialog";


interface UserInterfaceCardViewProps {
  userInterface: UserInterface;
}

interface UserInterfaceViewProps {
  userInterfaces: UserInterface[];
}

function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}

export function UserInterfaceView({ userInterfaces }: UserInterfaceViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = chunkArray(userInterfaces, 4);

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  };

  return (
    <div className="relative w-full overflow-hidden">
      {slides.length > 1 && (
        <>
          {currentSlide > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
            >
              <ChevronLeft className="text-white" />
            </button>
          )}
          {currentSlide < slides.length - 1 && (
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
            >
              <ChevronRight className="text-white" />
            </button>
          )}
        </>
      )}

      <div className="w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            className="grid grid-cols-4 gap-4 w-full shrink-0 min-w-full"
          >
            {slide.map((userInterface, index) => (
              <div key={index} className="min-w-0">
                <UserInterfaceCardView userInterface={userInterface} />
              </div>
            ))}
          </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function UserInterfaceCardView({ userInterface }: UserInterfaceCardViewProps) {
  return (
    <div className="flex flex-col bg-white shadow-md rounded-lg p-4 w-full h-full">
      <Dialog>
        <DialogTrigger>
          <div className="relative w-full aspect-square mb-4">
            <Image
              src={userInterface.fileUrl}
              alt={userInterface.description}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-screen-lg">
          <div className="h-full w-full aspect-square mb-4">
            <Image
              src={userInterface.fileUrl}
              alt={userInterface.description}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </DialogContent>
      </Dialog>
      <p className="text-sm text-gray-500">{userInterface.description}</p>
    </div>
  );
}
