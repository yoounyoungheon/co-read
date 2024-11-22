import { ItemType } from "../domain/item";
import fork from "@/app/utils/public/fork.png"
import beef from "@/app/utils/public/beef.png"

export const mockForkMenu:ItemType[] = [
  {title: "한돈 삼겹살", price: 6000, description: "국내산 한돈입니다.", image: fork},
  {title: "한돈 목살", price: 6000, description: "국내산 한돈입니다.", image: fork},
  {title: "한돈 가브리살", price: 6000, description: "국내산 한돈입니다.", image: fork},
  {title: "한돈 특수부위 모듬", price: 6000, description: "국내산 한돈입니다.", image: fork},
  {title: "한돈 국거리", price: 6000, description: "국내산 한돈입니다.", image: fork},
]

export const mockBeefMenu:ItemType[] = [
    {title: "한우 등심(암소)", price: 10000, description: "국내산 한우 등심입니다.", image: beef},
    {title: "한우 안심", price: 12000, description: "국내산 한우 안심입니다.", image: beef},
    {title: "한우 갈비살", price: 10000, description: "국내산 한우 갈비살입니다.", image: beef},
    {title: "한우 차돌박이", price: 12000, description: "국내산 한우 차돌박이입니다.", image: beef},
    {title: "한우 채끝살", price: 12000, description: "국내산 한우 채끝살입니다.", image: beef},
  ]