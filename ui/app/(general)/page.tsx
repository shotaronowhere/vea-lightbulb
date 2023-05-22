'use client'
import { motion } from 'framer-motion'
import '/styles/light.css'
import request from 'graphql-request'
import { useAccount, ConnectorData, useDisconnect, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { BranchIsWalletConnected } from '@/components/shared/branch-is-wallet-connected'
import { Button } from '@/components/ui/button'
import { FADE_DOWN_ANIMATION_VARIANTS } from '@/config/design'
import { publicProvider } from 'wagmi/providers/public'
import {goerli, arbitrumGoerli, gnosisChiado} from 'wagmi/chains' 
import { readContract, configureChains, watchContractEvent, createClient } from '@wagmi/core'
import { BigNumber } from 'ethers'
const abi = require('../../assets/VeaOutboxArbToEthDevnet.json').abi
const { provider, webSocketProvider } = configureChains(
  [goerli, arbitrumGoerli, gnosisChiado],
  [publicProvider()],
)

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
 

import {FiExternalLink} from 'react-icons/fi'
 
const client = createClient({
  provider,
  webSocketProvider,
})
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [light, setLight] = useState(false)
  const [hitSwitch, setHitSwitch] = useState("loading...")
  const [time, setTime] = useState(0)
  const [veaBridgeConfirmation, setveaBridgeConfirmation] = useState(false)
  var condition = light ? 'on' : 'off'
  var relayed = light ? '' : 'none'
  var switchHit = hitSwitch != "loading..."
  var tableDisplay = light || switchHit ? '' : 'none'
  var timerDisplay = switchHit && !light && !veaBridgeConfirmation ? '' : 'none'
  var bridgeSuccess = veaBridgeConfirmation || light ? '' : 'none'
  const count = useRef(0)
  const account = useAccount({
    onDisconnect() {
      setLight(false);
      setHitSwitch("loading...");
      setveaBridgeConfirmation(false);
      setTime(0)
    },

    async onConnect({ address, connector, isReconnected }) {
      const lightBulbIsOn = await readContract({
        address: '0x0DF02C42860a5e29BFDaa0F89e86e8e25074571e',
        abi: [
          {
            inputs: [
              {
                internalType: 'address',
                name: '',
                type: 'address',
              },
            ],
            name: 'lightBulbIsOn',
            outputs: [
              {
                internalType: 'bool',
                name: '',
                type: 'bool',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'lightBulbIsOn',
        chainId: 5,
        args: [address!],
      })

      const latestVerifiedEpoch = (await readContract({
        address: '0x906dE43dBef27639b1688Ac46532a16dc07Ce410',
        abi: [
          {
            inputs:[],
            name:"latestVerifiedEpoch",
            outputs:[{internalType:"uint256",name:"",type:"uint256"}],
            stateMutability:"view",
            type:"function"}
        ],
        functionName: 'latestVerifiedEpoch',
        chainId: 5,
      }) as BigNumber).toNumber()

      console.log('lightBulbIsOn', lightBulbIsOn)
      if (lightBulbIsOn)
        setLight(true);
      else
        setLight(false);
      const lightBulbToggles: any = await request(
        'https://api.thegraph.com/subgraphs/name/shotaronowhere/vea-lightbulb',
        `{
          lightBulbToggleds(first: 1, where: {lightBulbOwner: "${address}"}, orderBy: blockTimestamp, orderDirection: asc) {
            messageId
            lightBulbOwner
            transactionHash
            blockTimestamp
          }
        }`
      )


      console.log(lightBulbToggles)
      if (lightBulbToggles.lightBulbToggleds.length > 0) {
        //goerli.infura.io/v3
        const msgid = lightBulbToggles.lightBulbToggleds[0].messageId
        const switchTime = lightBulbToggles.lightBulbToggleds[0].blockTimestamp
        const epoch = Math.floor(switchTime / 1800)
        if (latestVerifiedEpoch >= epoch){
          console.log('latest epoch', latestVerifiedEpoch);
          console.log('msg epoch', epoch);
          setveaBridgeConfirmation(true)
          console.log('latestVerifiedEpoch', latestVerifiedEpoch)
          /*
          const bridgeTxn = await request(
            'https://thegraph.com/hosted-service/subgraph/alcercu/veascan-outbox-goerli',
            `{
              claims(first: 1, orderBy: epoch, where: {epoch_gte: 3}) {
                txHash
              }
            }`
          )*/
        }
        const estimatedBridgeTimeComplete = Math.ceil((switchTime / 1800))*1800 + 300
        const estimatedBridgeTime = Math.max(estimatedBridgeTimeComplete - Math.floor(Date.now()/1000), 0)
        setTime(estimatedBridgeTime)
        setHitSwitch(lightBulbToggles.lightBulbToggleds[0].transactionHash)
        console.log('time set', estimatedBridgeTime)
      } else {
        setHitSwitch("loading...")
        setveaBridgeConfirmation(false);
        setTime(0)
      }
    },
  })

  const unwatch = watchContractEvent(
    {
      address: '0x906dE43dBef27639b1688Ac46532a16dc07Ce410',
      abi: abi,
      eventName: 'Verified',
      chainId: 5,
      once: true,
    },
    (epoch) => {
      setveaBridgeConfirmation(true)
    },
  )

  function handleClick() {
    const switchTime = Math.floor(Date.now()/1000)
    const estimatedBridgeTimeComplete = Math.ceil((switchTime / 1800))*1800 + 300
    const estimatedBridgeTime = Math.max(estimatedBridgeTimeComplete - Math.floor(Date.now()/1000), 0)
    setTime(estimatedBridgeTime)
  }

  useEffect(() => {
    // create a interval and get the id
    const myInterval = setInterval(() => {
      setTime((time) => {
        if (time == 1) {
          setLight(true)
    }
        if (time > 0) return time - 1
        return time
      })
    }, 1000)
  
    console.log('time',time)
  
	const handleConnectorUpdate = async ({account, chain}: ConnectorData) => {
    setHitSwitch("loading...")
    setTime(0)
    setveaBridgeConfirmation(false);
    
    if (account) {
      const lightBulbIsOn = await readContract({
        address: '0x0DF02C42860a5e29BFDaa0F89e86e8e25074571e',
        abi: [
          {
            inputs: [
              {
                internalType: 'address',
                name: '',
                type: 'address',
              },
            ],
            name: 'lightBulbIsOn',
            outputs: [
              {
                internalType: 'bool',
                name: '',
                type: 'bool',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'lightBulbIsOn',
        chainId: 5,
        args: [account!],
      })
      console.log('lightBulbIsOn', lightBulbIsOn)
      if (lightBulbIsOn)
        setLight(true);
      else
        setLight(false);
      const lightBulbToggles: any = await request(
        'https://api.thegraph.com/subgraphs/name/shotaronowhere/vea-lightbulb',
        `{
          lightBulbToggleds(first: 1, where: {lightBulbOwner: "${account}"}, orderBy: blockTimestamp, orderDirection: asc) {
            messageId
            lightBulbOwner
            blockTimestamp
            transactionHash
          }
        }`
      )
      console.log(lightBulbToggles)
      if (lightBulbToggles.lightBulbToggleds.length > 0) {
        //goerli.infura.io/v3
        //https: console.log(lightBulbToggles.lightBulbToggleds[0].messageId)
        const switchTime = lightBulbToggles.lightBulbToggleds[0].blockTimestamp
        const estimatedBridgeTimeComplete = Math.ceil((switchTime / 1800))*1800 + 300
        const estimatedBridgeTime = Math.max(estimatedBridgeTimeComplete - Math.floor(Date.now()/1000), 0)
        setTime(estimatedBridgeTime)
        setHitSwitch(lightBulbToggles.lightBulbToggleds[0].transactionHash)
        console.log('time set', estimatedBridgeTime)
      } 
    } else if (chain) {
      console.log('new chain', chain)
    }
  }

  if (account.connector) {
    account.connector.on('change', handleConnectorUpdate)
    }

      // clear out the interval using the id when unmounting the component
      return () => clearInterval(myInterval)
  }
  , [light, account.connector, time])

  const { config, error } = usePrepareContractWrite({
    address: '0x0FEe56B014be6870415Ec2dD018Da6bD3E1D7d24',
    abi: [
      {
        inputs: [],
        name: 'turnOnLightBulb',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'turnOnLightBulb'
  })
  const { data, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      setHitSwitch(data.transactionHash)
      handleClick()
    },
  })

  return (
    <>
          <motion.div
        className={`flex-center ${condition} body flex h-full w-full`}
        variants={FADE_DOWN_ANIMATION_VARIANTS}
        initial="hidden"
        whileInView="show"
        animate="show"
        viewport={{ once: true }}>
        <div className={`flex-center ${condition} body flex h-full w-full`}>
          <div className="light" style={{ margin: '10px 0' }}>
            <div className="gnosis"></div>
            <div className="wire"></div>
            <div className="bulb">
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="switches">
            <span className="switch">
              <Button className="btn" disabled={!write || switchHit} onClick={() => write?.()}></Button>
            </span>
          </div>
        </div>
        </motion.div>
  <table className="table" style={{width: "80%", display: `${tableDisplay}`, zIndex:"0"}}>
    {/* head */}
    <thead>
    <tr>
      <th>Step</th>
      <th>Process</th>
      <th>Txn</th>
      <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      <tr className="hover">
        <th>1</th>
        <td>Switch</td>
        <td><span style={{display: "flex"}}>{switchHit? hitSwitch.substring(0,5)+'...'+hitSwitch.substring(hitSwitch.length-4,hitSwitch.length-1) : hitSwitch}&nbsp;<a target="_blank" href={"https://goerli.arbiscan.io/tx/"+hitSwitch}><FiExternalLink/></a></span></td>
        <td>✅</td>
      </tr>
      {/* row 2 */}
      <tr className="hover">
        <th>2</th>
        <td>Bridging</td>
        <td><div style={{display: relayed}}><span style={{display: "flex"}}>veascan<a target="_blank" href="https://veascan.io/"><FiExternalLink/></a></span></div></td>
        <td><div style={{display: timerDisplay}}>
                <div className="countdown font-mono">
                  <span id="hour" style={{ "--value": 0 } as React.CSSProperties}></span>:
                  <span id="minute" style={{ '--value': Math.floor((time - Math.floor(time / 3600) * 3600) / 60) } as React.CSSProperties}></span>:
                  <span
                    id="second"
                    style={{
                      '--value': time - Math.floor(time / 3600) * 3600 - Math.floor((time - Math.floor(time / 3600) * 3600) / 60) * 60,
                    }as React.CSSProperties}></span>
            </div>
            </div>
            <div style={{display: bridgeSuccess}}>✅</div>
          </td>
      </tr>
      {/* row 3 */}
      <tr className="hover">
      <th>3</th>
        <td>Relaying</td>
        <td><div style={{display: relayed}}><span style={{display: "flex"}}>veascan<a target="_blank" href="https://veascan.io/"><FiExternalLink/></a></span></div></td>
        <td><div style={{display: relayed}}>✅</div>
</td>
      </tr>
    </tbody>
  </table>
    </>
  )
}