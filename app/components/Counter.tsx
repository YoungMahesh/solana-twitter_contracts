import { web3 } from "@project-serum/anchor"
import { useWallet } from "@solana/wallet-adapter-react"
import { useState } from "react"
import { getCounterProgram,  } from "../backend/2.web3Provider"
import useStore from "../backend/store"
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

const baseAcc = web3.Keypair.generate()
export default function Counter() {

    const [currCount, setCurrCount] = useState<null | number>(null)


    const network = useStore(state => state.network)
    const setIsLoading = useStore(state => state.setIsLoading)
  

  
    const wallet: any = useWallet()
  
    const startCounter = async() => {
      setIsLoading(true)
      try{
          const counterProgr = getCounterProgram(network, wallet)
          await counterProgr.rpc.create({
              accounts: {
                  baseAccount: baseAcc.publicKey,
                  user: wallet.publicKey,
                  systemProgram: web3.SystemProgram.programId,
              },
              signers: [baseAcc],
          })

          const account = await counterProgr.account.baseAccount.fetch(baseAcc.publicKey)
          
        console.log(account, 'account')
        setCurrCount(account.count.toString())
      }catch(err) {
        console.log(err)
      }
      setIsLoading(false)
    }
  
    const increaseCount = async() => {
      setIsLoading(true)
      try{
          const counterProgr = getCounterProgram(network, wallet) 
          await counterProgr.rpc.increment({
              accounts: {
                  baseAccount: baseAcc.publicKey,
              },
  
          })
          const account = await counterProgr.account.baseAccount.fetch(baseAcc.publicKey)
        console.log(account, 'account')

        setCurrCount(account.count.toString())
      }catch(err) {
        console.log(err)
      }
      setIsLoading(false)
    }
  
    return (
      <Box>

        {
            currCount !== null && <Typography>Current Count: {currCount}</Typography>
        }

        <Button variant='contained' onClick={startCounter}>Start Counter</Button>
        <Button variant='contained' onClick={increaseCount}>Increase Count</Button>
      </Box>
    )
}