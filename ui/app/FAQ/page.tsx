'use client'

import { motion } from 'framer-motion'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FADE_DOWN_ANIMATION_VARIANTS } from '@/config/design'
import { ResponsiveMobileAndDesktop } from '../../components/shared/responsive-mobile-and-desktop'

export default function PageDashboardTransaction() {
  return (
    <motion.div
      className="flex-center flex h-full w-full"
      variants={FADE_DOWN_ANIMATION_VARIANTS}
      initial="hidden"
      whileInView="show"
      animate="show"
      viewport={{ once: true }}>
      <Accordion type="single" collapsible className="w-[90%]">
        <AccordionItem value="item-1">
          <AccordionTrigger>How does the Vea Bridge work?</AccordionTrigger>
          <AccordionContent>Optimistic Bridging</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Why 24 hours?</AccordionTrigger>
          <AccordionContent>Security </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Are messages authenticated?</AccordionTrigger>
          <AccordionContent>Yes. Otherwise a relayer network would suffice.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  )
}
