const fs = require("fs");
const path = require("path");
const csv = require('csv-parser')
const results = [];

const getNftName = (name) => `Sanya #${name}`;
const getMetadata = (name, imageUrl, attributes) => ({
  name: getNftName(name),
  symbol: "SANYA",
  description:
    "Sanya is a Succubus, an ancient supernatural entity who seduces men and women all over the world. She infiltrates their dreams and waking thoughts with promises of beauty, happiness, and riches beyond description.",
  seller_fee_basis_points: 350,
  external_url: "",
  attributes,
  collection: {
    name: "Sanya",
    family: "Sanya",
  },
  properties: {
    files: [
      {
        uri: imageUrl,
        type: "image/png",
      },
    ],
    category: "image",
    maxSupply: 0,
    creators: [
      {
        address: "3rVtcKSVA1y1AiSK6SZv39DXYAtoFZx9zngXu6nr8uFg",
        share: 50,
      },
      {
        address: "FKKfA5DbDGTbxPN53uHTB9QsENQAWPhn16uyAickebtz",
        share: 50,
      },
    ],
  },
  image: imageUrl,
});

const folder = "./jsons/";

const getAttributes = (props) => {
  // map attributes to the proper key/value objects
  const attrs = Object.keys(props).map((key) => {
    return {
      trait_type: key,
      value: props[key],
    };
  });

  return attrs;
};

const iterateOverItems = async () => {
  try {
    for (const row of results) {
      const { Name: name, ...props } = row;
      const nameByNumber = Number.parseInt(name);

      const filePath = folder + nameByNumber + ".json";

      try {
        var pad = "0000"
        var ans = pad.substring(0, pad.length - name.length) + name
        var imageUrl 
        console.log(ans)
        if( nameByNumber <= 3500 ) {
          imageUrl = `https://ipfs.io/ipfs/QmenpRbhKCC6PGYEZPv64QUpvWN7U7X1udBKVstaFS59TW/${ans}.png`
        }
        if( nameByNumber > 3500 && nameByNumber <= 7000 ) {
          imageUrl = `https://ipfs.io/ipfs/QmVH6iA7vFfoC3QK9VT9D82S87wbo1TapK8edFExoVN1T8/${ans}.png`
        }
        if( nameByNumber > 7000 && nameByNumber <= 9999 ) {
          imageUrl = `https://ipfs.io/ipfs/QmZhsWWWBV3gamob1Siw6VkYdsf41rxKUq5SiJ8vyDGct1/${ans}.png`
        }

        const attributes = getAttributes(props);
        const metadata = getMetadata(name, imageUrl, attributes);
        const metadataString = JSON.stringify(metadata);
        fs.writeFileSync(filePath, metadataString)

      } catch (error) {
        newItem = {
          [nameByNumber]: undefined,
        };
      }
    }
  } catch (e) {
    // Catch anything bad that happens
    console.error("We've thrown! Whoops!", e);
  }
};

const readCsv = async () => {
  fs.createReadStream(path.resolve(__dirname, "metadata.csv"))
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      iterateOverItems();
    });
};

readCsv();
