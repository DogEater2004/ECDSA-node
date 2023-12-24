import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { sha256 } from "ethereum-cryptography/sha256.js";
import {toHex, utf8ToBytes} from "ethereum-cryptography/utils.js";
import {keccak256} from "ethereum-cryptography/keccak.js";


function Transfer({ address, setBalance}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setprivateKey] = useState("");
  let exr = "";

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const publicKey = secp256k1.getPublicKey(privateKey);


    try {

      let trxn = JSON.stringify({
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      });

      const bytes = utf8ToBytes(trxn);
      const trxn_hash = toHex(keccak256(bytes));




      const trxn_sign = secp256k1.sign(trxn_hash , privateKey);

      const trxnString = JSON.stringify(trxn_sign, (key, value) => {
        // Check if the value is a BigInt, convert it to string
        if (typeof value === 'bigint') {
          return value.toString() + 'n';
        }
        return value;
      });


      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        trxn_hash,
        msg_signature: trxnString,

      });
      setBalance(balance);
    } catch (ex) {
      console.log(ex);


    }
  }


  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Sign and Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Private Key
        <input
          placeholder="Enter your private key"
          value={privateKey}
          onChange={setValue(setprivateKey)}
        ></input>
      </label>

 



      <input type="submit" className="button" value="Sign & Transfer" />
    </form>
  );
}

export default Transfer;
