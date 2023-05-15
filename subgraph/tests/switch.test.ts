import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { lightBulbToggled } from "../generated/schema"
import { lightBulbToggled as lightBulbToggledEvent } from "../generated/Switch/Switch"
import { handlelightBulbToggled } from "../src/switch"
import { createlightBulbToggledEvent } from "./switch-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let messageId = BigInt.fromI32(234)
    let lightBulbOwner = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newlightBulbToggledEvent = createlightBulbToggledEvent(
      messageId,
      lightBulbOwner
    )
    handlelightBulbToggled(newlightBulbToggledEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("lightBulbToggled created and stored", () => {
    assert.entityCount("lightBulbToggled", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "lightBulbToggled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "messageId",
      "234"
    )
    assert.fieldEquals(
      "lightBulbToggled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "lightBulbOwner",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
