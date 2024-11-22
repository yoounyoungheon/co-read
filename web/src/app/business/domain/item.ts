import { StaticImageData } from "next/image";

export interface ItemType{
  id: string;
  title: string;
  price: number;
  description: string;
  image: StaticImageData;
  category: "Fork" | "Beef"
}

export class Item{}