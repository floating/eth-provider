const EventEmitter = require('events')
const dev = process.env.NODE_ENV === 'development'

let WalletConnect, WCQRCode

class WalletConnectConnection extends EventEmitter {
  constructor(_WalletConnect, _WCQRCode, options) {
    super()
    WalletConnect = _WalletConnect
    WCQRCode = _WCQRCode
    this.bridge = options.walletConnectBridge
    this.qrcode = options.walletConnectQR
    this.on('error', () => this.close())
    setTimeout(() => this.create(options), 0)
  }
  openQR() {
    WCQRCode.open(this.wc.uri, () => {
      this.emit('error', new Error('User close WalletConnect QR Code modal'))
    })
  }
  create(options) {
    if (!WalletConnect) this.emit('error', new Error('WalletConnect not available'))

    try {
      this.wc = new WalletConnect({ bridge: options.walletConnectBridge })
    } catch (e) {
      return this.emit('error', e)
    }

    if (!this.wc.connected) { // Create new session
      this.wc.createSession().then(() => {
        if (this.qrcode) this.openQR()
      }).catch(e => this.emit('error', e))
    }

    this.wc.on('connect', (e, payload) => {
      if (e) return this.emit('error', e)

      if (this.qrcode) WCQRCode.close() // Close QR Code Modal
      const { accounts, chainId } = payload.params[0] // Get provided accounts and chainId

      // Save accounts and chainId
      this.accounts = accounts
      this.chainId = chainId

      this.updateNetworkId(chainId)

      // Emit connect event
      this.emit('connect')
    })

    this.wc.on('session_update', (e, payload) => {
      if (e) return this.emit('error', e)

      const { accounts, chainId } = payload.params[0] // Get updated accounts and chainId

      // Check if accounts changed and trigger event
      if (this.accounts !== accounts) {
        this.accounts = accounts
        this.emit('accountsChanged', accounts)
      }

      // Check if chainId changed and trigger event
      if (this.chainId !== chainId) {
        this.chainId = chainId
        this.emit('chainChanged', chainId)
      }

      // Check if networkId changed and trigger event
      this.updateNetworkId(chainId)

    })
    this.wc.on('disconnect', (e, payload) => {
      if (e) return this.emit('error', e)
      this.onClose()
    })
  }
  onClose() {
    this.wc = null
    this.closed = true
    if (dev) console.log('Closing WalletConnector connection')
    this.emit('close')
    this.removeAllListeners()
  }
  close() {
    if (this.wc) return this.wc.killSession()
    this.onClose()
  }
  error(payload, message, code = -1) {
    this.emit('payload', { id: payload.id, jsonrpc: payload.jsonrpc, error: { message, code } })
  }
  send(payload) {
    if (this.wc && this.wc.connected) {
      return this.wc.sendCustomRequest(payload)
    } else {
      return this.error(payload, 'Not connected')
    }
  }
  async updateNetworkId(chainId) {
    const networkId = convertChainIdToNetworkId(chainId)
    if (this.networkId !== networkId) {
      this.networkId = networkId
      this.emit('networkChanged', networkId)
    }
  }
}

const opts = options => Object.assign({ walletConnectBridge: 'https://bridge.walletconnect.org', walletConnectQR: true }, options)
module.exports = (_WalletConnect, _WCQRCode) => options => new WalletConnectConnection(_WalletConnect, _WCQRCode, opts(options))
