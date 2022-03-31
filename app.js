function JSONstringifyOrder(obj, space) {
	var allKeys = []
	var seen = {}
	JSON.stringify(obj, (key, value) => {
		if (!(key in seen)) {
			allKeys.push(key)
			seen[key] = null
		}
		return value
	});
	allKeys.sort()
	return JSON.stringify(obj, allKeys, space)
}

let addressRegExp = new RegExp('^0x[0-9a-fA-F]{40}$')
function isAddressValid(address) {
	return addressRegExp.test(address)
}

function parseTransaction(tx) {
	return {
		to: tx.to,
		nonce: parseInt(tx.nonce),
		gasLimit: ethers.BigNumber.from(tx.gasLimit),
		gasPrice: ethers.utils.parseUnits(tx.gasPrice, "gwei"),
		data: tx.data,
		value: ethers.utils.parseEther(tx.value),
		chainId: parseInt(tx.chainId),
	}
}

function formatTransaction(tx) {
	return {
		chainId: tx.chainId,
		data: tx.data,
		to: tx.to,
		from: tx.from,
		gasLimit: ethers.BigNumber.from(tx.gasLimit).toString(),
		gasPrice: ethers.utils.formatUnits(tx.gasPrice, "gwei"),
		nonce: tx.nonce,
		value: ethers.utils.formatEther(tx.value),
		hash: tx.hash,
	}
}

function readFileAsync(file) {
	return new Promise((resolve, reject) => {
		let reader = new FileReader()
		reader.onload = () => {
			resolve(reader.result)
		}
		reader.onerror = reject
		reader.readAsText(file)
	})
}

function setIdenticon(element, address) {
	element.style.backgroundImage = "url(" + blockies.create({seed: address.toLowerCase(), size: 8, scale: 16}).toDataURL() + ")"
}

function unsetIdenticon(element) {
	element.style.backgroundImage = null
}

let chains = [
	{
		id: 1,
		symbol: "ETH",
		name: "Ethereum Mainnet",
		url: "https://mainnet.infura.io/v3/",
		scan: "https://etherscan.io",
	},
	{
		id: 56,
		symbol: "BNB",
		name: "Smart Chain",
		url: "https://bsc-dataseed.binance.org/",
		scan: "https://bscscan.com",
	},
	{
		id: 3,
		symbol: "ETH",
		name: "Ropsten Testnet",
		url: "https://ropsten.infura.io/v3/",
		scan: "https://ropsten.etherscan.io",
	},
	{
		id: 97,
		symbol: "BNB",
		name: "Smart Chain - Testnet",
		url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
		scan: "https://testnet.bscscan.com",
	},
	{
		id: 1337,
		symbol: "ETH",
		name: "Localhost 8545",
		url: "http://localhost:8545",
		scan: "https://testnet.bscscan.com",
	},
]

let tokens = [
	// Ethereum
	{
		address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
		decimals: 6,
		name: "Tether USD",
		symbol: "USDT",
		chainId: 1,
	},
	{
		address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
		decimals: 6,
		name: "USD Coin",
		symbol: "USDC",
		chainId: 1,
	},
	{
		address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
		decimals: 18,
		name: "Binance USD",
		symbol: "BUSD",
		chainId: 1,
	},
	{
		address: "0xa47c8bf37f92aBed4A126BDA807A7b7498661acD",
		decimals: 18,
		name: "Wrapped UST Token",
		symbol: "UST",
		chainId: 1,
	},
	{
		address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
		decimals: 18,
		name: "Dai Stablecoin",
		symbol: "DAI",
		chainId: 1,
	},

	// Smart Chain
	{
		address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
		decimals: 18,
		name: "Binance-Peg Ethereum Token",
		symbol: "ETH",
		chainId: 56,
	},
	{
		address: "0x55d398326f99059fF775485246999027B3197955",
		decimals: 18,
		name: "Binance-Peg BSC-USD",
		symbol: "BSC-USD",
		chainId: 56,
	},
	{
		address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
		decimals: 18,
		name: "Binance-Peg USD Coin",
		symbol: "USDC",
		chainId: 56,
	},
	{
		address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
		decimals: 18,
		name: "Binance-Peg BUSD Token",
		symbol: "BUSD",
		chainId: 56,
	},
	{
		address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
		decimals: 18,
		name: "Binance-Peg Dai Token",
		symbol: "DAI",
		chainId: 56,
	},
	{
		address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
		decimals: 18,
		name: "Wrapped BNB",
		symbol: "WBNB",
		chainId: 56,
	},

	// Smart Chain - Testnet
	{
		address: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
		decimals: 18,
		name: "Binance USD",
		symbol: "BUSD",
		chainId: 97,
	},
	{
		address: "0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867",
		decimals: 18,
		name: "DAI Token",
		symbol: "DAI",
		chainId: 97,
	},
]

