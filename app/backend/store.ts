import create from "zustand"
import { defaultNetwork } from "./1.serverInfo"

interface globalState {
  network: string
  setNetwork: (_net: string) => void

  isLoading: boolean
  setIsLoading: (val: boolean) => void
}

const useStore = create<globalState>((set) => ({
  network: defaultNetwork,
  setNetwork: (_network) => set((state) => ({ network: _network })),

  isLoading: false,
  setIsLoading: (_isLoading) => set((state) => ({ isLoading: _isLoading })),
}))

export default useStore
