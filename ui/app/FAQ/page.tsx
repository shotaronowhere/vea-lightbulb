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
          <AccordionContent>Vea is an optimistic bridge which periodically aggregates sent messages, and bridges them together efficiently.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How fast is Vea?</AccordionTrigger>
          <AccordionContent>This demo uses the devnet which is permissioned to achieve low latency for good developer experience. The devnet takes ~30 min to send messages.
          <br></br><br></br>
          The full testnet is permissionless and takes about half a day to send messages from Arbitrum. The full testnet is used for testing validators and is not recommended for developers.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Where can I learn more?</AccordionTrigger>
          <AccordionContent>To learn more read the <a href="docs.vea.ninja">docs.</a><br></br><br></br>
          Also watch the <a href = "https://www.youtube.com/watch?v=Pz8MitQoZAs">Eth Taipei talk</a> on Vea.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  )
}
