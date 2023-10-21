import { lightBulbToggled as lightBulbToggledEvent } from "../generated/Switch/Switch"
import { lightBulbToggled } from "../generated/schema"
import { BigInt } from "@graphprotocol/graph-ts"

export function handlelightBulbToggled(event: lightBulbToggledEvent): void {
  let entity = new lightBulbToggled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  if (event.address.toHexString() != "0x2Ecf85A39004bc66caE469473Da75215025da8E2"){
    entity.chainId = BigInt.fromU32(5)
  } else {
    entity.chainId = BigInt.fromU32(10200)
  }

  entity.messageId = event.params.messageId
  entity.lightBulbOwner = event.params.lightBulbOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
