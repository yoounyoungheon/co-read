import { lusitana } from "@/app/ui/components/util/fonts"
import { Card, CardContent, CardFooter } from "@/app/ui/components/view/molecule/card/card"

export default function Page(){
  const numbers: number[] = [1,2,3,4];
  const gridCards: JSX.Element[] = numbers.map((number)=>(
    <>
    <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
          <p>This is card contents area {number}.</p>
          </div>
          <div className="space-y-2">
          <p>This is card contents area {number}.</p>
          </div>
        </CardContent>
        <CardFooter>
          <p>This is card footer area</p>
        </CardFooter>
      </Card>
    </>
  ))
  
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`} >
        Today Lastest Section - grid
      </h1>
      <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
        {gridCards}
      </div>

      <div className="pt-6"></div>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`} >
        Today Lastest Section - row
      </h1>
      <div className="grid gap-6 sm:grid-rows-2 lg:grid-rows-4">
        {gridCards}
      </div>
    </main>
  )
}