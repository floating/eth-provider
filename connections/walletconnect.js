const { getChain } = require('evm-chains')
const { convertNumberToHex } = require('@walletconnect/browser')
const EventEmitter = require('events')
const presets = require('../presets')
const dev = process.env.NODE_ENV === 'development'

let WalletConnect, WCQRCode

const XHR = typeof window !== 'undefined' && typeof window.XMLHttpRequest !== 'undefined' ? window.XMLHttpRequest : null

class WalletConnectConnection extends EventEmitter {
  constructor(_WalletConnect, _WCQRCode, options) {
    super()
    WalletConnect = _WalletConnect
    WCQRCode = _WCQRCode
    this.bridge = options.walletConnectBridge
    this.qrcode = options.walletConnectQR
    this.infuraId = options.walletConnectInfuraId
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

      // Save accounts
      this.accounts = accounts

      // Handle chain update
      this.updateChain(chainId)

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

      // Handle chain update
      this.updateChain(chainId)

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
  async send(payload) {
    const signingMethods = [
      'eth_sendTransaction',
      'eth_signTransction',
      'eth_sign',
      'eth_signTypedData',
      'eth_signTypedData_v1',
      'eth_signTypedData_v3',
      'personal_sign'
    ]
    const stateMethods = [
      'eth_accounts',
      'eth_chainId',
      'net_version'
    ]
    if (this.wc && this.wc.connected) {
      if (signingMethods.includes(payload.method)) {
        return await this.wc.sendCustomRequest(payload)
      } else if (stateMethods.includes(payload.method)) {
        switch (payload.method) {
          case 'eth_accounts':
            return {
              id: payload.id,
              jsonrpc: payload.jsonrpc,
              result: this.accounts
            }
          case 'eth_chainId':
            return {
              id: payload.id,
              jsonrpc: payload.jsonrpc,
              result: convertNumberToHex(this.chainId)
            }

          case 'net_version':
            return {
              id: payload.id,
              jsonrpc: payload.jsonrpc,
              result: this.networkId
            }
          default:
            break;
        }
      } else {
        return await this.httpConnection.send(payload)
      }
    } else {
      return this.error(payload, 'Not connected')
    }
  }

  async updateChain(chainId) {
    if (this.chainId === chainId) {
      return;
    }
    const chain = await getChain(chainId)

    // Check if chainId changed and trigger event
    if (this.chainId !== chainId) {
      this.chainId = chainId
      this.emit('chainChanged', chainId)
    }

    const { networkId } = chain
    // Check if networkId changed and trigger event
    if (this.networkId !== networkId) {
      this.networkId = networkId
      this.emit('networkChanged', networkId)
    }

    // Handle rpcUrl update
    this.updateRpcUrl(chain)
  }

  updateRpcUrl(chain) {
    const { chainId, rpc } = chain
    let rpcUrl = ''
    if (rpc.length) {
      if (this.infuraId) {
        const matches = rpc.filter(rpcUrl => rpcUrl.inclues('infura.io'))
        if (matches && matches.length) {
          rpcUrl = matches[0].replace("${INFURA_API_KEY}", this.infuraId)
        } else {
          rpcUrl = rpc[0]
        }
      }
    } else {
      rpcUrl = this.getPresetRpcUrl(chainId)
    }
    if (rpcUrl) {
      // Update rpcUrl 
      this.rpcUrl = rpcUrl
      // Handle httpConnection update
      this.updateHttpConnection()
    } else {
      this.emit('error', new Error(`No RPC Url avaialble for chainId: ${chainId}`))
    }
  }

  updateHttpConnection = (options) => {
    if (this.rpcUrl) {
      this.httpConnection = new HTTPConnection(XHR, this.rpcUrl, options)
    }
  }

  getPresetRpcUrl(chainId) {
    switch (chainId) {
      case 1:
        return presets.infura[1]
      case 3:
        return presets.infuraRopsten[1]

      case 4:
        return presets.infuraRinkeby[1]

      case 5:
        return presets.infuraGoerli[1]

      case 42:
        return presets.infuraKovan[1]
      default:
        return ''

    }
  }
}

const opts = options => Object.assign({ walletConnectBridge: 'https://bridge.walletconnect.org', walletConnectQR: true }, options)
module.exports = (_WalletConnect, _WCQRCode) => options => new WalletConnectConnection(_WalletConnect, _WCQRCode, opts(options))
