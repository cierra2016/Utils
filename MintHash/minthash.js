const { 
    Connection, 
    clusterApiUrl,
    PublicKey,
} = require('@solana/web3.js')
const {programs} = require("@metaplex/js")
const fs = require('fs')
const {metadata: { Metadata }} = programs
const metadataId = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
const creator = new PublicKey('7hd1ohQH9PGwda6jxd5kUmQJTBx1qSj7MDjauYKdvGvc')
const devnet = clusterApiUrl('mainnet-beta')
const conn = new Connection(devnet)

const MAX_NAME_LENGTH = 32;
const MAX_URI_LENGTH = 200;
const MAX_SYMBOL_LENGTH = 10;
const MAX_CREATOR_LEN = 32 + 1 + 1;

const main = async() => {
    const metadataAccounts = await conn.getProgramAccounts(
        metadataId,
        {
            filters: [
                {
                    memcmp: {
                        offset:
                            1 +
                            32 +
                            32 +
                            4 +
                            MAX_NAME_LENGTH +
                            4 +
                            MAX_URI_LENGTH +
                            4 +
                            MAX_SYMBOL_LENGTH +
                            2 +
                            1 +
                            4 +
                            0 * MAX_CREATOR_LEN,
                        bytes: creator.toBase58(),
                    },
                },
            ],
        }
    );
    
    const mintHashes = [];
    
    for (let index = 0; index < metadataAccounts.length; index++) {
        const account = metadataAccounts[index];
        const accountInfo = await conn.getParsedAccountInfo(account.pubkey);
        // @ts-ignore
        const metadata =new Metadata(creator.toString(), accountInfo.value);
        mintHashes.push(metadata.data.mint);
    }
    fs.writeFileSync('minthash.json', JSON.stringify(mintHashes))
}

main()