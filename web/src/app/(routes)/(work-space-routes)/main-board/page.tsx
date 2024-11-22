import { lusitana } from "@/app/utils/style/fonts"
import { Card, CardContent, CardFooter } from "@/app/ui/components/view/molecule/card/card"
import fork from '@/app/utils/public/fork.png'

export default function Page(){
  const titles: string[] = ['한돈 삼겹살', '한돈 목살', '양지살', '등갈비'];
  const gridCards: JSX.Element[] = titles.map((title, index)=>(
    <>
    <Card
      className="relative"
      style={{
        backgroundImage: `url(${fork.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      key={index}
    >
      <div className="absolute inset-0 bg-black opacity-50 rounded-xl z-0"></div>
      <CardContent className="space-y-4 pt-6 text-white z-10 relative">
        <div className="mb-10">
          <p>{title}</p>
        </div>
      </CardContent>

      <CardFooter className="z-10 relative text-white">
        <p>1000₩(100g)</p>
      </CardFooter>
    </Card>
    </>
  ))
  
  return (
    <main>
      <h1 className={`${lusitana.className} text-center mb-4 te text-xl md:text-2xl`} >
        Menu
      </h1>
      <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
        {gridCards}
      </div>
    </main>
  )
}