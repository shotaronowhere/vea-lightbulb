// SPDX-License-Identifier: MIT

/**
 *  @authors: [@shotaronowhere]
 *  @reviewers: []
 *  @auditors: []
 *  @bounties: []
 *  @deployments: []
 */

pragma solidity ^0.8.0;

import "../interfaces/IVeaInbox.sol";
import "../interfaces/ILightBulb.sol";

/**
 * @title Lightbulb
 * @dev A switch on arbitrum turning a light on and off on arbitrum with the Vea bridge.
 */
contract Switch{

    IVeaInbox public immutable veaInbox; // vea inbox on arbitrum
    address public immutable lightBulb; // gateway on goerli

    /**
     * @dev The Fast Bridge participants watch for these events to decide if a challenge should be submitted.
     * @param messageId The id of the message sent to the lightbulb.
     * @param lightBulbOwner The address of the owner of the lightbulb on the L2 side.
     */
    event lightBulbToggled(uint64 messageId, address lightBulbOwner);

    constructor(address _veaInbox, address _lightBulb) {
        veaInbox = IVeaInbox(_veaInbox);
        lightBulb = _lightBulb;
    }

    function turnOnLightBulb() external {
        bytes memory _msgData = abi.encode(msg.sender);
        uint64 msgId = veaInbox.sendMessage(lightBulb, ILightBulb.turnOn.selector, _msgData);
        emit lightBulbToggled(msgId, msg.sender);
    }
}