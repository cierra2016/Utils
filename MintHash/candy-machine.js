const { 
  Connection, 
  clusterApiUrl,
  PublicKey,
} = require('@solana/web3.js')
const {programs} = require("@metaplex/js")
const fs = require('fs')
const { deserialize } = require('borsh')
const {metadata: { Metadata }} = programs
const metadataId = new PublicKey('cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ')
const devnet = clusterApiUrl('mainnet-beta')
const conn = new Connection(devnet)

class CandyMachine {
  authority
  wallet
  token_mint
  config
  data
  items_redeemed
  bump
  constructor(args) {
    this.authority = args.authority
    this.wallet = args.wallet
    this.token_mint = args.token_mint
    this.config = args.config
    this.data = args.data
    this.items_redeemed = args.items_redeemed
    this.bump = args.bump
  }
}

// class Data {
//   uuid
//   price
//   items_available
//   go_live_date
//   constructor(args) {
//     this.uuid = args.uuid
//     this.price = args.price
//     this.items_redeemed = args.items_redeemed
//     this.go_live_date = args.go_live_date
//   }
// }
class Data {
  uuid
  symbol
  seller_fee_basis_point
  creators
  max_supply
  is_mutable
  retain_authority
  max_number_of_lines
  constructor(args) {
    this.uuid = args.uuid
    this.symbol = args.symbol
    this.seller_fee_basis_point = args.seller_fee_basis_point
    this.creators = args.creators
    this.max_supply = args.max_supply
    this.is_mutable = args.is_mutable
    this.retain_authority = args.retain_authority
    this.max_number_of_lines = args.max_number_of_lines

  }
}
class Creator {
  address
  verified
  share

  constructor(args) {
    this.address = args.address;
    this.verified = args.verified;
    this.share = args.share;
  }
}
class Config {
  authority
  data
  constructor(args) {
    this.authority = args.authority
    this.data = args.data
  }
}

const MAX_NAME_LENGTH = 32;
const MAX_URI_LENGTH = 200;
const MAX_SYMBOL_LENGTH = 10;
const MAX_CREATOR_LEN = 32 + 1 + 1;

const CANDY_MACHIN_SCHEMA = new Map([
  // [
  //   Data,
  //   {
  //     kind: 'struct',
  //     fields:[
  //       ['uuid', 'string'],
  //       ['price', 'u64'],
  //       ['items_available', 'u64'],
  //       ['go_live_date', {
  //         kind: 'option',
  //         type: 'i64'
  //       }]
  //     ]
  //   }
  // ],
  [
    CandyMachine,
    {
      kind: 'struct',
      fields:[
        ['authority', 'u256'],
        ['wallet', 'u256'],
        ['token_mint', { kind: 'option', type:'u256'}],
        ['config', 'u256'],
        ['data', Data],
        ['item_redeemed', 'u64'],
        ['bump', 'u8'],
      ]
    }
  ],
  [
    Creator,
    {
      kind: 'struct',
      fields: [
        ['address', 'u256'],
        ['verified', 'u8'],
        ['share', 'u8'],
      ],
    },
  ],
  [
    Data,
    {
      kind: 'struct',
      fields: [
        ['uuid', 'string'],
        ['symbol', 'string'],
        ['seller_fee_basis_points', 'u16'],
        ['creators', { kind: 'Vec', type: [Creator] }],
        ['max_supply', 'u64'],
        ['is_mutable', 'u8'],
        ['retain_authority', 'u8'],
        ['max_number_of_lines', 'u32']
      ]
    }
  ],
  [
    Config,
    {
      kind: 'struct',
      fields:[
        ['authority', 'u256'],
        ['data', Data],
      ]
    }
  ]
])

const main = async() => {
  const metadataAccounts = await conn.getProgramAccounts(
      metadataId,
      {
        // filters: [
        //     {
        //         memcmp: {
        //             offset:
        //                 1 +
        //                 32 +
        //                 32 +
        //                 4 +
        //                 32 +
        //                 4 + 6,
        //             bytes: 3000000000,
        //         },
        //     },
        // ],
        // commitment: 'max',
        // filters:[
        //   {
        //     // dataSize: 8 + 32+ 10 + 4 + 2 + 5 + 14 + MAX_SYMBOL_LENGTH + MAX_CREATOR_LEN * 5
        //     dataSize: 182//8 + 32 + 32 + 32 + 1 + 32 + 8 + 1 + 10 + 16 + 9
        //   }
        // ]
    }
  );
  
  const mintHashes = [];
  // fs.writeFileSync('candy-machine.json', JSON.stringify(metadataAccounts))

  // console.log(metadataAccounts)
  for (let index = 0; index < metadataAccounts.length; index++) {
      const account = metadataAccounts[index];
      mintHashes.push(metadataAccounts[index].pubkey.toBase58())
      // const accountInfo = await conn.getAccountInfo(account.pubkey);
      // // @ts-ignore
      // console.log(accountInfo.length)
      // const metadata =new deserialize(
      //   CANDY_MACHIN_SCHEMA,
      //   Config,
      //   accountInfo.data
      // );
      // console.log(metadata)
      // mintHashes.push(metadata);
  }
  fs.writeFileSync('candy-machine.json', JSON.stringify(mintHashes))
}

main()