import Link from "next/link";
import BookLogo from "../book-logo";
import NavLinks from "./nav-link";
import { PowerIcon } from "@heroicons/react/16/solid";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40" href="/">
        <div className="w-32 text-white md:w-40"><BookLogo/></div>
      </Link>

      <div>
        <NavLinks/>
        <div></div>
        <form>
          <button>
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  )
}