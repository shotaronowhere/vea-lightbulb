import { lightBulbToggled as lightBulbToggledEvent } from "../generated/Switch/Switch"
import { lightBulbToggled } from "../generated/schema"

export function handlelightBulbToggled(event: lightBulbToggledEvent): void {
  let entity = new lightBulbToggled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.messageId = event.params.messageId
  entity.lightBulbOwner = event.params.lightBulbOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
