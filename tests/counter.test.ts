import { setProvider, Provider, workspace } from "@project-serum/anchor"
import { Program, web3 } from "@project-serum/anchor"
import assert from 'assert'
import { Counter } from "target/types/counter"

describe("counter", () => {
  // Configure the client to use the local cluster.
  const provider = Provider.env()
  setProvider(provider)

  const mysolanaapp = workspace.Counter as Program<Counter>
  const baseAccount1 = web3.Keypair.generate()


  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await mysolanaapp.rpc.create({
      accounts: {
        baseAccount: baseAccount1.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      },
      signers: [baseAccount1],
    })

    const account = await mysolanaapp.account.baseAccount.fetch(baseAccount1.publicKey)
    assert.ok(account.count.toString() === '0')
  })


  it('Increments the counter', async() => {
    await mysolanaapp.rpc.increment({
      accounts: {
        baseAccount: baseAccount1.publicKey
      }
    })

    const account = await mysolanaapp.account.baseAccount.fetch(baseAccount1.publicKey)
    assert.ok(account.count.toString() === '1')
  })
})
