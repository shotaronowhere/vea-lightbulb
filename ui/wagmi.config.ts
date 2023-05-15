import { defineConfig } from '@wagmi/cli'
import { react, hardhat } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'lib/blockchain.ts',
  plugins: [
    hardhat({
      project: '../contracts',
    }),
  ],
})