import * as React from 'react';
import {
  nonceManagerFields,
} from "@district-labs/intentify-intent-modules-react"

export type NonceConfig = {
  label: string
  classNameLabel?: string
  dimensional: {
    label: string
    labelTrigger: string
    classNameLabel?: string
    classNameTrigger?: string
    defaultQueue: number
  }
  time: {
    defaultId: number
    defaultDelta: number
    defaultCount: number
  }
}

type NonceManager = React.HTMLAttributes<HTMLElement> & {
  intentBatch: any
  setIntentBatch: any
  nonceConfig?: NonceConfig
}

export const NonceManager = ({ className, intentBatch, setIntentBatch, nonceConfig }: NonceManager) => { 

  console.log(nonceConfig, 'nonceConfignonceConfignonceConfig')

 return(
  <div>
    {
      nonceManagerFields.NonceType(
        intentBatch,
        setIntentBatch,
      )
    }
    {
      intentBatch?.nonce.type === "dimensional" &&
      nonceManagerFields.NonceDimensional(
        intentBatch,
        setIntentBatch,
        nonceConfig?.dimensional
      )
    }
    {
      intentBatch?.nonce.type === "time" &&
      nonceManagerFields.NonceTime(
        intentBatch,
        setIntentBatch,
        nonceConfig?.time
      )
    }
  </div>
)}