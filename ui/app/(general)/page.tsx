'use client'
import { motion } from 'framer-motion'
import '/styles/light.css'
import request from 'graphql-request'
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { BranchIsWalletConnected } from '@/components/shared/branch-is-wallet-connected'
import { Button } from '@/components/ui/button'
import { FADE_DOWN_ANIMATION_VARIANTS } from '@/config/design'
import { publicProvider } from 'wagmi/providers/public'
import {goerli, arbitrumGoerli, gnosisChiado} from 'wagmi/chains' 
import { readContract, configureChains, createClient } from '@wagmi/core'
const { provider, webSocketProvider } = configureChains(
  [goerli, arbitrumGoerli, gnosisChiado],
  [publicProvider()],
)
 
const client = createClient({
  provider,
  webSocketProvider,
})
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [light, setLight] = useState(false)
  const [time, setTime] = useState(0)
  var condition = light ? 'on' : 'off'
  const count = useRef(0)

  const account = useAccount({
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
      console.log('lightBulbIsOn', lightBulbIsOn)
      if (lightBulbIsOn)
        setLight(true);
      const lightBulbToggles: any = await request(
        'https://api.thegraph.com/subgraphs/name/shotaronowhere/vea-lightbulb',
        `{
          lightBulbToggleds(first: 1, where: {lightBulbOwner: "${address}"}, orderBy: blockTimestamp, orderDirection: asc) {
            messageId
            lightBulbOwner
            blockTimestamp
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
        console.log('time set', estimatedBridgeTime)
      }
    },
  })

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
        if (time == 1) setLight(true)
        if (time > 0) return time - 1
        return time
      })
    }, 1000)
    // clear out the interval using the id when unmounting the component
    return () => clearInterval(myInterval)
  }, [light])

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
            <div className="wire"></div>
            <div className="bulb">
              <span></span>
              <span></span>
            </div>
          </div>
          <BranchIsWalletConnected>
            <div className="flex-center col-span-12 flex flex-col lg:col-span-9">
              <div className="text-center">
                <div className="countdown font-mono text-2xl">
                  <span id="hour" style={{ "--value": 0 } as React.CSSProperties}></span>:
                  <span id="minute" style={{ '--value': Math.floor((time - Math.floor(time / 3600) * 3600) / 60) } as React.CSSProperties}></span>:
                  <span
                    id="second"
                    style={{
                      '--value': time - Math.floor(time / 3600) * 3600 - Math.floor((time - Math.floor(time / 3600) * 3600) / 60) * 60,
                    }as React.CSSProperties}></span>
                </div>
              </div>
            </div>
            <div className="countdown font-mono text-2xl">
              <span id="hour" style={{ '--value': 0 }as React.CSSProperties}></span>:<span id="minute" style={{ '--value': 0 }as React.CSSProperties}></span>:
              <span
                id="second"
                style={{
                  '--value': 0,
                }as React.CSSProperties}></span>
            </div>
          </BranchIsWalletConnected>
          <div className="switches">
            <span className="switch">
              <Button className="btn" disabled={!write} onClick={() => write?.()}></Button>
            </span>
          </div>
        </div>
        </motion.div>
    </>
  )
}