let erc20abi = [
	"function balanceOf(address owner) view returns (uint256)",
	"function decimals() view returns (uint8)",
	"function symbol() view returns (string)",
	"function transfer(address to, uint amount) returns (bool)",
	"event Transfer(address indexed from, address indexed to, uint amount)",
]

let erc20interface = new ethers.utils.Interface(erc20abi)

let pages = [
	"create wallet", "create tx", "sign tx", "send tx"
]

let createQR
let signQR
let createWalletQR

function appMain() {return {
	page: "create tx",
	resultCallback: null,
	openScanModal() {},
	scan(cb) {
		this.resultCallback = cb
		this.openScanModal()
	},
}}

function appCreateWallet() {return {
	wallet: null,
	creationError: "",
	password: "",
	progress: 0,
	encrypting: false,
	encryptedJson: "",
	createRandom() {
		try {
			this.wallet = ethers.Wallet.createRandom()
			if (!createWalletQR) createWalletQR = new QRious({
				element: document.getElementById("create-wallet-qr"),
				size: 512,
			})
			createWalletQR.value = JSON.stringify(this.wallet.address)
			setIdenticon(this.$refs["address-small-icon"], this.wallet.address)
			setIdenticon(this.$refs["address-icon"], this.wallet.address)
		} catch (e) {
			this.creationError = e.reason || e.message
		}

		this.encryptedJson = ""
	},
	async encrypt() {
		this.encryptedJson = ""
		this.encrypting = true
		try {
			let obj = this
			this.encryptedJson = await this.wallet.encrypt(this.password, {}, function(p) {
				obj.progress = p
			})
			let encrypted = JSON.parse(this.encryptedJson)

			var blob = new Blob([this.encryptedJson], {type: 'text/json'})
			let a = document.getElementById("download-keystore")

			a.download = encrypted["x-ethers"].gethFilename
			a.href = window.URL.createObjectURL(blob)
		} catch {}
		this.encrypting = false
	},
}}

