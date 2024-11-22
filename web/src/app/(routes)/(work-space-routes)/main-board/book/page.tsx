'use client'
import { lusitana } from "@/app/utils/style/fonts"
import { Card } from "@/app/ui/components/view/molecule/card/card"
import { totalData } from "@/app/business/mock/mock";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AchromaticButton from "@/app/ui/components/view/atom/button/achromatic-button";
import { Dialog, DialogTrigger, DialogContent } from "@/app/ui/components/view/molecule/dialog/dialog";
import { BookDialog } from "./components/book-dialog";

export default function Page(){
  const param = useSearchParams();
  const key:string | null = param.get("item");

  const item = totalData.filter((item)=>{
    if(item.id === key){return item}
  })[0]

  return (
    <main>
      <Suspense fallback={<div>페이지가 로딩중입니다...</div>}>
      <h1 className={`${lusitana.className} text-xl font-semibold`}>{item?.title}</h1>
      <div className={`grid gap-3`}>
        <Card
        style={{
          backgroundImage: `url(${item.image.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
          <div className="p-32"/>
        </Card>
        <Card className="border-none shadow-none px-2 space-y-6">
          <p>
            {`"${item?.description}"`}
          </p>
          <p className="font-semibold">
            {`가격: ${item?.price}원(100g)`}
          </p>
        </Card>
        <Dialog>
          <DialogTrigger asChild>
            <AchromaticButton className="w-full">예약하기</AchromaticButton>
          </DialogTrigger>
          <DialogContent>
            <BookDialog item={item}/>
          </DialogContent>
        </Dialog>
      </div>
      </Suspense>
    </main>
  )
}