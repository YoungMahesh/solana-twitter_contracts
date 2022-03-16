import { ReactElement } from 'react'
import Head from 'next/head'
import Layout from '../components/common/Layout'
import Messages from '../components/Messages'
import Counter from '../components/Counter'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Twitter from '../components/Twitter'


export default function Home() {
  return (
    <>
      <Head>
        <title>Solana</title>
        <meta name="description" content="D-app on solana" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

    <WalletMultiButton />
      {/* <Messages />
      <Counter /> */}
      <Twitter />
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}