let provider
let contract
function appCreate() {return {
	fromAddress: "",
	balance: 0,
	gasFeeLimit: 0,
	chain: chains[0],
	tokenAddress: "",
	token: null,
	transferTo: "",
	transferAmount: "0",
	txJson: "",
	tx: {
		to: "",
		nonce: 0,
		gasLimit: "21000",
		gasPrice: "20",
		data: "",
		value: "0",
		chainId: chains[0].id,
	},
	scanFromAddress() {
		this.scan(address => this.fromAddress = address)
	},
	scanToAddress() {
		this.scan(address => this.tx.to = address)
	},
	scanTransferToAddress() {
		this.scan(address => this.transferTo = address)
	},
	init() {
		this.updateChain()
	},
	updateChain() {
		this.chain = chains.filter((c) => c.id == this.tx.chainId)[0]
		provider = new ethers.providers.JsonRpcProvider(this.chain.url)
		this.updateToken()
		this.updateTx()
	},
	updateToken() {
		this.token = tokens.filter((t) => t.address == this.tokenAddress && t.chainId == this.tx.chainId)[0]
		this.tx.to = this.transferTo
		if (!this.token) {
			this.tx.data = ""
			this.updateTx()
			return
		}
		if (!isAddressValid(this.fromAddress)) return

		let signer = new ethers.VoidSigner(this.fromAddress, provider)
		contract = new ethers.Contract(this.token.address, erc20abi, signer)
		this.transferTo = this.tx.to
		this.tx.to = this.token.address
		this.updateTx()
	},
	async getBalance() {
		if (!isAddressValid(this.fromAddress)) return
		let balance = await provider.getBalance(this.fromAddress)
		this.balance = ethers.utils.formatEther(balance)
	},
	async getTokenBalance() {
		if (!isAddressValid(this.fromAddress)) return
		let balance = await contract.balanceOf(this.fromAddress)
		this.token.balance = ethers.utils.formatUnits(balance, this.token.decimals)
	},
	async getNonce() {
		if (!isAddressValid(this.fromAddress)) return
		this.tx.nonce = await provider.getTransactionCount(this.fromAddress)
		await this.updateTx()
	},
	async getGasPrice() {
		let gasPrice = await provider.getGasPrice()
		this.tx.gasPrice = ethers.utils.formatUnits(gasPrice, "gwei")
		await this.updateTx()
	},
	async estimateGas() {
		let gasLimit
		let amount = this.transferAmount
		if (!amount) amount = "0"
		if (!this.token) gasLimit = await provider.estimateGas(parseTransaction(await this.getTx()))
		else gasLimit = await contract.estimateGas.transfer(this.fromAddress, ethers.utils.parseUnits(amount, this.token.decimals))
		this.tx.gasLimit = ethers.BigNumber.from(gasLimit).toString()
		await this.updateTx()
	},
	async getTx() {
		if (this.token) {
			let amount = this.transferAmount
			if (!amount) amount = "0"

			let tx = await contract.populateTransaction.transfer(
				this.fromAddress, ethers.utils.parseUnits(amount, this.token.decimals)
			)
			this.tx.data = tx.data
			this.tx.to = tx.to
			this.tx.value = "0"
		}
		return {
			to: this.tx.to,
			nonce: parseInt(this.tx.nonce),
			gasLimit: this.tx.gasLimit,
			gasPrice: this.tx.gasPrice,
			data: this.tx.data,
			value: this.tx.value,
			chainId: parseInt(this.tx.chainId),
		}
	},
	async updateTx() {
		if (!createQR) createQR = new QRious({
			element: document.getElementById("create-qr"),
			size: 512,
		})

		if (!this.token) this.transferTo = this.tx.to

		if (isAddressValid(this.fromAddress))
			setIdenticon(this.$refs["from-icon"], this.fromAddress)
		else unsetIdenticon(this.$refs["from-icon"])
		
		if (isAddressValid(this.tx.to))
			setIdenticon(this.$refs["to-icon-coin"], this.tx.to)
		else unsetIdenticon(this.$refs["to-icon-coin"])
		
		if (isAddressValid(this.transferTo))
			setIdenticon(this.$refs["to-icon-token"], this.transferTo)
		else unsetIdenticon(this.$refs["to-icon-token"])

		if (!isAddressValid(this.fromAddress)) {
			createQR.foregroundAlpha = 0
			return
		}
		createQR.foregroundAlpha = 1

		let tx = await this.getTx()

		this.gasFeeLimit = ethers.utils.formatEther(ethers.utils.parseUnits(tx.gasPrice, "gwei") * tx.gasLimit)

		createQR.value = JSON.stringify(tx)
		this.txJson = JSONstringifyOrder(tx, "  ")
	},
}}

