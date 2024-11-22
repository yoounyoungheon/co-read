'use client';

import { UserGroupIcon, HomeIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { ForwardRefExoticComponent, SVGProps } from 'react';

interface navLinkType {
  name: string,
  href: string,
  icon: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref">>,
}

const links: navLinkType[] = [
  {name: '상품 관리', href: '/manager-board', icon: HomeIcon},
  {name: '이벤트', href: '/manager-event', icon: UserGroupIcon},
  {name: '고객 관리', href: '/manager-user', icon: DocumentDuplicateIcon},
]

export default function ManagerNavLinks(){
  const pathName = usePathname();
  return (
    <>
     {links.map((link)=>{
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              `flex h-[48px] grow items-center
              justify-center gap-2 rounded-md 
              bg-emerald-50 p-2 text-xs text-emerald-600
              font-medium
              hover:bg-emerald-100 hover:text-emerald-600
              md:flex-none md:justify-start
              md:p-1 md:px-2`,
              {'bg-emerald-200 text-emerald-800': pathName === link.href}
            )}>
                <LinkIcon className='w-4'/>
                <p>{link.name}</p>
          </Link>
        )
     })}
    </>
  )
}