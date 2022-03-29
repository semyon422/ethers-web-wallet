ethers web wallet
=================

An open source Ethereum wallet that uses the Ethers library.  

Designed to work with two devices.  
First, a transaction is created on a device connected to the Internet. Then it signs on a device disconnected from the Internet. After that, on the first device, it goes to the network. Communication between devices occurs through QR codes.

**Features:**

- Get balance and nonce for sender address.
- Get gas limit and gas price.
- Use mnemonic phrase, private key or encrypted JSON wallet to sign the transaction.
- Submit the transaction to the network.

**Networks included:**

- Binance Smart Chain
- Binance Smart Chain - Testnet

**Todo:**

- More default networks.
- Creating a new wallet.
- Token support.
- Identicons.

**Changelog:**

- v1.0.0 - Create
- v1.0.1 - Add QR scanner

**Used Libraries:**

- [ethers](https://github.com/ethers-io/ethers.js)
- [qrious](https://github.com/neocotic/qrious)
- [qr-scanner](https://github.com/nimiq/qr-scanner)
- [alpine](https://github.com/alpinejs/alpine)
- [bulma](https://github.com/jgthms/bulma)

License
-------

MIT License.