function appSign() {return {
	walletMode: "mnemonic",
	path: "m/44'/60'/0'/0/0",
	mnemonic: "",
	privateKey: "",
	files: null,
	password: "",
	progress: 0,
	decryptionError: "",
	decrypting: false,
	txJson: "",
	tx: {},
	token: null,
	transferTo: "",
	transferAmount: "0",
	signedTxRaw: "",
	wallet: null,
	chain: null,
	locked: false,
	gasFeeLimit: "",
	async resetTx() {
		this.tx = {}
		this.chain = {}
		this.transferTo = ""
		this.transferAmount = "0"
		this.gasFeeLimit = ""
		this.token = null
	},
	async parse() {
		try {
			this.tx = JSON.parse(this.txJson)
			this.chain = chains.filter((c) => c.id == this.tx.chainId)[0]
			this.gasFeeLimit = ethers.utils.formatEther(ethers.utils.parseUnits(this.tx.gasPrice, "gwei") * this.tx.gasLimit)

			if (!this.tx.data) {
				this.transferTo = ""
				this.transferAmount = "0"
				this.token = null
				return
			}

			this.token = tokens.filter((t) => t.address == this.tx.to && t.chainId == this.tx.chainId)[0]

			let transfer = await erc20interface.decodeFunctionData("transfer", this.tx.data)
			this.transferTo = transfer.to
			this.transferAmount = ethers.utils.formatUnits(transfer.amount, this.token.decimals)
			
			if (isAddressValid(this.tx.to))
				setIdenticon(this.$refs["to-icon-coin"], this.tx.to)
			else unsetIdenticon(this.$refs["to-icon-coin"])
			
			if (isAddressValid(this.transferTo))
				setIdenticon(this.$refs["to-icon-token"], this.transferTo)
			else unsetIdenticon(this.$refs["to-icon-token"])
		} catch {
			await this.resetTx()
		}
	},
	scanTransactionJson() {
		this.scan(tx => {
			this.txJson = tx
			this.parse()
		})
	},
	scanMnemonic() {
		this.scan(mnemonic => this.mnemonic = mnemonic)
	},
	scanPrivateKey() {
		this.scan(privateKey => this.privateKey = privateKey)
	},
	resetWallet() {
		this.wallet = null
		this.mnemonic = ""
		this.privateKey = ""
		this.files = null
		this.password = ""
		this.progress = 0
		this.decryptionError = ""
		this.decrypting = false
		unsetIdenticon(this.$refs["from-icon"])
	},
	reset() {
		this.resetWallet()
		this.signedTxRaw = ""
		if (signQR) {
			signQR.value = ""
			signQR.foregroundAlpha = 0
		}
	},
	lock() {
		this.locked = true
	},
	unlock() {
		this.locked = false
		this.reset()
	},
	async getWallet() {
		this.wallet = null
		this.decrypting = true
		this.decryptionError = ""
		try {
			if (this.walletMode == "mnemonic") this.wallet = ethers.Wallet.fromMnemonic(this.mnemonic, this.path)
			else if (this.walletMode == "key") this.wallet = new ethers.Wallet(this.privateKey)
			else if (this.walletMode == "json" && this.files[0]) {
				let content = await readFileAsync(this.files[0])
				let obj = this
				this.wallet = await ethers.Wallet.fromEncryptedJson(content, this.password, function(p) {
					obj.progress = p
				})
			}

			if (isAddressValid(this.wallet.address))
				setIdenticon(this.$refs["from-icon"], this.wallet.address)
			else unsetIdenticon(this.$refs["from-icon"])
		} catch (e) {
			this.decryptionError = e.reason || e.message
		}
		this.decrypting = false
	},
	async signTransaction() {
		await this.parse()
		this.signedTxRaw = await this.wallet.signTransaction(parseTransaction(this.tx))

		if (!signQR) signQR = new QRious({
			element: document.getElementById("sign-qr"),
			size: 512,
		})
		signQR.value = this.signedTxRaw
		signQR.foregroundAlpha = 1

		this.resetWallet()
	},
}}

