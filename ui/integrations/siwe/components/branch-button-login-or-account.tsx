import * as React from 'react'

import { BranchIsWalletConnected } from '@/components/shared/branch-is-wallet-connected'

interface BranchButtonLoginOrAccountProps {
  className?: string
  classNameButtonLogin?: string
  classNameButtonLogout?: string
}

export const BranchButtonLoginOrAccount = ({ classNameButtonLogin, classNameButtonLogout }: BranchButtonLoginOrAccountProps) => {
  return (
    <BranchIsWalletConnected>
      <></>
    </BranchIsWalletConnected>
  )
}

export default BranchButtonLoginOrAccount
