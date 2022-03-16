import { Program, Provider, setProvider, web3, workspace } from "@project-serum/anchor"
import { assert } from "chai"
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
   
        assert.ok(fetchedTweet.topic.toString() === topic1)
        assert.ok(fetchedTweet.content.toString() === content1)
    })


    it('fetch all tweets', async() => {
        const allTweets = await twitterPro.account.tweet.all()
        console.log('TweetsList', allTweets)

    })

    it('update tweet', async() => {


        await twitterPro.rpc.updateTweet(topic2, content2, {
            accounts: {
                tweet: tweetAcc.publicKey,
                author: provider.wallet.publicKey,
            }
        })

        const fetchedTweet = await twitterPro.account.tweet.fetch(tweetAcc.publicKey)
        assert.ok(fetchedTweet.topic.toString() === topic2)
        assert.ok(fetchedTweet.content.toString() === content2)
    })

    it('cannot update tweet by other user', async() => {
        const otherUser = web3.Keypair.generate()

        try{
            await twitterPro.rpc.updateTweet('new', 'new', {
                accounts: {
                    tweet: tweetAcc.publicKey,
                    author: otherUser.publicKey
                }
            })
    
        }catch(err) {
            const tweet1 = await twitterPro.account.tweet.fetch(tweetAcc.publicKey)
            assert.ok(tweet1.content.toString() === content2)
        }
    })

    

})