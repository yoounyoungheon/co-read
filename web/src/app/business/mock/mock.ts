import { ItemType } from "../domain/item";
import fork from "@/app/utils/public/fork.png"
import beef from "@/app/utils/public/beef.png"

export const mockForkMenu:ItemType[] = [
  {id: "f1", title: "한돈 삼겹살", price: 6000, description: "국내산 한돈 삼겹살입니다. 지방함량이 많아 주로 구이로 사용됩니다.", image: fork, category: "Fork"},
  {id: "f2", title: "한돈 목살", price: 6000, description: "국내산 한돈입니다.", image: fork, category: "Fork"},
  {id: "f3", title: "한돈 가브리살", price: 6000, description: "국내산 한돈입니다.", image: fork, category: "Fork"},
  {id: "f4", title: "한돈 특수부위 모듬", price: 6000, description: "국내산 한돈입니다.", image: fork, category: "Fork"},
  {id: "f5", title: "한돈 국거리", price: 6000, description: "국내산 한돈입니다.", image: fork, category: "Fork"},
]

export const mockBeefMenu:ItemType[] = [
  {id: "b6", title: "한우 등심(암소)", price: 10000, description: "국내산 한우 등심입니다.", image: beef, category: "Beef"},
  {id: "b7", title: "한우 안심", price: 12000, description: "국내산 한우 안심입니다.", image: beef, category: "Beef"},
  {id: "b8", title: "한우 갈비살", price: 10000, description: "국내산 한우 갈비살입니다.", image: beef, category: "Beef"},
  {id: "b9", title: "한우 차돌박이", price: 12000, description: "국내산 한우 차돌박이입니다.", image: beef, category: "Beef"},
  {id: "b10", title: "한우 채끝살", price: 12000, description: "국내산 한우 채끝살입니다.", image: beef, category: "Beef"},
]

export const totalData: ItemType[] = [...mockBeefMenu, ...mockForkMenu];