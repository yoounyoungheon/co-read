import { lusitana } from "@/app/utils/style/fonts"
import { Card, CardContent, CardFooter } from "@/app/ui/components/view/molecule/card/card"
import { mockBeefMenu, mockForkMenu } from "@/app/business/mock/mock";
import Link from "next/link";

export default function Page(){
  const forkData = mockForkMenu;
  const beefData = mockBeefMenu;

  const forkCards: JSX.Element[] = forkData.map((val, index)=>(
    <div key={index}>
        <Card
          className="relative"
          style={{
            backgroundImage: `url(${val.image.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50 rounded-xl z-0"></div>
          <CardContent className="space-y-4 pt-6 text-white z-10 relative">
            <div className="mb-10">
              <p>{val.title}</p>
            </div>
          </CardContent>

          <CardFooter className="z-10 relative text-white">
            <p>{`${val.price}원 (100g)`}</p>
          </CardFooter>
        </Card>
    </div>
  ))

  const beefCards: JSX.Element[] = beefData.map((val, index)=>(
    <div key={index}>
      <Link href={`/main-board/book?item=${val.id}`}>
        <Card
          className="relative"
          style={{
            backgroundImage: `url(${val.image.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50 rounded-xl z-0"></div>
          <CardContent className="space-y-4 pt-6 text-white z-10 relative">
            <div className="mb-10">
              <p>{val.title}</p>
            </div>
          </CardContent>

          <CardFooter className="z-10 relative text-white">
          <p>{`${val.price}원 (100g)`}</p>
          </CardFooter>
        </Card>
      </Link>
    </div>
  ))
  
  return (
    <main>
      <h1 className={`${lusitana.className} text-center text-xl mb-2`}>Fork</h1>
      <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
        {forkCards}
      </div>
      <div className="w-full my-[4%] border-[1px] border-lightGray/30" />
      <h1 className={`${lusitana.className} text-center text-xl mb-2`}>Beef</h1>
      <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
        {beefCards}
      </div>
    </main>
  )
}