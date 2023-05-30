import { motion } from 'framer-motion'
import { BinaryIcon, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FADE_IN_ANIMATION_SETTINGS } from '@/config/design'
import { LinkComponent } from '../shared/link-component'

export function UserDropdown() {
  return (
    <motion.div className="relative inline-block text-left text-neutral-700" {...FADE_IN_ANIMATION_SETTINGS}>
      <table>
  <tr>
    <th>
      <Popover>
        <PopoverTrigger>
          <button className="bg-card flex items-center justify-center overflow-hidden rounded-md p-2 px-4 transition-all duration-75 hover:bg-neutral-100 focus:outline-none active:scale-95 ">
            Menu
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="w-full rounded-md p-2 ">
            <Link className="user-dropdown-menu-item" href="/">
            🏠 Home
            </Link>
            <Link className="user-dropdown-menu-item " href="/FAQ">
            ❓FAQ
            </Link>
            <Popover>
        <PopoverTrigger>
             <p><span>&nbsp;</span>💡 Chain</p>
        </PopoverTrigger>
        <PopoverContent>
          <div className="w-full rounded-md p-2 ">
            <Link className="user-dropdown-menu-item" href="/goerli">
              <BinaryIcon className="h-4 w-4" />
              <p className="text-sm">Goerli</p>
            </Link>
            <Link className="user-dropdown-menu-item " href="/">
              <LayoutDashboard className="h-4 w-4" />
              <p className="text-sm">Chiado</p>
            </Link>
          </div>
        </PopoverContent>
      </Popover>
          </div>
        </PopoverContent>
      </Popover>
      </th>
      <th><span>&nbsp;</span></th>
      <th>
      <div className="flex items-center gap-4">
            <LinkComponent className="flex items-right" href="https://docs.vea.ninja/introduction/readme">
              <button className="btn-pill bg-gradient-button btn hover:scale-105 hover:shadow-lg">
                <span className="px-2">Build on Vea</span>
              </button>
            </LinkComponent>
          </div>
          </th>
  </tr>
  </table>
    </motion.div>
  )
}
