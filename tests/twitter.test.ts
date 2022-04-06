import { Program, Provider, setProvider, web3, workspace } from "@project-serum/anchor"
import { expect } from "chai"
import { Twitter } from "../target/types/twitter"

describe('twitter', async() => {
    const provider = Provider.env()
    setProvider(provider)
    const tweetAcc = web3.Keypair.generate()
    const twitterPro = workspace.Twitter as Program<Twitter>

    const topic1 = "topice1", content1 = "Content1", topic2 = "Baahubali", content2= "Tanhaji"
    it('send tweet', async() => {
        await twitterPro.rpc.sendTweet(topic1, content1, {
            accounts: {
                tweet: tweetAcc.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: web3.SystemProgram.programId,
            },
            signers: [tweetAcc],
        })

        const fetchedTweet = await twitterPro.account.tweet.fetch(tweetAcc.publicKey)
   
        expect(fetchedTweet.topic).to.eq(topic1)
        expect(fetchedTweet.content).to.eq(content1)
    })

    it('update tweet', async() => {
        const allTweets = await twitterPro.account.tweet.all()
        const tweet0 = allTweets[0]
        await twitterPro.rpc.updateTweet(topic2, content2, {
            accounts: {
                tweet: tweet0.publicKey,
                author: provider.wallet.publicKey,
            }
        })

        const fetchedTweet = await twitterPro.account.tweet.fetch(tweet0.publicKey)
        expect(fetchedTweet.topic).to.eq(topic2)
        expect(fetchedTweet.content).to.eq(content2)
    })

    it('cannot update tweet by other user', async() => {
        const otherUser = web3.Keypair.generate()
        // const otherUserBal = await provider.connection.getBalance(otherUser.publicKey)
        // const walletBal = await provider.connection.getBalance(provider.wallet.publicKey)
        
        // console.log('otherUserBalance', otherUserBal)
        // console.log('wallet balance', walletBal)
        try{
            await twitterPro.rpc.updateTweet('new', 'new', {
                accounts: {
                    tweet: tweetAcc.publicKey,
                    author: otherUser.publicKey
                }
            })
    
        }catch(err) {
            const tweet1 = await twitterPro.account.tweet.fetch(tweetAcc.publicKey)
            expect(tweet1.content).to.eq(content2)
            expect(err.message).to.eq('Signature verification failed')
        }
    })


})