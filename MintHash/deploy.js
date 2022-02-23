require('dotenv').config()
const { 
  Connection, 
  Keypair, 
  clusterApiUrl,
  BpfLoader,
  sendAndConfirmTransaction,
  BPF_LOADER_PROGRAM_ID
} = require('@solana/web3.js')
const fs = require('fs').promises
const BN = require("bn.js")
const bs58 = require('bs58')
const { deserialize, serialize } = require('borsh')
const payer_account = Keypair.fromSecretKey(bs58.decode(process.env.payer_privKey))
const fsPath = '../rust/target/deploy/nfts.so'

const main = async() => {
  const devnet = clusterApiUrl('devnet')
  const conn = new Connection(devnet)

  const programAccount = new Keypair()
  const programId = programAccount.publicKey
  console.log('Program loaded to account')
  console.log({programIdBase58: programId.toBase58()})
  console.log("\n#4 Loading Program to Account : upload smart contract using BPF LOADER ...")
  const program = await fs.readFile(fsPath)
  console.log({ program })
  await BpfLoader.load(conn, payer_account, programAccount, program, BPF_LOADER_PROGRAM_ID)
  process.exit(0)
 
}
main()