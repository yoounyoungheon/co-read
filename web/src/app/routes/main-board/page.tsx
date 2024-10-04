import { lusitana } from "@/app/ui/components/util/fonts"

export default function Page(){
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`} >
        Today Lastest Section
      </h1>
      <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
        최신 트랜드 책 소식이 나와야 합니다.
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        
      </div>
    </main>
  )
}