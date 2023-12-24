const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { toHex } = require("ethereum-cryptography/utils.js");
const { keccak256 } = require("ethereum-cryptography/keccak.js");

const privateKey = secp256k1.utils.randomPrivateKey();
console.log("Private Key:", toHex(privateKey));

const publicKey = secp256k1.getPublicKey(privateKey);
console.log("Public Key:", toHex(publicKey));
