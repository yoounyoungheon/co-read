'use client'
import Link from "next/link";
import HanaLogo from "../components/view/atom/hana-logo";
import NavLinks from "./nav-link";
import { PowerIcon } from "@heroicons/react/16/solid";
import { redirect } from "next/navigation";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-4 py-4 md:px-2">
      <Link className="mb-2 flex h-20 justify-start items-center rounded-md bg-white p-4 md:h-40 border-2 border-emerald-500" href="/main-board">
        <div className="w-32 md:w-40"><HanaLogo/></div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks/>
        <div className="hidden h-auto w-full grow rounded-md bg-emerald-10 md:block"></div>
        <form>
          <button
            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-white-50 p-3 text-sm text-emerald-800 font-medium hover:bg-emerald-50 hover:text-emerald-600 md:flex-none md:justify-start md:p-2 md:px-3"
            onClick={()=>{redirect('/')}}
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  )
}