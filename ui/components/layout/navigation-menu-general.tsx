'use client'

import * as React from 'react'

import Image from 'next/image'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

import { BranchColorMode } from '../shared/branch-color-mode'
import { LinkComponent } from '../shared/link-component'

export function NavigationMenuGeneral() {
  return (
    <NavigationMenu className="self-center">
      <NavigationMenuList className="w-full">
        <NavigationMenuItem>
          <NavigationMenuTrigger>Chain</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <div className="relative flex h-full w-full select-none flex-col justify-end overflow-hidden rounded-md bg-gradient-to-b from-blue-800 to-blue-900 p-6 no-underline outline-none focus:shadow-md">
                    <div className="absolute top-10 right-0 z-0 h-48 w-48 bg-[url('https://em-content.zobj.net/thumbs/240/twitter/322/high-voltage_26a1.png')] bg-cover opacity-20" />
                    <div className="z-10">
                      <h3 className="z-10 mb-2 mt-4 text-lg font-medium text-white">
                        <span className="text-4xl">Build with Vea!</span>
                      </h3>
                      <p className="mb-3 text-sm leading-tight text-white/90">
                      The 🎚 and 💡 live on different chains, and communicate with Vea.
                      </p>
                      <p className="text-sm font-bold leading-tight text-white/90">#VEA</p>
                    </div>
                  </div>
                </NavigationMenuLink>
              </li>
              <li className="flex flex-col gap-4">
                <LinkComponent href="/">
                  <div className="bg-card-with-hover card">
                  <span style={{display: "flex"}}><img src='/icons/NetworkArbitrumTest.svg'></img><svg xmlns="http://www.w3.org/2000/svg" width="12" height="24" fill-rule="evenodd" clip-rule="evenodd"><path d=""/></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill-rule="evenodd" clip-rule="evenodd"><path fill="#FFFFFF" d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="12" height="24" fill-rule="evenodd" clip-rule="evenodd"><path d=""/></svg><img src='/icons/NetworkGnosis.svg'></img></span>
                    <div className="my-2" />
                    <p className="text-xs"><h3 className="text-xxl font-bold">Chiado. Send messages from Arbitrum to Gnosis on testnet (chiado).</h3></p>
                  </div>
                </LinkComponent>
                <LinkComponent href="/goerli">
                <div className="bg-card-with-hover card">
                  <span style={{display: "flex"}}><img src='/icons/NetworkArbitrumTest.svg'></img><svg xmlns="http://www.w3.org/2000/svg" width="12" height="24" fill-rule="evenodd" clip-rule="evenodd"><path d=""/></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill-rule="evenodd" clip-rule="evenodd"><path fill="#FFFFFF" d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="12" height="24" fill-rule="evenodd" clip-rule="evenodd"><path d=""/></svg><img src='/icons/NetworkEthereum.svg'></img></span>
                    <div className="my-2" />
                    <p className="text-xs"><h3 className="text-xxl font-bold">Goerli. Send messages from Arbitrum to Goerli on testnet (goerli).</h3></p>
                  </div>
                </LinkComponent>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <LinkComponent href="/FAQ">FAQ</LinkComponent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <LinkComponent href="https://veascan.io/">&nbsp; VeaScan</LinkComponent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = ({ className, name, imgLight, imgDark, children, ...props }: any) => {
  return (
    <li key={name}>
      <NavigationMenuLink asChild>
        <LinkComponent
          href={props.href as string}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-slate-700 dark:focus:bg-slate-700',
            className
          )}
          {...props}>
          <BranchColorMode>
            <Image className="mb-3 h-7 w-7 rounded-full" alt="Etherscan logo" src={imgDark} width={100} height={100} />
            <Image className="mb-3 h-7 w-7 rounded-full" alt="Etherscan logo" src={imgLight} width={100} height={100} />
          </BranchColorMode>
          <div className="text-sm font-medium leading-none">{name}</div>
          <p className="text-sm leading-snug text-slate-500 line-clamp-2 dark:text-slate-400">{children}</p>
        </LinkComponent>
      </NavigationMenuLink>
    </li>
  )
}
ListItem.displayName = 'ListItem'
