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

let chains = [
	{
		id: 56,
		symbol: "BNB",
		name: "Smart Chain",
		url: "https://bsc-dataseed.binance.org/",
		scan: "https://bscscan.com",
	},
	{
		id: 97,
		symbol: "BNB",
		name: "Smart Chain - Testnet",
		url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
		scan: "https://testnet.bscscan.com",
	},
]

let pages = [
	"create", "sign", "send"
]

let createQR
let signQR

function appMain() {return {
	page: "create",
	resultCallback: null,
	openScanModal() {},
	scan(cb) {
		this.resultCallback = cb
		this.openScanModal()
	},
}}

let provider
function appCreate() {return {
	fromAddress: "",
	balance: 0,
	chain: chains[0],
	mode: "coin",
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
	init() {
		this.updateChain()
	},
	updateChain() {
		this.chain = chains.filter((c) => c.id == this.tx.chainId)[0]
		provider = new ethers.providers.JsonRpcProvider(this.chain.url)
	},
	async getBalance() {
		if (!isAddressValid(this.fromAddress)) return
		let balance = await provider.getBalance(this.fromAddress)
		this.balance = ethers.utils.formatEther(balance)
	},
	async getNonce() {
		if (!isAddressValid(this.fromAddress)) return
		this.tx.nonce = await provider.getTransactionCount(this.fromAddress)
	},
	async getGasPrice() {
		let gasPrice = await provider.getGasPrice()
		this.tx.gasPrice = ethers.utils.formatUnits(gasPrice, "gwei")
	},
	async estimateGas() {
		this.tx.gasLimit = ethers.BigNumber.from(await provider.estimateGas(parseTransaction(this.getTx()))).toString()
	},
	getTx() {
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
	updateTx() {
		console.log(this.txJson)
		let tx = this.getTx()

		if (!createQR) createQR = new QRious({
			element: document.getElementById("create-qr"),
			size: 512,
		})
		createQR.value = JSON.stringify(tx)
		if (!createQR.value) {
			createQR.value = this.txJson
			return
		}
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
	signedTxRaw: "",
	wallet: null,
	chain: null,
	locked: false,
	parse() {
		try {
			this.tx = JSON.parse(this.txJson)
			this.chain = chains.filter((c) => c.id == this.tx.chainId)[0]
		} catch {
			this.tx = {}
			this.chain = {}
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
		} catch (e) {
			this.decryptionError = e.reason || e.message
		}
		this.decrypting = false
	},
	async signTransaction() {
		this.parse()
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
	signedTxJson: "",
	complete: true,
	message: "",
	status: "waiting to be sent",
	txReceipt: {
		blockNumber: 0,
		confirmations: 0,
		gasUsed: 0,
	},
	parse() {
		try {
			this.parseTransaction()
		} catch {
			this.tx = {}
		}
	},
	scanSignedTransaction() {
		this.scan(tx => this.signedTxRaw = tx)
	},
	parseTransaction() {
		let tx = ethers.utils.parseTransaction(this.signedTxRaw)
		this.tx = formatTransaction(tx)
		this.chain = chains.filter((c) => c.id == tx.chainId)[0]
		provider = new ethers.providers.JsonRpcProvider(this.chain.url)
	},
	async sendTransaction() {
		this.complete = false
		this.status = "sending"
		this.message = ""
		this.txReceipt = null
		try {
			let tx = await provider.sendTransaction(this.signedTxRaw, 0)
			this.txReceipt = await provider.waitForTransaction(tx.hash)
			this.status = this.txReceipt.status == 1 ? 'success' : 'failure'
		} catch (e) {
			this.status = "waiting to be sent"
			this.message = e.reason
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
