ethers web wallet
=================

An open source Ethereum wallet that uses the Ethers library.  

Designed to work with two devices.  
First, a transaction is created on a device connected to the Internet. Then it signs on a device disconnected from the Internet. After that, on the first device, it goes to the network. Communication between devices occurs through QR codes.  

**Don't use it if you don't know how it works. You alone are responsible for your actions.**  

**Features:**

- Get balance and nonce for sender address.
- Get gas limit and gas price.
- Use mnemonic phrase, private key or encrypted JSON wallet to sign the transaction.
- Submit the transaction to the network.

**Networks included:**

- Ethereum Mainnet (+ Ropsten Testnet)
- Binance Smart Chain (+ Testnet)
- Localhost 8545

**Tokens included (Ethereum):**

- Tether USD (USDT)
- USD Coin (USDC)
- Binance USD (BUSD)
- Wrapped UST Token (UST)
- Dai Stablecoin (DAI)

**Tokens included (Binance Smart Chain):**

- Binance-Peg Ethereum Token (ETH)
- Binance-Peg BSC-USD (BSC-USD)
- Binance-Peg USD Coin (USDC)
- Binance-Peg BUSD Token (BUSD)
- Binance-Peg Dai Token (DAI)
- Wrapped BNB (WBNB)

**Changelog:**

- v1.0.0 - Create
- v1.0.1 - Add QR scanner
- v1.0.2 - Add ERC20 tokens support
- v1.0.3 - Add wallet creation page
- v1.0.4 - Add identicons, more networks and tokens

**Used Libraries:**

- [ethers](https://github.com/ethers-io/ethers.js)
- [blockies](https://github.com/ethereum/blockies)
- [qrious](https://github.com/neocotic/qrious)
- [qr-scanner](https://github.com/nimiq/qr-scanner)
- [alpine](https://github.com/alpinejs/alpine)
- [bulma](https://github.com/jgthms/bulma)

License
-------

MIT License.
