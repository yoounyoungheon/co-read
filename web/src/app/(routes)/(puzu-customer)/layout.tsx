import React, { Suspense } from "react";
import SideNav from "@/app/ui/nav/customer/sidenav";

export default function Layout({children}:{children: React.ReactNode}) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav/>
      </div>
      <div className="flex-grow px-6 py-3 md:overflow-y-auto md:p-12">
        <Suspense fallback={<div>페이지가 로딩중 입니다..</div>}>
        {children}
        </Suspense>
      </div>
    </div>
  )
}