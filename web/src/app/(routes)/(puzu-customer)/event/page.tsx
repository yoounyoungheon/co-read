import { lusitana } from "@/app/utils/style/fonts"
import { Card, CardContent, CardFooter } from "@/app/ui/components/view/molecule/card/card"

export default function Page(){
  const numbers: number[] = [1,2,3,4];
  const gridCards: JSX.Element[] = numbers.map((number, index)=>(
    <div key={index}>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <p>This is card contents area {number}.</p>
          </div>
        </CardContent>
        <CardFooter>
          <p>This is card footer area</p>
        </CardFooter>
      </Card>
    </div>
  ))
  
  return (
    <main>
      <h1 className={`${lusitana.className} text-center mb-4 text-xl md:text-2xl`} >
        Event
      </h1>
      <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
        {gridCards}
      </div>
    </main>
  )
}