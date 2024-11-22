'use client'
import Link from "next/link";
import Logo from "../../components/view/atom/logo";
import ManagerNavLinks from "./manager-nav-link";

export default function ManagerSideNav() {
  return (
    <div className="flex h-full flex-col px-4 py-4 md:px-2">
      <Link className="mb-2 flex h-20 justify-center items-center rounded-md bg-white p-4 md:h-40 border-2 border-emerald-500" href="/main-board">
        <div><Logo/></div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <ManagerNavLinks/>
        <div className="hidden h-auto w-full grow rounded-md bg-emerald-10 md:block"></div>
      </div>
    </div>
  )
}