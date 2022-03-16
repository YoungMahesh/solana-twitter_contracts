import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { useEffect, useRef, useState } from "react"
import useStore from "../backend/store"
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react"
import { getTwitterProgram } from "../backend/2.web3Provider"
import { Wallet, web3 } from "@project-serum/anchor"

export default function Twitter() {
  const network = useStore(state => state.network)
  const wallet = useAnchorWallet()
  const setIsLoading = useStore(state => state.setIsLoading)

  const [tweetContent, setTweetContent] = useState("")
  const [tweetTopic, setTweetTopic] = useState("")
  const [tweetList, setTweetList] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      if(!wallet) return
      console.log(wallet)
      if(tweetList.length) return

      setIsLoading(true)
      try {

        const tweeterPro = getTwitterProgram(network, wallet as any)
        const list1 = await tweeterPro.account.tweet.all()
        setTweetList(list1)
        console.log(list1)
      } catch (err) {
        console.log(err)
      }
      setIsLoading(false)
    })()
  }, [network, wallet])


  const sendTweet = async() => {
    if(!wallet) return alert('Connect wallet')
    
    setIsLoading(true)
    try{
      const tweetAcc = web3.Keypair.generate()
      const twitterPro = getTwitterProgram(network, wallet as any)
      await twitterPro.rpc.sendTweet(tweetTopic, tweetContent, {
        accounts: {
            tweet: tweetAcc.publicKey,
            user: (wallet as any).publicKey,
            systemProgram: web3.SystemProgram.programId,
        },
        signers: [tweetAcc],
    })
    window.location.reload()
    }catch(err) {
      console.log(err)
    }
    setIsLoading(false)
  }

  return (
    <Box>
      <Box>
        <Typography>Tweets List</Typography>
        {tweetList.map((el, idx) => (
          <Box key={idx}>
            <Typography variant="h6">{el.account.topic}</Typography>
            <Typography>{el.account.content}</Typography>
          </Box>
        ))}
      </Box>
      <Box>
        <TextField 
          value={tweetTopic}
          onChange={e => setTweetTopic(e.target.value)}
          placeholder='Tweet Title'
        />
      </Box>
      <Box>
        <TextField
          value={tweetContent}
          onChange={(e) => setTweetContent(e.target.value)}
          placeholder='Tweet Content'
        />
        <Button onClick={sendTweet}>Tweet</Button>
      </Box>
    </Box>
  )
}
