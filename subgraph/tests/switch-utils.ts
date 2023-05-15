import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import { lightBulbToggled } from "../generated/Switch/Switch"

export function createlightBulbToggledEvent(
  messageId: BigInt,
  lightBulbOwner: Address
): lightBulbToggled {
  let lightBulbToggledEvent = changetype<lightBulbToggled>(newMockEvent())

  lightBulbToggledEvent.parameters = new Array()

  lightBulbToggledEvent.parameters.push(
    new ethereum.EventParam(
      "messageId",
      ethereum.Value.fromUnsignedBigInt(messageId)
    )
  )
  lightBulbToggledEvent.parameters.push(
    new ethereum.EventParam(
      "lightBulbOwner",
      ethereum.Value.fromAddress(lightBulbOwner)
    )
  )

  return lightBulbToggledEvent
}
