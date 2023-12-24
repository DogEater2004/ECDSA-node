const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { toHex } = require("ethereum-cryptography/utils.js");
const { keccak256 } = require("ethereum-cryptography/keccak.js");

app.use(cors());
app.use(express.json());

const balances = {
  "030134a1d5bd635128daa805e010dddf7b9fa92742392cfb5f6ce3afc305c73998": 100, // private key : b91091067e83ebcbfda9954c2a1700e8d07f58832209990cb5eaa4f558364699
  "02d532ee28d7371dbc7392074a12dc5ace5c5dba4963d8d35755bb7097bd14dd10": 50, // private key : 1aae3d8c4b5f4dcbf66e75b8503fa08dde5e75c8b4091d4d0cf3431f88539f9e
  "03d73e007c74084727e7ca056ec4e6c73c4947ba40cb164cd550c6ed80cef3ad7b": 750, // private key : 91592c4bfa2148a40b9d86ac08032f7fe10624fe76820581a91678f4bfdf796f
  "029f329f1a2d2725c117c7bc28372e65ae3d24ed24208beb4dec486c5274534be4": 2000, // private key : a9584eebe5573ede0c5344cab591c634b562ed8e070edaa42ad2da36b06e9a85
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, trxn_hash, msg_signature } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const parsed_sign = JSON.parse(msg_signature, (key, value) => {
    if (typeof value === "string" && /^\d+n$/.test(value)) {
      // Convert string to BigInt
      return BigInt(value.slice(0, -1));
    }
    return value;
  });

  try {
    const isSigned = secp256k1.verify(parsed_sign, trxn_hash, sender);
    console.log(isSigned);
  } catch (ex) {
    console.log(ex);
  }
  const isSigned = secp256k1.verify(parsed_sign, trxn_hash, sender);

  if (isSigned) {
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(400).send({ message: "Incorrect private Key" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
