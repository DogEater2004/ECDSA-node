## ECDSA Node

This project is an example of using a client and server to facilitate transfers between different addresses.

It incorporates Public Key Cryptography. By using Elliptic Curve Digital Signatures we can make it so the server only allows transfers that have been signed for by the person who owns the associated address.

- Generate keypair using the generator script and add them to the balances in server.
- enter your public key and to sign the trasaction use your private key.

### Client

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application
4. Now you should be able to visit the app at http://127.0.0.1:5173/

### Server

1. Open a terminal within the `/server` folder
2. Run `npm install` to install all the depedencies
3. Run `node index` to start the server