function appSend() {return {
	chain: null,
	signedTxRaw: "",
	tx: {},
	token: null,
	gasFeeLimit: "",
	transferTo: "",
	transferAmount: "0",
	signedTxJson: "",
	complete: true,
	message: "",
	messageParse: "",
	status: "waiting to be sent",
	txReceipt: {
		blockNumber: 0,
		confirmations: 0,
		gasUsed: 0,
	},
	async parse() {
		this.messageParse = ""
		try {
			await this.parseTransaction()
		} catch (e) {
			this.messageParse = e.reason || e.message
			this.tx = {}
			this.chain = null
			this.token = null
			this.gasFeeLimit = ""
			this.transferTo = ""
			this.transferAmount = ""
			unsetIdenticon(this.$refs["from-icon"])
			unsetIdenticon(this.$refs["to-icon-coin"])
			unsetIdenticon(this.$refs["to-icon-token"])
		}
	},
	scanSignedTransaction() {
		this.scan(tx => {
			this.signedTxRaw = tx
			this.parse()
		})
	},
	async parseTransaction() {
		let tx = ethers.utils.parseTransaction(this.signedTxRaw)
		this.tx = formatTransaction(tx)
		this.chain = chains.filter((c) => c.id == tx.chainId)[0]
		provider = new ethers.providers.JsonRpcProvider(this.chain.url)
	
		this.gasFeeLimit = ethers.utils.formatEther(ethers.utils.parseUnits(this.tx.gasPrice, "gwei") * this.tx.gasLimit)

		if (isAddressValid(this.tx.from))
			setIdenticon(this.$refs["from-icon"], this.tx.from)
		else unsetIdenticon(this.$refs["from-icon"])
		
		if (isAddressValid(this.tx.to))
			setIdenticon(this.$refs["to-icon-coin"], this.tx.to)
		else unsetIdenticon(this.$refs["to-icon-coin"])

		if (this.tx.data == "0x") return

		this.token = tokens.filter((t) => t.address == this.tx.to && t.chainId == this.tx.chainId)[0]

		let transfer = await erc20interface.decodeFunctionData("transfer", this.tx.data)
		this.transferTo = transfer.to
		this.transferAmount = ethers.utils.formatUnits(transfer.amount, this.token.decimals)
		
		if (isAddressValid(this.transferTo))
			setIdenticon(this.$refs["to-icon-token"], this.transferTo)
		else unsetIdenticon(this.$refs["to-icon-token"])
	},
	async sendTransaction() {
		this.complete = false
		this.status = "sending"
		this.message = ""
		this.txReceipt = null
		try {
			let tx = await provider.sendTransaction(this.signedTxRaw, 0)
			this.txReceipt = await tx.wait()
			// this.txReceipt = await provider.waitForTransaction(tx.hash)
			this.status = this.txReceipt.status == 1 ? 'success' : 'failure'
		} catch (e) {
			this.status = "waiting to be sent"
			this.message = e.reason
			console.log(e)
		}
		this.complete = true
	},
}}

let qrScanner
function appQrScan() {return {
	hasCamera: false,
	hasFlash: false,
	isScanning: false,
	cameraId: "environment",
	cameras: [],
	async init() {
		this.openScanModal = () => this.start()
	},
	async onDecode(result) {
		if (result.data == "") return
		this.resultCallback(result.data)
		await this.stop()
	},
	async start() {
		this.hasCamera = await QrScanner.hasCamera()
		this.cameras = await QrScanner.listCameras(true)
		let video = document.getElementById("qr-scanner")
		qrScanner = new QrScanner(video, result => this.onDecode(result), {
			returnDetailedScanResult: true,
			highlightScanRegion: true,
			highlightCodeOutline: true,
		})
		qrScanner.setInversionMode("both")

		this.isScanning = true
		await qrScanner.start()
		this.hasFlash = await qrScanner.hasFlash()
	},
	async stop() {
		this.isScanning = false
		await qrScanner.stop()
		qrScanner.destroy()
		qrScanner = null
	},
	async updateCamera() {
		await qrScanner.setCamera(this.cameraId)
	},
	toggleFlash() {
		qrScanner.toggleFlash()
	},
}}
