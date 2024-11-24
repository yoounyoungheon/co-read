'use client'
import { lusitana } from "@/app/utils/style/fonts"
import { Card, CardContent, CardFooter } from "@/app/ui/components/view/molecule/card/card"
import { mockBeefMenu, mockForkMenu } from "@/app/business/mock/mock";
import { Dialog, DialogTrigger, DialogContent } from "@/app/ui/components/view/molecule/dialog/dialog";
import { ManageProductDialog } from "./components/manage-product-dialog";
import AchromaticButton from "@/app/ui/components/view/atom/button/achromatic-button";


export default function Page(){
  const forkData = mockForkMenu;
  const beefData = mockBeefMenu;

  const forkCards: JSX.Element[] = forkData.map((val, index)=>(
    <div key={index} className="space-y-1">
      <Card
        className="relative w-full"
        style={{
          backgroundImage: `url(${val.image.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50 rounded-xl z-0"></div>
        <CardContent className="space-y-4 pt-6 text-white z-10 relative h-60">
          <div className="mb-5">
            <p>{val.title}</p>
          </div>
          <div className="mb-5 text-sm">
            <p>{val.description}</p>
          </div>
        </CardContent>
        <CardFooter className="z-10 relative text-white">
          <p>{`${val.price}원 (100g)`}</p>
        </CardFooter>
      </Card>
      <div className="space-x-2">
        <Dialog>
          <DialogTrigger className="z-30" asChild>
            <AchromaticButton>상품 정보 변경</AchromaticButton>
          </DialogTrigger>
          <DialogContent className="z-20">
            <ManageProductDialog item={val} />
          </DialogContent>
        </Dialog>
        <AchromaticButton >상품 삭제</AchromaticButton>
      </div>
    </div>
  ))

  const beefCards: JSX.Element[] = beefData.map((val, index)=>(
    <div key={index} className="space-y-1">
      <Card
        className="relative w-full"
        style={{
          backgroundImage: `url(${val.image.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50 rounded-xl z-0"></div>
        <CardContent className="space-y-4 pt-6 text-white z-10 relative h-60">
          <div className="mb-5">
            <p>{val.title}</p>
          </div>
          <div className="mb-5 text-sm">
            <p>{val.description}</p>
          </div>
        </CardContent>
        <CardFooter className="z-10 relative text-white">
          <p>{`${val.price}원 (100g)`}</p>
        </CardFooter>
      </Card>
      <div className="space-x-2 justify-items-center">
        <Dialog>
          <DialogTrigger className="z-30" asChild>
            <AchromaticButton>상품 정보 변경</AchromaticButton>
          </DialogTrigger>
          <DialogContent className="z-20">
            <ManageProductDialog item={val} />
          </DialogContent>
        </Dialog>
        <AchromaticButton >상품 삭제</AchromaticButton>
      </div>
    </div>
  ))
  
  return (
    <main>
      <h1 className={`${lusitana.className} text-center text-xl mb-2`}>Fork</h1>
      <div className={`grid gap-2 grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 justify-items-center`}>
        {forkCards}
      </div>
      <div className="w-full my-[4%] border-[1px] border-lightGray/30" />
      <h1 className={`${lusitana.className} text-center text-xl mb-2`}>Beef</h1>
      <div className={`grid gap-2 grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 justify-items-center`}>
        {beefCards}
      </div>
    </main>
  )
}