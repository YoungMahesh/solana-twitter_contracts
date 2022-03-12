import { web3 } from "@project-serum/anchor"
import { useWallet } from "@solana/wallet-adapter-react"
import { useState } from "react"
import { getMessagesProgram } from "../backend/2.web3Provider"
import useStore from "../backend/store"
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

const baseAcc = web3.Keypair.generate()
export default function Messages() {
    const [allMessages, setAllMessages] = useState<string[]>([])
    const [lastMsg, setLastMsg] = useState('')
    const network = useStore(state => state.network)
    const setIsLoading = useStore(state => state.setIsLoading)
  
    const [input1, setInput1] = useState('')
  
    const wallet: any = useWallet()
  
    const createMsgBox = async() => {
      setIsLoading(true)
      try{
        const messageProgr = getMessagesProgram(network, wallet)
        await messageProgr.rpc.initialize(input1, {
          accounts: {
            baseAccount: baseAcc.publicKey,
            user: wallet.publicKey,
            systemProgram: web3.SystemProgram.programId,
          },
          signers: [baseAcc],
        })
        const account = await messageProgr.account.baseAccount.fetch(baseAcc.publicKey)
        console.log(account, 'account')
        setLastMsg(account.data)
        setInput1('')
      }catch(err) {
        console.log(err)
      }
      setIsLoading(false)
    }
  
    const addNewMsg = async() => {
      setIsLoading(true)
      try{
        const messageProgr = getMessagesProgram(network, wallet)
        await messageProgr.rpc.update(input1, {
          accounts: {
            baseAccount: baseAcc.publicKey
          }
        })
        const account = await messageProgr.account.baseAccount.fetch(baseAcc.publicKey)
        console.log(account, 'account')
        setLastMsg(account.data)
        setAllMessages(account.dataList)
        setInput1('')
      }catch(err) {
        console.log(err)
      }
      setIsLoading(false)
    }
  
    return (
      <Box>

        <Typography>LastMessage: {lastMsg}</Typography>
        {
          allMessages.map((el, idx) => <Typography key={idx}>{el}</Typography>)
        }
        <TextField value={input1} onChange={e => setInput1(e.target.value)} />
        <Button variant='contained' onClick={createMsgBox}>Create new box</Button>
        <Button variant='contained' onClick={addNewMsg}>Add new message</Button>
      </Box>
    )
}