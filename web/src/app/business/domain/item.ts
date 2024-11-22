import { StaticImageData } from "next/image";

export interface ItemType{
  title: string,
  price: number,
  description: string,
  image: StaticImageData
}

export class Item{}