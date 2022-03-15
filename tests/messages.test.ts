import { Provider, setProvider, web3, workspace } from "@project-serum/anchor"
import { Program } from "@project-serum/anchor"
import { assert } from "chai"
import { Messages } from "target/types/messages"

// program.rpc - for writing txn
// program.account - for reading accounts data


describe("messages", () => {
  // Configure the client to use the local cluster.

  const provider = Provider.env()
  setProvider(provider)

  const baseAccount1 = web3.Keypair.generate()
  const program = workspace.Messages as Program<Messages>

  it("Is initialized!", async () => {
    // Add your test here.
    const msg1 = "Rajadhiraj"
    const tx = await program.rpc.initialize(msg1, {
      accounts: {
        baseAccount: baseAccount1.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      },
      signers: [baseAccount1],
    })


    const accounts = await program.account.baseAccount.fetch(baseAccount1.publicKey)

    assert.ok(accounts.data === msg1)
  })

  it("is storing messages", async() => {
    const title1 = 'Update1111'
    await program.rpc.update(title1, {
      accounts: {
        baseAccount: baseAccount1.publicKey,
      }
    })

    const accounts = await program.account.baseAccount.fetch(baseAccount1.publicKey)
    console.log('data list: ', accounts.dataList)
    assert.ok(accounts.dataList[1] === title1)
  })
})
