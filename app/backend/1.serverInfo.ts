interface ServerInfoInt {
   [val: string]: {
        networkUrl: string
        contracts: {
            messages: string
            counter: string
            twitter: string
        }
    }
}


export const serverInfo: ServerInfoInt = {
    localnet: {
        networkUrl: 'http://127.0.0.1:8899',
        contracts: {
            messages: 'BMkLrsFDEUtW46wgiXhES7pTiRGpfSF5b7FsCbYCq4qo',
            counter: '4HozAEDcAaTGxV9KZx34gxHAEAPsFJNaoqqgupHTUnT7',
            twitter: 'HC4NZEsuGoVvbxBypDFjuFLRakQussGc5mfh9cGNHDgY',
        },
    },
    devnet: {
        networkUrl: 'https://api.devnet.solana.com',
        contracts: {
            messages: 'BMkLrsFDEUtW46wgiXhES7pTiRGpfSF5b7FsCbYCq4qo',
            counter: '4HozAEDcAaTGxV9KZx34gxHAEAPsFJNaoqqgupHTUnT7',
            twitter: 'HC4NZEsuGoVvbxBypDFjuFLRakQussGc5mfh9cGNHDgY'
        }
    },
}
export const defaultNetwork = 'devnet'