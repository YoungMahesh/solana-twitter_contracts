import { Idl, Program, Provider, Wallet } from "@project-serum/anchor";
import { Connection } from "@solana/web3.js";
import { defaultNetwork, serverInfo } from "./1.serverInfo";
import MessagesIdl from './messages.json'
import CounterIdl from './counter.json'


const getProvider = (network: string, wallet: Wallet,) => {
    const networkUrl = getServerInfo(network).networkUrl
    const connection = new Connection(networkUrl)
    return new Provider(connection, wallet, {})
}


export const getMessagesProgram = (network: string, wallet: Wallet) => {
    const provider = getProvider(network, wallet)
    const msgBoxAddr = getServerInfo(network).contracts.messages

    return new Program(MessagesIdl as Idl, msgBoxAddr, provider)
}

export const getCounterProgram = (network: string, wallet: Wallet) => {
    const provider = getProvider(network, wallet)
    const counterAddr = getServerInfo(network).contracts.counter
    return new Program(CounterIdl as Idl, counterAddr, provider)
}

export const getServerInfo = (network: string) => {
    if(serverInfo[network]) return serverInfo[network]
    return serverInfo[defaultNetwork]
}

