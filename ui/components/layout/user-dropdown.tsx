import { motion } from 'framer-motion'
import { BinaryIcon, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FADE_IN_ANIMATION_SETTINGS } from '@/config/design'

export function UserDropdown() {
  return (
    <motion.div className="relative inline-block text-left text-neutral-700" {...FADE_IN_ANIMATION_SETTINGS}>
      <Popover>
        <PopoverTrigger>
          <button className="bg-card flex items-center justify-center overflow-hidden rounded-md p-2 px-4 transition-all duration-75 hover:bg-neutral-100 focus:outline-none active:scale-95 ">
            Menu
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="w-full rounded-md p-2 ">
            <Link className="user-dropdown-menu-item" href="/">
              <BinaryIcon className="h-4 w-4" />
              <p className="text-sm">Home</p>
            </Link>
            <Link className="user-dropdown-menu-item " href="/FAQ">
              <LayoutDashboard className="h-4 w-4" />
              <p className="text-sm">FAQ</p>
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </motion.div>
  )
}
