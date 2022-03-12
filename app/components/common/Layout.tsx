import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider,} from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import '@solana/wallet-adapter-react-ui/styles.css'
import Backdrop1 from "./Backdrop"
import { getServerInfo } from "../../backend/2.web3Provider"
import useStore from "../../backend/store"

export default function Layout({ children }: {children: any}) {
  const network = useStore(state => state.network)

  const wallets = [
    new PhantomWalletAdapter(),
  ]

  return ( <ConnectionProvider endpoint={(getServerInfo(network).networkUrl)}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Backdrop1 />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>)
}