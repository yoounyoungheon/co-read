export interface Book {
  id: string
  memberID: string,
  Item: BookedItem[]
}

export interface BookedItem {
  itemId: string,
  amount?: number,
  request:string,
}